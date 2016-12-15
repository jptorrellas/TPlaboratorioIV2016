angular.module('miSitio')
  
  .directive('portadaDir', function() {

    return {
      scope:{
        locales: '=locales',
        origen: '=origen',
        destino: '=destino',
        urlImgLocal: '@urlImgLocal',
        urlImgProducto: '@urlImgProducto',
        myInterval: '@myInterval',
        argentaIcon: '@argentaIcon'
      },
      replace: true,
      restrict: "E",
      templateUrl: "templates/directivas/dirPortada.html",
      controller: "PortadaCtrl"
    };

  });