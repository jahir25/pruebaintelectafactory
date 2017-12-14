<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));
    
     if($rspta->query == 1){         
        $sql = "SELECT 
        id_hoja, descripcion, estado, nombre_excel, nombre_u2000
        FROM hojas_datafill
        WHERE estado = 1
        ORDER BY descripcion";
        $stmt = $dbh->prepare($sql);        
        $stmt->execute();
        $r = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($r);        
    }else{         
        $q="SELECT 
        id_hoja, descripcion, estado, nombre_excel, nombre_u2000
        FROM hojas_datafill
        ORDER BY descripcion";
        $stmt = $dbh->prepare($q);        
        $stmt->execute();
        $r = $stmt->fetchAll(PDO::FETCH_ASSOC);        
        echo json_encode($r);        
    }
 ?>