<?php
    
    $updateData = getRequestInfo();

    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts
                                SET
                                FirstName = ?,
                                MiddleName = ?,
                                LastName = ?,
                                Address = ?,
                                PhoneNumber = ?,
                                Email = ?,
                                Company = ?,
                                Birthday = ?
                                WHERE ContactId = ?");
        if ($stmt == false)
        {
            returnWithError("Could not update contact.");
        }

        $stmt->bind_param("ssssssssi",
                           $updateData["FirstName"],
                           $updateData["MiddleName"],
                           $updateData["LastName"],
                           $updateData["Address"],
                           $updateData["PhoneNumber"],
                           $updateData["Email"],
                           $updateData["Company"],
                           $updateData["Birthday"],
                           $updateData["ContactId"]); 
        $stmt->execute();
        returnWithError("");      
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultAsJson($retValue);
    } 
