import React, { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './style.css';

function Header()
{
	const logo = require('./LOGO_DMS'); // logo
	const user = require('./user.png'); // picture for user
	let navigate = useNavigate();
	
	useEffect(() => // this function is called on every page reload
    {
		var id = sessionStorage.getItem("userID");
		if(id !== null)
		{
			document.getElementById("profile").style.display = "block";
		}
		else
		{
			document.getElementById("profile").style.display = "none";
		}
	}, []);
	
	function logout()
	{
		axios.post("/api/logout")
		.then(function(response)
		{
			if(response.data)
			{
				sessionStorage.clear();
				document.getElementById("profile").style.display = "none";
				document.getElementById("n").style.display = "none";
				navigate("/");
				return;
			}
		})
		.catch(function(error) { alert(error); });
	}
	
	function userInfo() // information about user
	{
		axios.get("/api/information")
		.then(function(response)
		{
			var x = (new DOMParser()).parseFromString(response.data, "text/xml");
			document.getElementById("pid").innerHTML = x.getElementsByTagName("userID")[0].childNodes[0].nodeValue;
			document.getElementById("pname").innerHTML = x.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			document.getElementById("pmail").innerHTML = x.getElementsByTagName("email")[0].childNodes[0].nodeValue;
			document.getElementById("pdate").innerHTML = x.getElementsByTagName("date_of_joined")[0].childNodes[0].nodeValue;
		})
	}
	
	return (
	<>
	<div>
		<div className="leftbox">
			<img src={logo} alt="LOGO" style={{ height:"99px" }} />
		</div>
		<div className="middlebox">
			<h2>Document Management System</h2>
			<h4>Manage All Of Your Document</h4>
		</div>
		<div className="rightbox">
			<div id="profile" style={{ display: "none",marginRight: '3%' }}>
				<Dropdown >
					<Dropdown.Toggle style={{ backgroundColor:"skyblue" }}>
						<img src={user} alt="U" style={{ height:"80px" }} /></Dropdown.Toggle>
					<Dropdown.Menu>
					<Dropdown.Item href="/editDetails">Edit Details</Dropdown.Item>
					<Dropdown.Item onClick={userInfo} data-toggle="modal" data-target="#info">My Information</Dropdown.Item>
					<Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	</div>
	
	<div className="modal fade" id="info" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
		<div className="modal-dialog modal-dialog-centered" role="document">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="exampleModalLongTitle"><b>Information About User</b></h5>
					<button type="button" className="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="modal-body">
					ID:&nbsp;&nbsp;<a id="pid"></a><br/>
					Name:&nbsp;&nbsp;<a id="pname"></a><br/>
					Email:&nbsp;&nbsp;<a id="pmail"></a><br />
					Date of join:&nbsp;&nbsp;<a id="pdate"></a>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
	</>
	)
}
  
export default Header;
