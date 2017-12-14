<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$q="SELECT 
	id_tipodato, nombre_tipodato
	FROM tipodato
	ORDER BY nombre_tipodato";
	$stmt = $dbh->prepare($q);
	$stmt->execute();
	$r = $stmt->fetchAll(PDO::FETCH_ASSOC);	

	echo json_encode($r);
 ?>