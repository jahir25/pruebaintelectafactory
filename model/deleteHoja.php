<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');


	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));

    $q = "";
    $respuesta;

    if($rspta->state == true)
       $q = 'UPDATE hojas_datafill SET estado = 1 WHERE id_hoja = :id_hoja';
    else
       $q = 'UPDATE hojas_datafill SET estado = 2 WHERE id_hoja = :id_hoja';

    $stmt = $dbh->prepare($q);    
    $stmt->bindParam(':id_hoja', $rspta->id, PDO::PARAM_STR);
    $r = $stmt->execute();

    if($r){
        $respuesta = array("success" => "Se ha cambiado de estado correctamente", "type" => "s");
    }else{
        $respuesta = array("error" => "No he ha cambiado de estado correctamente", "type" => "e");
    }

    echo json_encode($respuesta);
 ?>