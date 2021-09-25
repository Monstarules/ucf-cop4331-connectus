<?php

    $deleteInfo = getRequestInfo();

    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");
    if( $conn->connect_error )
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // DO THINGS
        $stmt = $conn->prepare("DELETE FROM  Contacts 
                                USING Contacts 
                                INNER JOIN Users 
                                ON Contacts.UserId = Users.UserId
                                WHERE ContactId=?");

        $stmt->bind_param("i", $deleteInfo["ContactId"]);
        $stmt->execute();
        $result = $stmt->get_result();

        // $result = $stmt->get_result() returns false
        // for successful and unsuccessful delete operation.
        // Either way the contact is not in the table :)
        if (!$result) 
        {
            returnWithInfo("Contact Deleted.");
        }
    }
    $stmt->close();
    $conn->close();


    // All below functions are directly from Dr. Leinecker,
    // or adaptations thereof
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($json)
    {
        header('Content-type: application/json');
        echo $json;
    }

    function returnWithInfo($mssg) 
    {
        $retValue = '{"message":"' . $mssg . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
