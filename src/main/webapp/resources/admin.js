// functions for admin controls

function approve()
{
	var a = new XMLHttpRequest();
	var id = document.getElementsByName("user")[0].value;
	a.open("POST", "/approve", true);
	a.send(id);
	document.getElementById("message").innerHTML = "Reload Page to check if request made is successful or not.";
}

function loadlog()
{
		var elem = document.getElementById('log');
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
				var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Date</th><th scope='col'>Time</th>";
				table += "<th scope='col'>User ID</th><th scope='col'>Document ID</th><th scope='col'>Action</th>";
				table += "<th scope='col'>Edited File/User ID</th></thead><tbody>";
				var x = xmlDoc.getElementsByTagName("item");
				//console.log("Length of list = " + x.length);
				for (i = 0; i <x.length; i++)
				{
					table += "<tr><td scope='row'>" +
				    x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("date")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("user_ID")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>";
				    try
				    {
						table += x[i].getElementsByTagName("doc_ID")[0].childNodes[0].nodeValue;
					}
					catch(err)
					{
						table += " ";
					}
				    table += "</td><td scope='row'>" +
				    x[i].getElementsByTagName("action")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>";
				    try
				    {
						table += x[i].getElementsByTagName("edited_file")[0].childNodes[0].nodeValue;
					}
					catch(err)
					{
						table += " ";
					}
				    table += "</td></tr>";
				}
				table += "<tr><td colspan='8'><button type='button' onclick='unloadlog()' >Unload This Table</button></td></tr></tbody></table>";
				document.getElementById("log").innerHTML = table;
				var desc = document.getElementById("desc");
				desc.style.display = 'block';
			}
		};
		xhttp.open("POST", "/log", true);
		xhttp.send();
}

function loadUser()
{
		var elem = document.getElementById('user');
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
				var table="<thead><tr><th scope='col'>ID</th><th scope='col'>Full Name</th><th scope='col'>Email</th>";
				table += "<th scope='col'>Date of join</th><th scope='col'>Time of join</th><th scope='col'>Is Admin</th>";
				table += "<th scope='col'>Is Active</th><th scope='col'>Is Approved</th><th scope='col'>Date Left</th></thead><tbody>";
				var x = xmlDoc.getElementsByTagName("item");
				//console.log("Length of list = " + x.length);
				for (i = 0; i <x.length; i++)
				{
					table += "<tr><td scope='row'>" +
				    x[i].getElementsByTagName("userID")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("email")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("date_of_joined")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("time_of_joined")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("admin")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("active")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>" +
				    x[i].getElementsByTagName("approved")[0].childNodes[0].nodeValue +
				    "</td><td scope='row'>";
				    try
				    {
						table += x[i].getElementsByTagName("Date_Left")[0].childNodes[0].nodeValue;
					}
					catch(err)
					{
						table += "--------";
					}
				    "</td></tr>";
				}
				table += "<tr><td colspan='9'><button type='button' onclick='unload()' >Unload This Table</button></td></tr></tbody></table>";
				document.getElementById("user").innerHTML = table;
				var e = document.getElementById('approval');
				e.style.display ='block';
			}
		};
		xhttp.open("POST", "/listUser", true);
		xhttp.send();
}

function unload()
{
	var elem = document.getElementById('user');
	elem.style.display ='none';
	var e = document.getElementById('approval');
	e.style.display ='none';
}

function unloadlog()
{
	var e = document.getElementById('log');
	e.style.display ='none';
	var desc = document.getElementById("desc");
	desc.style.display = 'none';
}

