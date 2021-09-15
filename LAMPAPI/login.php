<?php

    $data = getRequestInfo();

    $servername = "localhost";
    $username = "ConnectUs";
    $password = "COP4331connectus";
    $database = "ConnectUs";

    // Connect API to database
    $conn = new mysqli($servername, $username, $password, $database);

    if ($conn->connect_error) {
        echo "Connection failed: " . $conn->connect_error;
    }

    else {
        $stmt = $conn->prepare("SELECT UserId,FirstName,LastName FROM Users WHERE UserName=? AND Password =?");
        $stmt->bind_param("ss", $data["UserName"], $data["Password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            returnWithInfo($row['FirstName'], $row['LastName'], $row['UserId']);
        }
        else {
            returnWithError("No Records Found");
        }

        $stmt->close();
        $conn->close();
    }

    // Retrieves the JSON with the login information
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    // Sends back a JSON object
    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    // Sets return info with an error and calls sendResultInfoAsJson()
    function returnWithError($err) {
        $retValue = '{"UserId":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    // Sets return info and calls sendResultInfoAsJson()
    function returnWithInfo($firstName, $lastName, $id) {
        $retValue = '{"UserId":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
