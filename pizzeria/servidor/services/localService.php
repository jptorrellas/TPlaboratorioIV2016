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

			if($crud->insert("usuarios", "nombre, apellido, email, tel, password, id_rol, fecha_alta", "'$objRecibido->nombre', '$objRecibido->apellido', '$objRecibido->email', '$objRecibido->telefono', '$objRecibido->password1', '$idRol->id', '$fechaActual'")) {

				$usuarioCreado = $crud->select("id", "usuarios", "email = '$objRecibido->email'");

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

	case 'cambioEstado':
    	
    	$usuario = $crud->select("*", "usuarios", "id = '$objRecibido->idUsuario'");

		if ($usuario != false && $usuario != null) {

	    	if ($crud->update("usuarios", "estado = '$objRecibido->estado'", "id = '$objRecibido->idUsuario'")) {
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
				$crud->update("usuarios", "nombre = '$objRecibido->nombre', email = '$objRecibido->email', password = '$objRecibido->password1', id_rol = '$idRol->id'", "id = '$objRecibido->id'");

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
				$crud->update("usuarios", "nombre = '$objRecibido->nombre', email = '$objRecibido->email', password = '$objRecibido->password1', foto = '$nombreFoto', id_rol = '$idRol->id'", "id = '$objRecibido->id'");

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
		break;	

	case 'listado':
		 
		$listaElementos = $crud->selectList("*", "locales", "estado = 1");
    	
    	if ($listaElementos != null && $listaElementos != false) {

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