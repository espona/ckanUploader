    // CKAN API
	var CKAN_URL = 'http://envidat02.wsl.ch:5000';
	var CKAN_API = CKAN_URL + '/api/action/';

    function getPackage(user_token, package_name){
    	
		var ckan_url_show_package  = CKAN_API + "package_show?name_or_id=" + package_name;
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
	
		var ckan_url_create_package = CKAN_API + 'package_create';

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
	
		var ckan_url_create_package = CKAN_API + 'package_update';

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
        
	function dataUpload(user_token, package_data, datafile) {
		
		var upload_result = {'id':'', 'url':''};
				
		var ckan_url_create_resource = CKAN_API + 'resource_create';
		
		var file_name = encodeURIComponent(datafile.name.substr(0, datafile.name.lastIndexOf('.')) || datafile.name)
		var extension = encodeURIComponent(datafile.name.substr(datafile.name.lastIndexOf('.')+1, datafile.name.length) || datafile.type);

		var formData = new FormData();
		formData.append('package_id',  package_data.id);
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
				  upload_result = response.result;
			  },
			  error : function(response) {
				  console.error(response)
				}
			});

			return (upload_result);
	};
