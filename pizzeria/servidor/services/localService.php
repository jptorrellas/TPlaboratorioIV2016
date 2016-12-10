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
			if($crud->insert("locales", "nombre, direccion, tel, latitud, longitud, estado", "'$objRecibido->nombre', '$objRecibido->direccion', '$objRecibido->tel', '$objRecibido->latitud', '$objRecibido->longitud', 0")) {

				$local = $crud->select("*", "locales", "nombre = '$objRecibido->nombre'");
				
				// Inserta un registro de encargado vacío para ese local y lo pone en estado 0
				$crud->insert("locales_plantilla", "id_local, id_usuario, id_rol, estado", "'$local->id', null, 2, 0");

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
		
		// Para la grilla de locales
		if ($objRecibido->filtro == "grilla") {
		 
			if ($objRecibido->rolUsuario == 'admin') {
				$campos = '*';
				$tablas = 'locales';
				$condiciones = '1';
			}
			if ($objRecibido->rolUsuario == 'encargado' || $objRecibido->rolUsuario == 'empleado') {
				$campos = 'locales.*';
				$tablas = 'locales, locales_plantilla';
				$condiciones = 'locales.id = locales_plantilla.id_local AND '.$objRecibido->idUsuario.' = locales_plantilla.id_usuario AND locales_plantilla.estado = 1';
			}
		}

		// Para el cbo locales en alta/modificacion empleado
		if ($objRecibido->filtro == "cboEmpleado") {
			
			$campos = '*';
			$tablas = 'locales';
			$condiciones = '1';
		}

		// Para el cbo locales en alta/modificacion encargado
		if ($objRecibido->filtro == "cboEncargado") {
			
			$campos = 'locales.*';
			$tablas = 'locales, locales_plantilla';
			$condiciones = 'locales.id = locales_plantilla.id_local AND locales_plantilla.id_rol = 2 AND locales_plantilla.estado = 0';
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

	case 'listadoFotos':
		
		$listaElementos = $crud->selectList("*", "locales_fotos", "id_local = '$objRecibido->idLocal'");
		if ($listaElementos != false && $listaElementos != null) {
    		
    		$respuesta['mensaje'] = 'ok';
			$respuesta['datos'] = $listaElementos;
			echo json_encode($respuesta);
    	}
    	else {
    		$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);	
		}	
		break;

	case 'cambiaEstadoFoto':
    	
    	$foto = $crud->select("*", "locales_fotos", "id = '$objRecibido->idFoto'");

		if ($foto != false && $foto != null) {

			if ($foto->estado == 1) {
				$foto->estado = 0;
			}
			else {
				$foto->estado = 1;
			}

	    	if ($crud->update("locales_fotos", "estado = '$foto->estado'", "id = '$objRecibido->idFoto'")) {
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

    case 'altaFotos':

    	if (isset($objRecibido->fotos) && $objRecibido->fotos != null && count($objRecibido->fotos) > 0) {
					
			ini_set('date.timezone','America/Buenos_Aires'); 
			$fechaActual = date("Y-m-d_H-i-s");

			for ($i=0; $i < count($objRecibido->fotos); $i++) { 
				// Obtiene extension del archivo a subir
				$extension = explode("/", $objRecibido->fotos[$i]->filetype);
				$extension = $extension[1];
				$Base64Img = base64_decode($objRecibido->fotos[$i]->base64);
			
				$nombreFoto = $objRecibido->idLocal.'-'.$fechaActual.'-'.$i.'.'.$extension;
				$archivoImagen = '../img/locales/'.$nombreFoto;
			
				file_put_contents($archivoImagen, $Base64Img);

				// inserta nombre de foto subida
				$crud->insert("locales_fotos", "id_local, foto", "'$objRecibido->idLocal', '$nombreFoto'");
			}

			$respuesta['mensaje'] = 'ok';
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