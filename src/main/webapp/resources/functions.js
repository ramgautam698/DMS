// file to hold the functions for userpage

function addCategory() // adds category to document
{
	var category_id = document.getElementById("addC").value;
	//sessionStorage.setItem("docID", id);
	var id = sessionStorage.getItem("docID");
	$.ajax(
	{
					type:"POST",
					url: "/addCategory",
					data: JSON.stringify({ id: parseInt(id), data: category_id }),
					contentType: "application/json; charset=utf-8",
		            dataType: "json",
		            success: function (response)
		            {
		            	alert("Request Sent to server.");
		            },
		            failure: function (response)
		            {
		            	alert(response.responseText);
		            },
		            error: function (response)
		            {
		            	alert(response.responseText);
		            }
	});
}

function categoryUpdate()
{
	var elem = document.getElementById('hidden');
	elem.style.display = 'block';
}

function categoryView()
{
		var elem = document.getElementById('categorytable');
		elem.style.display = 'block';
		var e = document.getElementById('Cupdate');
		e.style.display = 'block';
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var i;
				var xmlDoc = this.responseXML;
				var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Name</th><th scope='col'>Description</th>" + 
				"<th scope='col'>Active</th><th scope='col'>Created By</th><th scope='col'>Date:Time</th></tr></thead><tbody>";
				var x = xmlDoc.getElementsByTagName("item");
				for (i = 0; i <x.length; i++)
				{
					table += "<tr><td scope='row'>" +
				    x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("active")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("created_by")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("date")[0].childNodes[0].nodeValue + " : " +
				    x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
				    "</td></tr>";
				}
				document.getElementById("categorytable").innerHTML = table;
			}
		};
		xhttp.open("POST", "/categoryView", true);
		xhttp.send();
}

function categoryUpdate()
{
	var id = document.getElementById('num').value;
	var name = document.getElementById('name').value;
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
	$.ajax(
	{
		type:"POST",
		url:"categoryEdit",
		data: JSON.stringify({id: parseInt(id), name: name, active: active, description: desc}),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(response)
		{
			document.getElementById("msgg").innerHTML = response.responseText;
		},
		failure: function (response)
		{
		            	document.getElementById("msgg").innerHTML = response.responseText;
		},
		error: function (response)
		{
		            	document.getElementById("msgg").innerHTML = response.responseText;
		}
	});
}

function RemoveCategory() // remove category from document
{
	var category_id = document.getElementById("removeC").value;
	var id = sessionStorage.getItem("docID");
	$.ajax(
	{
					type:"POST",
					url: "/removeCategory",
					data: JSON.stringify({ id: parseInt(id), data: category_id }),
					contentType: "application/json; charset=utf-8",
		            dataType: "json",
		            success: function (response)
		            {
		            	alert("Request Sent to server.");
		            },
		            failure: function (response)
		            {
		            	alert(response.responseText);
		            },
		            error: function (response)
		            {
		            	alert(response.responseText);
		            }
	});
}

function changeDname() // change the file name of document
{
		var id = document.getElementById("docid").textContent;
		var c = document.getElementsByName("titleName")[0].value;
		$.ajax(
				{
					type:"POST",
					url: "/changeTitle",
					data: JSON.stringify({ id: id, data: c }),
					contentType: "application/json; charset=utf-8",
		            dataType: "json",
		            success: function (response)
		            {
		            	alert("File successfully renamed");
		            },
		            failure: function (response)
		            {
		            	alert(response.responseText);
		            },
		            error: function (response)
		            {
		            	alert(response.responseText);
		            }
				});
				
		sessionStorage.clear();
		document.getElementById('txtEditor').style.display = "none";
		document.getElementById('confirm_del').style.display = "none";
		unload();
		loadDoc();
}
	
function closeIT() // closes the opened document
{
		sessionStorage.removeItem("id");
		document.getElementById('txtEditor').style.display = "none";
}
	
