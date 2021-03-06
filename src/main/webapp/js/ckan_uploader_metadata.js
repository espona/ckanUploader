
function mergeMetadata(package_data, metadata_string){
		
	// Convert to package
    var new_package = datacite2package(metadata_string);	
    
    // Merge-Update
    var merged_package = mergePackages(package_data, new_package);
    
    return(merged_package);
}

function mergePackages(old_package_data, new_package_data) {

	var merged_package = jQuery.extend(true, {}, old_package_data);
	
	for (key in new_package_data) {
		merged_package[key] = new_package_data[key];	
	}
	
	return(merged_package);

}

function xmlString2json(metadata_xml){
	
	var metadata_dom = parseXml(metadata_xml);
	var metadata_json = xml2json(metadata_dom);
 
	// fix for the begining of the string that contains an "undefined"
	metadata_json = metadata_json.replace("{\nundefined", "{");

    return(JSON.parse(metadata_json));	
}

function datacite2package(datacite_string){
	// create blank package data
	var ckan_package = new Object();

	// Parse metadata into JSON
	var metadata_json = xmlString2json(datacite_string);
	console.log(metadata_json);
	
	// Get the datacite resource
	if ('resource' in metadata_json) {
		// Fill up package data
		var resource = metadata_json.resource;
	
		// TITLE(S)
		if  (typeof resource.titles !== "undefined") {

			var subtitles = [];

			// If single object, make it an array. If it is a string, make it an object first.
			resource.titles.title = asArray( resource.titles.title, '#text');
			
			// Loop through titles
			resource.titles.title.forEach( function (title) {
				if (title['#text'].length >0) {
					// First title without type is the main title, the rest subtitles
					if ('@titleType' in title || typeof ckan_package.title !== "undefined"){
						//Composite Repeating Field: "subtitle" (Subtitles) = [{"subtitle", "type" : ["alternative_title","subtitle","translated_title"], "language" : ["en","de","fr","it","ro"]}]			
						var subtitle = {'subtitle': title['#text'], 
								        'type': dataciteTitleType2ckan(title['@titleType']), 
								        'language': ((typeof title['@xml:lang'] === 'undefined') ? "" : title['@xml:lang']).substring(0,2)
								        };
						subtitles.push(subtitle);					
					}
					else{
						//Field: "title" (Title)
						ckan_package.title = title['#text'];																
					}
				}
			} );
			if (subtitles.length>0) ckan_package.subtitle = JSON.stringify(subtitles);
		}
		
		// AUTHORS
		if  (typeof resource.creators !== "undefined") {
			var authors = [];
			
			// If single object, make it an array. If it is a string, make it an object first.
			resource.creators.creator = asArray( resource.creators.creator, 'creatorName');

			// Loop through creators
			resource.creators.creator.forEach( function (creator) {
				if (creator['creatorName'].length >0) {

					//Composite Repeating Field: "author" (Authors) = [{"name", "affiliation", "email", "identifier", "identifier_scheme":["orcid","isni","rid","rgate"]}]
					var author = {"name": creator['creatorName'],
							      "affiliation": dataciteAffiliation2string(creator.affiliation),
							      "email":"",
							      "identifier":dataciteNameIdentifier2ckan(creator.nameIdentifier)['identifier'],
								  "identifier_scheme":dataciteNameIdentifier2ckan(creator.nameIdentifier)['identifier_scheme']
							};
					authors.push(author);					
				}
			} );
			if (authors.length>0) ckan_package.author = JSON.stringify(authors);
		}
		
		//DOI
		//Field: "doi" (DOI)
		if (typeof resource.identifier !== "undefined"){
			resource.identifier = asObject(resource.identifier, '#text');
			if (resource.identifier['@identifierType'] === "DOI" && resource.identifier['#text'].length > 0) {
				ckan_package.doi = resource.identifier['#text'];
			}
		}
		
		//PUBLICATION
		//Composite Field: "publication" (Publication) = {"publisher", "publication_year"}
		if (typeof resource.publisher !== "undefined" || typeof resource.publicationYear !== "undefined" ){
			ckan_package.publication = JSON.stringify({
				                                   'publisher': ( (typeof resource.publisher === "undefined") ? '' : resource.publisher),
				                                   'publication_year': ( (typeof resource.publicationYear === "undefined") ? '' : resource.publicationYear)
												 });
		}
		
		//DESCRIPTION
		//Field: "notes" (Description)
		if (typeof resource.descriptions !== "undefined"){
			var notes = [];

			// If single object, make it an array. If it is a string, make it an object first.
			resource.descriptions.description = asArray( resource.descriptions.description, '#text');
			
			// Loop through descriptions
			resource.descriptions.description.forEach( function (description) {
				if (description['#text'].length >0) {
					var description_type = ((typeof description["@descriptionType"] === 'undefined')? "": (description["@descriptionType"].length >0 ? description["@descriptionType"].trim() + ": ":"")); 
					notes.push( description_type + description['#text'].trim());					
					}
			} );
			
			if (notes.length>0) ckan_package.notes = notes.join("\r\n \r\n");
		}

		//KEYWORDS
		//Object List Field (?): "tags" (Subjects) = [{"vocabulary_id", "state", "display_name", "id", "name"}]
		if (typeof resource.subjects !== "undefined"){
			var keywords = [];

			// If single object, make it an array. If it is a string, make it an object first.
			resource.subjects.subject = asArray( resource.subjects.subject, '#text');
			
			// Loop through subjects
			resource.subjects.subject.forEach( function (subject) {
				if (subject['#text'].length >0) {
					keywords.push({"name":subject['#text'].trim().toUpperCase()});					
				}
			} );
			
			if (keywords.length>0) ckan_package.tags = keywords;
		}

		//VERSION
		//Field: "version" (Version)
		if (typeof resource.version !== "undefined"){
			resource.version = asObject(resource.version, '#text')['#text']
			if (typeof resource.version.length >0 ) ckan_package.version = resource.version;
		}
		
		// RESOURCE TYPE
		if (typeof resource.resourceType !== "undefined"){
			resource.resourceType = asObject(resource.resourceType, '#text')
			//Field: "resource_type" (Type)
			if (resource.resourceType['#text'].length >0 ) ckan_package.resource_type = resource.resourceType['#text'];
			//Field: "resource_type_general (General Type) = ["audiovisual","collection","dataset","event","image","interactive_resource","model","physical_object","service","software","sound","text", "other"]
			if (typeof resource.resourceType['@resourceTypeGeneral'] !== 'undefined') ckan_package.resource_type_general = resource.resourceType['@resourceTypeGeneral'].trim().toLowerCase()
		}
		
		//CONTACT POINT
		if  (typeof resource.contributors !== "undefined") {			
			// If single object, make it an array. If it is a string, make it an object first.
			resource.contributors.contributor = asArray( resource.contributors.contributor, 'contributorName');

			// Loop through contributors
			resource.contributors.contributor.forEach( function (contributor) {
				if (contributor['contributorName'].length >0 &&  contributor['@contributorType'] === "ContactPerson"){

					//Composite Field: "maintainer"(Contact) = {"name","affiliation", "email", "identifier", "identifier_scheme":["orcid","isni","rid","rgate"]}
					var maintainer = {"name": contributor['contributorName'],
							      	  "affiliation": dataciteAffiliation2string(contributor.affiliation),
							      	  "email":"",
							      	  "identifier":dataciteNameIdentifier2ckan(contributor.nameIdentifier)['identifier'],
							      	  "identifier_scheme":dataciteNameIdentifier2ckan(contributor.nameIdentifier)['identifier_scheme']
									};
					ckan_package.maintainer = JSON.stringify(maintainer);
					return;
				}
			} );
		}
		
		//TODO: To be mapped(?):
		//Field: "license_id (? license_url, license_title)" (License) =  ["notspecified", "odc-pddl", "odc-odbl", "odc-by", "cc-zero", "cc-by", "cc-by-sa", "gfdl", "other-open", "other-pd", "other-at", "uk-ogl", "cc-nc", "other-nc", "other-closed"]
		// - Values as a dictionary: http://envidat02.wsl.ch:5000/api/action/license_list
		//Field: "owner_org" (Organization)
		//Field: "name" (URL)

	}
	console.log(ckan_package);
    return(ckan_package);
}

