<html xmlns:th="http://www.thymeleaf.org">
<head> 
	<title>File Upload </title>
	<script src="${pageContext.request.contextPath}/resources/functions.js">
	<script  src="https://code.jquery.com/jquery-1.7.1.min.js"></script>
</head> 
<body>
	<center>
		<h1>Document Management System</h1>
		<h3>Upload File in Server</h3>
	</center>
	
	<a href="userpage">Go To Home Page</a><br>
	<h5>Note: File will not get uploaded if the file with exactly same name already exist in same location.</h5>
	<h6>${msg} </h6>
	<input id="fileupload" type="file" name="fileupload" /> 
	<button id="upload-button" onclick="uploadFile()"> Upload </button>
	<p>The document is not given any category by default. Choose one of the existing category.</p>
	<button type="button" onclick="getCategory()">Get Existing Category</button>
	<p><select id="select" onchange="getDescription()" style="display:none"></select><a id="desc"></a><p>
	Or you can create new category
	<form action="categoryForm">
		<input type="submit" value="Create New Category">
	</form>

<script>
	async function uploadFile()
	{
	  let formData = new FormData(); 
	  formData.append("file", fileupload.files[0]);
	  var options = select.options;
	  //console.log(options);
	  formData.append("category", document.getElementById("select").value);
	  let response = await fetch('/upload',
	  {
	    method: "POST", 
	    body: formData
	  }); 
	
	  if (response.status == 200)
	  {
	    alert("File sent to server. Check in document list to see if it is uploaded.");
	  }
	}
</script>
<!-- <p>
		Select Category for this file:
		<select class="form-select" aria-label="Default select example" id="category">
			<option selected>Un-Categorized</option>
			<option data-id="1">One</option>
			<option data-id="2">Two</option>
			<option data-id="3">Three</option>
		</select>
	</p> -->

</body> 
</html>