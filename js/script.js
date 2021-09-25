// The small humble beginnings?
// Eventually, the JS code will go here.

var urlBase = 'http://connect-us.me';
var extension = 'php';


var UserId = 0;
var FirstName = "";
var LastName = "";

function doLogin()
{
	UserId = 0;
	FirstName = "";
	LastName = "";
	 
    // Change 'loginName' and 'loginPassword' if necessary, for consistency
	var UserName = document.getElementById("UserName").value;
	var Password = document.getElementById("Password").value;
	
	document.getElementById("loginResult").innerHTML = "";

	var tmp = {UserName:UserName,Password:Password};
	var jsonPayload = JSON.stringify( tmp );
	
	var url = urlBase + '/LAMPAPI/login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				UserId = jsonObject.UserId;
		
				if( UserId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				saveCookie();
	
                window.location.href = "UserIndex.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// Display error message in case of login failure.
        document.getElementById("loginResult").innerHTML = err.message;
	}

}


function doRegister()
{
            UserId = 0;
            FirstName = "";
            LastName = "";

            document.getElementById("loginResult").innerHTML = "";
            
            // Change 'loginName' and 'loginPassword' if we necessary, for consistency
            var UserName = document.getElementById("UserName").value;
            var Password = document.getElementById("Password").value;
            var ConfirmPassword = document.getElementById("ConfirmPassword").value;
            var FirstName = document.getElementById("FirstName").value;
            var LastName = document.getElementById("LastName").value;

            if( UserName == "" || Password == "" || ConfirmPassword == "" || FirstName == "" || LastName == "")
            {
            	document.getElementById("loginResult").innerHTML = "Please do not leave any field empty";
            	return;
            }

            if(Password != ConfirmPassword)
            {
            	document.getElementById("loginResult").innerHTML = "Passwords do not match";
            	return;
            }


            var tmp = {UserName:UserName,Password:Password,FirstName:FirstName,LastName:LastName};
            var jsonPayload = JSON.stringify( tmp );
            
            var url = urlBase + '/LAMPAPI/register.' + extension;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try
            {
                xhr.onreadystatechange = function() 
                {
                    if (this.readyState == 4 && this.status == 200) 
                    {
                        var jsonObject = JSON.parse( xhr.responseText );
                        let error = jsonObject.error;
                
                        //this should be checking if the User is trying to create an acct. that already exists
                        if( error == "User is already registered!")
                        {
                            document.getElementById("loginResult").innerHTML = "User already exists";
                            return;
                        }


                
                        FirstName = jsonObject.FirstName;
                        LastName = jsonObject.LastName;


                        saveCookie();
            
                        window.location.href = "index.html";
                    }
                };
                xhr.send(jsonPayload);
            }
            catch(err)
            {
                // I assume this is where we would should redirect to a registration page, or just tell the user they dont have an account
                document.getElementById("loginResult").innerHTML = err.message;
            }
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",UserId=" + UserId + ";expires=" + date.toGMTString();
}

// function validateUser(){

// 	if(UserId < 1)
// 	{
// 		window.location.href = "index.html";
// 	}

// }

function readCookie()
{
	UserId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "FirstName" )
		{
			FirstName = tokens[1];
		}
		else if( tokens[0] == "LastName" )
		{
			LastName = tokens[1];
		}
		else if( tokens[0] == "UserId" )
		{
			UserId = parseInt( tokens[1].trim() );
		}
	}
	
	if( UserId < 0 )
	{
		window.location.href = "index.html";
	}
	// else
	// {
	// 	//document.getElementById("UserName").innerHTML = "Logged in as " + FirstName + " " + LastName;
	// } 
}

function doLogout()
{
	UserId = 0;
	FirstName = "";
	LastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function addContact()
{
	var newFirstName = document.getElementById("create_fname").value;
	var newMiddleName = document.getElementById("create_mname").value;
    var newLastName = document.getElementById("create_lname").value;
	var newAddress= document.getElementById("create_addr").value;
	var newPhoneNumber = document.getElementById("create_phone").value;
	var newEmail = document.getElementById("create_email").value;
	var newCompany = document.getElementById("create_company").value;

	var tmp = {	UserId:UserId,
				FirstName:newFirstName,
				MiddleName:newMiddleName,
				LastName:newLastName,
				Address:newAddress,
				PhoneNumber:newPhoneNumber,
				Email:newEmail,
				Company:newCompany
			};
	
	console.log(tmp);
	
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/LAMPAPI/createContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// document.getElementById("contactAddResult").innerHTML = err.message;
	}
}


