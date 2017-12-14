<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$descripcion = $_POST['descripcion'];
	$nexcel = $_POST['nexcel'];
	$nu2000 = $_POST['nu2000'];

	$q="SELECT 
	COUNT(*) AS contador
	FROM hojas_datafill
	WHERE UPPER(descripcion) = UPPER(:descripcion) OR  UPPER(nombre_excel) = UPPER(:nexcel) OR UPPER(nombre_u2000) = UPPER(:nu2000)";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
	$stmt->bindParam(':nexcel', $nexcel, PDO::PARAM_STR);
	$stmt->bindParam(':nu2000', $nu2000, PDO::PARAM_STR);
	$stmt->execute();
	$r = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($r['contador'] == 0) {

		$q="INSERT INTO 
		hojas_datafill 
		(descripcion, estado, nombre_excel, nombre_u2000)
		VALUES(:descripcion, 1, :nexcel, :nu2000)";

		$stmt = $dbh->prepare($q);
		$stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
		$stmt->bindParam(':nexcel', $nexcel, PDO::PARAM_STR);
		$stmt->bindParam(':nu2000', $nu2000, PDO::PARAM_STR);
		$r = $stmt->execute();
			

		if($r == true){
			echo json_encode(array('success' => 'Hoja Datafill creado exitosamente', 'warning' => 'false'));
		}
		else{
			echo json_encode(array('error' => 'Error al crear la hoja datafill', 'warning' => 'false'));
		}

	}elseif($r['contador'] > 0){
		echo json_encode(array('warning' => 'true', 'msg' => 'La hoja datafill ya existe'));

	}

	
 ?>