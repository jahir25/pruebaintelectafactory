<?php
	require_once('config/mysql.php');
	require_once('config/config.php');
	
 	$rspta = json_decode(file_get_contents("php://input"));        
        
    save4G($rspta[2]->data, $rspta[2]->hoja, $rspta[2]->header);

    function save4G($data, $hoja, $header){
        $db  = new dbConnect();
        $dbh = $db->conectardb();
        
        $sql = "SELECT id_hoja, nombre_excel
                FROM hojas_datafill
                WHERE nombre_excel = :nombre_excel AND id_hoja IS NOT NULL";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':nombre_excel', $hoja, PDO::PARAM_STR);
        $stmt->execute();
        $rHoja = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $hoja = str_replace("DF", "", $hoja);
        /*if(isset($hoja))
            return;*/
        $sql = "SELECT P.id_parametro, P.nombre_parametro, P.nombre_excel, T.id_tecnologia, TD.id_tipodato
                FROM parametros P
                INNER JOIN tecnologia T
                ON T.id_tecnologia = P.id_tecnologia
                INNER JOIN tipodato TD
                ON TD.id_tipodato = P.id_tipodato
                WHERE T.nombre_tecnologia = :nombre_tecnologia
                ORDER BY 3";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':nombre_tecnologia', $hoja, PDO::PARAM_STR);
        $stmt->execute();
        $r = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        
        $tmpSite = $data[0]->{"ENODEB ID"};
        for($i = 0; $i < sizeof($data); $i++){            
            /*$flag = false;*/
                        
            if($data[$i]->{"ENODEB ID"} != $tmpSite){
                /*var_dump($data[$i - 1]->{"ENODEB ID"});*/
                getPCI($data[$i - 1]->{"ENODEB ID"}, "*PCI", $r[0]["id_tecnologia"], 2);
                /*getPCI($data[0]->{"ENODEB ID"}, "*RootSequenceIdx", $r[0]["id_tecnologia"], 1);*/
                /*$flag = true;*/                
                $tmpSite = $data[$i]->{"ENODEB ID"};                
            }else{
                $tmpSite = $data[$i]->{"ENODEB ID"};
                /*$flag = false;*/                
            }
            
            $respondeSite = array("codigo_sitio" => $data[$i]->{"ENODEB ID"}, 
                              "nombre_sitio" => $data[$i]->{"ENODE B NAME"}, 
                              "latitud" => $data[$i]->{"Latitude"}, 
                              "longitud" => $data[$i]->{"Longitude"});

            $respondeSector = array("codigo_sitio" => $data[$i]->{"ENODEB ID"}, 
                                    "id_tecnologia" => $r[0]["id_tecnologia"], 
                                    "cod_sectorone" => $data[$i]->{"CELL ID"});

            executeInsertSite($respondeSite, $respondeSector);

            foreach ($r as $keyr => $valuer){
                foreach ($header as $keyh => $valueh){
                    if($valuer["nombre_excel"] == $valueh){
                        $valid0 = validValue($valuer, $data[$i]->$valueh);
                        /*$valid1 = validValue($valuer, $data[$i]->$valueh);
                        $valid2 = validValue($valuer, $data[$i]->$valueh);*/

                        /*if($valid0 == 1 && $valid1 == 1 && $valid2 == 1){*/                    
                            insertParamBySheet($rHoja["id_hoja"], $valuer["id_parametro"]);
                            $rValor1 = array("codigo_sector" => $data[$i]->{"CELL ID"},
                                           "id_tipodato" => $valuer["id_tipodato"],
                                           "id_parametro" => $valuer["id_parametro"],
                                           "value" => $data[$i]->$valueh);
                            /*var_dump($rValor1);*/                            
                            executeInsertParam($valid0, $rValor1);

                            /*$rValor2 = array("codigo_sector" => $data[$i]->{"CELL ID"},
                                           "id_tipodato" => $valuer["id_tipodato"],
                                           "id_parametro" => $valuer["id_parametro"],
                                           "value" => $data[$i]->$valueh);
                            executeInsertParam($valid1, $rValor2);

                            $rValor3 = array("codigo_sector" => $data[$i]->{"CELL ID"},
                                           "id_tipodato" => $valuer["id_tipodato"],
                                           "id_parametro" => $valuer["id_parametro"],
                                           "value" => $data[$i]->$valueh);
                            executeInsertParam($valid2, $rValor3);*/
                        /*}*/
                    }                
                }            
            }            
            if($i == sizeof($data) - 1)
                    getPCI($data[$i]->{"ENODEB ID"}, "*PCI", $r[0]["id_tecnologia"], 2);
            /*if($i == (sizeof($data)-1)){
                getPCI($data[$i - 1]->{"ENODEB ID"}, "*PCI", $r[0]["id_tecnologia"], 2);
                getPCI($data[0]->{"ENODEB ID"}, "*RootSequenceIdx", $r[0]["id_tecnologia"], 1);
            }*/
        }
    }

   function insertParamBySheet($hoja, $parametro){   
        $db  = new dbConnect();
        $dbh = $db->conectardb();
        $valid = false;
       
        $sql = "SELECT orden + 1 AS orden FROM parametro_x_hoja
                WHERE id_hoja = :id_hoja ORDER BY 1 DESC LIMIT 1";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':id_hoja', $hoja, PDO::PARAM_INT);       
        $stmt->execute();
        $r = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if(!isset($r["orden"])){
          $r["orden"] =  ($r["orden"] * 1.0) + 1;
        }
       
        $sql = "SELECT 1 AS valid FROM parametro_x_hoja
                WHERE id_hoja = :id_hoja AND id_parametro = :id_parametro";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':id_hoja', $hoja, PDO::PARAM_INT);       
        $stmt->bindParam(':id_parametro', $parametro, PDO::PARAM_INT);            
        $stmt->execute();
        $rv = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($rv["valid"] != 1){
            $sql = "INSERT INTO parametro_x_hoja(id_hoja, id_parametro, estado, orden) 
                        VALUES(:id_hoja, :id_parametro, 1, :orden)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id_hoja', $hoja, PDO::PARAM_INT);
            $stmt->bindParam(':id_parametro', $parametro, PDO::PARAM_INT);
            $stmt->bindParam(':orden', $r["orden"], PDO::PARAM_INT);
            $valid = $stmt->execute();
        }
        
       if($valid){
           $success = array('success' => 'Se ha asignado el parametro: '.$parametro.' para la hoja: '.$hoja, 'type' => 's');
           echo json_encode($success);
       }
    }

    function validValue($result, $value){
        $validation = 0;
        $responde;
        switch($result["id_tipodato"]){
            case 1:
                if(str_word_count($value) > 0) $validation += 1; else $validation -= 1;
                $responde = array("valid" => $validation);
                break;
            case 2:
                if(is_numeric($value) == true && stripos($value, ".") != true) $validation += 1; else $validation -= 1;
                $responde = array("valid" => $validation);
                break;
            case 3:
                if(str_word_count($value) == 0 && stripos($value, ".") == true) $validation += 1; else $validation -= 1;
                $responde = array("valid" => $validation);
                break;
            default:
                $responde = array("error" => "Error a ingresar el tipo de dato", "type" => "e");
                break;
        }
        return $responde;
    }

    function executeInsertParam($valid, $value){
        $db  = new dbConnect();
        $dbh = $db->conectardb();
        $sql;
        ini_set('max_execution_time', 108000);
        $sql = "SELECT 1 AS valid FROM valores
                WHERE id_parametro = :id_parametro AND codigo_sector = :codigo_sector";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':id_parametro', $value["id_parametro"], PDO::PARAM_INT);
        $stmt->bindParam(':codigo_sector', $value["codigo_sector"], PDO::PARAM_STR);
        $stmt->execute();
        $r = $stmt->fetch(PDO::FETCH_ASSOC);
                
        if($r["valid"] != 1){
            if($value["id_tipodato"] == 1){
                $sql = "INSERT INTO valores(valstr, id_parametro, codigo_sector) 
                        VALUES(:value, :id_parametro, :codigo_sector)";
            }else{
                $sql = "INSERT INTO valores(valnum, id_parametro, codigo_sector) 
                        VALUES(:value, :id_parametro, :codigo_sector)";
            }
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id_parametro', $value["id_parametro"], PDO::PARAM_INT);
            $stmt->bindParam(':codigo_sector', $value["codigo_sector"], PDO::PARAM_INT);
            $stmt->bindParam(':value', $value["value"], PDO::PARAM_STR);
            $valid = $stmt->execute();
        }
        /*else{
            if($value["id_tipodato"] == 1){
                $sql = "UDPATE valores SET valstr :value
                        WHERE :id_parametro = :id_parametro AND codigo_sector = :codigo_sector";
            }else{
                $sql = "UDPATE valores SET valnum = :value
                        WHERE :id_parametro = :id_parametro AND codigo_sector = :codigo_sector";
            }
        }*/
        
        
        if($valid){
            $success = array('success' => 'Se ha Asignado el valor: '.$value["value"].' para el parametro: '.$value["id_parametro"], 'type' => 's');
            echo json_encode($success);            
        }else{
            $error = array('error' => 'Error al asignar el valor: '.$value["value"].' para el parametro: '.$value["id_parametro"], 'type' => 'e');
            echo json_encode($error);
        }
        
    }

    function executeInsertSite($value, $responde){ 
        $db  = new dbConnect();
        $dbh = $db->conectardb();
        $valid = false;
        /*$error = array();*/
        $sql = "SELECT 1 AS valid FROM sitio
                WHERE codigo_sitio = :codigo_sitio AND nombre_sitio = :nombre_sitio";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':codigo_sitio', $value["codigo_sitio"], PDO::PARAM_STR);
        $stmt->bindParam(':nombre_sitio', $value["nombre_sitio"], PDO::PARAM_STR);        
        $stmt->execute();
        $r = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($r["valid"] != 1){
            $sql = "INSERT INTO sitio(codigo_sitio, nombre_sitio, latitud, longitud, estado) 
                    VALUES(:codigo_sitio, :nombre_sitio, :latitud, :longitud, 1)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':codigo_sitio', $value["codigo_sitio"], PDO::PARAM_STR);
            $stmt->bindParam(':nombre_sitio', $value["nombre_sitio"], PDO::PARAM_STR);            
            $stmt->bindParam(':latitud', $value["latitud"], PDO::PARAM_STR);
            $stmt->bindParam(':longitud', $value["longitud"], PDO::PARAM_STR);                
            $valid = $stmt->execute();            
        }else{
            $sql = "UPDATE sitio 
                    SET latitud = :latitud, longitud = :longitud
                    WHERE codigo_sitio = :codigo_sitio AND nombre_sitio = :nombre_sitio";
            $stmt  = $dbh->prepare($sql);
            $stmt ->bindParam(':codigo_sitio', $value["codigo_sitio"], PDO::PARAM_STR);
            $stmt ->bindParam(':nombre_sitio', $value["nombre_sitio"], PDO::PARAM_STR);            
            $stmt ->bindParam(':latitud', $value["latitud"], PDO::PARAM_STR);
            $stmt ->bindParam(':longitud', $value["longitud"], PDO::PARAM_STR);                
            $valid = $stmt ->execute();       
        }
        
        if($valid){
            $success = array('success' => 'El sitio : '.$value["nombre_sitio"]. " se creado o actualizado correctamente", 'type' => 's');
            echo json_encode($success);
            executeInsertSector($responde["cod_sectorone"], $responde["codigo_sitio"], $responde["id_tecnologia"]);            
        }else{
            $error = array('error' => 'Error al crear o actualizar el sitio: '.$value["nombre_sitio"], 'type' => 'e');
            echo json_encode($error);
        }
    }
    
    function executeInsertSector($codeSector, $codeSite, $codeTec){
        $db  = new dbConnect();
        $dbh = $db->conectardb();
        $valid = false;
        
        $sql = "SELECT 1 AS valid FROM sectores
                WHERE codigo_sector = :codigo_sector AND codigo_sitio = :codigo_sitio";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':codigo_sector', $codeSector, PDO::PARAM_STR);
        $stmt->bindParam(':codigo_sitio', $codeSite, PDO::PARAM_STR);
        $stmt->execute();
        $r = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($r["valid"] != 1){
            $sql = "INSERT INTO sectores(codigo_sector, estado, codigo_sitio, id_tecnologia) 
                    VALUES(:codigo_sector, 1, :codigo_sitio, :id_tecnologia)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':codigo_sector', $codeSector, PDO::PARAM_STR);
            $stmt->bindParam(':codigo_sitio', $codeSite, PDO::PARAM_STR);            
            $stmt->bindParam(':id_tecnologia', $codeTec, PDO::PARAM_STR);
            $valid = $stmt->execute();
        }
        /*else{
            $sql = "UPDATE sectores
                    SET id_tecnologia = :id_tecnologia
                    WHERE codigo_sector = :codigo_sector AND codigo_sitio = :codigo_sitio)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':codigo_sector', $codeSector, PDO::PARAM_STR);
            $stmt->bindParam(':codigo_sitio', $codeSite, PDO::PARAM_STR);
            $stmt->bindParam(':id_tecnologia', $codeTec, PDO::PARAM_STR);
            $valid = $stmt->execute();
        }*/
        
        if($valid){
            $success = array('success' => 'El sector : '.$codeSector.' se creado o actualizado correctamente para el sitio: '.$codeSite, 'type' => 's');
            echo json_encode($success);
        }else{
            $error = array('error' => 'Error al crear o actualizar el sector: '.$codeSector.' para el sitio '.$codeSite, 'type' => 'e');
            echo json_encode($error);
        }
    }
    
    function getPCI($site, $param, $tec, $option){                
        $db  = new dbConnect();
        $dbh = $db->conectardb();
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
        
        $sql = "CALL getDistanceBySite(:codigo_sitio, :nombre_excel, :tec)";
        /*var_dump($site);
        var_dump("$#############$");*/
        $stmt = $dbh->prepare($sql);        
        $stmt->bindParam(':codigo_sitio', $site, PDO::PARAM_STR);
        $stmt->bindParam(':nombre_excel', $param, PDO::PARAM_STR);
        $stmt->bindParam(':tec', $tec, PDO::PARAM_INT);
        $stmt->execute();
        $r = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                
        $tmpPCI = -1;
        $tmpRes = -1;
        $oItems = bell_filter($r, $site);
        
        $oData = array_slice($r, 0);
        $oValid = false;
        array_splice($r, 0, sizeof($oItems));
        /*var_dump($oItems);
        var_dump($r);*/
        
        if(sizeof($r) == sizeof($oItems)){
            
            for($i = 0; $i < sizeof($oItems); $i++){
                $oItem = getNeighborsBySector($oItems[$i], $r);
                /*var_dump($oItem);
                var_dump($site);*/
                /*var_dump("$#############$");*/
                /*if(sizeof($oItem) > 0                             ){
                    $oValid = true;*/
                $vResponde = changePCI($oItem, $oItems[$i], $option, $site, $param, $tec);                
                var_dump($vResponde);
                    /*var_dump($oItem);*/
                /*}else{
                    $oValid = false;
                }*/
            }            
        }else{
            $aResiduos = array();
            $count = 0;        
            foreach ($oData as $key => $value){                               
                if(($value["valor"] * 1) != 0){
                    return;
                }                                
                $aResiduo = hola($option, $value, $aResiduos);                
                array_push($aResiduos, $aResiduo);                
            }
        } 
    }
    
    function hola($option, $pValue, $aResiduos){        
        if($option == 2){
            $tmpPCI = rand(0, 479);    
        }else{
            $tmpPCI = rand(0, 749);
        }
        $tmpResiduo = $tmpPCI % 3;        
        
        if($option == 2){
            if(($pValue["valor"] * 1) != $tmpPCI && !in_array($tmpResiduo, $aResiduos)){
                updatePCI($tmpPCI, $pValue["id_valor"]);
                return $tmpResiduo;
            }else{                
                hola($option, $pValue, $aResiduos);                
            }
        }elseif($option == 1){
            if(($pValue["valor"] * 1) == $tmpPCI && in_array($tmpResiduo, $aResiduos, TRUE)){
                hola($option, $pValue, $aResiduos);
            }else{                                                    
                updatePCI($tmpPCI, ($pValue["id_valor"] * 1));
                return;                
            }    
        }
    }
    function bell_filter($oData, $oValue){
        $tmpArray = array();
        foreach($oData as $oKey => $aValue){
            if(in_array($oValue, $aValue)){
                array_push($tmpArray, $aValue);
            }
        }
        return $tmpArray;
    }

    function changePCI($oNeighbors, $oNewSite, $option, $site, $param, $tec){        
        $tmpPCI;
        $aResiduo = array();
        
        $valid = setPCI($oNeighbors, $oNewSite, $option, $site, $param, $tec);
        var_dump($valid);
        if(sizeof($aResiduo) == 3)
            $aResiduo = array();
        
        if($valid[0]["valid"]){
            /*if(!in_array($valid[0]["residuo"], $aResiduo)){*/
                /*var_dump($aResiduo);*/
            $aData = updatePCI($valid[0]["param"], $oNewSite["id_valor"]);
            var_dump($aData);
            array_push($aResiduo, $aData[0]["residuo"]);
            /*}else
                array_push($aResiduo, $valid[0]["residuo"]);*/
        }
        /*$valid = setPCI($oNeighbors, $oNewSite, $tmpPCI, $option*/
    }

    function setPCI($oNeighbors, $oNewSite, $option, $site, $param, $tec){
        ini_set('memory_limit', '-1');
        $vValue;
        $fRespuesta = array();
        $vFlag = false;
        $aRespuesta = array();
        $aValid = array();
        $vCount = 0;
        $vSite = sizeof($oNeighbors)?$oNeighbors[0]["codigo_sitio"]:null;

        if($option == 2){
            $vValue = rand(0, 479);
        }else{
            $vValue = rand(0, 749);
        }

        $conttrue=0;
        $contfalse=0;
        
        $vResiduo = ($vValue % 3);           
        foreach ($oNeighbors as $nKey => $nValue){            
            $nValue["valor"] = $nValue["valor"] * 1;
            
            if($option == 2){
                if($nValue["valor"] != $vValue && $nValue["residuo"] != $vResiduo)           
                    $conttrue++;
                    array_push($aValid, true);
                }else{
                    $contfalse++;
                    array_push($aValid, false);   
                }                 
            }
            
            if($nValue["codigo_sitio"] == $vSite){
                $vCount += 1;
                if($vCount == 3)
                    array_push($aRespuesta, $oNeighbors[$nKey]);
            }else
                $vCount = 1;
            $vSite = $nValue["codigo_sitio"];
        }
        
        var_dump(array_search($aValid, true));
        /*if(in_array(true, $aValid)){*/
            /*array_push($fRespuesta, array("valid" => $vFlag, "param" => $vValue, "residuo" => $vResiduo, "rspta" => $aRespuesta));
        }else{
            setPCI($oNeighbors, $oNewSite, $option, $site, $param, $tec);
        }*/
        return $fRespuesta;
    }

    function getNeighborsBySector($oVector, $oData){
        $tmpArray = array();
        $am_azimuth = ($oVector["azimuth"] * 1.0) - 15;
        $ad_azimuth = ($oVector["azimuth"] * 1.0) + 15;
        $add = false;
        if(sizeof($oData) > 0){
            foreach ($oData as $key => $value){
                $am_azimuth_nei = ($value["azimuth"] * 1.0) - 15;
                $ad_azimuth_nei = ($value["azimuth"] * 1.0) + 15;
                $num1 = (($oVector["longitud"] * $ad_azimuth) - $oVector["latitud"]) - (($value["longitud"] * $ad_azimuth_nei) - $value["latitud"]);
                $num2 = ($ad_azimuth_nei - $ad_azimuth);
                $fradx;
                $frady;
                $frady_nei;
                
                if($num2 > 0){
                    $fradx = $num1 / $num2;
                    $frady = (($ad_azimuth * $fradx) - ($oVector["longitud"] * $ad_azimuth)) + $oVector["latitud"];
                    $frady_nei = (($ad_azimuth_nei * $fradx) - ($value["longitud"] * $ad_azimuth_nei)) + $value["latitud"];
                    $add = true;
                }else{
                    $fradx = null;
                    $frady = null;
                    $frady_nei = null;
                    $add = false;
                }
                
                $parm1 = (($oVector["longitud"] * $am_azimuth) - $oVector["latitud"]) - (($value["longitud"] * $am_azimuth_nei) - $value["latitud"]);
                $parm2 = ($am_azimuth_nei - $am_azimuth);
                $scadx;
                $scady;
                $scady_nei;
                if($parm2 > 0){
                    $scadx = $parm1 / $parm2;
                    $scady = (($am_azimuth * $scadx) - ($oVector["longitud"] * $am_azimuth)) + $oVector["latitud"];
                    $scady_nei = (($am_azimuth_nei * $scadx) - ($value["longitud"] * $am_azimuth_nei)) + $value["latitud"];                    
                    $add = true;
                }else{
                    $scadx = null;
                    $scady = null;
                    $scady_nei = null;
                    $add = false;
                }

                if($add){
                    array_push($tmpArray, 
                       array("first_point_x" => $fradx, 
                            "first_point_y" => $frady, 
                            "first_point_nei_y" => $frady_nei,
                            "second_point_x" => $scadx, 
                            "second_point_y" => $scady, 
                            "second_point_nei_y" => $scady_nei,
                            "id_valor" => $value["id_valor"],
                            "id_parametro" => $value["id_parametro"],
                            "codigo_sitio" => $value["codigo_sitio"],
                            "codigo_sector" => $value["codigo_sector"],
                            "valor" => $value["valor"],
                            "residuo" => $value["residuo"],
                            "azimuth" => $value["azimuth"],
                            "distance" => $value["distance"]));                    
                }
            }
        }
        return $tmpArray;            
    }

    function updatePCI($valor, $id){
        $db  = new dbConnect();
        $dbh = $db->conectardb();
        
        $sql = "UPDATE valores SET valnum = :valnum WHERE id_valor = :id_valor";
        $stmt = $dbh->prepare($sql);        
        $stmt->bindParam(':valnum', $valor, PDO::PARAM_INT);
        $stmt->bindParam(':id_valor', $id, PDO::PARAM_INT);
        $stmt->execute();
    }    
    
    function getPCISector($site, $param, $tec){
        $db  = new dbConnect();
        $dbh = $db->conectardb();

        $sql = "SELECT CASE WHEN VA.valnum != 0 THEN (ROUND(VA.valnum) / 3) ELSE null END AS residuo 
        FROM valores VA
        INNER JOIN parametros PA
        ON PA.id_parametro = VA.id_parametro
        INNER JOIN sectores SEC
        ON SEC.codigo_sector = VA.codigo_sector
        INNER JOIN sitio S 
        ON S.codigo_sitio = SEC.codigo_sitio
        WHERE S.codigo_sitio = :codigo_sitio AND PA.nombre_excel = :nombre_excel AND PA.id_tecnologia = :tec";

        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':codigo_sitio', $site, PDO::PARAM_STR);
        $stmt->bindParam(':nombre_excel', $param, PDO::PARAM_STR);
        $stmt->bindParam(':tec', $tec, PDO::PARAM_STR);
        $stmt->execute();

        $dRespuesta = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $dRespuesta;
    }
 ?>