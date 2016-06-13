
$(document)	.ready(function() {
	
	var METADATA_XML = "";
		
	// MAIN FUNCTION
	function upload(token, name, metadata, datafile) {
			
		report  = " UPLOAD: Package " + name ;
        displayReport("<p>" + report + "</p>");
        
        // Check if package exists, create blank otherwise
        var package_data = getPackage(token, name);
        console.log(package_data)
        if (typeof package_data === "undefined") {
            displayReport("<p> Create package ...</p>");        	
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
	


	function preProcess(token, name, metadatafile, datafile){
	      var reader = new FileReader();

	      reader.onload = function (e) {
              displayReport("<p> Reading metadata </p>");
	    	  upload(token, name, reader.result, datafile);
	       };
	      
	      if (typeof metadatafile === "undefined") {upload(token, name, "", datafile);}
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
	
	// Upload
	$('#upload_metadata').click(function() {
		resetReport();
		
		var user_token = $('#text_user_token').val();
		var package_name = $('#text_package_name').val();
				
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
			
		preProcess(user_token, package_name, metadatafile, datafile);

	});
	
});
