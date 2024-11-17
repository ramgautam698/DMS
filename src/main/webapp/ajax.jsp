<html xmlns:th="http://www.thymeleaf.org">
<head> 
<title>File Upload </title> 
</head> 
<body>
	
	<h2>Note: File will not get uploaded if the file with exactly same name already exist in same location.<h2>
	<input id="fileupload" type="file" name="fileupload" /> 
	<button id="upload-button" onclick="uploadFile()"> Upload </button>

<script>
	async function uploadFile()
	{
	  let formData = new FormData(); 
	  formData.append("file", fileupload.files[0]);
	  let response = await fetch('/upload', {
	    method: "POST", 
	    body: formData
	  }); 
	
	  if (response.status == 200) {
	    alert("File sent to server. Check in document list to see if it is uploaded.");
	  }
	}
</script>

</body> 
</html>