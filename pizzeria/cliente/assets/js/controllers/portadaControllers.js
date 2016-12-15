angular.module('miSitio')

.controller('PortadaCtrl', function($scope, $state, growl, portadaService, usuarioFactory, urlFactory) {

  $scope.traerTodo = function() {
    $scope.traerTodoData = { accion: 'traerTodo' };
    
    portadaService.traerTodo($scope.traerTodoData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.locales = respuesta.datos;
          $scope.origen = $scope.locales[0].locDir;
          $scope.destino = $scope.locales[0].locDir;
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };
  $scope.traerTodo();
  
  
  $scope.urlImgLocal = urlFactory.imgLocal;
  $scope.urlImgProducto = urlFactory.imgProducto;
  $scope.argentaIcon = urlFactory.iconoArgenta;
  $scope.myInterval = 3000;

  
  $scope.getpos = function(event){
    $scope.destino = String([event.latLng.lat(), event.latLng.lng()]);
  };

  $scope.onLoad = function() {
    NgMap.getMap().then(function (map) {
    });
  };

});









