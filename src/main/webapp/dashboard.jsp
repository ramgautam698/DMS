<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Admin Page</title>

<script src="${pageContext.request.contextPath}/resources/admin.js">

<script  src="https://code.jquery.com/jquery-1.7.1.min.js"></script>

<!-- JS, Popper.js, and jQuery -->
<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.min.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" crossorigin="anonymous"></script>

<!-- CSS only -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

</head>
<body>

<center>
		<h1>Document Management System</h1>
		<h2>Admin Control Panel</h2>
</center>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
			<a class="navbar-brand" >Navbar</a>
		 <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
		 	<div class="navbar-nav">
					<a class="nav-link disabled" >${name}</a>
					<button type="button" class="btn btn-link" onclick="loadUser()" >User Data</button>
					<button type="button" class="btn btn-link" onclick="loadlog()" >Admin Log</button>
					<a class="nav-link" href="logout">Log Out</a>
			</div>
		 </div>
	</div>
</nav>

<div>
	<table class="table table-hover" id="user"> </table>
</div>

${errMSG}
<div style="display:none" id="approval">
	<p>
		Provide Log In Approvel to User with ID:
		<input type="number" name="user" id="user"></input>
		<button type="button" onclick="approve()">APPROVE</button><br>
		<a id="message"></a>
	</p>
</div>

<center>
<div>
	<p id="desc" style="display:none"><b>In Column, Action:</b>"e" for edited, "u" for uploaded, "d" for deleted,
	"n" for change of file name, "s" for shared, "x" for unshared, NULL if file have been uploaded.<br>
	<b>Likewise In Column, Edited File/User ID:</b>
	It contains previous file name before editing, file path if deleted, old name if file name changed, id of other user if shared.</p>
	<table class="table table-hover" id="log"> </table>
</div>
</center>


</body>
</html>