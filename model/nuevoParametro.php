<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$state = $_POST['state'];

	if ($state == "true") {

		$nombre_parametro = $_POST['nombre_parametro'];
		$valor = $_POST['valor'];
		$id_tipodato = 2;
		$id_tecnologia = 4;

		$q="SELECT 
		COUNT(*) AS contador
		FROM parametros
		WHERE UPPER(nombre_parametro) = UPPER(:nombre_parametro)";
		$stmt = $dbh->prepare($q);
		$stmt->bindParam(':nombre_parametro', $nombre_parametro, PDO::PARAM_STR);
		$stmt->execute();
		$r = $stmt->fetch(PDO::FETCH_ASSOC);	

		if ($r['contador'] == 0) {

			$q="INSERT INTO 
			parametros 
			(id_tecnologia, nombre_parametro, estado, id_tipodato, valor)
			VALUES(:id_tecnologia, :nombre_parametro, 1, :id_tipodato, :valor)";

			$stmt = $dbh->prepare($q);
			$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
			$stmt->bindParam(':nombre_parametro', $nombre_parametro, PDO::PARAM_STR);
			$stmt->bindParam(':id_tipodato', $id_tipodato, PDO::PARAM_STR);
			$stmt->bindParam(':valor', $valor, PDO::PARAM_STR);
			$r = $stmt->execute();
				

			if($r == true){
				echo json_encode(array('success' => 'Parametro creado exitosamente', 'warning' => 'false'));
			}
			else{
				echo json_encode(array('error' => 'Error al crear el parametro', 'warning' => 'false'));
			}
			
		}elseif ($r['contador'] > 0) {
			echo json_encode(array('warning' => 'true', 'msg' => 'El parametro '.$nombre_parametro.', ya existe'));
		}
		
	}elseif ($state == "false") {

		$id_tecnologia = $_POST['id_tecnologia'];
		$nombre_parametro = $_POST['nombre_parametro'];
		$id_tipodato = $_POST['id_tipodato'];
		$nexcel = $_POST['nexcel'];
		$nu2000 = $_POST['nu2000'];
		
		$q="SELECT 
		COUNT(*) AS contador
		FROM parametros
		WHERE UPPER(nombre_parametro) = UPPER(:nombre_parametro)";
		$stmt = $dbh->prepare($q);
		$stmt->bindParam(':nombre_parametro', $nombre_parametro, PDO::PARAM_STR);
		$stmt->execute();
		$r = $stmt->fetch(PDO::FETCH_ASSOC);	

		if ($r['contador'] == 0) {

			$q="INSERT INTO 
			parametros 
			(id_tecnologia, nombre_parametro, estado, id_tipodato, nombre_excel, nombre_u2000)
			VALUES(:id_tecnologia, :nombre_parametro, 1, :id_tipodato, :nexcel, :nu2000)";

			$stmt = $dbh->prepare($q);
			$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
			$stmt->bindParam(':nombre_parametro', $nombre_parametro, PDO::PARAM_STR);
			$stmt->bindParam(':id_tipodato', $id_tipodato, PDO::PARAM_STR);
			$stmt->bindParam(':nexcel', $nexcel, PDO::PARAM_STR);
			$stmt->bindParam(':nu2000', $nu2000, PDO::PARAM_STR);
			$r = $stmt->execute();
				

			if($r == true){
				echo json_encode(array('success' => 'Parametro creado exitosamente', 'warning' => 'false'));
			}
			else{
				echo json_encode(array('error' => 'Error al crear el parametro', 'warning' => 'false'));
			}
			
		}elseif ($r['contador'] > 0) {
			echo json_encode(array('warning' => 'true', 'msg' => 'El parametro: '.$nombre_parametro.', ya existe'));
		}
	}


		
 ?>