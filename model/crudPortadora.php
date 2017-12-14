<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));
    
    switch($rspta->action){
        case 1:
            $qvalid = "SELECT 1 AS valid FROM portadoras WHERE codigo_sector = :codigo_sector AND UPPER(portadora) = UPPER(:portadora)";
            $stmt = $dbh->prepare($qvalid);
            $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
            $stmt->bindParam(':portadora', $rspta->data->portadora, PDO::PARAM_STR);
            $stmt->execute();
            $valid = $stmt->fetch(PDO::FETCH_ASSOC);

            if($valid["valid"] != 1){                
                $q = "INSERT INTO portadoras (codigo_sector, portadora) VALUES(:codigo_sector, :portadora)";
                $stmt = $dbh->prepare($q);
                $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
                $stmt->bindParam(':portadora', $rspta->data->portadora, PDO::PARAM_STR);
                $r = $stmt->execute();

                if($r == true){
                    echo json_encode(array('success' => 'Se ha creado la portadora correctamente', "type" => "s"));
                }else{
                    echo json_encode(array('error' => 'Error crear portadora', "type" => "e"));
                }
            }else{
                echo json_encode(array('error' => 'Error: al crear la portadora '.$rspta->data->portadora.'. ya existe', "type" => "e"));                
            }
            
            break;
        case 2: 
            $q="SELECT P.id_portadora, S.codigo_sector, P.portadora
                FROM portadoras P
                INNER JOIN sectores S
                    ON S.codigo_sector = P.codigo_sector";

            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $r = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            
            echo json_encode($r);
            break;
        case 3:
            $q = "SELECT P.id_portadora, S.codigo_sector, P.portadora
                FROM portadoras P
                INNER JOIN sectores S
                    ON S.codigo_sector = P.codigo_sector
                WHERE P.id_portadora = :id_portadora";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':id_portadora', $rspta->data, PDO::PARAM_STR);
            $stmt->execute();
            $r = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode($r);
            break;
        case 4:
            $qvalid = "SELECT 1 AS valid FROM portadoras WHERE UPPER(codigo_sector) = UPPER(:codigo_sector) AND UPPER(portadora) = UPPER(:portadora)";
            $stmt = $dbh->prepare($qvalid);
            $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
            $stmt->bindParam(':portadora', $rspta->data->portadora, PDO::PARAM_STR);
            $stmt->execute();
            $valid = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($valid["valid"] != 1){ 
                $q="UPDATE portadoras SET codigo_sector = :codigo_sector, portadora = :portadora WHERE id_portadora = :id_portadora";

                $stmt = $dbh->prepare($q);
                $stmt->bindParam(':id_portadora', $rspta->data->id, PDO::PARAM_STR);            
                $stmt->bindParam(':portadora', $rspta->data->portadora, PDO::PARAM_STR);
                $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);            
                $r = $stmt->execute();

                if($r == true){
                    echo json_encode(array('success' => 'Se ha modificado la portadora correctamente', "type" => "s"));
                }
                else{
                    echo json_encode(array('error' => 'Error al modificar la portadora' , "type" => "e"));
                }
            }else{
                echo json_encode(array('error' => 'Error al modificar la portadora o la portadora ingresada ya existe', "type" => "e"));
            }
            break;
        case 5:
            /*NO ACTION*/
            /*$q = "";
            $respuesta;
            
            if($rspta->data->state == true)
               $q = "UPDATE portadoras SET estado = 1 WHERE id_portadora = :id_portadora";
            else
               $q = "UPDATE portadoras SET estado = 2 WHERE id_portadora = :id_portadora";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':codigo_sector', $rspta->data->codigo, PDO::PARAM_STR);
            $r = $stmt->execute();
            
            if($r){
                $respuesta = array("success" => "Se ha cambiado de estado al sitio correctamente", "type" => "s");
            }else{
                $respuesta = array("error" => "No he ha cambiado de estado el sitio correctamente", "type" => "e");
            }

            echo json_encode($respuesta);*/
            break;
        case 6:            
            $q="SELECT codigo_sector FROM sectores WHERE estado = 1";
            
            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $sitio = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            
            echo json_encode($sitio);
            break;
        default:
            echo json_encode(array('error' => 'Error: Comunicarse con el Administrador' , "type" => "e"));
            break;
    }
 ?>