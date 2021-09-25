<?php

    $displayData = getRequestInfo();

    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT ContactId,FirstName,LastName FROM Contacts WHERE UserId=?");
        $stmt->bind_param("s", $displayData["UserId"]);
        $stmt->execute();
        
        $result = $stmt->get_result();

        $contacts= "";
        $contactIDs = array();
        $count = 0;

        while ($row = $result->fetch_assoc())
        {
            if ($count > 0)
            {
                $contacts .= ",";
            }
            $count++;
            array_push($contactIDs, $row["ContactId"]); 
            $contacts .= '"' . $row["FirstName"] . " " . $row["LastName"] . '"'; 
        }

        if ($count == 0)
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($contacts, $contactIDs);
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
        $retValue = '{"Error":"' . $err . '"}';
        sendResultAsJson($retValue);
    }

    function returnWithInfo($searchResults, $contactIds)
    {
        $retValue = '{"results":[' . $searchResults . '],"contactIds":"' . $contactIds . '","error":""}';
        sendResultAsJson($retValue);
    }
