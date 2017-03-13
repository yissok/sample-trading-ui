<?php

	include("connect.php"); 	
	
	$link=Connection();
	
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 12:25:00', 7);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 12:30:00', 6);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 12:35:00', 8);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 12:40:00', 11);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 12:45:00', 10);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 12:50:00', 13);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 12:55:00', 14);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:00:00', 15);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:05:00', 16);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:10:00', 35);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:15:00', 47);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:20:00', 51);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:25:00', 50);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:30:00', 56);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:35:00', 55);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:40:00', 57);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:45:00', 53);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:50:00', 47);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:55:00', 43);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 14:00:00', 39);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:00:00', 15);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:00:00', 15);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:00:00', 15);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:00:00', 15);");
	$result = mysqli_query($link,"INSERT INTO history (time_stamp, people) VALUES ('2017-03-06 13:00:00', 15);");
?>