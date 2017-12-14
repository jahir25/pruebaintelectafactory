<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    $rspta = json_decode(file_get_contents("php://input"));
	$LLAVE = LLAVE;

    $sql = "SELECT 1 AS valid FROM usuario WHERE login = :login AND email = :email";
    $stmt = $dbh->prepare($sql);
	$stmt->bindParam(':login', $rspta->login, PDO::PARAM_STR);	
	$stmt->bindParam(':email', $rspta->email, PDO::PARAM_STR);
	$stmt->execute();
	$valid = $stmt->fetch(PDO::FETCH_ASSOC);	
    
    if($valid['valid'] != 1){
        $q="INSERT INTO usuario (login, nombres, apellidos, id_ldap, email, id_perfil, password, estado)
           VALUES(:login, :nombre, :apellido, :LDAP, :email, :perfil, AES_ENCRYPT(:password, :LLAVE), 1)";

        $stmt = $dbh->prepare($q);
        $stmt->bindParam(':login', $rspta->login, PDO::PARAM_STR);
        $stmt->bindParam(':LDAP', $rspta->LDAP, PDO::PARAM_STR);
        $stmt->bindParam(':nombre', $rspta->nombre, PDO::PARAM_STR);
        $stmt->bindParam(':apellido', $rspta->apellido, PDO::PARAM_STR);
        $stmt->bindParam(':password', $rspta->pass, PDO::PARAM_STR);
        $stmt->bindParam(':perfil', $rspta->perfil, PDO::PARAM_STR);
        $stmt->bindParam(':email', $rspta->email, PDO::PARAM_STR);
        $stmt->bindParam(':LLAVE', $LLAVE, PDO::PARAM_STR);
        $r = $stmt->execute();


        if($r == true){
            echo json_encode(array('success' => 'Usuario creado exitosamente', 'type' => 's'));
        }
        else{
            echo json_encode(array('error' => 'Error al crear usuario', 'type' => 'e'));
        }
        
    }else{
        echo json_encode(array('error' => 'Error al crear usuario: '.$rspta->login.' o el usuario ya existe', 'type' => 'e'));
    }
 ?>