<?php
    
    $contactData = getRequestInfo();

    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, MiddleName, LastName, Address, 
                                PhoneNumber, Email, Company) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->bind_param("isssssss",
                           $contactData["UserId"],
                           $contactData["FirstName"],
                           $contactData["MiddleName"],
                           $contactData["LastName"],
                           $contactData["Address"],
                           $contactData["PhoneNumber"],
                           $contactData["Email"],
                           $contactData["Company"]); 
        $stmt->execute();
        returnWithError("");      
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultAsJson($retValue);
    } 
