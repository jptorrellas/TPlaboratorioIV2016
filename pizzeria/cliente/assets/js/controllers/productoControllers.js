angular.module('miSitio')

.controller('GrillaProductosCtrl', function($scope, $state, growl, i18nService, uiGridConstants, NgMap, productoService, localService, usuarioFactory, urlFactory) {

  $scope.usuario = usuarioFactory.payload;
  $scope.urlimg = urlFactory.imgProducto;
  $scope.grillaTitulo = 'Lista de Productos';
  $scope.localActual = usuarioFactory.payload.local;
  $scope.productoActual = '';

  $scope.traerCboLocales = function() {

    $scope.traerCboLocalesData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, filtro: 'grilla', accion: 'listado' };
    
    localService.listado($scope.traerCboLocalesData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.listaLocales = respuesta.datos;
          if ($scope.frmTitulo == 'Editar Producto') { 
            $scope.frmData.local = $scope.localActual;
          }
          if ($scope.frmTitulo == 'Agregar Producto') { 
            $scope.frmData.local = $scope.listaLocales[0].nombre;
          }
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };
  $scope.traerCboLocales();


  $scope.traerTodo = function() {
    $scope.traerTodoData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, localActual: $scope.localActual, filtro: 'grilla', accion: 'listado' };
    
    productoService.listado($scope.traerTodoData)
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
  $scope.traerTodo();
  
  $scope.cambiaEstadoItem = function(idItem) {

    $scope.cambiaEstadoData = { idProducto : idItem, accion : 'cambiaEstado' };

    productoService.cambiaEstado($scope.cambiaEstadoData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          growl.success(respuesta.mensaje, {ttl: 3000});
          $scope.traerTodo();
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
          $scope.traerTodo();
        }
      }
    ); 
  };

  $scope.editarItem = function(item) {

    console.log(item);
    $scope.frmTitulo = 'Editar Producto';
    
    $scope.frmData =
    {
      id: item.id,
      descripcion: item.descripcion,
      ingredientes: item.ingredientes,
      precio: item.precio,
      idLocal: item.id_local,
      accion: 'modificacion'
    };


    $scope.guardarItemEditado = function() {     
      
      productoService.modificacion($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Edición de producto ok!", {ttl: 3000});
            $scope.traerTodo();
          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
    };
  };

  $scope.agregarItem = function() {

    $scope.frmTitulo = 'Agregar Producto';

    $scope.frmData =
    {
      descripcion: 'Producto1',
      ingredientes: 'mozzarella, salsa tomate, aceitunas',
      precio: 100,
      local: $scope.listaLocales[0].nombre,
      accion: 'alta'
    };


    $scope.guardarItemAgregado = function() {
        
      productoService.alta($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Nuevo producto agregado ok!", {ttl: 3000});
            $scope.traerTodo();       
          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
    };
  };
  
  // Objeto de configuracion de la grilla Locales.
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
  $scope.gridOptions.exporterSuppressColumns= [ 'foto', 'datos' ];

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
      { field: 'id', name: '#', cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.id}}</div>', width: 50 },
      { field: 'local', name: 'local', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.local}}</div>', width: 150 },
      { field: 'descripcion', name: 'descripcion', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.descripcion}}</div>', width: 150 },
      { field: 'ingredientes', name: 'ingredientes',  cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.ingredientes}}</div>', width: 150 },
      { field: 'precio', name: 'precio', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.precio}}</div>', width: 180  },
      { field: 'estado', name: 'estado', cellClass: 'ui-grid-vertical-center', 
        cellTemplate: 
        '<div>\
          <input type="checkbox" ng-checked="{{row.entity.estado}}" ng-click="grid.appScope.cambiaEstadoItem(row.entity.id)">\
        </div>', 
        width: 140,
        filter: { type: uiGridConstants.filter.SELECT,
          selectOptions: [
            {value: '1', label: 'activo'},
            {value: '0', label: 'inactivo'}
          ] 
        },
        cellFilter: 'estado'
      },
      { field: 'datos', name: 'datos', cellClass: 'ui-grid-vertical-center', 
        cellTemplate: 
        '<div>\
          <button class="btn btn-warning btn-xs rounded-x" style="height:25px; width:25px;" title="Editar" data-toggle="modal" data-target="#popupfrm" ng-click="grid.appScope.editarItem(row.entity);" ><i class="fa fa-pencil"></i></button>\
        </div>'
        ,
        headerCellClass: 'center', enableFiltering: false, enableColumnMenu: false
      },
      { field: 'fotos', name: 'fotos', cellClass: 'ui-grid-vertical-center',
        cellTemplate: 
        '<div>\
          <button class="btn btn-warning btn-xs rounded-x" style="height:25px; width:25px;" title="Fotos" ng-click="grid.appScope.traerFotos(row.entity);" ><i class="fa fa-picture-o"></i></button>\
        </div>'
        ,
        headerCellClass: 'center', enableFiltering: false, enableColumnMenu: false
      }   
    ];
  };

  // Oculta columnas según rol usuario
  var posEstado = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('estado');
  var posDatos = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('datos');
  var posFotos = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('fotos');
  
  if ($scope.usuario.rol == 'admin') {
    $scope.gridOptions.columnDefs[posEstado].visible = true;
    $scope.gridOptions.columnDefs[posDatos].visible = true;
    $scope.gridOptions.columnDefs[posFotos].visible = true;
  }
  else {
    $scope.gridOptions.columnDefs[posEstado].visible = false;
    $scope.gridOptions.columnDefs[posDatos].visible = false;
    $scope.gridOptions.columnDefs[posFotos].visible = false;
  }



  ///////////////// FOTOS LOCALES /////////////////

  $scope.traerFotos = function(item) {
    $scope.productoActual = item;
    $scope.grillaFotosShow = true;
    $scope.grillaFotosTitulo = 'Fotos del Producto: ' + item.descripcion + ' (' + item.local + ')';
    $scope.traerFotosData = { idProducto: item.id, accion: 'listadoFotos' };
    $scope.files = null;
    
    productoService.listadoFotos($scope.traerFotosData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.gridFotosOptions.data = respuesta.datos;
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
          $scope.gridFotosOptions.data = [];
        }
      }
    );
  };

  $scope.agregarFotos= function() {
    $scope.agregarFotosData =
    {
      fotos: $scope.files,
      idProducto: $scope.productoActual.id,
      accion: 'altaFotos'
    };
        
    productoService.altaFotos($scope.agregarFotosData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {
          growl.success("Fotos agregadas ok!", {ttl: 3000});
          $scope.traerFotos($scope.productoActual);       
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
        }
      }
    );

  };

  $scope.cambiaEstadoFoto = function(idItem) {

    $scope.cambiaEstadoData = { idFoto : idItem, accion : 'cambiaEstadoFoto' };

    productoService.cambiaEstadoFoto($scope.cambiaEstadoData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          growl.success(respuesta.mensaje, {ttl: 3000});
          $scope.traerTodo();
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
          $scope.traerTodo();
        }
      }
    ); 
  };



  // Objeto de configuracion de la grilla Fotos.
  $scope.gridFotosOptions = {};
    

  // Configuracion de la paginacion
  $scope.gridFotosOptions.paginationPageSizes = [25, 50, 75];
  $scope.gridFotosOptions.paginationPageSize = 25;

  $scope.gridFotosOptions.columnDefs = columnDefsFotos();
  $scope.gridFotosOptions.rowHeight = 60;
  // Activo la busqueda en todos los campos.
  $scope.gridFotosOptions.enableFiltering = true;
  // Configuracion del idioma.
  i18nService.setCurrentLang('es');


  function columnDefsFotos () {
    
    return [       
      { field: 'id', name: '#', cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.id}}</div>', width: 50 },
      { field: 'foto', name: 'foto', headerCellClass: 'center', cellTemplate:'<div class="ui-grid-cell-contents" style="width:100%; height: 100%; text-align:center;"><img style="width:50px; height:50px;" ng-src="{{grid.appScope.urlimg}}{{row.entity.foto}}"></div>', width: 80, enableFiltering: false, enableColumnMenu: false },
      { field: 'estado', name: 'estado', cellClass: 'ui-grid-vertical-center', 
        cellTemplate: 
        '<div>\
          <input type="checkbox" ng-checked="{{row.entity.estado}}" ng-click="grid.appScope.cambiaEstadoFoto(row.entity.id)">\
        </div>', 
        width: 140,
        filter: { type: uiGridConstants.filter.SELECT,
          selectOptions: [
            {value: '1', label: 'activo'},
            {value: '0', label: 'inactivo'}
          ] 
        },
        cellFilter: 'estado'
      }
    ];
  };



});









