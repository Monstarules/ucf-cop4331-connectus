<?php
    
    $contactData = getRequestInfo();

    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("INSERT INTO Contacts (UserId, FirstName, MiddleName, LastName, Address, 
                                PhoneNumber, Email, Company, Birthday) VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("issssssss",
                           $contactData["UserId"],
                           $contactData["FirstName"],
                           $contactData["MiddleName"],
                           $contactData["LastName"],
                           $contactData["Address"],
                           $contactData["PhoneNumber"],
                           $contactData["Email"],
                           $contactData["Company"],
                           $contactData["Birthday"]); 
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
