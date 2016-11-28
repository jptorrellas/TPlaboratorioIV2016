angular.module('miSitio')
  
.controller('SimpleCtrl', function($scope, $rootScope, $state, $auth, growl, i18nService, uiGridConstants, usuarioService, usuarioFactory, urlFactory) {
    // Objeto de configuracion de la grilla.
    $scope.gridOptions = {
      // Configuracion para exportar datos.
      exporterCsvFilename: 'misdatos.csv',
      // exporterCsvColumnSeparator: ',',
      exporterPdfDefaultStyle: {fontSize: 9},
      exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
      exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
      exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
      exporterPdfFooter: function ( currentPage, pageCount ) {
        return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
      },
      exporterPdfCustomFormatter: function ( docDefinition ) {
        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        return docDefinition;
      },
      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'LETTER',
      exporterPdfMaxGridWidth: 500,
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
      }
    };
    $scope.gridOptions.enableGridMenu = true;
    $scope.gridOptions.selectAll = true;

    $scope.gridOptions.enableCellEdit = true;
    // Configuracion de la paginacion
    $scope.gridOptions.paginationPageSizes = [25, 50, 75];
    $scope.gridOptions.paginationPageSize = 25;

    $scope.gridOptions.columnDefs = columnDefs();
    // Activo la busqueda en todos los campos.
    $scope.gridOptions.enableFiltering = true;
    // Configuracion del idioma.
    // i18nService.setCurrentLang('es');





   //  $scope.traerTodo = function() {
   //  	$scope.traerTodoData = { accion: 'listado' };
    
	  //   usuarioService.listado($scope.traerTodoData)
	  //   .then( 
	  //     function(respuesta) { 
	  //       if (respuesta.estado == true) {
	  //         $scope.gridOptions.data = respuesta.datos;
	  //         console.log($scope.gridOptions.data);
	  //       }
	  //       else {
	  //         growl.error(respuesta.mensaje, {ttl: 3000}); 
	  //       }
	  //     }
	  //   );
  	// };
  	// $scope.traerTodo();
    
    $scope.gridOptions.data = 
    [
      {id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:1, nombre:"juan", email:"1@1.com"},{id:2, nombre:"pedro", email:"2@1.com"}
    ]; 




  	function columnDefs () {
      return [
        { field: 'id', name: '#'},
        
        { field: 'nombre', name: 'nombre'
          ,enableFiltering: false
        },
        { field: 'email', name: 'email' }
        
        // { field: 'password', name: 'password', width: 150
        //   ,type: 'date'
        //   ,cellFilter: "date: 'dd-MM-yyyy'"
        // },
        // { field: 'avatar',  name: 'avatar', cellTemplate:"<img width=\"50px\" ng-src=\"{{grid.getCellValue(row, col)}}\" lazy-src>",width: 70
        //   ,type: 'text'
        //   ,cellFilter: "date: 'dd-MM-yyyy'"
        // },
        //  { field: 'foto',  name: 'foto', cellTemplate:"<img width=\"30px\" ng-src=\"{{grid.getCellValue(row, col)}}\" lazy-src>",width: 70
        //   ,type: 'text'
        // },
        // { field: 'sueldoPretendido',  name: 'sueldoPretendido',width: 180 
        //   ,type: 'text'
        // },
        // { width: 100, cellTemplate:"<button ng-Click='grid.appScope.MostrarData(row.entity)'>MOSTRAR", name:"MostrarLongitud"
         
        // } ,{ width: 100, cellTemplate:"<button ng-Click='grid.appScope.Amigos(row.entity)'>Mostrar Amigos", name:"MostrarAmigos"
         
        // },{ width: 100, cellTemplate:"<button ng-Click='grid.appScope.GpsAmigos(row.entity)'>GPS Amigos", name:"GpsAmigos"
         
        // }
         


      ];
    };
  
});
