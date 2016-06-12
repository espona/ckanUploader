<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<html>
<head>
	<title>CKAN Uploader</title>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet" type="text/css">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700" rel="stylesheet" type="text/css">
      <link rel="stylesheet" type="text/css" href="css/metadata_style.css">
      <link rel="shortcut icon" href="images/envidat-ckan-favicon.ico">
</head>
<body>
	<div align="center">
		<h1>CKAN Upload Client </h1>
	</div>

	<div class="hidden">
		<input type='file' accept=".xml" id="metadata_browser"  style="width:0px; height:0px;overflow: hidden;"/>
		<input type='file'               id="datafile_browser"  style="width:0px; height:0px;overflow: hidden;"/>
	</div>
	
	<div style="width: 100%;" >	
		<fieldset>
			<legend>
				Resource Data
			</legend>
			<table style="width: 100%; border: 0px;">
			    <thead></thead>
			    <tbody>
					<tr>
						<td align="right">
						    <label class= "field" >User Token: </label>
						</td>	
						<td style="width: 99%;">
							<input type="text" id="text_user_token" class="data" style="width: 100%;"/> 
						</td>	
					</tr>
					<tr>
						<td>
						    <label class= "field">Package Name: </label>
						</td>	
						<td style="width: 99%;">
							<input type="text" id="text_package_name" class="data" style="width: 100%;"/> 
						</td>	
					</tr>
				</tbody>
			</table>
		</fieldset>	
		</div>
		<div style="width: 100%;" >	
		<fieldset>
			<legend>
				Upload File(s)
			</legend>
			<table style="width: 100%; border: 0px;">
			    <thead></thead>
			    <tbody>
					<tr>
						<td style="width: 100%;">
							<input type="text" id="text_metadata_name" readonly="readonly" class="filename" disabled style="width: 99%;"/> 
						</td>	
						<td>
							<button type="submit" id="button_browse_metadata" class="browse">
								<img alt="" src="images/folder_document.png"/>
								<span style="vertical-align: middle;">Choose Metadata...</span> 
							</button>
						</td>	
					</tr>
					<tr>
						<td style="width: 100%;">
							<input type="text" id="text_datafile_name" readonly="readonly" class="filename" disabled style="width: 99%;"/> 
						</td>	
						<td>
							<button type="submit" id="button_browse_datafile" class="browse"">
								<img alt="" src="images/folder_document.png"/>
								<span style="vertical-align: middle;">Choose Data Files...</span> 
							</button>
						</td>	
					</tr>
				</tbody>
			</table>
		</fieldset>
		<div  style="width: 100%;"  align="center">
			<button id="upload_metadata" type="submit" class="upload" >
				<img alt="" src="images/cloud_upload.png"/>
				<span style="vertical-align: middle;align:center;">CKAN UPLOAD</span> 
			</button>
		</div>				
	</div>

	<div>
		<fieldset style="min-height:300px;">
			<legend>
				Server Report
			</legend>
			<div id="div_report"  class="scrollable" style="width: 100%; min-height: 300px">
			</div>
		</fieldset>
	</div>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"></script>
	<script src="metadata_upload_script.js"></script>
	
</body>
</html>
