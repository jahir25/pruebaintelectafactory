<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    session_start();

	if (isset($_SESSION['ENTEL_SESSION'])) {
        echo "{\"acceso\":\"true\"}";
    }else{
        echo "{\"acceso\":\"false\"}";
        session_destroy();
    }

 ?>