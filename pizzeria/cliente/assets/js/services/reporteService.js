angular.module('miSitio')

.service('reporteService', function($http, urlFactory) {
	
	var respuesta = {};

	this.traerTodo = function(data) {

    	return $http.post(urlFactory.wsReporte, data,  { timeout: 10000 })
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
					respuesta.mensaje = "No hay nada para traer";
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

