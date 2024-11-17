import React from "react";
import axios from 'axios';
import { Button } from "react-bootstrap";

function AddDocument()
{
	function createCategory() // create new category
	{
		var name = document.getElementById("value").value;
		var desc = document.getElementById("fdesc").value;
		var active = document.getElementById('active').checked;
		var id = sessionStorage.getItem("userID");
		if(id === 'null')
		{
			id = 0;
			alert("You must be logged in to create category.");
			return;
		}
		axios.post("/api/categoryCreate",
		{
			name: name,
			description: desc,
			active: active,
			created_by: id
		})
		.then(function(response)
		{
			document.getElementById("fmsg").innerHTML = response.data;
		})
		.catch(function(error)
		{
			alert(error);
		})
	}
	
	function getCategory() // get all available category
	{
		axios.post("/api/getCategory")
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var select = "<option selected value='0' name='No category'>Un-Categorized</option>";
			var x = xml.getElementsByTagName("item");
			for (var i = 0; i <x.length; i++)
			{
				select += "<option value=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + ">" +
				x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue + " </option>";
				//
				sessionStorage.setItem(x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue,
				x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue);
			}
			document.getElementById("select").innerHTML = select;
			document.getElementById("dropbox").style.display = "block";
		})
		.catch(function(error)
		{
			alert(error);
		})
	}
	
	function getDescription() // show description of category selected
	{
		var x = document.getElementById("select").value;
		document.getElementById("desc").innerHTML = sessionStorage.getItem(x);
	}
	
	function home() // go to home page
	{
		var id = sessionStorage.getItem("userID");
		var name = sessionStorage.getItem("username");
		sessionStorage.clear();
		sessionStorage.setItem("userID", id);
		sessionStorage.setItem("username", name);
	}
	
	function showForm() // show form to add category
	{
		document.getElementById("form").style.display = "block";
	}
	
	function upload() // uploads file in server.
	{
		const formData = new FormData(); 
		formData.append("file", document.getElementById("fileupload").files[0]);
		formData.append("category", document.getElementById("select").value);
		formData.append("userID", sessionStorage.getItem("userID"));
		axios.post("/api/uploadFile", formData,
		{
			 headers:{'Content-Type': 'multipart/form-data'}
		})
		.then(function(response)
		{
			document.getElementById("msg").innerHTML = response.data;
		})
		.catch(function(error)
		{
			alert(error);
		})
	}
	
	return(
	<div style={{ marginLeft: '3%' }}>
		<center><h1>Document Management System</h1>
		<h4>All Document to server</h4><p/></center>
		<Button onClick={home}>Go to home page</Button><p />
		<b>Note: If the document with exact same name exist in same location, it will not be uploaded.</b>
		<br /> <a>Select File: </a>&nbsp;&nbsp;&nbsp;&nbsp;
		<input className="btn btn-success" id="fileupload" type="file"></input>
		&nbsp;&nbsp;&nbsp;&nbsp;<button onClick={upload} className="btn btn-warning">Upload File</button><p />
		<h3 style={{ color: "red" }} id="msg"></h3>
		
		By Default this document is not given any category. Choose one of the existing category.
		<button type="button" style={{ color: "black", background: "yellow" }} onClick={getCategory}>Get Existing Category</button><br />
		<p id="dropbox" style={{ display: "none" }}>&nbsp;&nbsp;&nbsp;Select:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<select id="select" onChange={getDescription}></select>&nbsp;&nbsp;&nbsp;<a id="desc"></a></p>
		
		<p>Or you can create your custome category here.</p>
		<Button className="btn btn-warning" onClick={showForm}>Create New Category</Button><br />
		
		<div id="form" style={{ display: "none" }}>
			<h5 id="fmsg"></h5>
			Create New Category.
			<div className="form-group">
				<label className="col-sm-2 col-form-label">Value(Maximum 20 character)</label>
				<div className="col-sm-10">
					<input type="text" className="form-control-plaintext" id="value"  placeholder="New Category" required />
				</div>
			</div>
			<div className="form-group">
				<label className="col-sm-2 col-form-label">Description(Maximum 100 character)</label>
				<div className="col-sm-10">
					<input type="text" className="form-control-plaintext" id="fdesc" placeholder="Description" required />
				</div>
			</div>
			<div className="form-group form-check">
					<input className="form-check-input" type="checkbox" id="active" />
					<label className="form-check-label" >Make this un-available for choosing category.</label>
			</div>
			<div className="form-group">
				<Button className="btn btn-success" onClick={createCategory}>Create This Category</Button>
			</div>
		</div>
	</div>
	)
}

export default AddDocument;