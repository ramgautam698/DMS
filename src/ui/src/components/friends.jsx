import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Friends()
{
	let navigate = useNavigate();
	
	useEffect(() => // this function is called on every page reload
    {
		var uid = sessionStorage.getItem("userID");
		if(uid === null)
		{
			navigate("/");
		}
		axios.post("/api/friends",
		{
			id : uid,
		})
		.then(function(response)
		{
			document.getElementById("friends1").innerHTML = response.data;
		})
		.catch(function(error) { alert(error); });
	}, []);
	
	return (
		<>
			<center>
			<h1>Document Management System</h1>
			<h3>Information About Other Users</h3>
			<a href="/userpage">Go to home page</a>
			</center>
			<div style={{ marginLeft: '2%', marginTop: '1%' }}>
				Information of user sharing my document.<br />
				<table className="table table-hover" id="friends1"></table>
			</div>
		</>
	)
}
  
export default Friends;

