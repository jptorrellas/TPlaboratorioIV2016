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

		$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->local'");

		
			
		// Inserta el pedido
		if($crud->insert("pedidos", "id_local, id_cliente, fecha, importe_total", "'$idLocal->id', '$objRecibido->idCliente', '$fechaActual', '$objRecibido->total'")) {

			// Trae idPedido recien creado
			$idPedido = $crud->select("id", "pedidos", "id_local = '$idLocal->id' AND id_cliente = '$objRecibido->idCliente' AND fecha = '$fechaActual'");

			// Inserta los detalles del pedido
			foreach ($objRecibido->productos as $producto) {
				$crud->insert("pedidos_detalles", "id_pedido, id_producto, precio_unitario, cantidad", "'$idPedido->id', '$producto->id', '$producto->precio', '$producto->cantidad'");
			}

			// Si el pedido lo realizó un empleado lo agrega a pedidos_plantilla
			if ($objRecibido->idEmpleado != null) {
				$crud->insert("pedidos_plantilla", "id_pedido, id_usuario", "'$idPedido->id', '$objRecibido->idEmpleado'");
			}

			

			$respuesta['mensaje'] = 'ok';
			echo json_encode($respuesta);
		}
		else {

			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);	
		}
		break;

	case 'cambiaEstado':
    	
    	$idEstado = $crud->select("id", "pedidos_estados", "descripcion = '$objRecibido->estado'");

    	if ($crud->update("pedidos", "id_estado = '$idEstado->id'", "id = '$objRecibido->idPedido'")) {
    		$respuesta['mensaje'] = 'ok';
			echo json_encode($respuesta);
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
				$campos = "pedidos.*, usuarios.email AS cliente, locales.nombre AS local, pedidos_estados.descripcion AS estado";
				$tablas = "pedidos, usuarios, locales, pedidos_estados";
				$condiciones = "pedidos.id_local = locales.id AND pedidos.id_cliente = usuarios.id AND pedidos.id_estado = pedidos_estados.id";
			}
			if ($objRecibido->rolUsuario == 'empleado' || $objRecibido->rolUsuario == 'encargado') {
				
				$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->localActual'");

				$campos = "pedidos.*, usuarios.email AS cliente, locales.nombre AS local, pedidos_estados.descripcion AS estado";
				$tablas = "pedidos, usuarios, locales, pedidos_estados";
				$condiciones = "pedidos.id_local = '$idLocal->id' AND pedidos.id_local = locales.id AND pedidos.id_cliente = usuarios.id AND pedidos.id_estado = pedidos_estados.id";
			}
			if ($objRecibido->rolUsuario == 'cliente') {

				$campos = "pedidos.*, usuarios.email AS cliente, locales.nombre AS local, pedidos_estados.descripcion AS estado";
				$tablas = "pedidos, usuarios, locales, pedidos_estados";
				$condiciones = "pedidos.id_cliente = '$objRecibido->idUsuario' AND pedidos.id_local = locales.id AND pedidos.id_cliente = usuarios.id AND pedidos.id_estado = pedidos_estados.id";
			}
		}

		$listaElementos = $crud->selectList($campos, $tablas, $condiciones);
    	
    	if ($listaElementos != null && $listaElementos != false) {

    		// agrega detalle de productos a cada pedido de la lista que devuelve
    		$listaElementos = json_decode(json_encode($listaElementos));
    		foreach ($listaElementos as $pedido) {
    			$pedido->productos = $crud->selectList("pedidos_detalles.*, locales_productos.descripcion", "pedidos_detalles, locales_productos", "id_pedido = '$pedido->id' AND pedidos_detalles.id_producto = locales_productos.id");
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

	case 'listadoPedidosEstados':
		
		// Para cboPedidosEstados en la grilla pedidos

		$listaElementos = $crud->selectList("*", "pedidos_estados", "1");
    	
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