
$(document)	.ready(function() {
	var METADATA_XML = "";
	
	// Functions
	function resetUploadForm() {
		$('#upload_metadata').prop('disabled', true);
		
		$('#metadata_browser').val("");
		$('#text_metadata_name').val("");

		$('#datafile_browser').val("");
		$('#text_datafile_name').val("");
	};

	function resetReport() {
    	$('#div_report').empty("");
 	};

	function preProcess(metadata, datafile){
	      var reader = new FileReader();
	      reader.onload = function (e) {
	    	  upload(metadata, reader.result, datafile);
	       };
	      reader.readAsText(metadata);
	 }
		
	function upload(metadata, xml, datafile) {
			
		var doi = getDoi(xml);
		
		report  = " UPLOAD STARTED: METADATA " + metadata.name + ", " + doi + " (" + metadata.size + " bytes) + DATA <br>";
        displayReport("<p>" + report + "</p>");
        
        // 1. Register Metadata
        var registered_metadata = registerMetadata(xml);
        doi = getDoi(registered_metadata);
        if (doi.length<=0){
            displayReport("<p> FAILED, aborting process!</p>");
        	return;
        }
        
        if (typeof datafile === "undefined") {
            displayReport("<p> No data to upload, DONE!</p>");
            return;
        }
        
        // 2. Create Package with resource
        var upload_result = dataUpload(registered_metadata, datafile);
        console.log(upload_result.data_url);
        if (upload_result.data_url.length <= 0){
            displayReport("<p> FAILED, aborting process!</p>");
        	return;
        }
        
        // 3. Register updated Metadata
        var final_metadata = registerMetadata(upload_result.updated_metadata);        
    };
	
	function registerMetadata(xml_string) {

		var report = "";
		var registered_metadata = "";
		
		var doi = getDoi(xml_string);
		
		var action = "(New registration)";
		if (doi.length>0) {
			action = "(Update)";
		}
		
		report  = " - Starting metadata upload " + action + "<br>";

		$.ajax({
			  url : "http://envidat01.wsl.ch:8080/MiniCat/rest/metadata/register",
			  type : 'POST',
			  data : xml_string,
			  async: false,
	          contentType: "application/xml",
	          headers: {
	              'Accept':'application/json',
	              'Content-Type':'application/xml'
	          },
	          dataType: "json",
			  success : function(response, data) {
					console.log(response);
					console.log(data);
					
					registered_metadata = response.content
					doi = getDoi(registered_metadata);
					report += "\t * SUCCESS, " + response.registration.description;
					report += ", DOI: <a href=\"" + getLandingPage(doi) + "\">" + doi + "</a><br>";
					
			  },
			  error : function(response) {
				  console.error(response)
				  report += "\t * FAILED: status=" + response.statusText + ", response='" + response.responseText + "'<br>";
				}
			});

		displayReport("<p>" + report + "</p>");
		return (registered_metadata);

	}
	
	function dataUpload(xml_string, datafile) {
		console.log(datafile);
		
		var doi = getDoi(xml_string);
		var title = getTitle(xml_string) + " (" + doi +")"; 

		var package_id = "";
		var package_url = "";
		var resource_url = "";
				
		var upload_result = {'data_url':'', 'updated_metadata':xml_string};
		
		//var ckan_url = 'http://envidat01.wsl.ch:5000/api/action/';		
		//luciaespona@envidat01.wsl.ch:5000
		//var user_token = "5c18eb13-5fbd-4148-b169-61e44a86253a";
		
		var ckan_url = 'http://ckan.wsl.ch/api/action/';
		// admin@ckan.wsl.ch
		var user_token = "f1083246-f1a0-4284-becb-e7aeb3b7bd16";
		
		// 1. Check if package exists
		var package_name = doi2ckan(doi);
		var ckan_url_show_package  = ckan_url + "package_show?name_or_id=" + package_name;
		
		var report  = " - Searching CKAN package: " + package_name + "<br>";

		$.ajax({
			  url : ckan_url_show_package,
			  type : 'GET',
			  async: false,
	          headers: {
	        	  'X-CKAN-API-Key':user_token
	          },
			  success : function(response, data) {
					console.log(response);
					console.log(data);

					package_id = response.result.id;
					package_url = "http://ckan.wsl.ch/dataset/" + package_name;
					report += "\t * FOUND package id: " + package_id + ",  <a href=\"" + package_url + "\">" + package_url + " </a> ";
			  },
			  error : function(response) {
					report += "\t * NOT FOUND package id: " + package_id;

				  console.error(response)
				}
			});
		displayReport("<p>" + report + "</p>");

		// 1.a Create PACKAGE if not found
		if (package_id.length <= 0) {
			var ckan_url_create_package = ckan_url + 'package_create';
			var organization_id = '9ee8ee5e-14d0-438b-b153-cb59c5914aae';
					
			var report  = " - Creating new CKAN package: " + package_name + " ('" + title + "') <br>";
			
			$.ajax({
			  url : ckan_url_create_package,
			  type : 'POST',
			  async: false,
	          headers: {
	        	  'X-CKAN-API-Key':user_token
	          },
			  data : JSON.stringify({
				  'name': package_name,
				  'title': encodeURIComponent(title),
				  'owner_org': organization_id,
				  'datacite_field': xml_string,
				  'url': getLandingPage(doi),
				  'notes': 'Package Created from MetadataUpload Webapp using the FileStore API'
			  }),
	          dataType: "json",
			  success : function(response, data) {
					console.log(response);
					console.log(data);
	
					package_id = response.result.id;
					package_url = "http://ckan.wsl.ch/dataset/" + package_name;
					report += "\t * SUCCESS, package id: " + package_id + ",  <a href=\"" + package_url + "\">" + package_url + " </a> ";
			  },
			  error : function(response) {
				  console.error(response)
				  report += "\t * FAILED: status=" + response.statusText + ", response='" + response.responseText + "'<br>";
				}
			});
			displayReport("<p>" + report + "</p>");
	
			if (package_id.length <= 0) return (upload_result);
		}
		
		// 2. Upload DATA
		report  = " - Creating resource: " + datafile.name + " (" + datafile.size + " bytes) <br>";

		var ckan_url_create_resource = ckan_url + 'resource_create';
		var file_name = encodeURIComponent(datafile.name.substr(0, datafile.name.lastIndexOf('.')) || datafile.name)
		var extension = encodeURIComponent(datafile.name.substr(datafile.name.lastIndexOf('.')+1, datafile.name.length) || datafile.type);

		var formData = new FormData();
		formData.append('package_id',  package_id);
		formData.append('id', file_name);
		formData.append('url', '');
		formData.append('format', extension.toUpperCase());
		formData.append('mimetype', datafile.type);
		formData.append('name',  file_name);
		formData.append('description', 'Resource Created from MetadataUpload Webapp using the FileStore API');
		formData.append("upload", datafile);
		
		$.ajax({
			  url : ckan_url_create_resource,
			  type : 'POST',
			  async: false,
	          headers: {
	        	  'X-CKAN-API-Key':user_token
	          },
			  data : formData,
	          dataType: "json",
			  processData: false,  // tell jQuery not to process the data
			  contentType: false,   // tell jQuery not to set contentType
			  success : function(response, data) {
					console.log(response);
					console.log(data);

					resource_id = response.result.id;
					resource_url = response.result.url;
					report += "\t * SUCCESS, resource id: " + resource_id + ",  <a href=\"" + resource_url + "\">" + resource_url + " </a> ";
			  },
			  error : function(response) {
				  console.error(response)
				  report += "\t * FAILED: status=" + response.statusText + ", response='" + response.responseText + "'<br>";
				}
			});
			displayReport("<p>" + report + "</p>");

			upload_result.updated_metadata = appendRelatedId(xml_string, resource_url);
	        upload_result.data_url = resource_url;
			return (upload_result);
	};

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

	function getLandingPage(doi){
		return ("http://www.envidat.ch/catalogue/" + doi);	
	}
	
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
	
	function doRelatedIdExists(xml, data_url){
		// Check if the related Id element already exists using the DOM
		var dom = $.parseXML( xml );
		
			var related_ids_found = $(dom).find("relatedIdentifiers");
			if(related_ids_found.length > 0){
				related_ids_found.each(function(){
					var $related_ids = $(this);
					var related_id_children = $related_ids.find("relatedIdentifier");
					related_id_children.each(function(){
						if ($(this).attr('relationType') === "IsMetadataFor" && $(this).text().trim() === data_url) {
							console.log("Found relatedIdentifier already!! type=" + $(this).attr('relationType') + ", '" + $(this).text().trim() + "'");				
							return(true);
						}
					});
				});
			}
		
		return (false);	
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
	
	function displayReport(report){
		$('#div_report').append(report);
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

	 
	// **************************************************************************

	// Empty text
	resetUploadForm();
	resetReport();
	
	// Metadata File selection
	$('#metadata_browser').change(function(){
        if ($(this).val()) {
			$('#upload_metadata').prop('disabled', false);			
        } 
        else {
			$('#upload_metadata').prop('disabled', true);        	
        }
		$('#text_metadata_name').val($(this).val());
    });
	
	$('#button_browse_metadata').click(function() {
		$('#metadata_browser').click();
	});

	// Data File selection
	$('#datafile_browser').change(function(){
		$('#text_datafile_name').val($(this).val());
    });
	
	$('#button_browse_datafile').click(function() {
		$('#datafile_browser').click();
	});

	// Upload
	$('#upload_metadata').click(function() {
		resetReport();
		
		if( $('#metadata_browser').val() != ""){
		    // file selected
			var metadata = $('#metadata_browser').get(0).files[0];

			// data selected
			var datafile = undefined;
			if( $('#datafile_browser').val() != ""){
				datafile = $('#datafile_browser').get(0).files[0];
			}
			preProcess(metadata, datafile);
		}

	});
	
});
