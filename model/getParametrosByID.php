<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$data = $_GET['data'];

	$q="SELECT 
	id_parametro, id_tecnologia, nombre_parametro, nombre_excel, nombre_u2000, id_tipodato, estado
	FROM parametros PR
	where id_parametro = :data";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':data', $data, PDO::PARAM_STR);
	$stmt->execute();
	$r = $stmt->fetch(PDO::FETCH_ASSOC);	

	echo json_encode($r);
 ?>