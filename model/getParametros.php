<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$data = $_GET['data'];

	$q="SELECT 
	PR.id_parametro, tec.nombre_tecnologia, PR.nombre_parametro, PR.nombre_excel, PR.nombre_u2000, tipo.nombre_tipodato, PR.estado
	FROM parametros PR
	INNER JOIN tecnologia tec ON tec.id_tecnologia = PR.id_tecnologia
	INNER JOIN tipodato tipo ON tipo.id_tipodato = PR.id_tipodato
	WHERE PR.id_tecnologia = :data
	ORDER BY PR.nombre_parametro";
	$stmt = $dbh->prepare($q);
	$stmt->bindParam(':data', $data, PDO::PARAM_STR);
	$stmt->execute();
	$r = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    for($i = 0; $i < sizeof($r); $i++){
        if($r[$i]["estado"] == 1){
            $r[$i]["estado"] = true;
        }elseif($r[$i]["estado"] == 2){
            $r[$i]["estado"] = false;
        }
    }

	echo json_encode($r);
 ?>