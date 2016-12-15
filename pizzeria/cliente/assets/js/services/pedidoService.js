angular.module('miSitio')

.service('pedidoService', function($http, urlFactory) {
	
	var respuesta = {};	

	this.alta = function(data) { 

    	return $http.post(urlFactory.wsPedido, data,  { timeout: 10000 })
    	.then(
  			function(retorno) { 
          // console.log(retorno);			   
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
	    			return respuesta;
    			}
    			if (retorno.data.mensaje == "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "Ya existe un producto con esa descripcion";
    				return respuesta;
    			}
    			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR DESCONOCIDO";
    				return respuesta;	
    			}	
  			},
  			function(error) { 
    			respuesta.estado = false;
    			respuesta.mensaje = "Problema de conexión con el servidor.";
    			return respuesta;
  			}
    	);
	};

	this.cambiaEstado = function(data) {

    	return $http.post(urlFactory.wsPedido, data,  { timeout: 10000 })
    	.then(
  			function(retorno) { 
          // console.log(retorno);        
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
    				respuesta.mensaje = "Cambio de estado ok!";
	    			return respuesta;
    			}
    			else{
    				respuesta.estado = false;
    				respuesta.mensaje = "Hubo un problema al intentar cambiar el estado.";
    				return respuesta;
    			}	
  			},
  			function(error) { 
    			respuesta.estado = false;
    			respuesta.mensaje = "Problema de conexión con el servidor.";
    			return respuesta;
  			}
    	);
	};

	this.modificacion = function(data) { 

    	return $http.post(urlFactory.wsPedido, data,  { timeout: 10000 })
    	.then(
  			function(retorno) { 
  				// console.log(retorno);			   
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
    				respuesta.datos = retorno.data.datos;
	    			return respuesta;
    			}
    			if (retorno.data.mensaje == "error. no existe el producto") {
    				respuesta.estado = false;
    				respuesta.mensaje = "El local que intenta editar ya no existe en el sistema. Por favor actualice la grilla.";
    				return respuesta;
    			}
    			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR DESCONOCIDO";
    				return respuesta;	
    			}	
  			},
  			function(error) { 
    			respuesta.estado = false;
    			respuesta.mensaje = "Problema de conexión con el servidor.";
    			return respuesta;
  			}
    	);
	};

	this.listado = function(data) {

    	return $http.post(urlFactory.wsPedido, data,  { timeout: 10000 })
    	.then(
  			function(retorno) { 
        // console.log(retorno);   
				if (retorno.data.mensaje == "ok") {
					respuesta.estado = true;
	    			respuesta.mensaje = 'Lista actualizada';
	    			respuesta.datos = retorno.data.datos;
	    			return respuesta;
				}

				if (retorno.data.mensaje == "error") {
					respuesta.estado = false;
					respuesta.mensaje = "No hay pedidos para mostrar";
					respuesta.datos = 'error';
					return respuesta;
				}
				if (retorno.data.mensaje != "ok" && retorno.data != "error") {
					respuesta.estado = false;
					respuesta.mensaje = "ERROR DESCONOCIDO";
					respuesta.datos = 'error';
					return respuesta;	
				}	
			},
			function(error) { 
				respuesta.estado = false;
				respuesta.mensaje = "Problema de conexión con el servidor.";
				respuesta.datos = 'error';
				return respuesta;
			}
    	);
	};

});

