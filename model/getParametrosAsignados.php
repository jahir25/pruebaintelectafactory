<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$data = $_GET['data'];

	$q="SELECT 
	PR.id_parametro, tec.nombre_tecnologia, PR.nombre_parametro, tipo.nombre_tipodato, PR.estado
	FROM parametro_x_hoja PXR
	INNER JOIN parametros PR ON PR.id_parametro = PXR.id_parametro
	INNER JOIN tecnologia tec ON tec.id_tecnologia = PR.id_tecnologia
	INNER JOIN tipodato tipo ON tipo.id_tipodato = PR.id_tipodato
	WHERE PXR.id_hoja = :data
	ORDER BY PR.nombre_parametro";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':data', $data, PDO::PARAM_STR);
	$stmt->execute();
	$r = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($r);
 ?>