// DataCite conversion functions
function dataciteAffiliation2string(affiliations){
	var affiliations_str = "";
	
	if (typeof affiliations !== "undefined"){
		var affiliations_array = asArray( affiliations, '#text');
		affiliations_array.forEach( function (affiliation) { 
			if (affiliation['#text'].length >0) {
				if (affiliations_str.length >0) affiliations_str += ',';
				affiliations_str += affiliation['#text'];
			}
		});
	}
	
	return(affiliations_str);
}

function dataciteNameIdentifier2ckan(identifier){
	var identifier_obj = {"identifier":"", "identifier_scheme":""};
	
	if (typeof identifier !== "undefined"){
		identifier_obj.identifier = ((typeof identifier['#text'] === 'undefined')? "" : identifier['#text'])
		identifier_obj.identifier_scheme = ((typeof identifier['@nameIdentifierScheme'] === 'undefined')? "" : identifier['@nameIdentifierScheme'].toLowerCase());
	}
	
	return(identifier_obj);
}

function dataciteTitleType2ckan(title_type){
	var title_type_dict = {"AlternativeTitle":"alternative_title", "Subtitle":"subtitle", "TranslatedTitle":"translated_title"};
	return ((typeof title_type_dict[title_type] === 'undefined') ? "" : title_type_dict[title_type]);
}

function asArray(object, default_key){
	if  (typeof object === "undefined") return [];
	
	if( Object.prototype.toString.call(object) === '[object Array]' ) {
		var object_array = [];
		
		object.forEach(function(element) {
			if (typeof element !== 'undefined'){
				object_array.push( asObject(element, default_key));
			}
		});
		
		return object_array;
	}
	else{
		return ([asObject(object, default_key)]);
	}

	return object;
}

function asObject(object, default_key){
	if (typeof object === 'undefined'){
		return ({[default_key]:""});
	}
	else {
		if (typeof object === 'string') return({[default_key]:object});
		else {
			if (typeof object[default_key] === 'undefined') {object[default_key] = "" };
			return(object);
		}
	}	
}
