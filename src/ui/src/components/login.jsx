import React from "react";
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login()
{
	const [inputs, setInputs] = useState({
		email:"",
		password:"",
	});
	
	const handleChange = (event) =>
	{
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}
	
	let navigate = useNavigate(); 
	
	const handleSubmit = (event) =>
	{
		event.preventDefault();
		axios.post("/api/login",
		{
			email: inputs.email,
			password: inputs.password,
		})
		.then(function(response)
		{
			var res = response.data; // res is object, res.id is valid
			if(res.id===0) // failed to log in
			{
				document.getElementById("msg").innerHTML = res.data;
			}
			else
			{
				sessionStorage.setItem("userID", response.data.id);
				sessionStorage.setItem("username", response.data.data);
				navigate("/userpage");
			}
		})
		.catch(function(error)
		{
			alert(error);
		});
	}
	
	return (
	<center>
	<h1>Document Management System</h1>
	<h3>Enter data for log in</h3>
	<form onSubmit={handleSubmit}>
		<h4 id="msg"></h4><p />
		<label>Enter your email:
			<input type="email" name="email" id="e" value={inputs.email} onChange={handleChange} />
		</label><p />
		<label>Enter your password:
			<input type="password" name="password" id="p" value={inputs.password || ""} onChange={handleChange} />
        </label><p />
		<input type="submit" value="Log In" />
	</form></center>
	)
}
  
export default Login;

/*var Login = () => {
  return (
	<div>
		<h3>Enter Information for login</h3>
		<form>
			Email: <input type="email" id="email" /><br />
			Password: <input type="password" id="password" /><br />
			<input type="button" value="Log In" onClick={formSubmit} />
		</form>
    </div>
  );
};
function formSubmit()
{
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	axios.post("/api/login",
		{
			"Content-Type": "application/xml; charset=utf-8",
			"data": JSON.stringify({mail: email, pass:password}),
			"dataType": "json"
			//JSON.stringify({ id: parseInt(id), data: category_id })
		})
		.then(function(response)
		{
			console.log(response.data);
		})
		.catch(function(error)
		{
			alert(error);
		});
}
*/