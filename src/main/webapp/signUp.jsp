<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>User Registration</title>
</head>
<body>

<center>
		<h1>Document Management System</h1>
		<h3>Enter information for login</h3>
		${msg}
		<form action="register" method="POST">
			<p>Full Name: <input type="text" required name="name"></p>
			<p>Email: <input type="email" required name="email"></p>
			<p>Password: <input type="password" required name="password"></p>
			<p><input type="Submit" value="Register My Name"></p>
		</form>
</center>
	

</body>
</html>