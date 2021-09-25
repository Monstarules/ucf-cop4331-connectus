function displayContacts()
{
	document.getElementById("displayResult").innerHTML = "";
	
	var colorList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/displayContacts.' + extension;
	
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
				generateGrid(jsonObject, userId);	
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
