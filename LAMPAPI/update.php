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
                                UserId = ?,
                                FirstName = ?,
                                MiddleName = ?,
                                LastName = ?,
                                Address = ?,
                                PhoneNumber = ?,
                                Email = ?,
                                Company = ?,
                                Birthday = ?");
        $stmt->bind_param("issssssss",
                           $updateData["UserId"],
                           $updateData["FirstName"],
                           $updateData["MiddleName"],
                           $updateData["LastName"],
                           $updateData["Address"],
                           $updateData["PhoneNumber"],
                           $updateData["Email"],
                           $updateData["Company"],
                           $updateData["Birthday"]); 
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");      
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
