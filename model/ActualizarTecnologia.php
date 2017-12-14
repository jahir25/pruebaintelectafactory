<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();


	$id_tecnologia = $_POST['id_tecnologia'];
	$nombre_tecnologia = $_POST['nombre_tecnologia'];

	$q="UPDATE 
	tecnologia
	SET nombre_tecnologia = :nombre_tecnologia
	WHERE id_tecnologia = :id_tecnologia";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
	$stmt->bindParam(':nombre_tecnologia', $nombre_tecnologia, PDO::PARAM_STR);
	$r = $stmt->execute();
		

	if($r == true){
		echo json_encode(array('success' => 'Tecnología Actualizada correctamente'));
	}
	else{
		echo json_encode(array('error' => 'Error al actualizar la Tecnología'));
	}	
 ?>