// The small humble beginnings?
// Eventually, the JS code will go here.

var urlBase = 'http://connect-us.me';
var extension = 'php';

var UserID = 0;
var FirstName = "";
var LastName = "";
//updated?

function doLogin()
{
	UserID = 0;
	FirstName = "";
	LastName = "";
	
    // Change 'loginName' and 'loginPassword' if necessary, for consistency
	var UserName = document.getElementById("loginName").value;
	var Password = document.getElementById("loginPassword").value;
	
	document.getElementById("LoginResult").innerHTML = "";

	var tmp = {UserName:UserName,Password:Password};
	var jsonPayload = JSON.stringify( tmp );
	
	var url = urlBase + '/login.' + extension;

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
				UserID = jsonObject.UserID;
		
				if( UserID < 1 )
				{		
					document.getElementById("LoginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				saveCookie();
	
                // DEFINITELY CHANGE THIS!!!!!
				window.location.href = "ContactPage.html";
			}
		};
		xhr.send(jsonPayload);
        //why is xhr.send(jsonPayload) at the end of the try? isn't jsonPayLoad holding what the user entered to login? NVM-- if theres
        // an error, it'll go to catch(err)
	}
	catch(err)
	{
		// I assume this is where we would should redirect to a registration page, or just tell the user they dont have an account
        document.getElementById("LoginResult").innerHTML = err.message;
	}

}

// SIGN UP
// NEW NECESSARY function; anyone can create a new account
function doSignUp()
{
            UserID = 0;
            FirstName = "";
            LastName = "";
            
            // Change 'loginName' and 'loginPassword' if we necessary, for consistency
            var UserName = document.getElementById("loginName").value;
            var Password = document.getElementById("loginPassword").value;
            var FirstName = document.getElementById("FirstName").value;
            var LastName = document.getElementById("LastName").value;
            
            document.getElementById("LoginResult").innerHTML = "";

            var tmp = {UserName:UserName,Password:Password,FirstName:FirstName,LastName:LastName};
            var jsonPayload = JSON.stringify( tmp );
            
            // change to whatever php we go to sign up, IF we go to a page to sign up
            var url = urlBase + '/SignUpPage.' + extension;

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
                        UserID = jsonObject.id;
                
                        //this should be checking if the User is trying to create an acct. that already exists
                        if( UserID > 0 )
                        {
                            document.getElementById("LoginResult").innerHTML = "User already exists";
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
                document.getElementById("LoginResult").innerHTML = err.message;
            }
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",UserID=" + UserID + ";expires=" + date.toGMTString();
}

function readCookie()
{
	UserID = -1;
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
		else if( tokens[0] == "UserID" )
		{
			UserID = parseInt( tokens[1].trim() );
		}
	}
	
	if( UserID < 0 )
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
	UserID = 0;
	FirstName = "";
	LastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function addContact()
{
	// change depending on exact ID in html

	//how do get userID for contacts?
	//var newUserID
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


// \/
function searchContact()
{
	var search = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	var contactList = "";

	var tmp = {search:search,UserID:UserID};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/Searchcontacts.' + extension;
	
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
