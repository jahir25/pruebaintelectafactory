<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));

    $q = "";
    $respuesta;

    if($rspta->state == true)
       $q = 'UPDATE tecnologia SET estado = 1 WHERE id_tecnologia = :id_tecnologia';
    else
       $q = 'UPDATE tecnologia SET estado = 2 WHERE id_tecnologia = :id_tecnologia';

    $stmt = $dbh->prepare($q);    
    $stmt->bindParam(':id_tecnologia', $rspta->value, PDO::PARAM_STR);
    $r = $stmt->execute();

    if($r){
        $respuesta = array("success" => "Se ha cambiado de estado correctamente", "type" => "s");
    }else{
        $respuesta = array("error" => "No he ha cambiado de estado correctamente", "type" => "e");
    }


    echo json_encode($respuesta);            
 ?>