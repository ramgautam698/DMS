<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Change User Information</title>
<script>
        function checkpasswd(event)
        {
            var pass = document.forms["myForm"]["NP"].value;
            var pass2 = document.forms["myForm"]["CNP"].value;
            if(pass.localeCompare(pass2)!=0)
            {
                alert("Both Password did not match with each other");
                event.preventDefault();
                return false;
            }
        }
    </script>
</head>
<body>

<center>
		<h1>Document Management System</h1>
		<h3>Enter information for change</h3>
		${msg}
		<form name="myForm" action="editUser" method="POST" onsubmit="checkpasswd(event)">
			<p>New Full Name: <input type="text" name="name"></p>
			<p>New Email: <input type="email" name="email"></p>
			<p>Current Password: <input type="password" required name="CP"></p>
			<p>New Password: <input type="password" name="NP"></p>
			<p>Confirm New Password: <input type="password" name="CNP"></p>
			<p><input type="Submit" value="Edit My Detail"></p>
		</form>
		<form action="deleteUser" method="POST">
			<p>Current Password: <input type="password" required name="CP"></p>
			<p><input type="Submit" value="Cancel My Registration"></p>
		</form>
</center>
	

</body>
</html>