import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';

function UserPage()
{
	let navigate = useNavigate();
	var state = 1;
	
	useEffect(() =>
    {
		var id = sessionStorage.getItem("userID");
		//sessionStorage.setItem("location", '["/"]');
		if(id === null)
		{
			navigate("/");
		}
		sessionStorage.setItem("pre", 1);
		sessionStorage.setItem("location", '["/"]');
	},[]);
	
	function addEMAIL() // add entry filed for sharing email address
	{
		$('#SHAREEMAILS').append('User: <input type="email" ><p>')
	}
	
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
	
	function del_category() // deletes the category
	{
		var id = document.getElementById("num").value;
		var ID = parseInt(id);
		if(typeof id != 'number' || ID < 0)
		{
			alert("Enter valid id.");	
			return;
		}
		var userID = sessionStorage.getItem("userID");
		axios.post("/api/categoryDelete", { id:ID, data:userID })
		.then(function(response){alert(response.data)})
		.catch(function(error){alert(error);})
	}
	
	function del_Dir() // deletes the directory(folder)
	{
		var arr = JSON.parse(sessionStorage.getItem("location"));
		var dir = "/";
		var uid = parseInt(sessionStorage.getItem("userID"));
		for(var i=1;i<arr.length;i++)
		{
			dir = dir + arr[i] + "/";
		}
		var val = document.getElementById("Del_dir").value;
		if(val == "")
		{
			alert("Empty value");
			return;
		}
		dir = dir + val;
		axios.post("/api/folderRemove",
		{
			id: uid,
			data: dir,
		})
		.then(function(response){alert(response.data)})
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
	
	const folderlogo = require('./folder.png'); // folder logo
	const filelogo = require('./file.png'); // folder logo
	
	function getDIR() // get all files and folder of user
	{
		var arr = JSON.parse(sessionStorage.getItem("location"));
		var dir = "/";
		for(var i=1;i<arr.length;i++)
		{
			dir = dir + arr[i] + "/";
		}
		axios.post("/api/folderAfiles",
		{
			data: dir,//sessionStorage.getItem("location"),
		})
		.then(function(response)
		{
			var xml = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xml.getElementsByTagName("item");
			var content = "";
			for (var i = 0; i <x.length; i++)
			{
				if(parseInt(x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue)==0)
				{
					content += "<div style='margin-left:2%;display:inline-block;'><Button class='btn btn-light'" +
					"id="+x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + 
					" value=" + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
					" onclick=openFolder(this.id,this.value)>" +
					" <img src=" + folderlogo + " alt='Folder' ></Button><br><a>" +
					x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue + "</a></div>";
				}
				else
				{
					content += "<div style='margin-left:2%;display:inline-block;'><button class='btn btn-light' " +
					"id="+x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + 
					" value=" + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
					"  data-toggle='modal' data-target='#doc' onclick=openFolder(this.id,this.value)>" +
					" <img src=" + filelogo + " alt='File'></button><br><a>" +
					x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue + "</a></div>";
				}
			}
			document.getElementById("fileList").innerHTML = content;
			document.getElementById("Lmsg").innerHTML = dir;
		})
	}
	
	function hideDetail() // hides the details of document shown
	{
		document.getElementById("hide").style.display = "none";
	}
	
	function locationC() // list of folder to change location
	{
		axios.get("/api/folderList")
		.then(function(response)
		{
			var xmlDoc = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xmlDoc.getElementsByTagName("item");
			$('#RL').empty();
			$('#RL').append('<input type="radio" name="folder" value="/"><label for="/">Root</label><br>')
			for (var i = 0; i <x.length; i++)
			{
				var value = x[i].getElementsByTagName("data")[0].childNodes[0].nodeValue
				$('#RL')
					.append('<input type="radio" name="folder" value="' + value + '">')
					.append('<label for="' + value + '">' + value + '</label><br>');
			}
		})
		.catch(function(error){alert(error);});
	}
	
	function locationCHANGE() // changes the location of file
	{
		var docId = document.getElementById("docidM").innerHTML;
		var val = document.querySelector('input[name="folder"]:checked').value;
		axios.post("/api/changePath",
		{
			id: parseInt(docId),
			data: val
		}).then(function(response) { alert(response.data) })
		.catch(function(response) { alert(response) })
	}
	
	function makePublic() // make the selected document public(accessible to all users)
	{
		var docid = document.getElementById("docidM").innerHTML;
		axios.post("/api/makeDocPublic", {id : parseInt(docid)})
		.then(function(response) { alert(response.data) })
		.catch(function(response) { alert(response.data) })
	}
	
	function openFile() // opens the file
	{
		var id = document.getElementById('docidM').innerHTML;
		var name = document.getElementById('FName').innerHTML;
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:8080/api/openFILE/"+ id,
			xhrFields:
			{
				responseType: 'blob' // to avoid binary data being mangled on charset conversion
			},
			success: function (blob, status, xhr)
			{
				var filename = name;
				var URL = window.URL || window.webkitURL;
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				if (typeof a.download === 'undefined')
				{
					window.location.href = downloadUrl;
				}
				else
				{
					a.href = downloadUrl;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
				}
				setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
			}
		});
	}
	
	function removeAccDoc() // make the selected document un-accessible to all general users
	{
		var docid = document.getElementById("docidM").innerHTML;
		axios.post("/api/makeDocUNPublic", {id : parseInt(docid)})
		.then(function(response) { alert(response.data) })
		.catch(function(response) { alert(response.data) })
	}
	
	function renameDir() // rename the folder
	{
		var arr = JSON.parse(sessionStorage.getItem("location"));
		var dir = "/";
		for(var i=1;i<arr.length;i++)
		{
			dir = dir + arr[i] + "/";
		}
		var uid = parseInt(sessionStorage.getItem("userID"));
		var present_name = document.getElementById("C_dir").value;
		var new_name = document.getElementById("N_dir").value;
		if(present_name == "" || new_name == "")
		{
			alert("The data entered is incomplete");
			return;
		}
		axios.post("/api/folderREname",
		{
			id: uid,
			title: present_name,
			location: dir,
			description: new_name,
		})
		.then(function(response){alert(response.data);})
		.catch(function(error){alert(error);})
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
	
	function shareGroup() // shares the document to group of users
	{
		var array = [];
		var docid = document.getElementById("docidM").innerHTML;
		array.push(docid);
		$('#SHAREEMAILS').find("input[type=email]").each(function(index, field)
		{
			array.push(field.value);
		})
		axios.post("/api/shareToGroup", array)
		.then(function(response) { alert(response.data) })
		.catch(function(response) { alert(response) })
	}
	
	function unhide() // hide the popup and display tab to edit file
	{
		document.getElementById('hide').style.display = "block";
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
	
	function updateDescription() // updates description of document
	{
		var id = document.getElementById("docid").textContent; // id of document
		var desc = document.getElementById("desC").value;
		axios.post("/api/changeDescription",
		{
			id: id,
			data: desc,
		})
		.then(function(response){alert(response.data)})
		.catch(function(error){alert(error);})
	}
	
	function updateDate() // updates date of document
	{
		var id = document.getElementById("docid").textContent; // id of document
		var year = document.getElementById("yeaR").value;
		if(year=="")
		{
			alert("Enter valid value of month.");
			return;
		}
		var month = document.getElementById("montH").value;
		if(month=="")
		{
			alert("Enter valid value of month.");
			return;
		}
		else if(parseInt(month)<10)
			month = "0" + month;
		var day = document.getElementById("daY").value;
		if(day=="")
			day = "01";
		else if(parseInt(day)<10)
			day = "0" + day;
		var date = year + "-" + month + "-" + day;
		axios.post("/api/changeDate",
		{
			id: id,
			data: date,
		})
		.then(function(response){alert(response.data)})
		.catch(function(error){alert(error);})
	}
	
	function updateWindow() // update the content of window view
	{
		var pre = parseInt(sessionStorage.getItem("pre"));
		//console.log("pre "+pre+" l = " + parseInt(JSON.parse(sessionStorage.getItem("location")).length));
		state = parseInt(JSON.parse(sessionStorage.getItem("location")).length);
		if(pre === state) //console.log("no change");
		{
			return;
		}
		else
		{
			sessionStorage.setItem("pre", state);
			getDIR();
		}
	}
	
	function windowBack() // back to previous window view
	{
			if(state==1)
				return;
			var arr = JSON.parse(sessionStorage.getItem("location"));
			arr.pop();
			sessionStorage.setItem("location", JSON.stringify(arr));
			state = parseInt(JSON.parse(sessionStorage.getItem("location")).length);
			sessionStorage.setItem("pre", state);
			getDIR();
	}
	
	function windowHide() // hide the window view area
	{
		document.getElementById("W").style.display = "none";
		document.getElementById("b1").style.display = "block";
	}
	
	function windowShow() // show window view area
	{
		document.getElementById("W").style.display = "block";
		document.getElementById("b1").style.display = "none";
		getDIR();
	}
	
	return (
	<div style={{marginBottom:"300px"}}>
		<div className="newObjects" style={{ marginTop: '1%' }} id="mainDiv">
			<center><a className="btn btn-secondary" href="/friends"> Information About Other Users.</a><p />
			<button className="btn btn-success" onClick={categories} >Document Categories</button><p />
			<Button onClick={windowShow} className="btn btn-primary" id="b1">Get All Files and Folder</Button>
			</center>
		</div>
		
		<div id="W" style={{display:"none", marginLeft:"1%", marginTop:"1%", marginRight:"1%" , marginBottom: "1%" }}>
			Location:: <a id="Lmsg"></a><p />
			<div id="fileList" onClick={updateWindow} style={{ marginBottom:"2%"  }}></div>
			<Button onClick={windowBack} className="btn btn-warning" style={{ marginRight:"6%" }}>Back to previous page</Button>
			<Button onClick={windowHide} className="btn btn-danger">Close This View</Button>
			<p />
			Rename the folder present in shown window:<p/>
			Current Name: <input type="text" id="C_dir" /><p />
			New Name: <input type="text" id="N_dir" /><p />
			<Button onClick={renameDir} className="btn btn-warning">Change Folder Name</Button><p />
			Delete the folder with name: <input type="text" id="Del_dir" /><p />
			<Button onClick={del_Dir} className="btn btn-danger">Delete The Folder</Button><br />
			<b>Note: Only empty folder is deleted.</b>
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
			<Button data-toggle="modal" data-target="#categoryDel" className="btn btn-danger">Delete this category </Button>
			</div>
		</div>
		
		<div style={{ display: "none", marginLeft: '1%', marginTop:'1%' }} id="ADiv">
			<center><b>All of your document</b></center>
			<table className="table table-hover" id="allDoc"></table>
			<p />
		</div>
		
		<div style={{ display: "none", marginLeft: '1%' }} id="FDiv">
			<center><b>All of the document that you can access</b></center>
			<table className="table table-hover" id="friendsDoc"></table>
		</div>
		
		<div style={{ display: "none", marginLeft: '1%', marginTop:"1%" }} id="MDiv">
			<center><b>All of the document that you have shared</b></center>
			<table className="table table-hover" id="mySharedDocument"></table>
		</div>
		
		<div style={{ display: "none", marginLeft: '1%' }} id="HDiv">
			<center><b>Your document shared history</b></center>
			<table className="table table-hover" id="history"></table>
		</div>
		
		<div style={{ display: "none", marginLeft: '1%' }} id="FHDiv">
			<center><b>Document sharing history of other user</b></center>
			<table className="table table-hover" id="friendsHistory"></table>
		</div>
		
		<div id="hide" style={{ display: "none" , marginLeft: '5%' }}>
			<Button className="btn btn-light" onClick={hideDetail}>Hide This Tab</Button><br />
			Its id is <a id="docidM"></a><br />
			<a id="more_infoM"></a>
			<Button onClick={openFile} style={{ marginLeft:'5%' }} className="btn btn-success">Open This File</Button>
			<p style={{ marginTop:'1%' }}>
				Change location(path) of file: <Button onClick={locationC} data-toggle="modal" data-target="#Clocation">Change</Button>
			</p>
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
				New File Description:&nbsp;&nbsp;<input type="text" id="desC" placeholder="New File Description" />
				&nbsp;&nbsp;&nbsp;<Button className="btn bth-success" onClick={updateDescription}>Update Description</Button>
			</p>
			<p>
				Update Date:<br />
				Year:&nbsp;&nbsp;<input type="number" id="yeaR" />&nbsp;&nbsp;
				Month:&nbsp;&nbsp;<input type="number" id="montH" />&nbsp;&nbsp;
				Day(Optional):&nbsp;&nbsp;<input type="number" id="daY" /><br />
				<Button className="btn bth-primary" onClick={updateDate}>Update Date</Button>
			</p>
			<p>
				<Button className="btn btn-warning" onClick={makePublic}>Make this document accessible to all the users.</Button>
			</p>
			<p>
				<Button className="btn btn-dark" onClick={removeAccDoc}>Remove accessibility of this document from general users.</Button>
			</p>
			<Button data-toggle='modal' data-target='#shareG'>Share This Document To Group of users.</Button>
			<p>
				Share this document with ID = &nbsp;&nbsp;
				<input type="number" name="shared_num" placeholder="1"></input>&nbsp;&nbsp;&nbsp;
				<Button type="button" onClick={shareDocument} className="btn btn-success">Share</Button><br />
				<a id="shared"></a><br />
				Un-Share this document with ID = &nbsp;&nbsp;
				<input type="number" name="unshared_num" placeholder="1"></input>&nbsp;&nbsp;&nbsp;
				<Button type="button" onClick={unshareDocument} className="btn btn-secondary">Un-Share</Button>
			</p>
			<Button className="btn btn-danger" onClick={Delete}>Delete This Document</Button>
			<div id="confirm_del" style={{ display: "none" }}>
				Are you sure you want to delete this document?This cannot be undone.<br />
				<Button className="btn btn-danger" onClick={DeleteFinal} >Yes. Delete This Document.</Button>
				<Button className="btn btn-success" onClick={DeleteCancel}>No. Don't Delete it.</Button>
			</div>
		</div>
		
		<div className="modal fade" id="categoryDel" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLongTitle"><b>Delete The Category</b></h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body" >
						Are you sure you want to delete the mentioned category??
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" className="btn btn-danger" data-dismiss="modal"
						onClick={del_category} >Delete</button>
					</div>
				</div>
			</div>
		</div>
		
		<div className="modal fade" id="shareG" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLongTitle"><b>Share to group</b></h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body" >
						Enter email address of users to share <p />
						<div id="SHAREEMAILS">
							User: <input type="email" /><p />
						</div>
						<Button onClick={addEMAIL}>More User</Button>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
						<button type="button" className="btn btn-primary" data-dismiss="modal"
						onClick={shareGroup} >Share</button>
					</div>
				</div>
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
						<button type="button" className="btn btn-warning" data-dismiss="modal" 
						onClick={unhide} id="personal" style={{ display: "none" }}>Edit</button>
					</div>
				</div>
			</div>
		</div>
		
		<div className="modal fade" id="Clocation" tabIndex="-1" role="dialog" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title"><b>Change Location</b></h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						Select one of the following
						<form id="RL"></form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" className="btn btn-warning" data-dismiss="modal" 
						onClick={locationCHANGE}>Change</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	)
}
  
export default UserPage;