function deletealert() // warning message to delete file
{
		document.getElementById('confirm_del').style.display = "block";
}
	
function deleteCancel() // remove the delete confirmation div
{
		document.getElementById('confirm_del').style.display = "none";
}

function HIDE_IT() // hides the table that shows the logs of shared and unshared history
{
	document.getElementById("history").style.display = "none";
}
	
function deleteIT() // deletes the opened document
{
		var data = document.getElementById("docid").textContent;
		var to_del = new XMLHttpRequest();
		to_del.open("POST","/delete", true);
		to_del.send(data);
		sessionStorage.clear();
		document.getElementById('txtEditor').style.display = "none";
		document.getElementById('confirm_del').style.display = "none";
		unload();
		loadDoc();
}

function getCategory() // shows list of available categories
{
	document.getElementById("select").style.display = "block";
	var xhttp = new XMLHttpRequest();
	var select = "<option selected value='0'>Un-Categorized</option>";
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
				var xmlDoc = this.responseXML;
				var x = xmlDoc.getElementsByTagName("item");
				for (i = 0; i <x.length; i++)
				{
					select += "<option value=" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + 
					" name = '" + x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue + "'>" +
					x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue + " " +
					+ "</option>";
				}
				document.getElementById("select").innerHTML = select;
				sessionStorage.setItem("select", select);
		}
	};
	xhttp.open("POST", "/getCategory", true);
	xhttp.send();
}

function getDescription() // show the description of category selected.
{
	var x = document.getElementById("select").value;
	document.getElementById("desc").innerHTML = x;
}
	
function loadDoc() // display the list of all document
{
		var elem = document.getElementById('demo');
		if (elem.style.display == 'none')
		{
			document.getElementById("demo").classList.add('table'); 
			document.getElementById("demo").classList.add('table-hover');
			elem.style.display = 'block';
		}
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var i;
				var xmlDoc = this.responseXML;
				var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Full Name</th><th scope='col'>Location</th>" + 
				"<th scope='col'>Details</th><th scope='col'>Open</th></tr></thead><tbody>";
				var x = xmlDoc.getElementsByTagName("item");
				//console.log("Length of list = " + x.length);
				for (i = 0; i <x.length; i++)
				{
					table += "<tr><td scope='row'>" +
				    x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("location")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'><button type='button' class='btn btn-info' id = " + 
				    x[i].getElementsByTagName('id')[0].childNodes[0].nodeValue + " onclick='ok(this.id)' >OK </button>" +
				    "</td><td scope='row'><button type='button' class='btn btn-success' id = " + 
				    x[i].getElementsByTagName('id')[0].childNodes[0].nodeValue + " onclick='openFILE(this.id)' >Open </button>" + 	
				    "</td></tr>";
				}
				table += "<tr><td colspan='5'><button type='button' class='btn btn-dark' onclick='unload()' >Unload Document</button></td></tr></tbody></table>";
				document.getElementById("demo").innerHTML = table;
			}
		};
		xhttp.open("POST", "/showdocument", true);
		xhttp.send();
}



function loadFriendsDoc() // loads the document shared by others
{
		var elem = document.getElementById('others');
		if (elem.style.display == 'none')
		{
			document.getElementById("others").classList.add('table'); 
			document.getElementById("others").classList.add('table-hover');
			elem.style.display = 'block';
		}
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var i;
				var xmlDoc = this.responseXML;
				//console.log(this.responseText);
				var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Full Name</th>" + 
				"<th scope='col'>Owned By ID</th><th scope='col'>Details</th><th scope='col'>View</th></tr></thead><tbody>";
				var x = xmlDoc.getElementsByTagName("item");
				//console.log("Length of list = " + x.length);
				for (i = 0; i <x.length; i++)
				{
					table += "<tr><td scope='row'>" +
				    x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("location")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'><button type='button' class='btn btn-success' id = " + 
				    x[i].getElementsByTagName('id')[0].childNodes[0].nodeValue + " onclick='view(this.id)' >Details</button>" +
				    "</td><td scope='row'><button type='button' class='btn btn-success' id = " + 
				    x[i].getElementsByTagName('id')[0].childNodes[0].nodeValue + " onclick='openFILE(this.id)' >Open </button>" +
				    "</td></tr>";
				}
				table += "<tr><td colspan='4'><button type='button' class='btn btn-warning' onclick='unloadIT()' >Unload Document</button>" +
				"<button type='button' onclick='viewItsHis()' class='btn btn-primary' >View its history</button></td></tr></tbody></table>";
				document.getElementById("others").innerHTML = table;
			}
		};
		xhttp.open("POST", "/showSHAREDdocument", true);
		xhttp.send();
}

