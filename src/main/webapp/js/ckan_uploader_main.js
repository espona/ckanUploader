
$(document)	.ready(function() {
			
	// MAIN FUNCTION
	function upload(token, name, organization, metadata, datafile) {
			
		report  = " UPLOAD: Package " + name ;
        displayReport("<p>" + report + "</p>");
        
        // Check if package exists, create blank otherwise
        var package_data = getPackage(token, name);
        if (typeof package_data === "undefined") {
            displayReport("<p> Create package ...</p>");    
            package_data = createEmptyPackage(token, name, organization);
            displayReport("<p> Created Package, id:" + package_data.id + "</p>");
        }
        else {
            displayReport("<p> Package Exists, id:" + package_data.id + "</p>");
        }
        
        // Update Metadata
        if (metadata === "") {
            displayReport("<p> No metadata to update</p>");
        }
        else {
            displayReport("<p> Updating Metadata ...</p>");   
            package_data = mergeMetadata(package_data, metadata)
        }
        
        // Add Resource
        if (typeof datafile === "undefined") {
            displayReport("<p> No data to upload</p>");
        }
        else {
            displayReport("<p> Uploading Data ...</p>");        	
        }

        // 2. Create Package with resource
        //var upload_result = dataUpload(metadata, datafile);
        //console.log(upload_result.data_url);
        //if (upload_result.data_url.length <= 0){
        //    displayReport("<p> FAILED, aborting process!</p>");
        //	return;
        //}
        
    };
	


	function preProcess(token, name, organization, metadatafile, datafile){
	      var reader = new FileReader();

	      reader.onload = function (e) {
              displayReport("<p> Reading metadata </p>");
	    	  upload(token, name, organization, reader.result, datafile);
	       };
	      
	      if (typeof metadatafile === "undefined") {upload(token, name, organization, "", datafile);}
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
		$('#text_datafile_name').val($(this).val());
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
		var datafile = undefined;
		if( $('#datafile_browser').val() != ""){
			datafile = $('#datafile_browser').get(0).files[0];
		}
			
		preProcess(user_token, package_name, organization, metadatafile, datafile);

	});
	
});
