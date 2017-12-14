<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$nombre_parametro = $_POST['nombre_parametro'];
	$id_tecnologia = $_POST['id_tecnologia'];
	$id_tipodato = $_POST['id_tipodato'];
	$id_parametro = $_POST['id_parametro'];
	$nexcel = $_POST['nexcel'];
	$nu2000 = $_POST['nu2000'];

	$q="UPDATE 
	parametros
	SET id_tecnologia = :id_tecnologia, nombre_parametro = :nombre_parametro, id_tipodato = :id_tipodato, nombre_excel = :nexcel, nombre_u2000 = :nu2000
	WHERE id_parametro = :id_parametro";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':id_parametro', $id_parametro, PDO::PARAM_STR);
	$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
	$stmt->bindParam(':nombre_parametro', $nombre_parametro, PDO::PARAM_STR);
	$stmt->bindParam(':id_tipodato', $id_tipodato, PDO::PARAM_STR);
	$stmt->bindParam(':nexcel', $nexcel, PDO::PARAM_STR);
		$stmt->bindParam(':nu2000', $nu2000, PDO::PARAM_STR);
	$r = $stmt->execute();
		

	if($r == true){
		echo json_encode(array('success' => 'Parametro creado exitosamente'));
	}
	else{
		echo json_encode(array('error' => 'Error al crear el parametro'));
	}	
 ?>