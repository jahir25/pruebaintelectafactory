<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));
    
    switch($rspta->action){
        case 1:
            $qvalid = "SELECT 1 AS valid FROM valores WHERE codigo_sector = :codigo_sector AND id_parametro = :id_parametro";
            $stmt = $dbh->prepare($qvalid);
            $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
            $stmt->bindParam(':id_parametro', $rspta->data->parametro, PDO::PARAM_STR);
            $stmt->execute();
            $valid = $stmt->fetch(PDO::FETCH_ASSOC);

            if($valid["valid"] != 1){
                $r;
                
                if($rspta->data->type == 1){
                    $q = "INSERT INTO valores (codigo_sector, id_parametro, valstr) VALUES(:codigo_sector, :id_parametro, :valstr)";
                    $stmt = $dbh->prepare($q);
                    $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_INT);
                    $stmt->bindParam(':id_parametro', $rspta->data->parametro, PDO::PARAM_INT);
                    $stmt->bindParam(':valstr', $rspta->data->value, PDO::PARAM_STR);
                    $r = $stmt->execute();                    
                }elseif($rspta->data->type == 2){
                    $q = "INSERT INTO valores (codigo_sector, id_parametro, valnum) VALUES(:codigo_sector, :id_parametro, :valnum)";
                    $stmt = $dbh->prepare($q);
                    $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_INT);
                    $stmt->bindParam(':id_parametro', $rspta->data->parametro, PDO::PARAM_INT);
                    $stmt->bindParam(':valnum', $rspta->data->value, PDO::PARAM_STR);
                    $r = $stmt->execute();                    
                }

                if($r == true){
                    echo json_encode(array('success' => 'Se ha creado el valor correctamente', "type" => "s"));
                }else{
                    echo json_encode(array('error' => 'Error crear el valor', "type" => "e"));
                }
            }else{
                echo json_encode(array('error' => 'Error crear el valor o el valor ingresado ya existe', "type" => "e"));                
            }
            
            break;
        case 2: 
            $q="SELECT V.id_valor, S.codigo_sector, P.nombre_parametro, T.nombre_tecnologia, TD.nombre_tipodato, CASE WHEN TD.id_tipodato = 1 THEN V.valstr ELSE V.valnum END AS valor
                FROM valores V
                INNER JOIN sectores S
                    ON S.codigo_sector = V.codigo_sector
                INNER JOIN parametros P
                    ON P.id_parametro = V.id_parametro
                INNER JOIN tecnologia T
                    ON T.id_tecnologia = P.id_tecnologia
                INNER JOIN tipodato TD
                    ON TD.id_tipodato = P.id_tipodato";

            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $r = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            
            echo json_encode($r);
            break;
        case 3:
            $q = "SELECT V.id_valor, S.codigo_sector, P.id_parametro, T.id_tecnologia, TD.id_tipodato, CASE WHEN TD.id_tipodato = 1 THEN V.valstr ELSE V.valnum END AS valor
                FROM valores V
                INNER JOIN sectores S
                    ON S.codigo_sector = V.codigo_sector
                INNER JOIN parametros P
                    ON P.id_parametro = V.id_parametro
                INNER JOIN tecnologia T
                    ON T.id_tecnologia = P.id_tecnologia
                INNER JOIN tipodato TD
                    ON TD.id_tipodato = P.id_tipodato
                WHERE V.id_valor = :id_valor";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':id_valor', $rspta->data, PDO::PARAM_STR);
            $stmt->execute();
            $r = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode($r);
            break;
        case 4:
            if($rspta->data->type == 1){
                $qvalid = "SELECT 1 AS valid FROM valores WHERE codigo_sector = :codigo_sector AND id_parametro = :id_parametro AND valstr = :valstr";
                $stmt = $dbh->prepare($qvalid);
                $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
                $stmt->bindParam(':id_parametro', $rspta->data->parametro, PDO::PARAM_STR);
                $stmt->bindParam(':valstr', $rspta->data->value, PDO::PARAM_STR);
                $stmt->execute();
                $valid = $stmt->fetch(PDO::FETCH_ASSOC);
            }elseif($rspta->data->type == 2){
                $qvalid = "SELECT 1 AS valid FROM valores WHERE codigo_sector = :codigo_sector AND id_parametro = :id_parametro AND valnum = :valnum";
                $stmt = $dbh->prepare($qvalid);
                $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_STR);
                $stmt->bindParam(':id_parametro', $rspta->data->parametro, PDO::PARAM_STR);
                $stmt->bindParam(':valnum', $rspta->data->value, PDO::PARAM_STR);
                $stmt->execute();
                $valid = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            if($valid["valid"] != 1){ 
                $r;
                
                if($rspta->data->type == 1){
                    $q = "UPDATE valores SET codigo_sector = :codigo_sector, id_parametro = :id_parametro, valstr = :valstr WHERE id_valor = :id_valor";
                    $stmt = $dbh->prepare($q);
                    $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_INT);
                    $stmt->bindParam(':id_parametro', $rspta->data->parametro, PDO::PARAM_INT);
                    $stmt->bindParam(':valstr', $rspta->data->value, PDO::PARAM_STR);
                    $stmt->bindParam(':id_valor', $rspta->data->id_valor, PDO::PARAM_STR);
                    $r = $stmt->execute();                    
                }elseif($rspta->data->type == 2){
                    $q = "UPDATE valores SET codigo_sector = :codigo_sector, id_parametro = :id_parametro, valnum = :valnum WHERE id_valor = :id_valor";
                    $stmt = $dbh->prepare($q);
                    $stmt->bindParam(':codigo_sector', $rspta->data->sector, PDO::PARAM_INT);
                    $stmt->bindParam(':id_parametro', $rspta->data->parametro, PDO::PARAM_INT);
                    $stmt->bindParam(':valnum', $rspta->data->value, PDO::PARAM_STR);
                    $stmt->bindParam(':id_valor', $rspta->data->id_valor, PDO::PARAM_STR);
                    $r = $stmt->execute();                    
                }

                if($r == true){
                    echo json_encode(array('success' => 'Se ha modificado el valor correctamente', "type" => "s"));
                }
                else{
                    echo json_encode(array('error' => 'Error al modificar el valor' , "type" => "e"));
                }
            }else{
                echo json_encode(array('error' => 'Error al modificar el valor o el sector y portadora ingresados ya existen', "type" => "e"));
            }
            break;
        case 5:
            /*NO ACTION*/
            /*$q = "";
            $respuesta;
            
            if($rspta->data->state == true)
               $q = "UPDATE valores SET estado = 1 WHERE id_portadora = :id_portadora";
            else
               $q = "UPDATE valores SET estado = 2 WHERE id_portadora = :id_portadora";

            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':codigo_sector', $rspta->data->codigo, PDO::PARAM_STR);
            $r = $stmt->execute();
            
            if($r){
                $respuesta = array("success" => "Se ha cambiado de estado al valor correctamente", "type" => "s");
            }else{
                $respuesta = array("error" => "No he ha cambiado de estado el valor correctamente", "type" => "e");
            }

            echo json_encode($respuesta);
            break;*/
        case 6:            
            $r = array();
            
            $q="SELECT DISTINCT s.codigo_sector 
                FROM sectores s
                INNER JOIN valores v
                ON s.codigo_sector = v.codigo_sector
                WHERE s.estado = 1 OR v.id_valor = :id_valor";
            
            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':id_valor', $rspta->data, PDO::PARAM_STR);
            $stmt->execute();
            $sector = $stmt->fetchAll(PDO::FETCH_ASSOC);
            array_push($r, $sector);
            
            $q="SELECT DISTINCT p.id_parametro, p.nombre_parametro, p.id_tipodato, p.id_tecnologia 
                FROM parametros p
                INNER JOIN valores v
                ON p.id_parametro = v.id_parametro
                WHERE p.estado = 1 OR v.id_valor = :id_valor";
            
            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':id_valor', $rspta->data, PDO::PARAM_STR);
            $stmt->execute();
            $parametro = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            array_push($r, $parametro);
            
            $q="SELECT id_tipodato, nombre_tipodato FROM tipodato";
            
            $stmt = $dbh->prepare($q);            
            $stmt->execute();
            $tipodato = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            array_push($r, $tipodato);
            
            $q="SELECT id_tecnologia, nombre_tecnologia FROM tecnologia";
            
            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':id_valor', $rspta->data, PDO::PARAM_STR);
            $stmt->execute();
            $tecnologia = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            array_push($r, $tecnologia);

            echo json_encode($r);
            break;
        case 7:            
            $r = array();
            
            $q="SELECT s.codigo_sector 
                FROM sectores s                
                WHERE s.estado = 1";
            
            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $sector = $stmt->fetchAll(PDO::FETCH_ASSOC);
            array_push($r, $sector);
            
            $q="SELECT p.id_parametro, p.nombre_parametro, p.id_tipodato, p.id_tecnologia 
                FROM parametros p WHERE estado = 1";
            
            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $parametro = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            array_push($r, $parametro);
            
            $q="SELECT id_tipodato, nombre_tipodato FROM tipodato";
            
            $stmt = $dbh->prepare($q);            
            $stmt->execute();
            $tipodato = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            array_push($r, $tipodato);
            
            $q="SELECT id_tecnologia, nombre_tecnologia FROM tecnologia WHERE estado = 1";
            
            $stmt = $dbh->prepare($q);
            $stmt->execute();
            $tecnologia = $stmt->fetchAll(PDO::FETCH_ASSOC);            
            array_push($r, $tecnologia);

            echo json_encode($r);
            break;
        default:
            echo json_encode(array('error' => 'Error: Comunicarse con el Administrador' , "type" => "e"));
            break;
    }
 ?>