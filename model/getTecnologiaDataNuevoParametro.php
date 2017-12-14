<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();


	$qd="SELECT 
	id_tecnologia, nombre_tecnologia
	FROM tecnologia
	WHERE estado = 1
	ORDER BY nombre_tecnologia";
	$stmt = $dbh->prepare($qd);
	$stmt->execute();
	$r = $stmt->fetchAll(PDO::FETCH_ASSOC);	
	

	echo json_encode($r);
 ?>