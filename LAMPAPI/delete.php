<?php

    $contactInfo = getRequestInfo();
 
    $conn = new mysqli("localhost", "ConnectUs", "COP4331connectus", "ConnectUs");
    if( $conn->connect_error )
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // $stmt = $conn->prepare("SELECT UserId from Users WHERE UserName=?");
        // $stmt->bind_param("ss", $contactInfo["UserName"]);
        // $stmt->execute();
        // $userId = $stmt->get_result();
        // $stmt->close();
        // $conn->close();

        // DO THINGS
        $stmt = $conn->prepare("DELETE FROM Contacts INNER JOIN Users ON Contacts.UserId = Users.UserId  WHERE UserId =? AND FirstName=? AND LastName =?");
        $stmt->bind_param("ss",
                            $userId["UserId"],
                            $contactInfo["FirstName"],
                            $contactInfo["LastName"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            returnWithInfo($row);
        }
        else {
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

    function returnWithInfo($contactInfo) 
    {
        $retValue = '{  "FirstName":"' . $contactInfo['FirstName'] . '",
                        "LastName":"' . $contactInfo['LastName'] . '",
                        "error":""}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }