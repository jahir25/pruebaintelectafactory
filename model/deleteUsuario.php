<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();    
 	$rspta = json_decode(file_get_contents("php://input"));
    $respuesta = array();
    $q = "";

    if($rspta->state == true)
	   $q = "UPDATE usuario SET estado = 1 WHERE id_usuario = :id_usuario";
    else
	   $q = "UPDATE usuario SET estado = 2 WHERE id_usuario = :id_usuario";

	$stmt = $dbh->prepare($q);
    $stmt->bindParam(':id_usuario', $rspta->id_usuario, PDO::PARAM_INT);
	$r = $stmt->execute();
	
    if($r){
        $respuesta = array("success" => "Se ha eliminado el Usuario Correctamente", "type" => "s");
    }else{
        $respuesta = array("error" => "No he ha eliminado el Usuario Correctamente", "type" => "e");
    }
	echo json_encode($respuesta);
 ?>