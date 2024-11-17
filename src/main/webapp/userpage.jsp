<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>My Page</title>

<script src="${pageContext.request.contextPath}/resources/functions.js">

<script  src="https://code.jquery.com/jquery-1.7.1.min.js"></script>

<!-- JS, Popper.js, and jQuery -->
<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.min.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" crossorigin="anonymous"></script>

<!-- CSS only -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

</head>
<body>
<%
	response.setHeader("Cache-control","no-cache");
	response.setHeader("Cache-control","no-store");
	response.setHeader("Pragma","no-cache");
	response.setDateHeader("Expire", 0);
%>

<center>
		<h1>Document Management System</h1>
</center>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
			<a class="navbar-brand" >Navbar</a>
		 <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
		 	<div class="navbar-nav">
					<a class="nav-link disabled" >${name}(${id})</a>
					<a class="nav-link" href="editDetails">Edit Details</a>
					<a class="nav-link" href="logout">Log Out</a>
					<button type="button" class="btn btn-link" onclick="loadDoc()" >Get All My Document</button>
					<button type="button" class="btn btn-link" id="myButton" >Add Document</button>
					<button type="button" class="btn btn-link" onclick="loadFriendsDoc()" >Get Friends Document</button>
					<button type="button" class="btn btn-link" onclick="loadSharedDoc()" >My Shared Document</button>
					<button type="button" class="btn btn-link" onclick="viewShareH()" >Shared History</button>
					<button type="button" class="btn btn-link" onclick="search()" >Search</button>
			</div>
		 </div>
	</div>
</nav>
<a href="friends1">Get Information of user sharing my document</a>
<a href="friends2">Get Information of user sharing document with me</a>

<div id="searchArea" style="display:none">
	<div class="input-group ps-5">
		<a>Enter Document Name To Search</a>
		<input type="search" id="form1" class="form-control" value = "document.txt"/>
		<button type="button" class="btn btn-primary" onclick="searchIT()"> <i class="fas fa-search">Search</i></button>
		<select id="select"></select>
	</div>
	
	<div> <table class="table table-hover" id="searchTable"></table> </div>
</div>

<h6><div id="details"></div></h6>
<div id="addCategory" style="display:none">
	<p>Add Category: <select id="addC" ></select><button type="button" class="btn btn-warning" onclick="addCategory()">Add</button></p>
	<p>Remove Category: <select id="removeC" ></select><button type="button" class="btn btn-danger" onclick="RemoveCategory()">Remove</button><br>
	<b>Note: Document is remove from its category only if belongs to that category.</b></p>
</div>

<div>
	<table class="table table-hover" id="demo"></table>
</div>

<div>
	<table class="table table-hover" id="others"></table>
</div>

<div>
	<table class="table table-hover" id="shared"></table>
	<div id="sharePoint" style="display:none">
		Unshare Document with ID = <input type="number" name="UD" id="UD"> <br>
		Remove access to this document with Id =  <input type="number" name="UU" id="UU">
		<button type="button" id="unshare">Un Share</button><a id="message"></a>
	</div>
</div>

<div>
	<table class="table table-hover" id="friendlog"></table>
</div>

<div id="txtEditor" class="form-group" style="display:none">
	<h4>Its id is <a id="docid"></a></h4><br>
	<a id="more_info"></a>
	<div id="hide">
		<p><button type="button" class="btn btn-danger" onclick="deletealert()" >Delete This Document</button></p>
		<p>
			If you want to change the name of file, type full file name here(with extension)<br>
			<input type="text" name="titleName"></input><button type="button" onclick="changeDname()">Change File Name</button>
		</p>
		<p>Update this document:
			<input id="fileupload" type="file" name="fileupload" />
			<button onclick="updateFile()">Update</button>
		</p>
		<p>
			Share this document with:
			<input type="number" name="shared_num" id="shared_num"></input><br>
			<button type="button" id="share">Share</button>
			<a id="shared"></a>
		</p>
	</div>
</div>

<div>
	<table class="table table-hover" id="history"></table>
</div>

<div id="confirm_del" style="display:none">
	<p>Are you sure you want to delete this document?This cannot be undone.</p>
	<button type="button" class="btn btn-danger" onclick="deleteIT()" >Yes. Delete This Document.</button>
	<button type="button" class="btn btn-success" onclick="deleteCancel()">No. Don't Delete it.</button>
</div>

<script>
	document.getElementById("myButton").onclick = function () // for save change of document
	{
			location.href = "/uploader";
	};
	
	$(function () 
	{
			$("#share").click(function ()
			{
				var input = {};
				var did = document.getElementById("docid").textContent;
				var friend = document.getElementsByName("shared_num")[0].value;
				$.ajax(
				{
					type:"POST",
					url: "/shareDocument",
					data: JSON.stringify({ id: did, data: friend }),
					contentType: "application/json; charset=utf-8",
		            dataType: "json",
		            success: function (response)
		            {
		            	document.getElementById("shared").innerHTML = response.responseText;
		            },
		            failure: function (response)
		            {
		            	document.getElementById("shared").innerHTML = response.responseText;
		            },
		            error: function (response)
		            {
		            	document.getElementById("shared").innerHTML = response.responseText;
		            }
				});
			});
	});
	
	$(function () 
	{
			$("#unshare").click(function ()
			{
				var input = {};
				var id = document.getElementsByName("UD")[0].value;
				var friend = document.getElementsByName("UU")[0].value;
				$.ajax(
				{
					type:"POST",
					url: "/unShare",
					data: JSON.stringify({ id: id, data: friend }),
					contentType: "application/json; charset=utf-8",
		            dataType: "json",
		            success: function (response)
		            {
		            	document.getElementById("message").innerHTML = response.responseText;
		            },
		            failure: function (response)
		            {
		            	document.getElementById("message").innerHTML = response.responseText;
		            },
		            error: function (response)
		            {
		            	document.getElementById("message").innerHTML = response.responseText;
		            }
				});
			});
	});

</script>

</body>
</html>