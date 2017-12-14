<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
    /*, CASE WHEN USU.estado = 1 THEN 'bell-blue' ELSE 'bell-red' END AS style */
    $q = "SELECT 
        USU.id_usuario, USU.login, USU.nombres, USU.apellidos, LDP.ldap_val, PR.perfil, USU.email, USU.estado
        FROM usuario USU
        INNER JOIN perfiles PR ON PR.id_perfil = USU.id_perfil
        INNER JOIN ldap LDP ON LDP.id_ldap = USU.id_ldap
        ORDER BY 1 ASC";

	$stmt = $dbh->prepare($q);
	$stmt->execute();
	$r = $stmt->fetchAll(PDO::FETCH_ASSOC);	

	echo json_encode($r);
 ?>