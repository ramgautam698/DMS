import React, { useEffect, useState } from "react";
import axios from "axios";
import './style.css';

function AddDocument()
{
	useEffect(() => 
    {
		// get Category
		axios.post("/api/getCategory")
		.then(function(response)
		{
			var xmlDoc = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xmlDoc.getElementsByTagName("item");
			var select = "<option selected value='0' name='No category'>No Category</option>";
			for (var i = 0; i <x.length; i++)
			{
				select += "<option value=" +
				x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + ">" +
				x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue + " </option>";
				var name = (x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue);
				sessionStorage.setItem(x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue, name);
			}
			document.getElementById("selectAD").innerHTML = select;
		})
		.catch(function(error){alert(error);});
		
		// get Folder
		axios.get("/api/folderList")
		.then(function(response)
		{
			var xmlDoc = (new DOMParser()).parseFromString(response.data, "text/xml");
			var x = xmlDoc.getElementsByTagName("item");
			var select = "<option selected value='root'>Default Folder</option>";
			for (var i = 0; i <x.length; i++)
			{
				select += "<option value='" +
				x[i].getElementsByTagName("data")[0].childNodes[0].nodeValue + "'>" +
				x[i].getElementsByTagName("data")[0].childNodes[0].nodeValue + " </option>";
			}
			document.getElementById("selectF").innerHTML = select;
		})
		.catch(function(error){alert(error);});
	}, []);
	
	const changeO = (event) =>
	{
		document.getElementById("ADm").innerHTML = sessionStorage.getItem(document.getElementById("selectAD").value);
	}
	
	const [inputs, setInputs] = useState({
		NF:"",
		DES:"",
		year:"",
		month:"",
		day:"",
	});
	
	const handleChange = (event) =>
	{
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}
	
	function upload() // uploads file in server.
	{
		const formData = new FormData(); 
		formData.append("file", document.getElementById("fileupload").files[0]);
		formData.append("category", document.getElementById("selectAD").value);
		formData.append("folder", document.getElementById("selectF").value);
		formData.append("NF", inputs.NF);
		formData.append("DES", inputs.DES);
		var date = inputs.year + "-" + inputs.month + "-";
		var day = inputs.day;
		if(day!=="")
			date = date + inputs.day;
		else
			date = date + "01";
		formData.append("date", date);
		
		axios.post("/api/uploadFile", formData, { headers:{'Content-Type': 'multipart/form-data'} })
		.then(function (response) { document.getElementById("msg").innerHTML = response.data; })
		.catch(function (error) {alert(error); })
	}
	
	return(
	<>
	<div style={{ marginLeft: '2%' }}>
		<b>Note: If the document with exact same name exist in same location, it will not be uploaded.</b>
		<br /> <a>Select File: </a>
		<input className="btn btn-success" id="fileupload" type="file" style={{ marginLeft: '3%'}}></input>
		<h5 style={{ color: "red" }} id="msg"></h5>
		
		Enter Year of Document:<input type="number" name="year" id="year" style={{ marginLeft: '1%'}} value={inputs.year} onChange={handleChange} /><p />
		Enter Month of Document: <input type="number" name="month" id="month" style={{ marginLeft: '1%' }} value={inputs.month} onChange={handleChange}  /><p />
		Enter Day of Document(Optional): <input type="number" name="day" id="day" style={{ marginLeft: '1%' }} value={inputs.day} onChange={handleChange} /><p />
		
		Folder of Document: <select id="selectF" style={{ marginLeft: '3%', marginRight:'3%'}} ></select>
		Create new folder within this folder and save this file.
		<input type="text" id="NF" name="NF" style={{ marginLeft: '1%' }} value={inputs.NF} onChange={handleChange} /><p />
		
		Choose the category for document:<select id="selectAD" onChange={changeO} style={{ marginLeft: '3%'}}></select>
		<a id="ADm" style={{ marginLeft: '4%'}}></a> <p />
		
		Description for document(if any)[Maximum 200 characters]:<br />
		<textarea id="desc" name="desc" style={{ marginRight: '2%', width:"100%"}} placeholder="Document Description" value={inputs.DES} onChange={handleChange}/>
		
		<p/><button onClick={upload} className="btn btn-warning" style={{ marginLeft: '20%'}}>Upload File</button>
		
	</div>
	</>
	)
}

export default AddDocument;
