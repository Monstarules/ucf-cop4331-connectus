// The small humble beginnings?
// Eventually, the JS code will go here.

var urlBase = 'http://connect-us.me';
var extension = 'php';

var UserId = 0;
var FirstName = "";
var LastName = "";
//updated?

function doLogin()
{
	UserId = 0;
	FirstName = "";
	LastName = "";
	
    // Change 'loginName' and 'loginPassword' if necessary, for consistency
	var UserName = document.getElementById("loginName").value;
	var Password = document.getElementById("loginPassword").value;
	
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
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				saveCookie();
	
                // DEFINITELY CHANGE THIS!!!!!
				window.location.href = "contacts/index.html";
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
function doSignUp()
{
            UserId = 0;
            FirstName = "";
            LastName = "";
            
            // Change 'loginName' and 'loginPassword' if we necessary, for consistency
            var UserName = document.getElementById("loginName").value;
            var Password = document.getElementById("loginPassword").value;
            var FirstName = document.getElementById("FirstName").value;
            var LastName = document.getElementById("LastName").value;
            
            document.getElementById("loginResult").innerHTML = "";

            var tmp = {UserName:UserName,Password:Password,FirstName:FirstName,LastName:LastName};
            var jsonPayload = JSON.stringify( tmp );
            
            // take them to register.php
            var url = urlBase + '/register.' + extension;

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
                        UserId = jsonObject.id;
                
                        //this should be checking if the User is trying to create an acct. that already exists
                        if( UserId > 0 )
                        {
                            document.getElementById("loginResult").innerHTML = "User already exists";
                            return;
                        }


                
                        FirstName = jsonObject.FirstName;
                        LastName = jsonObject.LastName;

                        saveCookie();
            
                        window.location.href = "contact.html";
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
		window.location.href = "index.html";
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
	//var newUserId
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

	var tmp = {	FirstName	:newFirstName,
				LastName	:newLastName,
				MiddleName	:newMiddleName,
				Address		:newAddress,
				PhoneNumber	:newPhoneNumber,
				Email		:newEmail,
				Company		:newCompany,
				Birthday	:newBirthday};

	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/create.' + extension;
	
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

/*function doDeleteContact)()
{
	UserId = document.getElementById("UserId").value;
}*/


// \/
function searchContact()
{
	var search = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	var contactList = "";

	var tmp = {search:search,UserId:UserId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					//watch this carefully, more likely than not it will NOT work well with our html files
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}
