<?php
	require_once('config/mysql.php');
	require_once ('config/config.php');

	$db  = new dbConnect();
	$dbh = $db->conectardb();
	$rspta = json_decode(file_get_contents("php://input"));

	/*=============================== INGRESAR DATA PARAMETRO '2G' ================*/
	$valores = [];

	$q="SELECT 
	 	latitud, longitud 
	 	FROM sitio";
		$stmt = $dbh->prepare($q);
		$stmt->execute();
		$r = $stmt->fetch(PDO::FETCH_ASSOC);

		// var_dump($r);

		$longitud1= $r['longitud'];
		$latitud1= $r['latitud'];

		$longitud2= -76.9710877;
		$latitud2= -12.1063476;

		function Calculardistancia($lo1, $la1, $lo2, $la2){

			$rad = M_PI / 180;

			$dlat = $la2 - $la1;
			$dlong = $lo2 - $lo1;
			$radio = 6378.1;

			$a = (sin($rad * $dlat/2))**2 + (cos($rad * $la1) * cos($rad * $la2) * (sin($rad * $dlong/2))**2 );
			$distancia = 2 * $radio * asin(sqrt($a));

			return $distancia;

		}

		function CaclularAngulo($lon1, $lat1, $lon2, $lat2){
			$lat1 = deg2rad($lat1); $lon1 = deg2rad($lon1);
			$lat2 = deg2rad($lat2); $lon2 = deg2rad($lon2);
			$dlat = $lat2-$lat1; // delta
			$dlon = $lon2-$lon1; // delta
			$bearing = atan2( ( sin($dlon)* cos($lat2)) , ( cos($lat1)* sin($lat2) -  sin($lat1) * cos($lat2)* cos($dlon)) );

			$bearing = rad2deg($bearing);
			if ($bearing < 0) { $bearing += 360; }
			return (round(1000 * $bearing) / 1000);
		}

		$cal = Calculardistancia($longitud1, $latitud1, $longitud2, $latitud2);

		$calangular = CaclularAngulo($longitud1, $latitud1, $longitud2, $latitud2);

		var_dump($calangular);

		var_dump(ROUND($cal, 3));
		$anguloapertura = 30;
		$arrayangulos = array('a1' => 30, 'a2' => 276, 'a3' => 178);
		$arrayangulosComp = array('a1' => 46, 'a2' => 356, 'a3' => 280);
		
		function CalcularCuandrante($angulo){
			if (0 <= $angulo && $angulo < 90) {
				return 1;
			}elseif(90 <= $angulo && $angulo < 180){
				return 2;
			}elseif(180 <= $angulo && $angulo < 270){
				return 3;
			}elseif(270 <= $angulo && $angulo < 360){
				return 4;
			}
		}

		// var_dump($arrayangulos);

		function CalcularIntersenccion($angulo, $acomp, $anguloscomp, $apertura){
			$calcAnguloComp = CalcularCuandrante($acomp);
			foreach ($angulo as $key => $angulonew) {
				$calcAngulo = CalcularCuandrante($angulonew);
				if ($calcAngulo == 1 && $calcAnguloComp == 1) {
					if ($calcAngulo - $apertura < $calcAnguloComp && $calcAnguloComp < $calcAngulo + $apertura) {
						var_dump("los tres angulos se intersectan");
					}elseif($calcAnguloComp > $calcAnguloComp < $calcAngulo + $apertura){
						foreach ($anguloscomp as $key => $anguloslow) {
							$complemento = $anguloslow + 90;
							if ($complemento > $angulonew) {
								var_dump($anguloslow.', angulo no se intersecta');
							}
						}
					}
				}
			}
		}

	// foreach ($rspta as $key => $value) {
	// 	$hojas = $value->hoja;
	// 	$headers = $value->header;
	// 	$datas = $value->data;

	// 	if ($hojas == 'DF2G') {

	// 		$codigo_sitio = 'BTS_ID';
	// 		$nombre_sitio = 'BTS_NAME';
	// 		$latitud = 'Latitude';
	// 		$longitud = 'Longitude';
	// 		$q="INSERT INTO 
	// 	 		sitio
	// 	 		(codigo_sitio, nombre_sitio, latitud, longitud, estado)
	// 	 		VALUES (:codigo_sitio, :nombre_sitio, :latitud, :longitud, 1)";
	// 		$stmt = $dbh->prepare($q);
	// 		$stmt->bindParam(':codigo_sitio', $datas[0]->$codigo_sitio, PDO::PARAM_STR);
	// 		$stmt->bindParam(':nombre_sitio', $datas[0]->$nombre_sitio, PDO::PARAM_STR);
	// 		$stmt->bindParam(':latitud', $datas[0]->$latitud, PDO::PARAM_STR);
	// 		$stmt->bindParam(':longitud', $datas[0]->$longitud, PDO::PARAM_INT);
	// 		$res = $stmt->execute();

	// 		foreach ($datas as $key => $data) {

	// 			$cid = "CID (Local Cell ID)";

	// 			$valores = get_object_vars($data);
	// 			$head_name = array_keys($valores);

	// 			$q="INSERT INTO 
	// 	 		sectores
	// 	  		(codigo_sector, estado, codigo_sitio, id_tecnologia)
	// 	  		VALUES (:codigo_sector, 1, 4809, 1)";
	// 			$stmt = $dbh->prepare($q);
	// 			$stmt->bindParam(':codigo_sector', $data->$cid, PDO::PARAM_STR);
	// 			$stmt->execute();
				
	// 			$lastId = $data->$cid;


	// 			foreach ($head_name as $key => $head) {

	// 				$order   = array("\r\n", "\n", "\r");
	// 				$head = str_replace($order, " ", $head);
					
	// 				$q="SELECT 
	// 			 	id_parametro, id_tipodato
	// 			 	FROM parametros 
	// 			 	WHERE UPPER(nombre_parametro) = UPPER(:nombre_parametro)";
	// 				$stmt = $dbh->prepare($q);
	// 				$stmt->bindParam(':nombre_parametro', $head, PDO::PARAM_STR);
	// 				$stmt->execute();
	// 				$r = $stmt->fetch(PDO::FETCH_ASSOC);

	// 				// var_dump($head);
	// 				// var_dump($r['id_parametro']);

	// 				if ($r['id_tipodato'] == 1) {
	// 					$colum = "valstr";
	// 				}else{
	// 					$colum = "valnum";
	// 				}

	// 				$q="INSERT INTO 
	//  				valores
	// 		 		($colum, id_parametro, codigo_sector)
	// 		 		VALUES (:valor, :id_parametro, :codigo_sector)";
	// 				$stmt = $dbh->prepare($q);
	// 				$stmt->bindParam(':valor', $data->$head, PDO::PARAM_STR);
	// 				$stmt->bindParam(':id_parametro', $r['id_parametro'], PDO::PARAM_STR);
	// 				$stmt->bindParam(':codigo_sector', $lastId, PDO::PARAM_STR);
	// 				$stmt->execute();
	// 				$res = $stmt->fetch(PDO::FETCH_ASSOC);
	// 			}
	// 		}
	// 	}
	// 	else if ($hojas == 'DF3G') {

	// 		$codigo_sitio = 'NODEB ID';
	// 		$nombre_sitio = 'NODE B NAME';
	// 		$latitud = 'Latitude';
	// 		$longitud = 'Longitude';

	// 		$codigo_sitio = $datas[0]->$codigo_sitio;
			
	// 		// $q="INSERT INTO 
	// 	 // 		sitio
	// 	 // 		(codigo_sitio, nombre_sitio, latitud, longitud, estado)
	// 	 // 		VALUES (:codigo_sitio, :nombre_sitio, :latitud, :longitud, 1)";
	// 		// $stmt = $dbh->prepare($q);
	// 		// $stmt->bindParam(':codigo_sitio', $datas[0]->$codigo_sitio, PDO::PARAM_STR);
	// 		// $stmt->bindParam(':nombre_sitio', $datas[0]->$nombre_sitio, PDO::PARAM_STR);
	// 		// $stmt->bindParam(':latitud', $datas[0]->$latitud, PDO::PARAM_STR);
	// 		// $stmt->bindParam(':longitud', $datas[0]->$longitud, PDO::PARAM_INT);
	// 		// $stmt->execute();
	// 		// $res = $stmt->fetch(PDO::FETCH_ASSOC);

	// 		foreach ($datas as $key => $data) {

	// 			$cid = "SECTOR ID";
	// 			$portadora = "CARRIER ID";

	// 			$valores = get_object_vars($data);
	// 			$head_name = array_keys($valores);

	// 			$q="INSERT INTO 
	// 	 		sectores
	// 	  		(codigo_sector, estado, codigo_sitio, id_tecnologia)
	// 	  		VALUES (:codigo_sector, 1, :codigo_sitio, 2)";
	// 			$stmt = $dbh->prepare($q);
	// 			$stmt->bindParam(':codigo_sector', $data->$cid, PDO::PARAM_STR);
	// 			$stmt->bindParam(':codigo_sitio', $codigo_sitio, PDO::PARAM_STR);
	// 			$stmt->execute();
				
	// 			$lastId = $data->$cid;

	// 			$id_portadora = $data->$portadora;

	// 			$q="INSERT INTO 
	// 	 		portadoras
	// 	  		(portadora, codigo_sector)
	// 	  		VALUES (:codigo_sector, :id_portadora)";
	// 			$stmt = $dbh->prepare($q);
	// 			$stmt->bindParam(':codigo_sector', $data->$cid, PDO::PARAM_STR);
	// 			$stmt->bindParam(':id_portadora', $id_portadora, PDO::PARAM_STR);
	// 			$stmt->execute();


	// 			foreach ($head_name as $key => $head) {

	// 				$order   = array("\r\n", "\n", "\r");
	// 				$head = str_replace($order, " ", $head);
					
	// 				$q="SELECT 
	// 			 	id_parametro, id_tipodato
	// 			 	FROM parametros 
	// 			 	WHERE UPPER(nombre_parametro) =  UPPER(:nombre_parametro)";
	// 				$stmt = $dbh->prepare($q);
	// 				$stmt->bindParam(':nombre_parametro', $head, PDO::PARAM_STR);
	// 				$stmt->execute();
	// 				$r = $stmt->fetch(PDO::FETCH_ASSOC);

	// 				if ($r['id_tipodato'] == 1) {
	// 					$colum = "valstr";
	// 				}else{
	// 					$colum = "valnum";
	// 				}

	// 				$q="INSERT INTO 
	//  				valores
	// 		 		($colum, id_parametro, codigo_sector)
	// 		 		VALUES (:valor, :id_parametro, :codigo_sector)";
	// 				$stmt = $dbh->prepare($q);
	// 				$stmt->bindParam(':valor', $data->$head, PDO::PARAM_STR);
	// 				$stmt->bindParam(':id_parametro', $r['id_parametro'], PDO::PARAM_STR);
	// 				$stmt->bindParam(':codigo_sector', $lastId, PDO::PARAM_STR);
	// 				$stmt->execute();
	// 				$res = $stmt->fetch(PDO::FETCH_ASSOC);
	// 			}
	// 		}
	// 	}
	// }



	/*===================== INGRESAR PARAMETROS POR TECNOLOGIA ==================*/

	// foreach ($rspta as $key => $value) {
	// 	$hoja = $value->hoja;
	// 	$header = $value->header;
	// 	$data = $value->data;

	// 	$tecnologia = substr($hoja, 2);

	// 	$q="INSERT INTO 
	// 	hojas_datafill 
	// 	(descripcion, estado, nombre_excel)
	// 	VALUES (:tecnologia, 1, :hoja)";
	// 	$stmt = $dbh->prepare($q);
	// 	$stmt->bindParam(':hoja', $hoja, PDO::PARAM_STR);
	// 	$stmt->bindParam(':tecnologia', $tecnologia, PDO::PARAM_STR);
	// 	$stmt->execute();
	// 	$r = $stmt->fetch(PDO::FETCH_ASSOC);
	// 	$lastIdHoja = $dbh->lastInsertId();
	// 	var_dump($lastIdHoja);

	// 	$q="SELECT 
	// 	id_tecnologia 
	// 	FROM tecnologia 
	// 	WHERE nombre_tecnologia = :tecnologia";
	// 	$stmt = $dbh->prepare($q);
	// 	$stmt->bindParam(':tecnologia', $tecnologia, PDO::PARAM_STR);
	// 	$stmt->execute();
	// 	$r = $stmt->fetch(PDO::FETCH_ASSOC);

	// 	$id_tecnologia = $r['id_tecnologia'];

	// 	foreach ($header as $key => $value) {

	// 		$tipo_dato;
	// 		$dato_des = $data[0]->$value;
	// 		if (is_numeric($dato_des) == true) {
	// 			if (strpos($dato_des, '.') != false) {
	// 				$tipo_dato = 3;
	// 			}else{
	// 				$tipo_dato = 2;
	// 			}
	// 		}else{
	// 			$tipo_dato = 1;
	// 		}

	// 		$order   = array("\r\n", "\n", "\r");
	// 		$value = str_replace($order, " ", $value);

	// 		$q="INSERT INTO 
	// 		parametros
	// 		(nombre_parametro, estado, nombre_excel, id_tecnologia, id_tipodato)
	// 		VALUES (:parametro, 1 , :nombre_excel, :id_tecnologia, :tipo_dato)";
	// 		$stmt = $dbh->prepare($q);
	// 		$stmt->bindParam(':parametro', $value, PDO::PARAM_STR);
	// 		$stmt->bindParam(':nombre_excel', $value, PDO::PARAM_STR);
	// 		$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
	// 		$stmt->bindParam(':tipo_dato', $tipo_dato, PDO::PARAM_INT);
	// 		$stmt->execute();
	// 		$res = $stmt->fetch(PDO::FETCH_ASSOC);
	// 		$lastId = $dbh->lastInsertId();

	// 		$q="INSERT INTO
	// 		parametro_x_hoja
	// 		(id_hoja, id_parametro, estado)
	// 		VALUES 
	// 		(:id_hoja, :id_parametro, 1)";
	// 		$stmt = $dbh->prepare($q);
	// 		$stmt->bindParam(':id_parametro', $lastId, PDO::PARAM_STR);
	// 		$stmt->bindParam(':id_hoja', $lastIdHoja, PDO::PARAM_STR);
	// 		$r = $stmt->execute();	
	
	// 	}
	// }

	/*=============================== INGRESAR PARAMETRO X HOJA ================*/

	// $id_tecnologia = 3;

	// $q="SELECT 
	// id_parametro
	// FROM parametros
	// WHERE id_tecnologia = :id_tecnologia and id_parametro <> 203";
	// $stmt = $dbh->prepare($q);
	// $stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
	// $stmt->execute();
	// $r = $stmt->fetchAll(PDO::FETCH_ASSOC);


	// foreach ($r as $key => $value) {
	// 	$id_parametro = $value['id_parametro'];

	// 	$q="INSERT INTO
	// 	parametro_x_hoja
	// 	(id_hoja, id_parametro, estado)
	// 	VALUES 
	// 	(:id_tecnologia, :id_parametro, 1)";
	// 	$stmt = $dbh->prepare($q);
	// 	$stmt->bindParam(':id_parametro', $id_parametro, PDO::PARAM_STR);
	// 	$stmt->bindParam(':id_tecnologia', $id_tecnologia, PDO::PARAM_STR);
	// 	$r = $stmt->execute();		
		
	// }
?>