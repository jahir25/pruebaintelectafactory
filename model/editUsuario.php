<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();    
    $Llave = LLAVE;
 	$rspta = json_decode(file_get_contents("php://input"));
    $respuesta;
    if($rspta->action == 1){
        $q = "SELECT USU.id_usuario, USU.login, USU.nombres, USU.apellidos, CAST(AES_DECRYPT(USU.password, :LLAVE) AS CHAR) AS password, USU.id_ldap, USU.id_perfil, USU.email 
                FROM usuario USU                
                WHERE USU.id_usuario = :id_usuario";
        $stmt = $dbh->prepare($q);
        $stmt->bindParam(':id_usuario', $rspta->data, PDO::PARAM_INT);
        $stmt->bindParam(':LLAVE', $Llave, PDO::PARAM_STR);
        $stmt->execute();
        $r = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $r[0]["password"] = base64_encode($r[0]["password"]);        
        echo json_encode($r);        
    }else if($rspta->action == 2){
        $sql = "SELECT 1 AS valid 
                FROM usuario 
                WHERE LOWER(login) = LOWER(:login) AND LOWER(email) = LOWER(:email) AND id_usuario != :id_usuario";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':id_usuario', $rspta->data->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(':login', $rspta->data->login, PDO::PARAM_STR);
        $stmt->bindParam(':email', $rspta->data->email, PDO::PARAM_STR);
        $stmt->execute();
        $valid = $stmt->fetch(PDO::FETCH_ASSOC);	
                    
        if($valid['valid'] != 1){
            $q = "";            
            $r;
            if($rspta->data->LDAP == 1){
                $q = "UPDATE usuario
                        SET nombres = :nombres, apellidos = :apellidos, id_ldap = :LDAP, login = :login, id_perfil = :id_perfil, email = :email
                        WHERE id_usuario = :id_usuario";                
            }else{                
                $q = "UPDATE usuario
                        SET nombres = :nombres, 
                        apellidos = :apellidos, 
                        id_ldap = :LDAP, 
                        login = :login, 
                        id_perfil = :id_perfil, 
                        email = :email, 
                        password = AES_ENCRYPT(:password, :LLAVE)
                        WHERE id_usuario = :id_usuario";        
            }
            $stmt = $dbh->prepare($q);
            $stmt->bindParam(':nombres', $rspta->data->nombre, PDO::PARAM_STR);
            $stmt->bindParam(':apellidos', $rspta->data->apellido, PDO::PARAM_STR);
            $stmt->bindParam(':LDAP', $rspta->data->LDAP, PDO::PARAM_INT);
            $stmt->bindParam(':login', $rspta->data->login, PDO::PARAM_STR);            
            $stmt->bindParam(':id_perfil', $rspta->data->perfil, PDO::PARAM_INT);
            $stmt->bindParam(':email', $rspta->data->email, PDO::PARAM_STR);        
            $stmt->bindParam(':id_usuario', $rspta->data->id_usuario, PDO::PARAM_INT);
            if($rspta->data->LDAP == 2){                
                $stmt->bindParam(':password', $rspta->data->password, PDO::PARAM_STR);                                                
                $stmt->bindParam(':LLAVE', $Llave, PDO::PARAM_STR);
            }
            $r = $stmt->execute();

            if($r){
                $respuesta = array("success" => "Se ha modificado el usuario Correctamente", "type" => "s");
            }else{
                $respuesta = array("error" => "No se ha modificado el usuario Correctamente", "type" => "e");
            }
            echo json_encode($respuesta);
        }else{
            echo json_encode(array('error' => 'Error el usuario: '.$rspta->data->login.' ya existe', 'type' => 'e'));          
        }
    }	
 ?>