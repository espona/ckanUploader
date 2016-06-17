    // CKAN API
	var CKAN_URL = 'http://envidat02.wsl.ch:5000/api/action/';

    function getPackage(user_token, package_name){
    	
		var ckan_url_show_package  = CKAN_URL + "package_show?name_or_id=" + package_name;
		var package_data = undefined;
		
		$.ajax({
			  url : ckan_url_show_package,
			  type : 'GET',
			  async: false,
	          headers: {
	        	  'X-CKAN-API-Key':user_token
	          },
			  success : function(response, data) {
					package_data = response.result;
			  },
			  error : function(response) {
				  console.warn(response);
				}
			});
		
        return(package_data);    	
    };
    
    function createEmptyPackage(user_token, package_name, organization){
		var organization_id = organization;
		var package_data = undefined;
	
		var ckan_url_create_package = CKAN_URL + 'package_create';

		$.ajax({
		  url : ckan_url_create_package,
		  type : 'POST',
		  async: false,
          headers: {
        	  'X-CKAN-API-Key':user_token
          },
		  data : JSON.stringify({
			  'name': package_name,
			  'title': encodeURIComponent(package_name),
			  'owner_org': organization_id,
			  'notes': 'Package Created from CKAN Uploader Webapp'
		  }),
          dataType: "json",
		  success : function(response, data) {
				package_data = response.result
		  },
		  error : function(response) {
			  console.error(response)
			}
		});
		return (package_data);
    	
    };
    
    function updatePackage(user_token, package_data){
	
		var ckan_url_create_package = CKAN_URL + 'package_update';

		$.ajax({
		  url : ckan_url_create_package,
		  type : 'POST',
		  async: false,
          headers: {
        	  'X-CKAN-API-Key':user_token
          },
		  data : JSON.stringify(package_data),
          dataType: "json",
		  success : function(response, data) {
				package_data = response.result
		  },
		  error : function(response) {
			  console.error(response)
			}
		});
		return (package_data);
    	
    };
    
    // OLD
    
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
