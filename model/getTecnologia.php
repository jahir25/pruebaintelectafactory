<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();

	$q="SELECT id_tecnologia, nombre_tecnologia, estado
        FROM tecnologia 
        ORDER BY 2";

	$stmt = $dbh->prepare($q);
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