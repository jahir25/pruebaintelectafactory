<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    /*LLAVE*/
    $Llave = LLAVE;
    /*PARAMETROS*/
	$login = $_GET['login'];
	$pass = $_GET['pass'];
    /*DESCRYPY*/
    $login = base64_decode($login);
    $pass = base64_decode($pass);
    /*CONSULTA*/
	$csql="SELECT USU.id_usuario, USU.nombres, USU.apellidos, USU.login, COUNT(*) AS VALID, USU.id_perfil
	FROM usuario USU
	WHERE UPPER(USU.login)=UPPER(:login) AND CAST(AES_DECRYPT(USU.password, '$Llave') AS CHAR) = :pass AND USU.estado = 1";
    $stmt = $dbh->prepare($csql);
    $stmt->bindParam(':login', $login, PDO::PARAM_STR);
    $stmt->bindParam(':pass', $pass, PDO::PARAM_STR);
    $stmt->execute();
    $rx = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($rx['VALID'] == 1) {
        if ($rx['id_perfil'] == 1) {
            echo "{\"acceso\":\"true\",\"route\":\"home\"}";
        }else{
            echo "{\"acceso\":\"true\",\"route\":\"homeUser\"}";
        }
    	session_start();
    	$_SESSION['ENTEL_ID_USUARIO'] = $rx['id_usuario'];
    	$_SESSION['ENTEL_NOMBRES'] = $rx['nombres'];
    	$_SESSION['ENTEL_APELLIDOS'] = $rx['apellidos'];
    	$_SESSION['ENTEL_LOGIN'] = $rx['login'];
        $_SESSION['ENTEL_PERFIL'] = $rx['id_perfil'];
    	$_SESSION['ENTEL_SESSION'] = true;
    }else{
		echo "{\"acceso\":\"false\",\"route\":\"login\"}";
    }

 ?>