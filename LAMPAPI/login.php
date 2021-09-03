<?php

    $data = getRequestInfo();

    $servername = "localhost";
    $username = "ConnectUs";
    $password = "COP4331connectus";
    $database = "ConnectUs";

    $conn = new mysqli($servername, $username, $password, $database);

    if ($conn->connect_error) {
        echo "Connection failed: " . $conn->connect_error;
    }

    else {
        $stmt = $conn->prepare("SELECT UserId,FirstName,LastName FROM Users WHERE UserName=? AND Password =?");
        $stmt->bind_param("ss", $data["login"], $data["password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            // returnWithInfo( $row['FirstName'], $row['LastName'], $row['UserId'] );
        }
        else {
            // returnWithError("No Records Found");
            echo "No records found";
        }

        $stmt->close();
        $conn->close();
    }

    // API has not been configured to recieve JSON from the Frontend
    function getRequestInfo() {
        return json_decode(file_get_contents("login.json"), true);
    }

    // I dont know what this does
    function sendResultInfoAsJson( $obj ) {
        // header('Content-type: application/json');
        // echo $obj;
        echo "<h1> YOU HAVE LOGGED IN </h1>";
    }
    
    function returnWithInfo( $firstName, $lastName, $id ) {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }
