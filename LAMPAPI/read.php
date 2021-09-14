<?php

    $readData = getRequestInfo();

    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserId=?");
        $stmt->bind_param("s", $readData["UserId"]);
        $stmt->execute();
        
        $result = $stmt->get_result();

        $contacts= "";
        $count = 0;

        while ($row = $result->fetch_assoc())
        {
            if ($count > 0)
            {
                $contacts .= ",";
            }
            $count++;
            $contacts .= '"' . $row["FirstName"] . " " . $row["LastName"] . '"'; 
        }

        if ($count == 0)
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($contacts);
        } 
 
        $stmt->close();
        $conn->close();
    } 

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

    function returnWithInfo($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultAsJson($retValue);
    }
