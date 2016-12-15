angular.module('miSitio')

.controller('ReportesCtrl', function($scope, $rootScope, $state, $auth, growl, reporteService, usuarioService, usuarioFactory, urlFactory) {



  // Los $rootScope son para que actualice en tiempo real los cambios de Usuario.
  $rootScope.usuarioActual = usuarioFactory.payload;
  $rootScope.usuarioActual.nombre = usuarioFactory.payload.nombre;
  $rootScope.urlImg = urlFactory.imgPerfilUsuario + usuarioFactory.payload.foto;

    
  //   usuarioService.modificacion($scope.editarPerfilData)
  //   .then( 
  //     function(respuesta) {          
  //       if (respuesta.estado == true) {

  //         usuarioFactory.payload = respuesta.datos;
  //         $rootScope.usuarioActual = usuarioFactory.payload;
  //         $rootScope.urlImg = urlFactory.imgPerfilUsuario + usuarioFactory.payload.foto;
  //         growl.success("Edición de perfil ok!", {ttl: 3000});       
  //       }
  //       else {
  //         growl.error(respuesta.mensaje, {ttl: 3000});
  //       }
  //     }
  //   );
  //   $scope.cargaFotoPerfilShow = false;
  // };
 
});