function doDeleteContact(contactID)
{
	var tmp = {ContactId:contactID};
	
	var jsonPayload = JSON.stringify( tmp );

	console.log("Attempting delete of ID: " + jsonPayload);

	var url = urlBase + '/LAMPAPI/deleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				doSearchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function doSearchContacts()
{
	var search = document.getElementById("sBar").value;
	
	var contactList = "";
	var currentContact = "";
	
	//var contactList = "";

	var tmp = {Search:search,UserId:UserId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/LAMPAPI/searchContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				if (xhr.responseText.includes("],\"error\":\"\"}")) displayContacts(xhr.responseText);
				else document.getElementById("contactTable").innerHTML = "";
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("debug").innerHTML = err.message;
	}
}

function displayContacts(searchJSON) {
    // UserId is already a global variable!
    //var userId = document.getElementById("UserId").value;
	//document.getElementById("displayResult").innerHTML = "";
	
	//var contactList = "";

	// var tmp = {UserId:UserId};
	//var jsonPayload = JSON.stringify( tmp );
	//document.getElementById("debug").innerHTML = jsonPayload; 

	var url = urlBase + '/LAMPAPI/readContact.' + extension;
	var retString = "";
	var splitData = searchJSON.replaceAll("{\"results\":[", "").replaceAll("],\"error\":\"\"}", "").replaceAll("'", "").split("\t");
	
	for (let i = 0; i < splitData.length; i++) {
		var splitData2 = splitData[i].split("----------");
		
		retString += "<tr id=\"entry" + splitData2[0] +"\">\r\n";
		retString += "<td id=\"fname" + splitData2[0] + "\" onclick=\"editField(&quot;fname" + splitData2[0] + "&quot;)\">"+ splitData2[1] + "</td>\r\n";
		retString += "<td id=\"mname" + splitData2[0] + "\" onclick=\"editField(&quot;mname" + splitData2[0] + "&quot;)\">"+ splitData2[2] + "</td>\r\n";
		retString += "<td id=\"lname" + splitData2[0] + "\" onclick=\"editField(&quot;lname" + splitData2[0] + "&quot;)\">"+ splitData2[3] + "</td>\r\n";
		retString += "<td id=\"address" + splitData2[0] + "\" onclick=\"editField(&quot;address" + splitData2[0] + "&quot;)\">"+ splitData2[4] + "</td>\r\n";
		retString += "<td id=\"pnumber" + splitData2[0] + "\" onclick=\"editField(&quot;pnumber" + splitData2[0] + "&quot;)\">"+ splitData2[5] + "</td>\r\n";
		retString += "<td id=\"email" + splitData2[0] + "\" onclick=\"editField(&quot;email" + splitData2[0] + "&quot;)\">"+ splitData2[6] + "</td>\r\n";
		retString += "<td id=\"company" + splitData2[0] + "\" onclick=\"editField(&quot;company" + splitData2[0] + "&quot;)\">"+ splitData2[7] + "</td>\r\n";
		
		retString += "</tr>\r\n";
	}	
	
	document.getElementById("contactTable").innerHTML = retString;
	return;
}

function doUpdateContact(newFieldInfo, id) {
	var tmp = {	FirstName:newFieldInfo[0],
				MiddleName:newFieldInfo[1],
				LastName:newFieldInfo[2],
				Address:newFieldInfo[3],
				PhoneNumber:newFieldInfo[4],
				Email:newFieldInfo[5],
				Company:newFieldInfo[6],
				ContactId:id
				};

	var jsonPayload = JSON.stringify( tmp );
	
	console.log(jsonPayload); 

	var url = urlBase + '/LAMPAPI/updateContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200)
			{
				doSearchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}
