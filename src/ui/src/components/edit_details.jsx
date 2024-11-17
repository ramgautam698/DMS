import React, {useEffect} from "react";
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Edit_Details()
{
	let navigate = useNavigate();
	const [inputs, setInputs] = useState({
		email:"",
		name:"",
		CP:"",
		NP:"",
		CNP:"",
		CCP:"",
	});
	
	useEffect(() =>
	{
		var id = sessionStorage.getItem("userID");
		if(id === 'null')
		{
		//	navigate("/");
		}
		document.getElementById("id").innerHTML = id;
	})
	
	const handleChange = (event) =>
	{
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}
	
	const update = (event) =>
	{
		event.preventDefault();
		if(inputs.NP!=inputs.CNP)
		{
			alert("Both of new password does not match with each other");
			return;
		}
		const formData = new FormData(); 
		formData.append("email", inputs.email);
		formData.append("name", inputs.name);
		formData.append("CP", inputs.CP);
		formData.append("NP", inputs.NP);
		axios.post("/api/updateUser", formData)
		.then(function(response)
		{
			document.getElementById("msg").innerHTML = response.data;
		})
		.catch(function(error){alert(error);})
	}
	
	const cancelReg = (event) => // cancels the user registration
	{
		event.preventDefault();
		axios.post("/api/deleteUser",
		{
			data: inputs.CCP,
			id: parseInt(sessionStorage.getItem("userID"))
		})
		.then(function(response)
		{
			var x = (new DOMParser()).parseFromString(response.data, "text/xml").getElementsByTagName("Boolean");
			if(x[0].childNodes[0].nodeValue=="true")
			{
				alert("Your registration cancelled.")
				sessionStorage.clear();
				navigate("/");
			}
			else document.getElementById("msg").innerHTML = "The password entered is incorrect.";
		})
		.catch(function(error){alert(error);});
	}
	
	return (
	<center>
	<h1>Document Management System</h1>
	<h3>Edit Details here.</h3>
	<a href="/userpage">Go to home page</a><p />
	My ID is <a id="id"></a>
	<form onSubmit={update}>
		<h4 id="msg"></h4><p />
		New Full Name:<input type="text" name="name" value={inputs.name} onChange={handleChange} /><p />
		New Email:<input type="email" name="email" value={inputs.email} onChange={handleChange} /><p />
		Current Password:<input type="password" name="CP" value={inputs.CP} onChange={handleChange} /><p />
		New Password:<input type="password" name="NP" value={inputs.NP} onChange={handleChange} /><p />
		Confirm New Password:<input type="password" name="CNP" value={inputs.CNP} onChange={handleChange} /><p />
		<input type="submit" value="Update Data" className="btn btn-warning" />
	</form><p/>
	<form onSubmit={cancelReg}>
		Current Password:
		<input type="password" name="CCP" required value={inputs.CCP || ""} onChange={handleChange}/><p />
		<input type="Submit" value="Cancel My Registration" className="btn btn-danger" />
	</form>
	</center>
	)
}
  
export default Edit_Details;

