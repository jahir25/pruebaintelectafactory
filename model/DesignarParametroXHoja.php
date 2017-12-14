<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$data = $_POST['data'];
	$id_hoja = $_POST['id_hoja'];

	foreach ($data as $key => $value) {
		
		$q="DELETE FROM
		parametro_x_hoja
		WHERE id_hoja = :id_hoja AND id_parametro = :id_parametro";
		$stmt = $dbh->prepare($q);
		$stmt->bindParam(':id_hoja', $id_hoja, PDO::PARAM_STR);
		$stmt->bindParam(':id_parametro', $value['id_parametro'], PDO::PARAM_STR);
		$r = $stmt->execute();
	}

	if($r == true){
		echo json_encode(array('success' => 'Parametros designados exitosamente'));
	}
	else{
		echo json_encode(array('error' => 'Error al designar los parametros'));
	}	

 ?>