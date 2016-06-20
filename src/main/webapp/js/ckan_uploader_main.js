
$(document)	.ready(function() {
			
	// MAIN FUNCTION
	function upload(token, name, organization, metadata, datafiles) {
			
		report  = " UPLOAD: Package " + name ;
        displayReport("<p>" + report + "</p>");
        
        // Check if package exists, create blank otherwise
        var package_data = getPackage(token, name);

        if (typeof package_data === "undefined") {
            displayReport("<p> Create package ...");    
            package_data = createEmptyPackage(token, name, organization);
            displayReport("  - Created Package, id:" + package_data.id);
        }
        else {
            displayReport("  - Package Exists, id:" + package_data.id);
        }
    	var package_url = CKAN_URL + '/dataset/' + package_data.name
        displayReport("  <a href=\"" + package_url + "\">" + package_url + " </a> </p>");
        
        // Update Metadata
        if (metadata === "") {
            displayReport("<p> No metadata to update</p>");
        }
        else {
            displayReport("<p> Updating Metadata ...");   
            package_data = mergeMetadata(package_data, metadata)
            package_data = updatePackage(token, package_data)
        	console.log(package_data)
        	displayReport("  - DONE: package id: " + package_data.id + ",  <a href=\"" + package_url + "\">" + package_url + " </a></p> ");
        }
        
        // Add Resource
        if (typeof datafiles === "undefined") {
            displayReport("<p> No data to upload</p>");
        }
        else {
        	datafiles.forEach(function(datafile) {
	            displayReport("<p> Uploading data: " + datafile.name + " (" + datafile.size + " bytes)");
	            var upload_result = dataUpload(token, package_data, datafile);
	            if (upload_result.url.length <= 0){
	            	 displayReport("  * FAILED</p>");
	            	 return;
	            } else {
	            	displayReport("  - DONE: resource id: " + upload_result.id + ",  <a href=\"" + upload_result.url + "\">" + upload_result.url + " </a> </p>");	
	            }
        	});
        }
    };

	function preProcess(token, name, organization, metadatafile, datafiles){
	      var reader = new FileReader();

	      reader.onload = function (e) {
              displayReport("<p> Reading metadata </p>");
	    	  upload(token, name, organization, reader.result, datafiles);
	       };
	      
	      if (typeof metadatafile === "undefined") {upload(token, name, organization, "", datafiles);}
	      else { reader.readAsText(metadatafile);}
	 }
	 
	// **************************************************************************

	// Empty text
	resetUploadForm();
	resetReport();
		
	// Metadata File selection
	$('#metadata_browser').change(function(){
		uploadButtonCheckEnable();
		$('#text_metadata_name').val($(this).val());
    });
	
	$('#button_browse_metadata').click(function() {
		$('#metadata_browser').click();
	});

	// Data File selection
	$('#datafile_browser').change(function(){
		uploadButtonCheckEnable();
		$('#text_datafile_name').val(getFileNames($(this).get(0).files));
    });
	
	$('#button_browse_datafile').click(function() {
		$('#datafile_browser').click();
	});

	// User Token
	$('#text_user_token').change(function(){ uploadButtonCheckEnable(); });
	
	// Package Name
	$('#text_package_name').change(function(){ uploadButtonCheckEnable(); });
	
	// Organization
	$('#text_organization').change(function(){ uploadButtonCheckEnable(); });
	
	// Upload
	$('#upload_metadata').click(function() {
		resetReport();
		
		var user_token = $('#text_user_token').val();
		var package_name = $('#text_package_name').val();
		var organization = $('#text_organization').val();
				
	    // metadata selected
		var metadatafile = undefined;
		if( $('#metadata_browser').val() != ""){
			metadatafile = $('#metadata_browser').get(0).files[0];
		}
		
		// data selected
		var datafiles = undefined;
		if( $('#datafile_browser').val() != ""){
			datafiles = getFileList( $('#datafile_browser').get(0).files);
		}
			
		preProcess(user_token, package_name, organization, metadatafile, datafiles);

	});
	
});
