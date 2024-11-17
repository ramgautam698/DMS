<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Admin Login</title>
</head>
<body>

<center>
		<h1>Document Management System</h1>
		<h3>Admin Log In</h3>
		<h4>Enter required information</h4>
		${msg}
		<form action="ALD" method="POST">
			<p>Email: <input type="email" required name="email"></p>
			<p>Password: <input type="password" required name="password"></p>
			<p><input type="Submit" value="Log In"></p>
		</form>
</center>
	

</body>
</html>