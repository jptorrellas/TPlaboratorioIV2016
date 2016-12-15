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

	case 'traerLogins':
		 
		$campos = "usuarios.*, logins.fecha as fechaLogin, roles.descripcion as rol";
		$tablas = "usuarios, logins, roles";
		$condiciones = "usuarios.id = logins.id AND usuarios.id_rol = roles.id";

		$logins = $crud->selectList($campos, $tablas, $condiciones);
    	
    	if ($logins != null && $logins != false) {

    		$respuesta['mensaje'] = 'ok';
			$respuesta['datos'] = $logins;
			echo json_encode($respuesta);
    	}
    	else {
    		$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
    	}
		break;

	case 'ventasPorLocal':
		 
		$campos = "DISTINCT locales.id as locId, locales.nombre as locNom";
		$tablas = "locales, pedidos";
		$condiciones = "locales.id = pedidos.id_local AND pedidos.id_estado = 4";

		$localesConPedidos = $crud->selectList($campos, $tablas, $condiciones);
    	
    	if ($localesConPedidos != null && $localesConPedidos != false) {

    		$localesConPedidos = json_decode(json_encode($localesConPedidos));

    		foreach ($localesConPedidos as $localConPedido) {
				$localConPedido->importeTotal = $crud->select( "SUM(pedidos.importe_total) AS importeTotal", "pedidos", "pedidos.id_local = '$localConPedido->locId' AND pedidos.id_estado = 4");
			}
			$localesConPedidos = json_decode(json_encode($localesConPedidos));

    		$respuesta['mensaje'] = 'ok';
			$respuesta['datos'] = $localesConPedidos;
			echo json_encode($respuesta);
    	}
    	else {
    		$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
    	}
		break;

	case 'ventasPorEmpleado':
		 
		$local = $objRecibido->local;

		$idLocal = $crud->select("id", "locales", "nombre = '$objRecibido->local'");

		$campos = "usuarios.*";
		$tablas = "locales_plantilla, usuarios";
		$condiciones = "locales_plantilla.id_usuario = usuarios.id AND locales_plantilla.id_local = '$idLocal->id'";

		$empleados = $crud->selectList($campos, $tablas, $condiciones);
    	
    	if ($empleados != null && $empleados != false) {

    		$empleados = json_decode(json_encode($empleados));

    		// trae pedidos de cada empleado
    		foreach ($empleados as $empleado) {
				$empleado->pedidos = $crud->selectList( "pedidos_plantilla.id_pedido", "pedidos_plantilla", "pedidos_plantilla.id_usuario = '$empleado->id'");
			}
			$empleados = json_decode(json_encode($empleados));

			// trae importe total de pedidos de cada empleado
			foreach ($empleados as $empleado) {
				foreach ($empleado->pedidos as $empleadoPedido) {
					$empleadoPedido->importe = $crud->select( "pedidos.importe_total AS total", "pedidos", "pedidos.id = '$empleadoPedido->id_pedido' AND pedidos.id_estado = 4");
				}
			}
			$empleados = json_decode(json_encode($empleados));
				
    		$respuesta['mensaje'] = 'ok';
			$respuesta['datos'] = $empleados;
			echo json_encode($respuesta);
    	}
    	else {
    		$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
    	}
		break;

	case 'comprasPorCliente':

		$campos = "usuarios.*";
		$tablas = "usuarios, pedidos";
		$condiciones = "usuarios.id = pedidos.id_cliente AND pedidos.id_estado != 5";

		$clientes = $crud->selectList($campos, $tablas, $condiciones);
    	
    	if ($clientes != null && $clientes != false) {

    		$clientes = json_decode(json_encode($clientes));

    		foreach ($clientes as $cliente) {
				$cliente->importeTotal = $crud->select( "SUM(pedidos.importe_total) AS importeTotal", "pedidos", "pedidos.id_cliente = '$cliente->id' AND pedidos.id_estado != 5");
			}
			$clientes = json_decode(json_encode($clientes));
				
    		$respuesta['mensaje'] = 'ok';
			$respuesta['datos'] = $clientes;
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