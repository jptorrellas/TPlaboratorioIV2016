angular.module('miSitio')

.factory('urlFactory', function () {
	
	var varServidor         = 'http://localhost/UTN/Github/TPlaboratorioIV2016Torrellas/pizzeria/servidor/';
	// var varServidor         = 'http://192.168.0.2/UTN/Github/Torrellas.SPLab42016/servidor/';
	var varServices         = 'services/';

	var varIconoArgenta		= 'img/locales/icono-argenta.png'
	var varImgPerfilUsuario = 'img/usuarios/';
	var varImgLocal      	= 'img/locales/';
	var varImgProducto      = 'img/productos/';

	var varWsUsuario        =  'usuarioService.php';
	var varWsProducto       =  'productoService.php';
	var varWsLocal       	=  'localService.php';
	var varWsPedido       	=  'pedidoService.php';

	return {
 		servidor		 : varServidor,
 		services         : varServidor + varServices,
 		iconoArgenta	 : varServidor + varIconoArgenta,
 		imgPerfilUsuario : varServidor + varImgPerfilUsuario,
 		imgLocal 		 : varServidor + varImgLocal,
 		imgProducto      : varServidor + varImgProducto,
 		wsUsuario        : varServidor + varServices + varWsUsuario,
 		wsProducto       : varServidor + varServices + varWsProducto,
 		wsLocal       	 : varServidor + varServices + varWsLocal,
 		wsPedido       	 : varServidor + varServices + varWsPedido
	}
});