function loadSharedDoc() //display the document shared with others
{
		var e =  document.getElementById('sharePoint');
		e.style.display = 'block';
		var elem = document.getElementById('shared');
		if (elem.style.display == 'none')
		{
			document.getElementById("shared").classList.add('table'); 
			document.getElementById("shared").classList.add('table-hover');
			elem.style.display = 'block';
		}
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var i;
				var xmlDoc = this.responseXML;
				var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Shared With</th><th scope='col'>Detail</th>" +
				"<th scope='col'>Download</th></tr></thead><tbody>";
				var x = xmlDoc.getElementsByTagName("item");
				//console.log("Length of list = " + x.length);
				for (i = 0; i <x.length; i++)
				{
					table += "<tr><td scope='row'>" +
				    x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("data")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'><button type='button' class='btn btn-success' id = " + 
				    x[i].getElementsByTagName('id')[0].childNodes[0].nodeValue + " onclick='ok(this.id)' >View Detail </button>" +
				    "</td><td scope='row'><button type='button' class='btn btn-primary' id = " + 
				    x[i].getElementsByTagName('id')[0].childNodes[0].nodeValue + " onclick='openFILE(this.id)' >Open File</button>" +	
				    "</td></tr>";
				}
				table += "<tr><td colspan='4'><button type='button' onclick='removeIT()' >Unload Document</button></td></tr></tbody></table>";
				document.getElementById("shared").innerHTML = table;
			}
		};
		xhttp.open("POST", "/mySHAREDdocument", true);
		xhttp.send();
}
	
function ok(id) // displays the details
{
		document.getElementById('hide').style.display = "block";
		if (document.getElementById('txtEditor').style.display !== "none")
		{
			document.getElementById('txtEditor').style.display = "none";
		}
		else
		{
			document.getElementById('txtEditor').style.display = "block";
		}
		
		if(typeof(Storage) !== "undefined")
		{
			sessionStorage.setItem("id", id);
			var file = new XMLHttpRequest();
			file.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					var Doc = this.responseXML;
					document.getElementById("docid").innerHTML = Doc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
					document.getElementById("more_info").innerHTML = Doc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
					document.getElementById('txtEditor').style.display = "block";
				}
			};
			file.open("POST","/getDetails", true);
			file.send(id);
		}
		else
		{
			if(sessionStorage.getItem("id")==id)
			{
				document.getElementById('txtEditor').style.display = "block";
			}
			else
			{
				sessionStorage.setItem("id", id);
			
				var file = new XMLHttpRequest();
				file.onreadystatechange = function()
				{
					if (this.readyState == 4 && this.status == 200)
					{
						var Doc = this.responseXML;
						document.getElementById("docid").innerHTML = Doc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
						document.getElementById("more_info").innerHTML = Doc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
						document.getElementById('txtEditor').style.display = "block";
					}
				};
				file.open("POST","/getDetails", true);
				file.send(id);
			}
		}
}

