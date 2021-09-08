// The small humble beginnings?
// Eventually, the JS code will go here.

var urlBase = 'http://connect-us.me';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
    // Change 'loginName' and 'loginPassword' if we necessary, for consistency
	var UserName = document.getElementById("loginName").value;
	var Password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	var tmp = {UserName:lUserNameogin,Password:Password};
	var jsonPayload = JSON.stringify( tmp );
	
	var url = urlBase + '/Login.' + extension;

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
				userId = jsonObject.UserId;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();
	
                // DEFINITELY CHANGE THIS!!!!!
				window.location.href = "addContactPage.html";
			}
		};
		xhr.send(jsonPayload);
        //why is xhr.send(jsonPayload) at the end of the try? isn't jsonPayLoad holding what the user entered to login? NVM-- if theres
        // an error, it'll go to catch(err)
	}
	catch(err)
	{
		// I assume this is where we would should redirect to a registration page, or just tell the user they dont have an account
        document.getElementById("loginResult").innerHTML = err.message;
	}

}

// SIGN UP
// NEW NECESSARY function; anyone can create a new account
function doSignUp()
{
            userId = 0;
            firstName = "";
            lastName = "";
            
            // Change 'loginName' and 'loginPassword' if we necessary, for consistency
            var UserID = document.getElementById("loginName").value;
            var Password = document.getElementById("loginPassword").value;
            var FirstName = document.getElementById("firstName").value;
            var LastName = document.getElementById("lastName").value;
            
            document.getElementById("loginResult").innerHTML = "";

            var tmp = {UserName:Login,Password:Password,FirstName:FirstName,LastName:LastName};
            var jsonPayload = JSON.stringify( tmp );
            
            // change to whatever page we go to sign up, IF we go to a page to sign up
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
                        userId = jsonObject.id;
                
                        //this should be checking if the User is trying to create an acct. that already exists
                        if( userId > 0)
                        {
                            document.getElementById("loginResult").innerHTML = "User already exists";
                            return;
                        }


                
                        firstName = jsonObject.firstName;
                        lastName = jsonObject.lastName;

                        saveCookie();
            
                        window.location.href = "color.html";
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// function addColor()
// {
    // 	var newColor = document.getElementById("colorText").value;
    // 	document.getElementById("colorAddResult").innerHTML = "";

    // 	var tmp = {color:newColor,userId,userId};
    // 	var jsonPayload = JSON.stringify( tmp );

    // 	var url = urlBase + '/AddColor.' + extension;
        
    // 	var xhr = new XMLHttpRequest();
    // 	xhr.open("POST", url, true);
    // 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    // 	try
    // 	{
    // 		xhr.onreadystatechange = function() 
    // 		{
    // 			if (this.readyState == 4 && this.status == 200) 
    // 			{
    // 				document.getElementById("colorAddResult").innerHTML = "Color has been added";
    // 			}
    // 		};
    // 		xhr.send(jsonPayload);
    // 	}
    // 	catch(err)
    // 	{
    // 		document.getElementById("colorAddResult").innerHTML = err.message;
    // 	}
	
// }

function addContact()
{
	// change depending on exact ID in html
    var newFirstName = document.getElementById("firstNameText").value;
    var newLastName = document.getElementById("firstLastText").value;
    //last thing changed
	document.getElementById("colorAddResult").innerHTML = "";

	var tmp = {color:newColor,userId,userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/AddColor.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}


// \/
function searchContact()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchColors.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
