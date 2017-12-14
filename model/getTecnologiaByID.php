<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$data = $_GET['data'];

	$q="SELECT 
	nombre_tecnologia, estado
	FROM tecnologia
	where id_tecnologia = :data";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':data', $data, PDO::PARAM_STR);
	$stmt->execute();
	$r = $stmt->fetch(PDO::FETCH_ASSOC);	

	echo json_encode($r);
 ?>