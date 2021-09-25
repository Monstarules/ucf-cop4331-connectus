<?php
	
    $searchData = getRequestInfo();
	
    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $searchName = "%" . $searchData["Search"] . "%";

        // SELECT ContactId from Contacts where concat(FirstName, MiddleName, LastName, Address, PhoneNumber, Email, Company) LIKE ? and UserId =?
        $stmt = $conn->prepare("SELECT ContactId, FirstName, MiddleName, LastName, Address, PhoneNumber, Email, Company FROM Contacts WHERE CONCAT(FirstName, MiddleName, LastName, Address, PhoneNumber, Email, Company) LIKE ? and UserId=?");
        $stmt->bind_param("ss", $searchName, $searchData["UserId"]);
        $stmt->execute();

        $result = $stmt->get_result();

        $searchCount = 0;
        $searchResults = "";

        while ($row = $result->fetch_assoc())
        {
            if ($searchCount > 0)
            {
                $searchResults .= "\t";
            }
            $searchCount++;
            $searchResults .= $row["ContactId"] . '----------' . $row["FirstName"] . '----------' . $row["MiddleName"] . '----------' . $row["LastName"] . '----------' . $row["Address"] . '----------' . $row["PhoneNumber"] . '----------' . $row["Email"] . '----------' . $row["Company"];
        }

        if ($searchCount == 0)
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($searchResults);
        } 

    }
    $stmt->close();
    $conn->close();

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultAsJson($json)
    {
        header('Content-type: application/json');
        echo $json;
    }

    function returnWithError($err)
    {
        $retValue = '{"UserId":0, "FirstName":"", "LastName":"", "error":"' . $err . '"}';
        sendResultAsJson($retValue);
    }

    function returnWithInfo($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultAsJson($retValue);
    }

