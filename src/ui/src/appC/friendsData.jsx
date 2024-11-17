import React, { useEffect } from "react";
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
			<div style={{ marginLeft: '2%', marginTop: '1%', marginBottom:"300px" }}>
				Information of user sharing my document.<br />
				<table className="table table-hover" id="friends1"></table>
				<a className="btn btn-dark" href="/userpage">Got It !!</a>
			</div>
		</>
	)
}
  
export default Friends;

