angular.module('miSitio')

.factory('urlFactory', function () {
	
	var varServidor         = 'http://localhost/UTN/Github/TPlaboratorioIV2016-Torrellas/pizzeria/servidor/';
	// var varServidor         = 'http://192.168.0.2/UTN/Github/Torrellas.SPLab42016/servidor/';
	var varServices         = 'services/';

	var varImgPerfilUsuario = 'img/usuarios/';
	var varImgProducto      = 'img/productos/';

	var varWsUsuario        =  'usuarioService.php';
	var varWsProducto       =  'productoService.php';
	var varWsLocal       	=  'localService.php';

	return {
 		servidor		 : varServidor,
 		services         : varServidor + varServices,
 		imgPerfilUsuario : varServidor + varImgPerfilUsuario,
 		imgProducto      : varServidor + varImgProducto,
 		wsUsuario        : varServidor + varServices + varWsUsuario,
 		wsProducto       : varServidor + varServices + varWsProducto,
 		wsLocal       	 : varServidor + varServices + varWsLocal
	}
});