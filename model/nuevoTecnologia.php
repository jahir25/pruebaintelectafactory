<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$nombre_tecnologia = $_POST['nombre_tecnologia'];

	$q="SELECT 
	COUNT(id_tecnologia) AS resultcontador, nombre_tecnologia
	FROM tecnologia
	WHERE UPPER(nombre_tecnologia) = UPPER(:nombre_tecnologia)";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':nombre_tecnologia', $nombre_tecnologia, PDO::PARAM_STR);
	$stmt->execute();
	$r = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($r['resultcontador'] == 0) {

		$q="INSERT INTO 
		tecnologia 
		(nombre_tecnologia, estado)
		VALUES(:nombre_tecnologia, 1)";

		$stmt = $dbh->prepare($q);
		$stmt->bindParam(':nombre_tecnologia', $nombre_tecnologia, PDO::PARAM_STR);
		$r = $stmt->execute();
			
		if($r == true){
			echo json_encode(array('success' => 'Tecnología creado exitosamente'));
		}
		else{
			echo json_encode(array('error' => 'Error al crear el tecnología'));
		}
	}else{
		echo json_encode(array('warning' => 'Error al crear la tecnología: '.$r['nombre_tecnologia'].' ya existe', 'alert'=>true));
	}

	
 ?>