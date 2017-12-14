<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$descripcion = $_POST['descripcion'];
	$nexcel = $_POST['nexcel'];
	$nu2000 = $_POST['nu2000'];
	$id_hoja = $_POST['id_hoja'];

	$q="UPDATE 
	hojas_datafill
	SET descripcion = :descripcion, nombre_excel = :nexcel, nombre_u2000 = :nu2000
	WHERE id_hoja = :id_hoja";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
	$stmt->bindParam(':nexcel', $nexcel, PDO::PARAM_STR);
	$stmt->bindParam(':nu2000', $nu2000, PDO::PARAM_STR);
	$stmt->bindParam(':id_hoja', $id_hoja, PDO::PARAM_STR);
	$r = $stmt->execute();

	if($r == true){
		echo json_encode(array('success' => 'Hoja actualizado exitosamente'));
	}
	else{
		echo json_encode(array('error' => 'Error al actualizar la descripción de la hoja'));
	}	
 ?>