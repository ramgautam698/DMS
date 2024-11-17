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

<a href="userpage">Go To Home Page</a><br>
<div>
	<table class="table table-hover">${table1}</table>
</div>

<div>
	<table class="table table-hover">${table2}</table>
</div>

</body>
</html>