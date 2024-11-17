import React, { useEffect } from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import axios from "axios";
import './style.css';

function NavBar()
{
	const handleChange = (event) => {}
	
	useEffect(() => // this function is called on every page reload
    {
		var id = sessionStorage.getItem("userID");
		if(id === null)
		{
			document.getElementById("n").style.display = "none";
			return;
		}
		var name = sessionStorage.getItem("username");
		document.getElementById("name").innerHTML = name;
		document.getElementById("n").style.display = "block";
	}, []);
	
	function getAllDocuments() // get all document of user.
	{
		document.getElementById("ADiv").style.display = "block";
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
		})
		.catch(function(error) { alert(error); });
	}
	
	function getFriendDocument() // loads the document shared by others
	{
		document.getElementById("FDiv").style.display = "block";
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
		})
		.catch(function(error) { alert(error); });
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
				x[i].getElementsByTagName("edited_file")[0].childNodes[0].nodeValue +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='FHDiv' class='btn btn-warning' " +
			"onclick='unloadIT(this.id)' >Hide History</button></td></tr></tbody></table>";
			document.getElementById("friendsHistory").innerHTML = table;
		})
		.catch(function(error){alert(error);})
	}
	
	function mySharedDocument() // shows the list of documents that are shared
	{
		document.getElementById("MDiv").style.display = "block";
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
			
		})
		.catch(function(error){alert(error);});
	}
	
	function search() // displays the search result
	{
		document.getElementById("searchResult").style.display = "block";
		var name = document.getElementById("Sname").value;
		var cat_id = document.getElementById("select").value;
		var year = document.getElementById("yearS").value;
		var month = document.getElementById("monthS").value;
		var folder = document.getElementById("folderS").value
		console.log(name, cat_id, year, folder);
		if(folder=="")
			folder = "root";
		if(year=="")
			year = "2077";
		if(month=="")
			month = "00";
		else if(parseInt(month)<10)
			month = "0" + month;
		//console.log("name = " + name + " cat_id = " + cat_id + " year = " + year + " month = "+ month +" dir =" + folder);
		axios.post("/api/search",
		{
			id: cat_id,
			date: year + "-" + month + "-01",
			description: folder,
			title: name,
		})
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var table="<thead><tr><th scope='col'>S.N</th><th scope='col'>Full Name</th><th scope='col'>Location</th>" + 
			"</tr></thead><tbody>";
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
		.catch(function(error){ alert(error); });
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
				x[i].getElementsByTagName("edited_file")[0].childNodes[0].nodeValue +
				"</td></tr>";
			}
			table += "<tr><td colspan='4'><button type='button' id='HDiv' class='btn btn-warning' " +
			"onclick='unloadIT(this.id)' >Remove Table</button></td></tr></tbody></table>";
			document.getElementById("history").innerHTML = table;
		})
		.catch(function(error){ alert(error); });
	}
	
	return(
	<>
		<div id = "n" style={{ display: "none" }}>
			<h6 id="name" className="title" style={{ marginBottom: "0%" }}></h6>
			<Navbar bg="primary" variant="dark">
			<Container>
				<Nav className="me-auto">
				<Nav.Link href="/userpage">Home</Nav.Link>
				<Nav.Link href="/addDocument">Add Document</Nav.Link>
				<Nav.Link onClick={getAllDocuments}>All My Document</Nav.Link>
				<Nav.Link href="/Doc_Category">Document By Category</Nav.Link>
				<Nav.Link onClick={mySharedDocument}>My Shared Document</Nav.Link>
				<Nav.Link onClick={getFriendDocument}>Get Friends Document</Nav.Link>
				<Nav.Link onClick={searchBar}>Search</Nav.Link>
				<Dropdown>
					<Dropdown.Toggle id="dropdown-basic">History</Dropdown.Toggle>
					<Dropdown.Menu>
					<Dropdown.Item onClick={sharedHistory}>My Shared History</Dropdown.Item>
					<Dropdown.Item onClick={History_of_Other}>Others Shared History</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				</Nav>
			</Container>
			</Navbar>
			<div style={{ display: "none", marginRight: '3%'}} id="searchBar">
				<div className="input-group ps-5">
					<a style={{ marginTop: '0.5%' }}>Enter Document Name To Search:&nbsp;&nbsp;&nbsp;</a>
					<input type="text" className="form-control" id="Sname" onChange={handleChange}/>&nbsp;&nbsp;&nbsp;
					<Button className="btn btn-success" onClick={search} ><i className="fas fa-search">Search</i></Button>
				</div>
				<div style={{  marginLeft: '3%', marginTop:"1%"}}>
					<a style={{ marginTop: '0.5%', background: 'aqua' }}>Apply Filters: &nbsp;&nbsp;&nbsp;</a>
					Category:&nbsp;&nbsp;<select id="select" style={{ marginRight: '2%'}}></select>
					Year:&nbsp;&nbsp;<input type="number" id="yearS" style={{ marginRight: '2%'}}/>
					Month:&nbsp;&nbsp;<input type="number" id="monthS" style={{ marginRight: '2%'}} />
					Folder:&nbsp;&nbsp;<input type="text" id="folderS" />
				</div>
				<table className="table table-hover" id="searchResult"></table>
			</div>
		</div>
	</>
	)
}

export default NavBar;