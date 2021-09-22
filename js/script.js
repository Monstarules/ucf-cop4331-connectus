// The small humble beginnings?
// Eventually, the JS code will go here.

var urlBase = 'http://connect-us.me';
var extension = 'php';

var UglyRL = "/BootstrapUI/Test"

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
		// from what i understand, this code is setting up what will happen WHEN the ready state changes (aka when new pages starts loading)
        // after you send jsonPayload
        xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				UserId = jsonObject.UserId;
		
				if( UserId < 1 )
				{		
					//window.location.href = UglyRL + "/index?#";
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				saveCookie();
	
                // DEFINITELY CHANGE THIS!!!!!
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

// SIGN UP
// NEW NECESSARY function; anyone can create a new account
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
            
            // take them to register.php
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


                
                        // FirstName = jsonObject.FirstName;
                        // LastName = jsonObject.LastName;

                        //saveCookie();
            
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
		window.location.href = UglyRL + "index.html";
	}
	else
	{
		document.getElementById("UserName").innerHTML = "Logged in as " + FirstName + " " + LastName;
	}
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
	// change depending on exact ID in html

	//how do get UserId for contacts?
    var newFirstName = document.getElementById("FirstNameText").value;
    var newLastName = document.getElementById("LastNameText").value;
	var newMiddleName = document.getElementById("MiddleNameText").value;
	var newAddress= document.getElementById("AddressText").value;
	var newPhoneNumber = document.getElementById("PhoneNumberText").value;
	var newEmail = document.getElementById("EmailText").value;
	var newCompany = document.getElementById("CompanyText").value;
	var newBirthday = document.getElementById("BirthdayText").value;

    //double check this later
	document.getElementById("contactAddResult").innerHTML = "";

	var tmp = {	FirstName:newFirstName,
				LastName:newLastName,
				MiddleName:newMiddleName,
				Address:newAddress,
				PhoneNumber:newPhoneNumber,
				Email:newEmail,
				Company:newCompany,
				Birthday:newBirthday};

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
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}


function doDeleteContact()
{
	// This way, we can tell the API exactly which contact to delete.
	var ContactId = document.getElementById("ContactId").value;

	var tmp = {ContactId:ContactId};

	var jsonPayload = JSON.stringify( tmp );

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
				document.getElementById("contactAddResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}





// update this O_O
function doSearchContacts()
{
	var search = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	var contactList = "";
	var currentContact = "";
	
	//var contactList = "";

	var tmp = {search:search,UserId:UserId};
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
				document.getElementById("displayResult").innerHTML = "Here's Da Search Results";
				var jsonObject = JSON.parse( xhr.responseText );
				generateGrid(jsonObject, UserId);	
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("displayResult").innerHTML = err.message;
	}
	
}





function doUpdateContact()
{
	var ContactId = document.getElementById("ContactId").value;

	// When this function is called, it should still be able to grab the old values
	// if they remain unchanged.
	var newFirstName = document.getElementById("FirstNameText").value;
    var newLastName = document.getElementById("LastNameText").value;
	var newMiddleName = document.getElementById("MiddleNameText").value;
	var newAddress = document.getElementById("AddressText").value;
	var newPhoneNumber = document.getElementById("PhoneNumberText").value;
	var newEmail = document.getElementById("EmailText").value;
	var newCompany = document.getElementById("CompanyText").value;
	var newBirthday = document.getElementById("BirthdayText").value; 

    //double check this later
	document.getElementById("contactUpdateResult").innerHTML = "";

	var tmp = {	FirstName:newFirstName,
				LastName:newLastName,
				MiddleName:newMiddleName,
				Address:newAddress,
				PhoneNumber:newPhoneNumber,
				Email:newEmail,
				Company:newCompany,
				Birthday:newBirthday,
				ContactId:ContactId};

	var jsonPayload = JSON.stringify( tmp );

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
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}


function displayContacts()
{
    // UserId is already a global variable!
    //var userId = document.getElementById("UserId").value;
	document.getElementById("displayResult").innerHTML = "";
	
	//var contactList = "";

	var tmp = {UserId:UserId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/LAMPAPI/displayContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("displayResult").innerHTML = "Here's Da Contacts";
				var jsonObject = JSON.parse( xhr.responseText );
				generateGrid(jsonObject, UserId);	
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("displayResult").innerHTML = err.message;
	}
}

function generateGrid(jsonObject, UserId)
{
    var output = "<div class='row'>";
    for(var i=0;i<jsonObject.results.length;i++)
    {
        if((i%3)==0)
        {
            output += "</div><div class='row'>" + "<div class='col-md-4'><div class=\"card\" style=\"width: 18rem;\">\
                <img class=\"card-img-top\" src=\"...\" alt=\"Card image cap\">\
                <div class=\"card-body\">\
                <h5 class=\"card-title\">Card title</h5>\
                <p class=\"card-text\">Some quick example text to build on the card title and make up the bulk of the card's content.</p>\
                <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\
                </div>\
                </div></div>";
        }
        else
        {
            output += "<div class='col-md-4'><div class=\"card\" style=\"width: 18rem;\">\
            <img class=\"card-img-top\" src=\"...\" alt=\"Card image cap\">\
            <div class=\"card-body\">\
            <h5 class=\"card-title\">Card title</h5>\
            <p class=\"card-text\">Some quick example text to build on the card title and make up the bulk of the card's content.</p>\
            <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\
            </div>\
            </div></div>";
        }
    }

    if((i%3)!=0)
    {
        output += "</div><div class='row'>";
    }
}
