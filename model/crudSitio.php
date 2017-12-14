<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));

    switch($rspta->action){
        case 1:

            $sql="SELECT 1 AS valid 
                    FROM sitio 
                    WHERE codigo_sitio = :codigo_sitio AND nombre_sitio = :nombre_sitio";

            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':codigo_sitio', $rspta->data->codigo, PDO::PARAM_STR);
            $stmt->bindParam(':nombre_sitio', $rspta->data->nombre, PDO::PARAM_STR);
            $stmt->execute();
            $valid = $stmt->fetch(PDO::FETCH_ASSOC);

            if($valid['valid'] != 1){                
                    $q="INSERT INTO sitio (codigo_sitio, nombre_sitio, latitud, longitud, estado) VALUES(:codigo_sitio, :nombre_sitio, :latitud, :longitud, 1)";

                    $stmt = $dbh->prepare($q);
                    $stmt->bindParam(':codigo_sitio', $rspta->data->codigo, PDO::PARAM_STR);
                    $stmt->bindParam(':nombre_sitio', $rspta->data->nombre, PDO::PARAM_STR);
                    $stmt->bindParam(':latitud', $rspta->data->latitud, PDO::PARAM_STR);
                    $stmt->bindParam(':longitud', $rspta->data->longitud, PDO::PARAM_STR);
                    $r = $stmt->execute();

                    if($r == true){
                        echo json_encode(array('success' => 'Se ha creado el sitio correctamente.', 'type' => 's'));
                    }
                    else{
                        echo json_encode(array('error' => 'Error crear el sitio.', 'type' => 'e'));
                    }                
            }else{
                echo json_encode(array('error' => 'Error: el sitio '.$rspta->data->codigo.' ya existe.', 'type' => 'e'));
            }
            break;
        case 2: 
            $q="SELECT codigo_sitio, nombre_sitio, latitud, longitud, estado FROM sitio";

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
            break;
        case 3:
            $q="SELECT codigo_sitio, nombre_sitio, latitud, longitud, estado 
                FROM sitio 
                WHERE codigo_sitio = :codigo_sitio";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':codigo_sitio', $rspta->data, PDO::PARAM_STR);
            $stmt->execute();
            $r = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode($r);
            break;
        case 4:
            $q="UPDATE sitio 
                SET nombre_sitio = :nombre_sitio, latitud = :latitud, longitud = :longitud 
                WHERE codigo_sitio = :codigo_sitio";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':codigo_sitio', $rspta->data->codigo, PDO::PARAM_STR);
            $stmt->bindParam(':nombre_sitio', $rspta->data->nombre, PDO::PARAM_STR);
            $stmt->bindParam(':latitud', $rspta->data->latitud, PDO::PARAM_STR);
            $stmt->bindParam(':longitud', $rspta->data->longitud, PDO::PARAM_STR);
            $r = $stmt->execute();
            
            if($r == true){
                echo json_encode(array('success' => 'Se ha modificado el sitio correctamente', "type" => "s"));
            }
            else{
                echo json_encode(array('error' => 'Error al modificar el sitio' , "type" => "e"));
            }
            break;
        case 5:
            $q = "";
            $respuesta;
            
            if($rspta->data->state == true)
               $q = "UPDATE sitio SET estado = 1 WHERE codigo_sitio = :codigo_sitio";
            else
               $q = "UPDATE sitio SET estado = 2 WHERE codigo_sitio = :codigo_sitio";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':codigo_sitio', $rspta->data->codigo, PDO::PARAM_STR);
            $r = $stmt->execute();
            
            if($r){
                $respuesta = array("success" => "Se ha cambiado de estado al sitio correctamente", "type" => "s");
            }else{
                $respuesta = array("error" => "No he ha cambiado de estado el sitio correctamente", "type" => "e");
            }

            echo json_encode($respuesta);
            break;
        default:
            echo json_encode(array('error' => 'Error: Comunicarse con el Administrador' , "type" => "e"));
            break;
    }
 ?>