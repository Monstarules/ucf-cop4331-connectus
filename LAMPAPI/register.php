<?php

    $userData = getRequestInfo();
 
    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // Check if UserName is already being used
        $stmt = $conn->prepare("SELECT UserName FROM Users WHERE UserName=?");
        $stmt->bind_param("s", $userData["UserName"]);
        $stmt->execute();
        
        $result = $stmt->get_result();
        if( $row = $result->fetch_assoc()  )
        {
            returnWithError("User is already registered!");
        }
        else
        {
            // Insert User into database
            $stmt = $conn->prepare("INSERT INTO Users(UserName, Password, FirstName, LastName) 
                                    VALUES (?,?,?,?)");
            $stmt->bind_param("ssss", 
                                $userData["UserName"], 
                                $userData["Password"], 
                                $userData["FirstName"], 
                                $userData["LastName"]);
            $stmt->execute();
            returnWithError("Registration Successful!");
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

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
