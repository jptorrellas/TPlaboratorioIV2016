<?php 
/**
*************************************
* WEB SERVICE                       *
*************************************
* Version: 1.0.2                    *
* Fecha:   09/11/2016               *
* Autor:   Juan Pablo Torrellas     *
*************************************
*/	
	
// Incluye todos los archivos necesarios
require_once('../ws/includeAll.php');

// RECIBE PETICION
$jsonObjeto = file_get_contents("php://input");

$objRecibido = json_decode($jsonObjeto);

// Array que se utilizará para devolver mensaje y data al cliente
$respuesta = [];
$respuesta['mensaje'] = '';
$respuesta['datos'] = '';

// Instancia un objeto Crud
$crud = new Crud;
/**
 * AYUDA FUNCIONES CRUD: tODOS LOS PARAMETROS SON STRING
 * 
 * insert($tabla, $campos, $valores)
 * select($campos, $tabla, $condiciones)
 * selectList($campos, $tabla, $condiciones)
 * selectJoin($campos, $tabla1, $tabla2, $condiciones)
 * update($tabla, $camposYvalores, $condiciones)
 * delete($tabla, $condiciones)
*/

switch ($objRecibido->accion) {
	
	case 'login':

		$usuario = $crud->select("*", "usuarios", "email = '$objRecibido->email' && password = '$objRecibido->password' && estado = 1");

		if ($usuario != false && $usuario != null) {
			// Guarda el registro del login
			// $crud->insert("registro_logins", "id_usuario, dispositivo_usuario", "'$usuario->id', '$objRecibido->dispositivo'");
			// Trae la descripción del rol
			$rolDescripcion = $crud->select("descripcion", "roles", "id = '$usuario->id_rol'");

			// Si es empleado o encargado trae a que local pertenece
			$local = null;
			if ($rolDescripcion->descripcion == 'encargado' || $rolDescripcion->descripcion == 'empleado') {
				$local = $crud->select("locales.nombre", "usuarios, locales, locales_plantilla", "usuarios.id = locales_plantilla.id_usuario AND locales_plantilla.id_local = locales.id");
			}

			// TOKEN
			$key = 'miToken';
			$token = array(
				"id" => $usuario->id,
				"nombre" => $usuario->nombre,
				"apellido" => $usuario->apellido,
				"tel" => $usuario->tel,
				"email" => $usuario->email,
				"password" => $usuario->password,
				"rol" => $rolDescripcion->descripcion,
				"foto" => $usuario->foto,
				"exp" => time() + 900
				// "iat" => 1356999524,
				// "nbf" => 1357000000
			);
			if ($local != false && $local != null) { 
				$token["local"] = $local->nombre;
			}
			else {
				$token["local"] = 'Sin Local';
			}

			$jwt = Firebase\JWT\JWT::encode($token, $key, 'HS256');

			$array['miToken'] = $jwt;
			echo json_encode($array);
				
		}
		else {
			echo "401";
		}
		break;

	case 'recuperaPassword':
		
		$usuario = $crud->select( "*", "usuarios", "email = '$objRecibido->email' && estado = 1");

		if ($usuario != null && $usuario != false) {					
			// ENVIO MAIL
			
			// Varios destinatarios
			$para  = $usuario->email; //. ', '; // atención a la coma
			// $para .= 'wez@example.com';
			
			// título
			$titulo = 'SISTEMA DE TORRELLAS: RECUPERACION PASSWORD';

			// mensaje
			$mensaje = '

			*****************************
			*   PIZZERIAS ARGENTA SRL   *
			*****************************
			
			SERVICIO DE RECUPERACION DE PASSWORD  

			**
			*   Datos de usuario:
			*
			*	E-mail:    '.$usuario->email.'
			*	Password:  '.$usuario->password.'
			**
			      
			Gracias por utilizar el sistema.
			Ante cualquier problema, duda o sugerencia no dudes en consultarnos.
			e-mail: jp.torrellas@gmx.com
			
			';

			mail($para, $titulo, $mensaje);

			$respuesta['mensaje'] = 'ok';
			echo json_encode($respuesta);
		}
		else {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		break;

	case 'alta':
		
		ini_set('date.timezone','America/Buenos_Aires'); 
		$fechaActual = date("Y-m-d_H-i-s");
	

		$usuario = $crud->select("*", "usuarios", "email = '$objRecibido->email'");
		// Si existe un usuario con ese mail devuelve un error
		if ($usuario != null) {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		else {
			
			// trae descricion de rol
			$idRol = $crud->select("id", "roles", "descripcion = '$objRecibido->rol'");

			if($crud->insert("usuarios", "nombre, apellido, email, tel, password, id_rol, fecha_alta", "'$objRecibido->nombre', '$objRecibido->apellido', '$objRecibido->email', '$objRecibido->tel', '$objRecibido->password1', '$idRol->id', '$fechaActual'")) {

				// Trae el usuario creado
				$usuarioCreado = $crud->select("id", "usuarios", "email = '$objRecibido->email'");

				// Si el usuario es de tipo encargado
				if ($objRecibido->rol == 'encargado' ) {
					// trae id de local
					$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->local'");
					
					$crud->update("locales_plantilla", "id_usuario = '$usuarioCreado->id', estado = 1", "id_local = '$idLocal->id' AND id_rol = 2");
				}

				// Si el usuario es de tipo empleado
				if ($objRecibido->rol == 'empleado' ) {
					// trae id de local
					$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->local'");
					
					$crud->insert("locales_plantilla", "id_local, id_usuario, id_rol", "'$idLocal->id', '$usuarioCreado->id', 3");
				}

				if (isset($objRecibido->foto) && $objRecibido->foto != null && $objRecibido->foto != '') {
					
					// Obtiene extension del archivo a subir
					//$extension = explode("/", $objRecibido->foto[0]->filetype);
					//$extension = $extension[1];
					//$Base64Img = base64_decode($objRecibido->foto[0]->base64);
					
					$array = explode(',', $objRecibido->foto);
					$objRecibido->foto = $array[1];
					
					$extension = 'png';
					$Base64Img = base64_decode($objRecibido->foto);
					
					$nombreFoto = $usuarioCreado->id.'-'.$fechaActual.'.'.$extension;
					$archivoImagen = '../img/usuarios/'.$nombreFoto;
					
					file_put_contents($archivoImagen, $Base64Img);

					// inserta nombre de foto subida
					$crud->update("usuarios", "foto = '$nombreFoto'", "id = '$usuarioCreado->id'");
				}

				$respuesta['mensaje'] = 'ok';
				echo json_encode($respuesta);
			}
			else {
				
				$respuesta['mensaje'] = 'error';
				echo json_encode($respuesta);
				
			}
		}
		break;

	case 'cambiaEstado':
    	
    	$usuario = $crud->select("*", "usuarios", "id = '$objRecibido->idUsuario'");

		if ($usuario != false && $usuario != null) {

			if ($usuario->estado == 1) {
				$usuario->estado = 0;
			}
			else {
				$usuario->estado = 1;
			}

	    	if ($crud->update("usuarios", "estado = '$usuario->estado'", "id = '$objRecibido->idUsuario'")) {
	    		
	    		// Busca si el usuario esta registrado como encargado o empleado
	    		$localesPlantillaUsuario = $crud->select("*", "locales_plantilla", "id_usuario = '$objRecibido->idUsuario'");

	    		if ($localesPlantillaUsuario != false && $localesPlantillaUsuario != null) {
	    		
	    			$crud->update("locales_plantilla", "estado = '$usuario->estado'", "id_usuario = '$objRecibido->idUsuario'");
	    		}

	    		$respuesta['mensaje'] = 'ok';
				echo json_encode($respuesta);
	    	}
	    	else {
	    		$respuesta['mensaje'] = 'error';
				echo json_encode($respuesta);
	    	}
	    }
	    else {
	    	$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
	    }

    	break;

	case 'modificacion':
		
		ini_set('date.timezone','America/Buenos_Aires'); 
		$fechaActual = date("Y-m-d_H-i-s");
	

		$usuario = $crud->select("*", "usuarios", "id = '$objRecibido->id' && estado = 0");
		// Si no existe el usuario o esta en estado 0
		if ($usuario != null) {
			$respuesta['mensaje'] = 'error. no existe el usuario';
			echo json_encode($respuesta);
		}
		else {
			
			// trae id de rol
			$idRol = $crud->select("id", "roles", "descripcion = '$objRecibido->rol'");

			// Si no actualizó la foto
			if ($objRecibido->foto == '') {
				// Actualiza solo datos
				$crud->update("usuarios", "nombre = '$objRecibido->nombre', apellido = '$objRecibido->apellido', email = '$objRecibido->email', tel = '$objRecibido->tel', password = '$objRecibido->password1', id_rol = '$idRol->id'", "id = '$objRecibido->id'");

				// Trae datos actualizados
				$usuarioActualizado = $crud->select("*", "usuarios", "id = '$objRecibido->id'");
				// trae descricion de rol
				$descripcionRol = $crud->select("descripcion", "roles", "id = '$usuarioActualizado->id_rol'");
				$usuarioActualizado->rol = $descripcionRol->descripcion;

				$respuesta['mensaje'] = 'ok';
				$respuesta['datos'] = $usuarioActualizado;
				echo json_encode($respuesta);
			}
			// Si actualizó la foto
			else {

				// Guarda la foto
				$array = explode(',', $objRecibido->foto);
				$objRecibido->foto = $array[1];
				
				$extension = 'png';
				$Base64Img = base64_decode($objRecibido->foto);
				
				$nombreFoto = $objRecibido->id.'-'.$fechaActual.'.'.$extension;
				$archivoImagen = '../img/usuarios/'.$nombreFoto;
				
				file_put_contents($archivoImagen, $Base64Img);

				// Actualiza datos y foto
				$crud->update("usuarios", "nombre = '$objRecibido->nombre', apellido = '$objRecibido->apellido', email = '$objRecibido->email', tel = '$objRecibido->tel', password = '$objRecibido->password1', foto = '$nombreFoto', id_rol = '$idRol->id'", "id = '$objRecibido->id'");
				

				// Trae datos actualizados
				$usuarioActualizado = $crud->select("*", "usuarios", "id = '$objRecibido->id'");
				// trae descricion de rol
				$descripcionRol = $crud->select("descripcion", "roles", "id = '$usuarioActualizado->id_rol'");
				$usuarioActualizado->rol = $descripcionRol->descripcion;

				$respuesta['mensaje'] = 'ok';
				$respuesta['datos'] = $usuarioActualizado;
				echo json_encode($respuesta);
			}
		}

		// Si el usuario es de tipo encargado
		if ($objRecibido->rol == 'encargado' ) {
			// trae id de local
			$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->local'");
			
			$crud->update("locales_plantilla", "id_local = '$idLocal->id', estado = 1", "id_usuario = '$objRecibido->id'");
		}

		// Si el usuario es de tipo empleado
		if ($objRecibido->rol == 'empleado' ) {
			// trae id de local
			$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->local'");
			
			$crud->update("locales_plantilla", "id_local = '$idLocal->id', estado = 1", "id_usuario = '$objRecibido->id'");
		}
		break;	

	case 'listado':
		
		// Para cbo clientes en pantalla pedidos
		if ((isset($objRecibido->filtro) && $objRecibido->filtro == 'cboClientes')) {
			$listaElementos = $crud->selectList("usuarios.*, roles.descripcion as rol", "usuarios, roles", "usuarios.id_rol = roles.id AND roles.descripcion = 'cliente'");
			goto respuesta;
    	}
		

		// Si el usuario es de tipo admin
		if ($objRecibido->rolUsuario == 'admin' || (isset($objRecibido->filtro) && $objRecibido->filtro == 'cboClientes')) {
			$listaElementos = $crud->selectList("usuarios.*, roles.descripcion as rol", "usuarios, roles", "usuarios.id_rol = roles.id AND usuarios.id != '$objRecibido->idUsuario'");
			goto respuesta;
    	}

		// Si el usuario es de tipo encargado
		if ($objRecibido->rolUsuario == 'encargado') {
			$idLocalUsuario = $crud->select("id_local as idLocal", "locales_plantilla", "id_usuario = '$objRecibido->idUsuario' AND id_rol = 2");
			$listaElementos = $crud->selectList("DISTINCT usuarios.*, roles.descripcion as rol", "usuarios, roles, locales_plantilla", "usuarios.id_rol = roles.id AND usuarios.id_rol = 4 AND usuarios.id != '$objRecibido->idUsuario' OR (usuarios.id_rol = roles.id AND usuarios.id_rol = 3 AND usuarios.id IN (SELECT  id_usuario FROM locales_plantilla WHERE id_local = '$idLocalUsuario->idLocal'))");
			goto respuesta;
		}

		// Si el usuario es de tipo empleado
		if ($objRecibido->rolUsuario == 'empleado') {
			$listaElementos = $crud->selectList("DISTINCT usuarios.*, roles.descripcion as rol", "usuarios, roles, locales_plantilla", "usuarios.id_rol = roles.id AND usuarios.id_rol = 4");
			goto respuesta;
		}

		respuesta:
    	if ($listaElementos != null && $listaElementos != false) {

    		// Trae el local al que pertenece el usuario
    		for ($i=0; $i < count($listaElementos); $i++) { 
    			
    			$local = null;
    			$idElemento = $listaElementos[$i]["id"];
				
				if ($listaElementos[$i]["rol"] == "encargado" || $listaElementos[$i]["rol"]  == "empleado") {
					$local = $crud->selectList("locales.nombre AS nombreLocal", "usuarios, locales, locales_plantilla", "'$idElemento' = locales_plantilla.id_usuario AND locales_plantilla.id_local = locales.id");
					if ($local != false && $local != null) {
						$local = $local[0]['nombreLocal'];
					}
					else {
						$local = "Sin local asignado";
					}
					
				}
				else {
					$local = " ";
				}
				$listaElementos[$i]["local"] = $local;
    		}

    		$respuesta['mensaje'] = 'ok';
			$respuesta['datos'] = $listaElementos;
			echo json_encode($respuesta);
    	}
    	else {
    		$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
    	}
		break;

	default:
		echo "error";
		break;
}


?>