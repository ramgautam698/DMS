import React from "react";
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sign_UP()
{
	let navigate = useNavigate();
	const [inputs, setInputs] = useState({
		email:"",
		name:"",
		password:"",
		CP:""
	});
	
	const handleChange = (event) =>
	{
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}
	
	const ok = (event) =>
	{
		event.preventDefault();
		if(inputs.password!=inputs.CP)
		{
			alert("Both of password does not match with each other");
			return;
		}
		axios.post("/api/register",
		{
			name: inputs.name,
			email: inputs.email,
			password: inputs.password,
		})
		.then(function(response)
		{
			console.log(response);
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("Content");
			var msg = x[0].getElementsByTagName("id")[0].childNodes[0].nodeValue;
			console.log(x[0].getElementsByTagName("id")[0].childNodes[0].nodeValue);
			if(msg==1)
			{
				alert(x[0].getElementsByTagName("data")[0].childNodes[0].nodeValue);
				navigate("/login");
			}
			else if(msg==0)
			{
				document.getElementById("msg").innerHTML = alert(x[0].getElementsByTagName("data")[0].childNodes[0].nodeValue);
			}
			else if(msg==2)
			{
				document.getElementById("msg").innerHTML = alert(x[0].getElementsByTagName("data")[0].childNodes[0].nodeValue);
			}
		})
		.catch(function(error){alert(error);})
	}
	
	return (
	<center>
	<h1>Document Management System</h1>
	<h3>Enter Required Data</h3>
	<form onSubmit={ok}>
		<h4 id="msg"></h4><p />
		New Full Name: <input type="text" name="name" value={inputs.name} onChange={handleChange} required /><p />
		New Email: <input type="email" name="email" value={inputs.email} onChange={handleChange} required /><p />
		Enter Password: <input type="password" name="password" value={inputs.password} onChange={handleChange} required /><p />
		Confirm Password: <input type="password" name="CP" value={inputs.CP} onChange={handleChange} /><p />
		<input type="submit" value="Register My Name" className="btn btn-success" />
	</form>
	</center>
	)
}
  
export default Sign_UP;

