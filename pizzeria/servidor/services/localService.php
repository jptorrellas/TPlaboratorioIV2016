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

		$local = $crud->select("*", "locales", "nombre = '$objRecibido->nombre'");
		// Si existe un usuario con ese mail devuelve un error
		//  OR (latitud = '$objRecibido->latitud AND longitud = '$objRecibido->longitud)
		if ($local != null) {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		else {
			
			// inserta el nuevo local
			if($crud->insert("locales", "nombre, direccion, tel, latitud, longitud", "'$objRecibido->nombre', '$objRecibido->direccion', '$objRecibido->tel', '$objRecibido->latitud', '$objRecibido->longitud'")) {

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
    	
    	$local = $crud->select("*", "locales", "id = '$objRecibido->idLocal'");

		if ($local != false && $local != null) {

			if ($local->estado == 1) {
				$local->estado = 0;
			}
			else {
				$local->estado = 1;
			}

	    	if ($crud->update("locales", "estado = '$local->estado'", "id = '$objRecibido->idLocal'")) {
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
	
		$local = $crud->select("*", "locales", "id = '$objRecibido->id' && estado = 0");
		// Si no existe el elemento o esta en estado 0
		if ($local != null) {
			$respuesta['mensaje'] = 'error. no existe el local';
			echo json_encode($respuesta);
		}
		else {

			// Actualiza 
			$crud->update("locales", "nombre = '$objRecibido->nombre', direccion = '$objRecibido->direccion', tel = '$objRecibido->tel', latitud = '$objRecibido->latitud', longitud = '$objRecibido->longitud'", "id = '$objRecibido->id'");

			$respuesta['mensaje'] = 'ok';
			echo json_encode($respuesta);
			
		}
		break;	

	case 'listado':
		 
		 if ($objRecibido->usuarioRol == 'admin') {
		 	$campos = '*';
		 	$tablas = 'locales';
		 	$condiciones = '1';
		 }
		 if ($objRecibido->usuarioRol == 'encargado') {
		 	$campos = 'locales.*, locales_encargados.id_local AS locEncIdLoc';
		 	$tablas = 'locales, locales_encargados';
		 	$condiciones = 'locales.id = locales_encargados.id_local AND '.$objRecibido->usuarioId.' = locales_encargados.id_usuario AND locales_encargados.estado = 1';
		 }
		 if ($objRecibido->usuarioRol == 'empleado') {
		 	$campos = 'locales.*';
		 	$tablas = 'locales, locales_encargados';
		 	$condiciones = 'locales.id = locales_empleados.id_local AND $objRecibido->usuarioId = locales_empleados.id_usuario AND locales_empleados.estado = 1';
		 }
		

		$listaElementos = $crud->selectList("$campos", "$tablas", "$condiciones");
    	
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