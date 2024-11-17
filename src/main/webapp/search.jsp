<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Search</title>
<link href="${pageContext.request.contextPath}/resources/stylesheet.css" rel="stylesheet">
</head>
<body>

<center>
		<h1>Document Management System</h1>
</center>
<div class="topbox">
	Searching can be done here.
</div>

<div>
	<input type="text" id="name">
	<button type="button" onclick="loadDoc()">Get Document</button>
</div>
<div>
	<table id="demo"></table>
</div>

<script>
	function loadDoc()
	{
		var name = document.getElementById("name").value;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//document.getElementById("s").innerHTML = this.responseText;
				var i;
				var xmlDoc = this.responseXML;
				var table="<tr><th>ID</th><th>Title</th><th>Location</th><th>Type</th></tr>";
				var x = xmlDoc.getElementsByTagName("item");
				//console.log("Length of list = " + x.length);
				for (i = 0; i <x.length; i++)
				{
					table += "<tr><td>" +
				    x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				    "</td><td>" +
				    x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
				    "</td><td>" +
				    x[i].getElementsByTagName("location")[0].childNodes[0].nodeValue +
				    "</td><td>" +
				    x[i].getElementsByTagName("type")[0].childNodes[0].nodeValue +
				    "</td></tr>";
				}
				document.getElementById("demo").innerHTML = table;
			}
		};
		xhttp.open("POST", "/showdocument", true);
		xhttp.send(name);
	}
	
</script>

</body>
</html>