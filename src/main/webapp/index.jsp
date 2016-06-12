<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<html>
<head>
	<title>Metadata Upload Rest Client</title>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet" type="text/css">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700" rel="stylesheet" type="text/css">
      <link href="http://www.envidat.ch/css/envidat_datacite.css" rel="Stylesheet" type="text/css">
      <link rel="stylesheet" type="text/css" href="css/metadata_style.css">
      <link rel="shortcut icon" href="http://www.envidat.ch/css/envidat-logo-icon.ico">
</head>
<body>
	<div align="center">
		<h1>Metadata Upload Client </h1>
	</div>

	<div class="hidden">
		<input type='file' accept=".xml" id="metadata_browser"  style="width:0px; height:0px;overflow: hidden;"/>
		<input type='file'               id="datafile_browser"  style="width:0px; height:0px;overflow: hidden;"/>
	</div>
	
	<div style="width: 100%;" >	
		<fieldset>
			<legend>
				Upload File
			</legend>
			<table style="width: 100%; border: 0px;">
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
					<td  style="padding-left: 5px;">
						<button id="upload_metadata" type="submit" class="upload" >
							<img alt="" src="images/cloud_upload.png"/>
							<span style="vertical-align: middle;">Upload</span> 
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
							<span style="vertical-align: middle;">Choose Data File...</span> 
						</button>
					</td>	
					<td  style="padding-left: 5px; display: inline-block;">
						
					</td>
				</tr>
			</table>
		</fieldset>
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
