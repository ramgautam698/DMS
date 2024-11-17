<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Login</title>
</head>
<body>

<center>
		<h1>Document Management System</h1>
		<h3>Enter information for login</h3>
		${msg}
		<form action="loginU" method="POST">
			<p>Email: <input type="email" required name="email"></p>
			<p>Password: <input type="password" required name="password"></p>
			<p><input type="Submit" value="Log In"></p>
		</form>
</center>
	

</body>
</html>