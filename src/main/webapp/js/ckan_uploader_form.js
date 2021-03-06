	// FORM FUNCTIONS
	function resetUploadForm() {
		$('#upload_metadata').prop('disabled', true);
		
		$('#metadata_browser').val("");
		$('#text_metadata_name').val("");

		$('#datafile_browser').val("");
		$('#text_datafile_name').val("");
		
		$('#text_user_token').val("aa1247a9-92c3-494d-90ba-7a3bf1dab7bd");
		$('#text_package_name').val("test-ckanuploader");
		$('#text_organization').val("wsl");
	};

	function resetReport() {
    	$('#div_report').empty("");
 	};
	
	function displayReport(report){
		$('#div_report').append(report);
	}

	function uploadButtonCheckEnable(){
		
		$('#upload_metadata').prop('disabled', true);
		
		if (! $('#text_user_token').val())    return;
		if (! $('#text_package_name').val())  return;
		if (! $('#text_organization').val())  return;
		
		if ($('#metadata_browser').val()) $('#upload_metadata').prop('disabled', false);
		if ($('#datafile_browser').val()) $('#upload_metadata').prop('disabled', false);
		return;
	}

	function getFileNames(files){
		var file_names = [];
		getFileList(files).forEach(function(file)  { 
			file_names.push( file['name'].trim());
		});
		return ("Files(" + files.length + "): " + file_names.join(", "));
	}
	
	function getFileList(files){
		var file_list = [];
		for (i = 0; i < files.length; i++)  { 
			file_list.push( files[i]);
		}
		return (file_list);
	}