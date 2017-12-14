<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));
    switch($rspta->action){
        case 1:            
            $sql = "SELECT 1 AS valid 
                    FROM sectores 
                    WHERE codigo_sector = :codigo_sector AND codigo_sitio = :codigo_sitio AND id_tecnologia = :id_tecnologia";
            
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
            $stmt->bindParam(':codigo_sitio', $rspta->data->sitio, PDO::PARAM_STR);
            $stmt->bindParam(':id_tecnologia', $rspta->data->tecnologia, PDO::PARAM_STR);
            $stmt->execute();
            $valid = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($valid != 1){
                $q = "INSERT INTO sectores (codigo_sector, codigo_sitio, id_tecnologia, estado) VALUES(:codigo_sector, :codigo_sitio, :id_tecnologia, 1)";
                
                $stmt = $dbh->prepare($q);
                $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_INT);
                $stmt->bindParam(':codigo_sitio', $rspta->data->sitio, PDO::PARAM_STR);
                $stmt->bindParam(':id_tecnologia', $rspta->data->tecnologia, PDO::PARAM_INT);
                $r = $stmt->execute();

                if($r == true){
                    echo json_encode(array('success' => 'Se ha creado el sector correctamente', "type" => "s"));
                }else{
                    echo json_encode(array('error' => 'Error crear el sector', "type" => "e"));
                }
                
            }else{                
                echo json_encode(array('error' => 'Error: el sector '.$rspta->data->sitio.' ya existe', "type" => "e"));                
            }
            
            break;
        case 2: 
            $q="SELECT s.codigo_sector, s.codigo_sitio, t.nombre_tecnologia, s.estado 
                FROM sectores s
                INNER JOIN tecnologia t
                    ON t.id_tecnologia = s.id_tecnologia";

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
            $q = "SELECT s.codigo_sector, s.codigo_sitio, t.id_tecnologia, s.estado 
                FROM sectores s
                INNER JOIN tecnologia t
                    ON t.id_tecnologia = s.id_tecnologia
                WHERE s.codigo_sector = :codigo_sector";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':codigo_sector', $rspta->data, PDO::PARAM_STR);
            $stmt->execute();
            $r = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode($r);
            break;
        case 4:
            $sql = "SELECT 1 AS valid 
                    FROM sectores 
                    WHERE codigo_sector = :codigo_sector AND codigo_sitio = :codigo_sitio AND id_tecnologia = :id_tecnologia";
            
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
            $stmt->bindParam(':codigo_sitio', $rspta->data->sitio, PDO::PARAM_STR);
            $stmt->bindParam(':id_tecnologia', $rspta->data->tecnologia, PDO::PARAM_STR);
            $stmt->execute();
            $valid = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($valid["valid"] != 1){
                $q="UPDATE sectores SET codigo_sitio = :codigo_sitio, id_tecnologia = :id_tecnologia WHERE codigo_sector = :codigo_sector";

                $stmt = $dbh->prepare($q);
                $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
                $stmt->bindParam(':codigo_sitio', $rspta->data->sitio, PDO::PARAM_STR);            
                $stmt->bindParam(':id_tecnologia', $rspta->data->tecnologia, PDO::PARAM_STR);
                $r = $stmt->execute();

                if($r == true){
                    echo json_encode(array('success' => 'Se ha modificado el sitio correctamente', "type" => "s"));
                }
                else{
                    echo json_encode(array('error' => 'Error al modificar el sitio' , "type" => "e"));
                }
            }else{
                echo json_encode(array('error' => 'Error al modificar el sector o el sector ingresado ya existe', "type" => "e"));
            }
            break;
        case 5:
            $q = "";
            $respuesta;
            
            if($rspta->data->state == true)
               $q = "UPDATE sectores SET estado = 1 WHERE codigo_sector = :codigo_sector";
            else
               $q = "UPDATE sectores SET estado = 2 WHERE codigo_sector = :codigo_sector";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':codigo_sector', $rspta->data->codigo, PDO::PARAM_STR);
            $r = $stmt->execute();
            
            if($r){
                $respuesta = array("success" => "Se ha cambiado de estado al sitio correctamente", "type" => "s");
            }else{
                $respuesta = array("error" => "No he ha cambiado de estado el sitio correctamente", "type" => "e");
            }

            echo json_encode($respuesta);
            break;
        case 6:
            $r = array();
            $q="SELECT codigo_sitio FROM sitio WHERE estado = 1";
            
            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $sitio = $stmt->fetchAll(PDO::FETCH_ASSOC);
            array_push($r, $sitio);
            
            $q="SELECT id_tecnologia, nombre_tecnologia FROM tecnologia WHERE estado = 1";

            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $tecnologia = $stmt->fetchAll(PDO::FETCH_ASSOC);
            array_push($r, $tecnologia);
            
            echo json_encode($r);
            break;
        default:
            /*var_dump($rspta->action);
            var_dump($rspta);*/
            echo json_encode(array('error' => 'Error: Comunicarse con el Administrador' , "type" => "e"));
            break;
    }
 ?>