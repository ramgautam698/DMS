import React from "react";
import axios from 'axios';
import { useState } from "react";
import { Button, } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home()
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
	
	const handleSubmit = (event) => // user log in
	{
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
				document.getElementById("msg1").innerHTML = res.data;
			}
			else
			{
				sessionStorage.setItem("userID", response.data.id);
				sessionStorage.setItem("username", response.data.data);
				sessionStorage.setItem("location", "/");
				document.getElementById("name").innerHTML = response.data.data;
				document.getElementById("n").style.display = "block";
				document.getElementById("profile").style.display = "block";
				navigate("/userpage");
			}
		})
		.catch(function(error) { alert(error); });
	}
	
	const register = (event) =>
	{
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
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("Content");
			var msg = x[0].getElementsByTagName("id")[0].childNodes[0].nodeValue;
			if(msg==1)
			{
				alert(x[0].getElementsByTagName("data")[0].childNodes[0].nodeValue);
			//	navigate("/login");
			}
			else 
			{
				document.getElementById("msg").innerHTML = response.data;
			}
		})
		.catch(function(error){alert(error);})
	}
	
	function login() // displays form for login
	{
		document.getElementById("home").style.display = "none";
		document.getElementById("signup").style.display = "none";
		document.getElementById("login").style.display = "block";
	}
	
	function signup() // display sign up form
	{
		document.getElementById("home").style.display = "none";
		document.getElementById("signup").style.display = "block";
		document.getElementById("login").style.display = "none";
	}
	
	function closeForm() // close forms
	{
		document.getElementById("home").style.display = "block";
		document.getElementById("signup").style.display = "none";
		document.getElementById("login").style.display = "none";
	}
	
	return (
	<div style={{marginBottom:"300px", textAlign:"center"}}>
		<div id="home">
			<p /><h5>Welcome</h5>
			To get started log in.<p />
			<Button onClick={login}>Log In</Button><p />
			Or, if you are new to this website.<p />
			<Button onClick={signup}>Register </Button>
		</div>
		
		<div id="login" style={{ display: "none" }}>
			<p id="msg">Enter data for log in</p>
			<form onSubmit={handleSubmit}>
				<h4 id="msg1"></h4><p />
				<label>Enter your email:
					<input type="email" name="email" value={inputs.email} onChange={handleChange} />
				</label><p />
				<label>Enter your password:
					<input type="password" name="password" value={inputs.password || ""} onChange={handleChange} />
		        </label><p />
				<button type="button" onClick={handleSubmit} className="btn btn-success">Log In</button>
			</form><p />
			Or, you can register your name.<p />
			<Button onClick={signup}>Register </Button><p />
			<a className="btn btn-link" onClick={closeForm}>Close Form</a>
		</div>
		
		<div id="signup" style={{ display: "none" }}>
			Registration Form
			<form onSubmit={register}>
				<h4 id="msg"></h4><p />
				New Full Name: <input type="text" name="name" value={inputs.name} onChange={handleChange} required /><p />
				New Email: <input type="email" name="email" value={inputs.email} onChange={handleChange} required /><p />
				Enter Password: <input type="password" name="password" value={inputs.password} onChange={handleChange} required /><p />
				Confirm Password: <input type="password" name="CP" value={inputs.CP} onChange={handleChange} /><p />
				<button type="button" className="btn btn-success" >Register My Name</button>
			</form>
			<p />If you have already register, you can log in.<p />
			<Button onClick={login}>Log In</Button><p />
			<a className="btn btn-link" onClick={closeForm}>Close Form</a>
		</div>
	</div>
	)
}
  
export default Home;
