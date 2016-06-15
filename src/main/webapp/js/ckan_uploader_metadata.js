
function mergeMetadata(package_data, metadata_string){
		
	// Convert to package
    var new_package = datacite2package(metadata_string);	
    
    // Merge-Update
    var merged_package = mergePackages(package_data, new_package);
    
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

	// Parse metadata into JSON
	var metadata_json = xmlString2json(datacite_string);

	console.log(Object.keys(metadata_json.resource));
		
	// Fill up package data
	var ckan_package = new Object();
	
	//Field: "title" (Title)
	
	
	//Field: "name" (URL)
	//Field: "doi" (DOI)
	//Composite Repeating Field: "author" (Authors) = [{"name", "affiliation", "email", "identifier", "identifier_scheme":["orcid","isni","rid","rgate"]}]
	//Field: "owner_org" (Organization)
	//Composite Repeating Field: "subtitle" (Subtitles) = [{"subtitle", "type" : ["alternative_title","subtitle","translated_title"], "language" : ["en","de","fr","it","ro"]}]
	//Composite Field: "publication" (Publication) = {"publisher", "publication_year"}
	//Field: "notes" (Description)
	//Object List Field (?): "tags" (Subjects) = [{"vocabulary_id", "state", "display_name", "id", "name"}]
	//Field: "license_id (? license_url, license_title)" (License) =  ["notspecified", "odc-pddl", "odc-odbl", "odc-by", "cc-zero", "cc-by", "cc-by-sa", "gfdl", "other-open", "other-pd", "other-at", "uk-ogl", "cc-nc", "other-nc", "other-closed"]
	// - Values as a dictionary: http://envidat02.wsl.ch:5000/api/action/license_list
	//Field: "version" (Version)
	//Field: "resource_type" (Type)
	//Field: "resource_type_general (General Type) = ["audiovisual","collection","dataset","event","image","interactive_resource","model","physical_object","service","software","sound","text", "other"]
	//Composite Field: "maintainer"(Contact) = {"name","affiliation", "email", "identifier", "identifier_scheme":["orcid","isni","rid","rgate"]}

    return(ckan_package);
}

function mergePackages(old_package_data, new_package_data) {

	var merged_package = new Object();
	
	return(merged_package);

}

//********OLD
// DOM RELATED
	function getDoi(xml){
		xmlDoc = $.parseXML( xml );
		$xml = $( xmlDoc );
		var doi =  $xml.find("identifier").text();
		return(doi);
	};
	
	// Gets only the first title
	function getTitle(xml){
		xmlDoc = $.parseXML( xml );
		$xml = $( xmlDoc );
		var titles =  $xml.find("title");
		var title = titles.first().text();
		return(title);
	};
	
	function appendRelatedId(xml, data_url){
		var dom = $.parseXML( xml );
		
		if (! doRelatedIdExists(xml, data_url)){
			var related_id_str = "<relatedIdentifier relatedIdentifierType=\"URL\" relationType=\"IsMetadataFor\">" 
										+ data_url + " </relatedIdentifier>";
			
			var related_ids_found = $(dom).find("relatedIdentifiers");
			if(related_ids_found.length <= 0){
				related_id_str = '<relatedIdentifiers>' +related_id_str + '</relatedIdentifiers>';
				$(dom).find("resource").first().append(related_id_str);
			}
			else {
				$(dom).find("relatedIdentifiers").first().append(related_id_str);
			}
		}
		
		var dom_str = xmlToString(dom);
		dom_str = replaceAll(dom_str,"xmlns=\"\"", "");
		return dom_str;

	}
		
	function escapeRegExp(str) {
	    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

	function doi2ckan(doi){
		var ckan_doi = doi.replace(/\./g, '-').replace(/\//g, '-');;
		return(ckan_doi);
	}
	
	function replaceAll(str, find, replace) {
		  return str.replace(new RegExp(escapeRegExp(find), 'gi'), replace);
	}
	

	
	function xmlToString(xmlData) { 

	    var xmlString;
	    //IE
	    if (window.ActiveXObject){
	        xmlString = xmlData.xml;
	    }
	    // code for Mozilla, Firefox, Opera, etc.
	    else{
	        xmlString = (new XMLSerializer()).serializeToString(xmlData);
	    }
	    return xmlString;
	}   
