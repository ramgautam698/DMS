import React, { useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";


function DocumentCategory()
{	
	let navigate = useNavigate();
	
	useEffect(() => // this function is called on every page reload
    {
		var id = sessionStorage.getItem("userID");
		if(id === 'null')
		{
			navigate("/");
		}
		axios.post("/api/documentByCategory")
		.then(function(response)
		{
			var table="<thead><tr><th scope='col'>Document ID</th><th scope='col'>Document Name</th>" +
			"<th scope='col'>Category ID</th><th scope='col'>Category Name</th></tr></thead><tbody>";
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("doc");
			for (var i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" + 
				x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
				"<td scope='row'>";
				try
				{
					var y = x[i].getElementsByTagName("a");
					for(var j = 0; j < y.length; j++)
					{
						table += y[j].getElementsByTagName("cid")[0].childNodes[0].nodeValue + "<br>";
					}
					table += "</td><td scope='row'>";
					for(var k = 0; k < y.length; k++)
					{
						table += y[k].getElementsByTagName("cname")[0].childNodes[0].nodeValue + "<br>";
					}
					table += "</td>";
				}
				catch(err){}
				table += "</td></tr>";
			}
			table += "</tbody></table>";
			document.getElementById("allDoc").innerHTML = table;
		})
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
	
	function addC() // add category to document
	{
		var docid = document.getElementById("docID").value;
		var category = document.getElementById("add").value;
		axios.post("/api/categoryAdd",{ id: docid, data: category,})
		.then(function(response){document.getElementById("msg").innerHTML = response.data;})
		.catch(function(error){alert(error);})
	}
	
	function removeC() // remove category from document
	{
		var docid = document.getElementById("docID").value;
		var category = document.getElementById("rcID").value;
		axios.post("/api/categoryRemove",{ id: docid, data: category,})
		.then(function(response){document.getElementById("msg").innerHTML = response.data;})
		.catch(function(error){alert(error);})
	}
	
	return (
	<>
		<div style={{ marginLeft: '5%'}}>
			<b>Change Category of document.</b><p />
			Enter ID of Document: <input type="number" id="docID"/><p/>
			Add this document to category with ID = &nbsp;&nbsp;<input type="number" id="add" />&nbsp;&nbsp;
			<Button className="btn btn-warning" onClick={addC}>Add Category</Button><p/>
			Remove this document from category with ID = &nbsp;&nbsp;<input type="number" id="rcID" />&nbsp;&nbsp;
			<Button className="btn btn-warning" onClick={removeC}>Remove Category</Button><br/>
			<a id="msg"></a><p />
			<Button className="btn btn-primary" onClick={categories}>View Availabe Category</Button><br/>
		</div>
		<div id="cDiv" style={{ marginLeft: '1%' }}>
			<table className="table table-hover" id="category"></table>
		</div>
		<div style={{ marginLeft: '2%', marginBottom: '15%' }}>
			<table className="table table-hover" id="allDoc"></table>
		</div>
	</>
	)
}
  
export default DocumentCategory;
