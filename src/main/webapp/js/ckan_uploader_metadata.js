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
