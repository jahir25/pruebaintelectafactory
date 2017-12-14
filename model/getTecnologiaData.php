<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$id_tecnologia = $_GET['data'];

	$q="SELECT 
	estado
	FROM tecnologia
	WHERE id_tecnologia = :id_tecnologia";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
	$stmt->execute();
	$r = $stmt->fetch(PDO::FETCH_ASSOC);	

	if ($r['estado'] == 2) {
		$qd="SELECT 
		id_tecnologia, nombre_tecnologia
		FROM tecnologia
		WHERE estado = 1 OR id_tecnologia = :id_tecnologia
		ORDER BY nombre_tecnologia";
		$stmt = $dbh->prepare($qd);
		$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
		$stmt->execute();
		$r = $stmt->fetchAll(PDO::FETCH_ASSOC);	
	}elseif ($r['estado'] == 1) {
		$qd="SELECT 
		id_tecnologia, nombre_tecnologia
		FROM tecnologia
		WHERE estado = 1
		ORDER BY nombre_tecnologia";
		$stmt = $dbh->prepare($qd);
		$stmt->execute();
		$r = $stmt->fetchAll(PDO::FETCH_ASSOC);	
	}

	echo json_encode($r);
 ?>