<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$id = $_POST['id'];
	$estado = $_POST['state'];

	if ($estado == 'true') {
		$estado = 1;
	}elseif($estado == 'false'){
		$estado = 2;
	}

	$q="UPDATE 
	hojas_datafill
	SET estado = :estado
	WHERE id_hoja = :id";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':id', $id, PDO::PARAM_STR);
	$stmt->bindParam(':estado', $estado, PDO::PARAM_STR);
	$r = $stmt->execute();

	if($r == true){
		echo json_encode(array('success' => 'hoja actualizado exitosamente', 'type' => 's'));
	}
	else{
		echo json_encode(array('error' => 'Error al actualizar la hoja', 'type' => 's'));
	}
 ?>