function openFILE(id) // opens the selected file
{
	$.ajax({
    type: "POST",
    url: "http://127.0.0.1:8080/download/"+ id,
    xhrFields: {
        responseType: 'blob' // to avoid binary data being mangled on charset conversion
    },
    success: function(blob, status, xhr)
    {
        // check for a filename
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        console.log(xhr.getAllResponseHeaders());
        
        if (disposition && disposition.indexOf('attachment') !== -1)
        {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1])
            	filename = matches[1].replace(/['"]/g, '');
        }

        if (typeof window.navigator.msSaveBlob !== 'undefined')
        {
            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
            window.navigator.msSaveBlob(blob, filename);
        } 
        else
        {
            var URL = window.URL || window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);

            if (filename)
            {
                // use HTML5 a[download] attribute to specify filename
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
            }
            else
            {
                alert("Some error occured.");
                //window.location.href = downloadUrl;
            }

            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
    }
	});
}

function removeIT() // hides list of shared documents
{
	var elem = document.getElementById('shared');
	elem.style.display ='none';
	var e =  document.getElementById('sharePoint');
	e.style.display = 'none';
}

function search() // makes the search area visible
{
	var elem = document.getElementById('searchArea');
	elem.style.display ='block';
	getCategory();
}

function searchIT() // displays the search result
{
	var id = document.getElementById("select").value;
	var c = document.getElementById("form1").value;
	$.ajax(
	{
		type:"POST",
		url: "/search",
		data: JSON.stringify({ id: parseInt(id), data: c }),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response)
		{
			var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Full Name</th><th scope='col'>Location</th>" +
			"<th scope='col'>Information</th><th scope='col'>File</th></tr></thead><tbody>";
			for (i = 0; i < response.length; i++)
			{
				table += "<tr><td scope='row'>" + response[i].id +
				"</td><td scope='row'>" + response[i].title +
				"</td><td scope='row'>" + response[i].location +
				"</td><td scope='row'><button type='button' class='btn btn-info' id = " + 
				response[i].id + " onclick='View_Details(this.id)' >View Details </button>" +
				"</td><td scope='row'><button type='button' class='btn btn-primary' id = " + 
				response[i].id + " onclick='openFILE(this.id)' >View Details </button>" + 
				"</td></tr>";
			}
			table += "</tbody></table>";
			document.getElementById("searchTable").innerHTML = table;
		}
	});
}

function unload() // hides the list of documents shown
{
		var elem = document.getElementById('demo');
		elem.style.display ='none';
}

function unloadIT() // hides the list of documents shared
{
	var elem = document.getElementById('others');
	elem.style.display ='none';
}

function updateFile() // function previously async, for updating file
{
	let formData = new FormData();
	formData.append("file", fileupload.files[0]);;;
	formData.append("id", document.getElementById("docid").innerHTML);
	let response = await fetch('/update',
	{
		method: "POST", 
		body: formData
	});
	if (response.status == 200)
	{
		alert("Request Sent To Server.");
	}
}

function view(id) // views of document shared by others
{
		document.getElementById('hide').style.display = "none";
		if (document.getElementById('txtEditor').style.display !== "none")
		{
			document.getElementById('txtEditor').style.display = "none";
		}
		else
		{
			document.getElementById('txtEditor').style.display = "block";
		}
		
		if(typeof(Storage) !== "undefined")
		{
			sessionStorage.setItem("id", id);
			var file = new XMLHttpRequest();
			file.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					var Doc = this.responseXML;
					document.getElementById("docid").innerHTML = Doc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
					document.getElementById("more_info").innerHTML = Doc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
					document.getElementById('txtEditor').style.display = "block";
				}
			};
			file.open("POST","/getDetails", true);
			file.send(id);
		}
		else
		{
			if(sessionStorage.getItem("id")==id)
			{
				document.getElementById('txtEditor').style.display = "block";
			}
			else
			{
				sessionStorage.setItem("id", id);
			
				var file = new XMLHttpRequest();
				file.onreadystatechange = function()
				{
					if (this.readyState == 4 && this.status == 200)
					{
						var Doc = this.responseXML;
						document.getElementById("docid").innerHTML = Doc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
						document.getElementById("more_info").innerHTML = Doc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
						document.getElementById('txtEditor').style.display = "block";
					}
				};
				file.open("POST","/getDetails", true);
				file.send(id);
			}
		}
}

