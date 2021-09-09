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
        $stmt = $conn->prepare("DELETE FROM Contacts 
                                JOIN Users 
                                ON Contacts.UserId = Users.UserId  
                                WHERE UserId=? 
                                AND FirstName=?
                                AND MiddleName =? 
                                AND LastName =?
                                AND Address =?
                                AND PhoneNumber =?
                                AND Email =?
                                AND Company =?
                                AND Birthday =?
                                ");
        $stmt->bind_param("ss",
                            $deleteInfo["UserId"],
                            $deleteInfo["FirstName"],
                            $deleteInfo["MiddleName"],
                            $deleteInfo["LastName"],
                            $deleteInfo["Address"],
                            $deleteInfo["PhoneNumber"],
                            $deleteInfo["Email"],
                            $deleteInfo["Company"],
                            $deleteInfo["Birthday"],
                            );
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) 
        {
            returnWithInfo("Contact deleted.");
        }
        else 
        {
            returnWithError("Contact Not Found");
        }
        $stmt->close();
        $conn->close();
    }

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
