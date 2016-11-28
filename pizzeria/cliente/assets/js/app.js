
var app = angular.module('miSitio', ['ui.router', 'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.exporter', 'satellizer', 'angular-growl', 'ngImgCrop', 'naif.base64']);


app.run(function($http) {

var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Al objeto $http le establecemos sus propiedades por defecto para utilice los headers que definimos arriba
  $http.defaults.headers.post = defaultHTTPHeaders;
});

app.config(function($stateProvider, $urlRouterProvider, $authProvider)
{
	
  	// Parametros de configuración
	// $authProvider.loginUrl = "http://trexasolutions.com/galle/services/usuarioService.php";
	$authProvider.loginUrl = "http://localhost/UTN/Github/TPlaboratorioIV2016Torrellas/pizzeria/servidor/services/usuarioService.php";
	// $authProvider.loginUrl = "http://192.168.0.2/UTN/Github/Torrellas.SPLab42016/servidor/services/usuarioService.php";

	//$authProvider.signupUrl = "http://api.com/auth/signup";
	$authProvider.tokenName = "miToken";
	$authProvider.tokenPrefix = "login";


	$stateProvider

		.state("login", {
			cache: false,
			url:"/login",
			templateUrl:"templates/login.html",
			controller:"LoginCtrl"
		})

		.state("registro", {
			cache: false,
			url:"/registro",
			templateUrl:"templates/registro.html",
			controller:"RegistroCtrl"
		})


		
		// MENU
		.state('menu', {
			cache: false,
			url: '/menu',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'MenuCtrl'
		})

		//ADMIN
		.state('menu.adminGrillaUsuarios', {
			cache: false,
			url: '/grillaUsuarios',
			views: {
			  'contenido': {
			    templateUrl: 'templates/grillas/grillaUsuarios.html',
			    controller: 'GrillaUsuariosCtrl'
			  }
			}
		})

		.state('menu.adminGrillaLocales', {
			cache: false,
			url: '/grillaLocales',
			views: {
			  'contenido': {
			    templateUrl: 'templates/grillas/grillaLocales.html',
			    controller: 'GrillaLocalesCtrl'
			  }
			}
		})

		//Comprador
		.state('menu.compradorGrillaProductos', {
			cache: false,
			url: '/grillaProductos',
			views: {
			  'contenido': {
			    templateUrl: 'templates/grillas/grillaProductos.html',
			    controller: 'GrillaProductosCtrl'
			  }
			}
		})

		//Vendedor
		.state('menu.vendedorGrillaProductos', {
			cache: false,
			url: '/grillaProductos',
			views: {
			  'contenido': {
			    templateUrl: 'templates/grillas/grillaProductos.html',
			    controller: 'GrillaProductosCtrl'
			  }
			}
		})

		//PRUEBA
		.state('menu.simple', {
			cache: false,
			url: '/simple',
			views: {
			  'contenido': {
			    templateUrl: 'templates/simple.html',
			    controller: 'SimpleCtrl'
			  }
			}
		})


				
			
	$urlRouterProvider.otherwise("/login");
});
