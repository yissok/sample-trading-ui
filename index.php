<?php

	include("connect.php"); 	
	
	$link=Connection();

	$result=mysqli_query($link, "SELECT * FROM `history`");
?>

<html>
   <head>
      <title>Sensor Data</title>
   </head>
<body>
   <h1>People in gym</h1>

   <table border="1" cellspacing="1" cellpadding="1">
		<tr>
			<td>&nbsp;Time&nbsp;</td>
			<td>&nbsp;People&nbsp;</td>
		</tr>

        <?php 
            $result = mysqli_query($link,"SELECT * FROM history");
            $rowcount=mysqli_num_rows($result)-1;
            //echo $rowcount;
            $query = "SELECT time_stamp, people FROM history";
            $result = mysqli_query($link, $query);
            //$row = mysqli_fetch_assoc($result);
            while($row = $result->fetch_array())
            {
                echo "<tr><td>".$row["time_stamp"]. "</td><td>".$row["people"]. "</td></tr>";
            }
            mysqli_close($link);
        ?>

   </table>
</body>
</html>