function View_Details(id) // view details of document
{
		document.getElementById('details').style.display = "block";
		document.getElementById('addCategory').style.display = "block";
		var file = new XMLHttpRequest();
		sessionStorage.setItem("docID", id);
		file.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var Doc = this.responseXML;
				var text = "Document ID: " + Doc.getElementsByTagName("id")[0].childNodes[0].nodeValue + "<br>" +
				Doc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
				document.getElementById("details").innerHTML = text;
				document.getElementById("addC").innerHTML = sessionStorage.getItem("select");
				document.getElementById("removeC").innerHTML = sessionStorage.getItem("select");
			}
		};
		file.open("POST", "/getDetails", true);
		file.send(id);
}

function viewItsHis() // view the shared log of others document that have access to
{
	var elem = document.getElementById('friendlog');
	if (elem.style.display == 'none')
	{
		document.getElementById("friendlog").classList.add('table'); 
		document.getElementById("friendlog").classList.add('table-hover');
		elem.style.display = 'block';
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			var i;
			var xmlDoc = this.responseXML;
			var table="<thead><tr><th scope='col'>Date</th><th scope='col'>Time</th><th scope='col'>Document ID</th>";
			table += "<th scope='col'>Owner ID</th><th scope='col'>Action</th><th scope='col'>User</th></tr></thead><tbody>";
			var x = xmlDoc.getElementsByTagName("item");
			//console.log(this.responseText);
			for (i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" +
				x[i].getElementsByTagName("date")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("doc_ID")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("user_ID")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>";
				if(x[i].getElementsByTagName("action")[0].childNodes[0].nodeValue == "s")
				{
					table += "Share With";
				}
				else
				{
					table += "Un-Shared With";
				}
				table += "</td><td scope='row'>" + x[i].getElementsByTagName("edited_file")[0].childNodes[0].nodeValue +
				"</td></tr>";
			}
			table += "<tr><td colspan='6'><button type='button' onclick='viewItsHisXX()' >Hide It</button></td></tr></tbody></table>";
			document.getElementById("friendlog").innerHTML = table;
		}
	};
	xhttp.open("POST", "/historyFriend", true);
	xhttp.send();
}

function viewItsHisXX() // hides the table that shows log of shared log of others document that have access to
{
		var elem = document.getElementById('friendlog');
		elem.style.display ='none';
}

function viewShareH() // view logs of all file share and unshare
{
	var elem = document.getElementById('history');
	if (elem.style.display == 'none')
	{
		document.getElementById("history").classList.add('table'); 
		document.getElementById("history").classList.add('table-hover');
		elem.style.display = 'block';
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			var i;
			var xmlDoc = this.responseXML;
			var table="<thead><tr><th scope='col'>Date</th><th scope='col'>Time</th><th scope='col'>Document ID</th>";
			table += "<th scope='col'>Action</th><th scope='col'>Shared/Unshared with</th></tr></thead><tbody>";
			var x = xmlDoc.getElementsByTagName("item");
			//console.log("Length of list = " + x.length);
			for (i = 0; i <x.length; i++)
			{
				table += "<tr><td scope='row'>" +
				x[i].getElementsByTagName("date")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>" +
				x[i].getElementsByTagName("doc_ID")[0].childNodes[0].nodeValue +
				"</td><td scope='row'>";
				if(x[i].getElementsByTagName("action")[0].childNodes[0].nodeValue == "s")
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
			table += "<tr><td colspan='5'><button type='button' onclick='HIDE_IT()' >Hide It</button></td></tr></tbody></table>";
			document.getElementById("history").innerHTML = table;
		}
	};
	xhttp.open("POST", "/history", true);
	xhttp.send();
}

