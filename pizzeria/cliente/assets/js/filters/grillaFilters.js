angular.module('miSitio')
.filter('estadoFilter', function () {
	var estado = {
		'0': 'Activo',
		'1': 'Inactivo'
	}
  return function (input) {  
    return sexo[input];
  };
});
