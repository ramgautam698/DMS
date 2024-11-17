import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";

function Userpage()
{
	let navigate = useNavigate();
	const handleChange = (event) => {}
	
	useEffect(() => // this function is called on every page reload
    {
		var id = sessionStorage.getItem("userID");
		if(id === 'null')
		{
			navigate("/");
		}
		var name = sessionStorage.getItem("username");
		sessionStorage.clear();
		sessionStorage.setItem("userID", id);
		sessionStorage.setItem("username", name);
		document.getElementById("user").innerHTML = name;
	}, []);
	
	function categories() // displays all categories of user and also active categories
	{
		document.getElementById("cDiv").style.display = "block";
		axios.post("/api/getCategoryALL")
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Name</th><th scope='col'>Description</th>" +
			"<th scope='col'>Created By</th><th scope='col'>Active</th><th scope='col'>Created On</th></tr></thead><tbody>";
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" +
				x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("created_by")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("active")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("date")[0].childNodes[0].nodeValue + " : " +
				x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='cDiv' class='btn btn-warning' " +
			"onclick='unloadIT(this.id)' >Hide This Table</button></td></tr></tbody></table>";
			document.getElementById("category").innerHTML = table;
		})
		.catch(function(error){alert(error);})
	}
	
	function categoryEdit() // edit the category
	{
		document.getElementById("ce").style.display = "block";
	}
	
	function categoryUpdate() // Update the values of category
	{
		var id = document.getElementById('num').value;
		var name = document.getElementById('n').value;
		var desc = document.getElementById('DESC').value;
		var checkbox = document.getElementById('myCheck');
		if(checkbox.checked == true)
		{
			var active = true;
		}
		else
		{
			var active = false;
		}
		axios.post("/api/categoryUpdate",
		{
			id: id,
			name: name,
			description: desc,
			active: active,
		})
		.then(function(response)
		{
			document.getElementById("msgg").innerHTML = response.data;
		})
		.catch(function(error){alert(error);})
	}
	
	function changeFileName() // change name of file
	{
		var id = document.getElementById("docid").textContent;
		var newname = document.getElementById("titleName").value;
		axios.post("/api/changeFileName",{ id: id, data: newname})
		.then(function(response)
		{
			if(response.data)
				alert("File Name changed with extension");
			else
				alert("ERROR");
		})
		.catch(function(error){alert(error);})
	}
	
	function Delete() // conformation for delete
	{
		document.getElementById("confirm_del").style.display = "block";
	}
	
	function DeleteCancel() // request for file delete cancelled
	{
		document.getElementById("confirm_del").style.display = "none";
	}
	
	function DeleteFinal() // delete the document
	{
		axios.post("/api/delete",{id : document.getElementById("docid").textContent})
		.then(function(response)
		{
			alert(response.data);
		})
		.catch(function(error){alert(error);})
	}
	
	function hideDetail() // hides the details of document shown
	{
		document.getElementById("hide").style.display = "none";
	}
	
	function History_of_Other() // shows history of other's shared document
	{
		document.getElementById("FHDiv").style.display = "block";
		axios.get("/api/History_of_Other")
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<thead><tr><th scope='col'>Date</th><th scope='col'>Time</th><th scope='col'>Document ID</th>";
			table += "<th scope='col'>Action</th><th scope='col'>Shared/Unshared with</th></tr></thead><tbody>";;
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" +
				x[i].getElementsByTagName("date")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("doc_ID")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>";
				if(x[i].getElementsByTagName("action")[0].childNodes[0].nodeValue === "s")
				{
					table += "Share With";
				}
				else
				{
					table += "Un-Shared With";
				}
				table += "</td><td scope='row'>" +
				x[i].getElementsByTagName("doc_ID")[0].childNodes[0].nodeValue +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='FHDiv' class='btn btn-warning' " +
			"onclick='unloadIT(this.id)' >Hide History</button></td></tr></tbody></table>";
			document.getElementById("friendsHistory").innerHTML = table;
		})
		.catch(function(error){alert(error);})
	}
	
	function logout()
	{
		axios.post("/api/logout")
		.then(function(response)
		{
			if(response.data)
			{
				sessionStorage.clear();
				navigate("/");
			}
		})
		.catch(function(error)
		{
			alert(error);
		});
	}
	
	function mySharedDocument() // shows the list of documents that are shared
	{
		document.getElementById("MDiv").style.display = "block";
		if(sessionStorage.getItem("C"))
		{
			return;
		}
		axios.post("/api/mySHAREDdocument")
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<thead><tr><th scope='col'>S.N</th><th scope='col'>File Name</th>" +
				"<th scope='col'>Shared With</th></tr></thead><tbody>";
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" + (i+1) +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("location")[0].childNodes[0].nodeValue +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='MDiv'" +
			"class='btn btn-warning' onclick='unloadIT(this.id)' >Unload Document</button></td></tr></tbody></table>";
			document.getElementById("mySharedDocument").innerHTML = table;
			sessionStorage.setItem("C",true);
			
		})
		.catch(function(error){alert(error);});
	}
	
	function search() // displays the search result
	{
		document.getElementById("searchResult").style.display = "block";
		var name = document.getElementById("name").value;
		var cat_id = document.getElementById("select").value;
		axios.post("/api/search",
		{
			id: cat_id,
			data: name
		})
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Full Name</th><th scope='col'>Location</th>" + 
			"</tr></thead><tbody>";
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" +
				x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("location")[0].childNodes[0].nodeValue + 	
				"</td><td scope='row'><button id=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				" onclick='openFile(this.id, this.value)' " + "value=" + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue
				+ " class='btn btn-warning'>Open</button>" +
				"</td><td scope='row'><button id=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				" onclick='details(this.id, 1)' class='btn btn-primary'>Get Details</button>" +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='searchResult' class='btn btn-warning' " +
			"onclick='unloadIT(this.id)' >Clear Search Result</button></td></tr></tbody></table>";
			document.getElementById("searchResult").innerHTML = table;
		})
		.catch(function(error){alert(error)})
	}
	
	function searchBar() // makes search bar appear
	{
		document.getElementById("searchBar").style.display = "block";
		axios.post("/api/getCategory")
		.then(function(response)
		{
			var xmlDoc = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xmlDoc.getElementsByTagName("item");
			var select = "<option selected value='0' name='No category'>Un-Categorized</option>";
			for (var i = 0; i <x.length; i++)
			{
				select += "<option value=" +
				x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + ">" +
				x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue + " </option>";
			}
			document.getElementById("select").innerHTML = select;
		})
		.catch(function(error)
		{
			alert(error);
		});
	}
	
	function sharedHistory() // displays the log history of shared documents
	{
		document.getElementById("HDiv").style.display = "block";
		axios.get("/api/sharedHistory")
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<thead><tr><th scope='col'>Date</th><th scope='col'>Time</th><th scope='col'>Document ID</th>";
			table += "<th scope='col'>Action</th><th scope='col'>Shared/Unshared with</th></tr></thead><tbody>";;
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" +
				x[i].getElementsByTagName("date")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("doc_ID")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>";
				if(x[i].getElementsByTagName("action")[0].childNodes[0].nodeValue === "s")
				{
					table += "Share With";
				}
				else
				{
					table += "Un-Shared With";
				}
				table += "</td><td scope='row'>" +
				x[i].getElementsByTagName("doc_ID")[0].childNodes[0].nodeValue +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='HDiv' class='btn btn-warning' " +
			"onclick='unloadIT(this.id)' >Remove Table</button></td></tr></tbody></table>";
			document.getElementById("history").innerHTML = table;
		})
		.catch(function(error){ alert(error); });
	}
	
	const getAllDocuments = () => // get all document of user.
	{
		document.getElementById("ADiv").style.display = "block";
		if(sessionStorage.getItem("A"))
		{
			return;
		}
		var Uid = parseInt(sessionStorage.getItem("userID"));
		axios.post("/api/getAllDocument",
		{
			id: Uid,
		})
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<table><thead><tr><th scope='col'>S.N</th><th scope='col'>Full Name</th><th scope='col'>Location</th>" + 
			"<th scope='col'>Open</th><th scope='col'>Details</th></tr></thead><tbody>";
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" + (i+1) + "</td><td scope='row'>" +
				x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("location")[0].childNodes[0].nodeValue +
				"</td><td scope='row'><button id=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				" onclick='openFile(this.id, this.value)' " + "value=" + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue
				+ " class='btn btn-warning'>Open</button>" +
				"</td><td scope='row'><button id=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				" data-toggle='modal' data-target='#doc' onclick='details(this.id, 1)' class='btn btn-primary'>Get Details</button>" +
				"</td></tr>";
			}
			table += "<tr><td colspan='5'><button type='button' id='ADiv' class='btn btn-warning' " +
			"onclick='unloadIT(this.id)' >Hide This Table</button></td></tr></tbody></table>";
			document.getElementById("allDoc").innerHTML = table;
			sessionStorage.setItem("A", true);
		})
		.catch(function(error) { alert(error); });
	}
	
	function getFriendDocument() // loads the document shared by others
	{
		document.getElementById("FDiv").style.display = "block";
		if(sessionStorage.getItem("B"))
		{
			return;
		}
		axios.get("/api/showSHAREDdocument")
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<table><thead><tr><th scope='col'>S.N</th><th scope='col'>Full Name</th><th scope='col'>Owned By</th>" +
			"<th scope='col'>Open</th><th scope='col'>Information</th></tr></thead><tbody>";
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" + (i+1) + "</td><td scope='row'>" +
				x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("location")[0].childNodes[0].nodeValue + 	
				"</td><td scope='row'><button id=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				" onclick='openFile(this.id, this.value)' " + "value=" + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue
				+ " class='btn btn-warning'>Open</button>" +
				"</td><td scope='row'><button id=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				" data-toggle='modal' data-target='#doc' onclick='details(this.id, 0)' class='btn btn-primary'>Get Details</button>" +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='FDiv'" +
			"class='btn btn-warning' onclick='unloadIT(this.id)' >Unload Document</button></td></tr></tbody></table>";
			document.getElementById("friendsDoc").innerHTML = table;
			sessionStorage.setItem("B", true);
		})
		.catch(function(error) { alert(error); });
	}
	
	function shareDocument() // share document
	{
		axios.post("/api/shareDocument",
		{
			id: document.getElementById("docid").textContent, // id of document
			data: document.getElementsByName("shared_num")[0].value, // if of other user
		})
		.then(function(response)
		{
			document.getElementById("shared").innerHTML = response.data;
		})
		.catch(function(error){alert(error);})
	}
	
	function unshareDocument() // un-share document
	{
		axios.post("/api/unShare",
		{
			id: document.getElementById("docid").textContent, // id of document
			data: document.getElementsByName("unshared_num")[0].value, // id of other user
		})
		.then(function(response)
		{
			document.getElementById("shared").innerHTML = response.data;
		})
		.catch(function(error){alert(error);})
	}
	
	function update() // update file in server
	{
		const formData = new FormData(); 
		formData.append("file", document.getElementById("fileupload").files[0]);
		formData.append("id", document.getElementById("docid").textContent);
		axios.post("/api/update", formData,
		{
			 headers:{'Content-Type': 'multipart/form-data'}
		})
		.then(function(response)
		{
			document.getElementById("fmsg").innerHTML = response.data;
		})
		.catch(function(error){alert(error);})
	}
	
	function user() // information about user
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
	
	function unhide()
	{
		document.getElementById('hide').style.display = "block";
	}
	
	return (
	<>
	<center><h1>Document Management System</h1>
	<h4 id="user"></h4></center>
	<Navbar bg="primary" variant="dark">
		<Container>
			<Navbar.Brand ></Navbar.Brand>
			<Nav className="me-auto">
			<Nav.Link href="/userpage">Home</Nav.Link>
			<Nav.Link href="/editDetails">Edit Details</Nav.Link>
			<Nav.Link onClick={user} data-toggle="modal" data-target="#info">My Information</Nav.Link>
			<Dropdown>
				<Dropdown.Toggle id="dropdown-basic">Documents</Dropdown.Toggle>
				<Dropdown.Menu>
				<Dropdown.Item href="/addDocument">Add Document</Dropdown.Item>
				<Dropdown.Item onClick={getAllDocuments}>All My Document</Dropdown.Item>
				<Dropdown.Item href="/Doc_Category">Document By Category</Dropdown.Item>
				<Dropdown.Item onClick={mySharedDocument}>My Shared Document</Dropdown.Item>
				<Dropdown.Item onClick={getFriendDocument}>Get Friends Document</Dropdown.Item>
				<Dropdown.Item onClick={sharedHistory}>Shared History</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			<Button onClick={searchBar}>Search</Button>
			<Button onClick={logout}>Logout</Button>
			</Nav>
		</Container>
	</Navbar>
	<div className="newObjects" style={{ marginTop: '1%' }}>
		<center><a className="btn btn-primary" href="/friends"> Information About Other Users.</a><p />
		<button className="btn btn-success" onClick={categories}>Document Categories</button></center>
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
	
	<p/>
	<div style={{ display: "none",marginRight: '3%' }} id="searchBar">
		<div className="input-group ps-5">
			<a>Enter Document Name To Search:&nbsp;&nbsp;&nbsp;</a>
			<input type="text" className="form-control" id="name" onChange={handleChange}/>&nbsp;&nbsp;&nbsp;
			<Button className="btn btn-primary" onClick={search} ><i className="fas fa-search">Search</i></Button>
			&nbsp;&nbsp;<select id="select"></select>
			<p />
			<table className="table table-hover" id="searchResult"></table>
		</div>
	</div>
	
	<div className="newObjects" style={{ display: "none", marginLeft: '1%' }} id="ADiv">
		<center><b>All of your document</b></center>
		<table className="table table-hover" id="allDoc"></table>
		<p />
	</div>
	
	<div style={{ display: "none", marginLeft: '1%' }} id="MDiv">
		<center><b>All of your document that you have shared</b></center>
		<table className="table table-hover" id="mySharedDocument"></table>
	</div>
	
	<div style={{ display: "none", marginLeft: '1%' }} id="FDiv">
		<center><b>All of the document that you can access</b></center>
		<table className="table table-hover" id="friendsDoc"></table>
		<Button className="btn btn-secondary" onClick={History_of_Other}>View Its History</Button>
	</div>
	
	<div style={{ display: "none", marginLeft: '1%' }} id="FHDiv">
		<center><b>Document sharing history of other user</b></center>
		<table className="table table-hover" id="friendsHistory"></table>
	</div>
	
	<div style={{ display: "none", marginLeft: '1%' }} id="HDiv">
		<center><b>Your document shared history</b></center>
		<table className="table table-hover" id="history"></table>
	</div>
	
	<div style={{ display: "none", marginLeft: '2%' }} id="cDiv">
		<table className="table table-hover" id="category"></table>
		<Button onClick={categoryEdit}>Edit Category</Button>
		<div id="ce" style={{ display: "none", marginLeft: '5%' }}>
		<p id="msgg"></p>Update Values of category:<p />
		ID of category: <input type="number" id="num" /><p />
		Name: <input type="text" id="n" /><p />
		Description: <input type="text" id="DESC" /><p />
		<label >Make this category <b>un-available</b> in drop box while searching and adding document: </label> 
		<input type="checkbox" id="myCheck" /><p />
		<Button onClick={categoryUpdate} className="btn btn-primary">Update</Button><p />
		</div>
	</div>
	
	<div className="modal fade" id="doc" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
		<div className="modal-dialog modal-dialog-centered" role="document">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="exampleModalLongTitle"><b>Information About Document</b></h5>
					<button type="button" className="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="modal-body">
					Its id is <a id="docid"></a><br />
					<a id="more_info"></a>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
					<button type="button" className="btn btn-warning" id="personal" style={{ display: "none" }}
						data-dismiss="modal" onClick={unhide}>Edit</button>
				</div>
			</div>
		</div>
	</div>
	
	<div id="hide" style={{ display: "none" , marginLeft: '5%' }}>
		<Button className="btn btn-light" onClick={hideDetail}>Hide This Tab</Button><br />
		<p>
			If you want to change the name of file, type full file name here(with extension)<br />
			<input type="text" id="titleName" placeholder="NewName.txt"></input>&nbsp;&nbsp;&nbsp;
			<Button className="btn bth-success" onClick={changeFileName}>Change File Name</Button>
		</p>
		<p>Update this document:&nbsp;&nbsp;&nbsp;
			<input id="fileupload" className="btn btn-secondary" type="file" id="fileupload" />
			&nbsp;&nbsp;&nbsp;<Button className="btn btn-warning" onClick={update}>Update</Button>
			&nbsp;&nbsp;&nbsp;<a id="fmsg"></a>
		</p>
		<p>
			Share this document with ID = &nbsp;&nbsp;
			<input type="number" name="shared_num" placeholder="1"></input>&nbsp;&nbsp;&nbsp;
			<Button type="button" onClick={shareDocument} className="btn btn-success">Share</Button><br />
			<a id="shared"></a>
			Un-Share this document with ID = &nbsp;&nbsp;
			<input type="number" name="unshared_num" placeholder="1"></input>&nbsp;&nbsp;&nbsp;
			<Button type="button" onClick={unshareDocument} className="btn btn-secondary">Un-Share</Button><br />
		</p>
		<Button className="btn btn-danger" onClick={Delete}>Delete This Document</Button>
		<div id="confirm_del" style={{ display: "none" }}>
			Are you sure you want to delete this document?This cannot be undone.<br />
			<Button className="btn btn-danger" onClick={DeleteFinal} >Yes. Delete This Document.</Button>
			<Button className="btn btn-success" onClick={DeleteCancel}>No. Don't Delete it.</Button>
		</div>
	</div>
	
	<div style={{ marginLeft: '0%', marginRight: '0%', marginTop:'80%' }}>
		This was to be in bottom
	</div>
	
	</>
	)
	
}
  
export default Userpage;

