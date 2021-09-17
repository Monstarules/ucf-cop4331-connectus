<?php

    $readData = getRequestInfo();

    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT UserID,FirstName,MiddleName,LastName,Address,PhoneNumber,Email,
                                Company,Birthday FROM Contacts WHERE UserId=? and ContactId=?");
        $stmt->bind_param("ss", $readData["UserId"], $readData["ContactId"]);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc())
        {
            returnWithInfo($row["FirstName"], $row["MiddleName"], $row["LastName"], $row["Address"], 
                           $row["PhoneNumber"], $row["Email"], $row["Company"], $row["Birthday"]);
        }
        else
        {
            returnWithError("Contact not found");
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

    function returnWithInfo($firstName, $middleName, $lastName, $address, $phoneNumber, $email, $company, $birthday)
    {
        $retValue = '{"FirstName":"' . $firstName . '","MiddleName":"' . $middleName . '","LastName":"' . $lastName . '","Address":"' . $address
                    . '","PhoneNumber":"' . $phoneNumber . '","Email":"' . $email . '","Company":"' . $company . '","Birthday":"' . $birthday . '"}';
        sendResultAsJson($retValue);
    }
