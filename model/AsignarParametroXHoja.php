<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$data = $_POST['data'];
	$id_hoja = $_POST['id_hoja'];

	foreach ($data as $key => $value) {
		
		$q="INSERT INTO 
		parametro_x_hoja
		(id_hoja, id_parametro, estado)
		VALUES(:id_hoja, :id_parametro, 1)";
		$stmt = $dbh->prepare($q);
		$stmt->bindParam(':id_hoja', $id_hoja, PDO::PARAM_STR);
		$stmt->bindParam(':id_parametro', $value['id_parametro'], PDO::PARAM_STR);
		$r = $stmt->execute();
	}

	if($r == true){
		echo json_encode(array('success' => 'Parametros asignados exitosamente'));
	}
	else{
		echo json_encode(array('error' => 'Error al asignar los parametros'));
	}	

 ?>