<?php

	function Connection()
    {
        
        $host="localhost";      
        $username="root"; 
        $password=""; 

        $db_name="fitin"; 
        $tbl_name="history"; 

        $connect = new mysqli($host, $username, $password, $db_name)or die("cannot connect"); 
        if ($connect->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } 
        return  $connect;
	}
?>
