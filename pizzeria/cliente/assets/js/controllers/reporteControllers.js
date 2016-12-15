angular.module('miSitio')

.controller('ReportesCtrl', function($scope, $rootScope, $state, $auth, growl, i18nService, uiGridConstants, reporteService, localService, usuarioService, usuarioFactory, urlFactory) {

    $scope.usuario = usuarioFactory.payload;
    $scope.localElegido = '';

    $scope.traerCboLocales = function() {

        $scope.traerCboLocalesData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, filtro: 'grilla', accion: 'listado' };
        
        localService.listado($scope.traerCboLocalesData)
        .then( 
            function(respuesta) { 
                if (respuesta.estado == true) {
                  $scope.listaLocales = respuesta.datos;
                  $scope.localElegido = $scope.listaLocales[0].nombre;
                }
                else {
                  growl.error(respuesta.mensaje, {ttl: 3000}); 
                }
            }
        );
    };
    $scope.traerCboLocales();



    $scope.ventasPorLocal = function() {
        reporteService.ventasPorLocal({ accion: 'ventasPorLocal' })
        .then( 
          function(respuesta) {          
            if (respuesta.estado == true) {
                $scope.ventasPorLocalData = respuesta.datos;

                $scope.ventasPorLocalEtiquetas = [];
                $scope.ventasPorLocalValores = [];

                for (var i = $scope.ventasPorLocalData.length - 1; i >= 0; i--) {
                    $scope.ventasPorLocalEtiquetas.push($scope.ventasPorLocalData[i].locNom);
                    $scope.ventasPorLocalValores.push($scope.ventasPorLocalData[i].importeTotal.importeTotal);
                }
            }
            else {
              growl.error(respuesta.mensaje, {ttl: 3000});
            }
          }
        );
    };
    $scope.ventasPorLocal();

    $scope.comprasPorCliente = function() {
        reporteService.comprasPorCliente({ accion: 'comprasPorCliente' })
        .then( 
          function(respuesta) {          
            if (respuesta.estado == true) {
                $scope.comprasPorClienteData = respuesta.datos;

                $scope.comprasPorClienteEtiquetas = [];
                $scope.comprasPorClienteValores = [];

                for (var i = $scope.comprasPorClienteData.length - 1; i >= 0; i--) {
                    $scope.comprasPorClienteEtiquetas.push($scope.comprasPorClienteData[i].email);
                    $scope.comprasPorClienteValores.push($scope.comprasPorClienteData[i].importeTotal.importeTotal);
                }
            }
            else {
              growl.error(respuesta.mensaje, {ttl: 3000});
            }
          }
        );
    };
    $scope.comprasPorCliente();

    $scope.ventasPorEmpleado = function(localElegido) {
        reporteService.ventasPorEmpleado({ local: $scope.localElegido, accion: 'ventasPorEmpleado' })
        .then( 
          function(respuesta) {          
            if (respuesta.estado == true) {
                $scope.ventasPorEmpleadoData = respuesta.datos;

                // recorre empleados
                for (var i = $scope.ventasPorEmpleadoData.length - 1; i >= 0; i--) {                   
                    $scope.ventasPorEmpleadoData[i].ventasTotal = 0;
                    // recorre pedidos
                    for (var z = $scope.ventasPorEmpleadoData[i].pedidos.length - 1; z >= 0; z--) {
                        $scope.ventasPorEmpleadoData[i].ventasTotal = $scope.ventasPorEmpleadoData[i].ventasTotal + parseFloat($scope.ventasPorEmpleadoData[i].pedidos[z].importe.total);
                    }
                }

                $scope.ventasPorEmpleadoEtiquetas = [];
                $scope.ventasPorEmpleadoValores = [];

                for (var i = $scope.ventasPorEmpleadoData.length - 1; i >= 0; i--) {
                    $scope.ventasPorEmpleadoEtiquetas.push($scope.ventasPorEmpleadoData[i].email);
                    $scope.ventasPorEmpleadoValores.push($scope.ventasPorEmpleadoData[i].ventasTotal);
                }
        
            }
            else {
              growl.error(respuesta.mensaje, {ttl: 3000});
            }
          }
        );
    };
    if ($scope.localElegido != '') {
        $scope.ventasPorEmpleado($scope.localElegido);
    }

    $scope.logins = function() {
        reporteService.logins({ accion: 'traerLogins' })
        .then( 
          function(respuesta) {          
            if (respuesta.estado == true) {
                $scope.gridOptions.data = respuesta.datos;
            }
            else {
              growl.error(respuesta.mensaje, {ttl: 3000});
            }
          }
        );
    };
    $scope.logins();



    $scope.grillaTitulo = "Regristro de Logins";
    // Objeto de configuracion de la grilla.
    $scope.gridOptions = {
    // Configuracion para exportar datos.
    exporterCsvFilename: $scope.grillaTitulo + '.csv',
    exporterCsvColumnSeparator: ';',
    exporterPdfDefaultStyle: {fontSize: 8},
    exporterPdfTableStyle: {margin: [0, 30, 0, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'white',  fillColor: '#72c02c'},
    exporterPdfHeader: { text: $scope.grillaTitulo, style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, alignment: 'center', color: '#72c02c' };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center' };
      return docDefinition;
    },
    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };
  $scope.gridOptions.enableGridMenu = true;
  $scope.gridOptions.gridMenuShowHideColumns = false;
  $scope.gridOptions.selectAll = true;

  // Configuracion de la paginacion
  $scope.gridOptions.paginationPageSizes = [25, 50, 75];
  $scope.gridOptions.paginationPageSize = 25;

  $scope.gridOptions.columnDefs = columnDefs();
  $scope.gridOptions.rowHeight = 60;
  // Activo la busqueda en todos los campos.
  $scope.gridOptions.enableFiltering = true;
  // Configuracion del idioma.
  i18nService.setCurrentLang('es');


  function columnDefs () {
    
    return [       
      { field: 'fecha', name: 'fecha', cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.fechaLogin}}</div>', headerCellClass: 'center' },
      { field: 'nombre', name: 'nombre',  cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.nombre}}</div>', headerCellClass: 'center' },
      { field: 'apellido', name: 'apellido',  cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.apellido}}</div>', headerCellClass: 'center' },
      { field: 'email', name: 'email',  cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.email}}</div>', headerCellClass: 'center' },
      { field: 'rol', name: 'rol', cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.rol}}</div>', headerCellClass: 'center',
        filter: { type: uiGridConstants.filter.SELECT,
          selectOptions: [
            {value: 'admin', label: 'administrador'},
            {value: 'encargado', label: 'encargado'},
            {value: 'empleado', label: 'empleado'},
            {value: 'cliente', label: 'cliente'}
          ] 
        },
        cellFilter: 'rol'
      }
    ];
  };
});









