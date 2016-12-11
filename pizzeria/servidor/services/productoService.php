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

		$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->local'");

		$producto = $crud->select("*", "locales_productos", "descripcion = '$objRecibido->descripcion' AND id_local = '$idLocal->id'");
		// Si existe un producto con esa descripción en ese local devuelve error
		if ($producto != null) {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		else {
			
			// inserta el nuevo local
			if($crud->insert("locales_productos", "id_local, descripcion, ingredientes, precio", "'$idLocal->id', '$objRecibido->descripcion', '$objRecibido->ingredientes', '$objRecibido->precio'")) {

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
    	
    	$producto = $crud->select("*", "locales_productos", "id = '$objRecibido->idProducto'");

		if ($producto != false && $producto != null) {

			if ($producto->estado == 1) {
				$producto->estado = 0;
			}
			else {
				$producto->estado = 1;
			}

	    	if ($crud->update("locales_productos", "estado = '$producto->estado'", "id = '$objRecibido->idProducto'")) {
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
	
		$producto = $crud->select("*", "locales_productos", "id = '$objRecibido->id'");
		// Si no existe el elemento o esta en estado 0
		if ($producto == null || $producto == false || $producto == '') {
			$respuesta['mensaje'] = 'error. no existe el producto';
			echo json_encode($respuesta);
		}
		else {

			// Actualiza 
			$crud->update("locales_productos", "descripcion = '$objRecibido->descripcion', ingredientes = '$objRecibido->ingredientes', precio = '$objRecibido->precio'", "id = '$objRecibido->id'");

			$respuesta['mensaje'] = 'ok';
			echo json_encode($respuesta);
			
		}
		break;	

	case 'listado':
		
		// Para la grilla de productos
		if ($objRecibido->filtro == "grilla") {
		 
			if ($objRecibido->rolUsuario == 'admin') {
				$campos = 'locales_productos.*, locales.nombre AS local';
				$tablas = 'locales_productos, locales';
				$condiciones = 'locales_productos.id_local = locales.id';
			}
			if ($objRecibido->rolUsuario != 'admin' && $objRecibido->localActual != '') {
				$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->localActual'");

				$campos = 'locales_productos.*, locales.nombre AS local';
				$tablas = 'locales_productos, locales';
				$condiciones = 'locales_productos.id_local = locales.id AND locales_productos.id_local = $idLocal->id';
			}
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
		
		$listaElementos = $crud->selectList("*", "productos_fotos", "id_producto = '$objRecibido->idProducto'");
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
    	
    	$foto = $crud->select("*", "productos_fotos", "id = '$objRecibido->idFoto'");

		if ($foto != false && $foto != null) {

			if ($foto->estado == 1) {
				$foto->estado = 0;
			}
			else {
				$foto->estado = 1;
			}

	    	if ($crud->update("productos_fotos", "estado = '$foto->estado'", "id = '$objRecibido->idFoto'")) {
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
			
				$nombreFoto = $objRecibido->idProducto.'-'.$fechaActual.'-'.$i.'.'.$extension;
				$archivoImagen = '../img/productos/'.$nombreFoto;
			
				file_put_contents($archivoImagen, $Base64Img);

				// inserta nombre de foto subida
				$crud->insert("productos_fotos", "id_producto, foto", "'$objRecibido->idProducto', '$nombreFoto'");
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