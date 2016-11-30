angular.module('miSitio')

.controller('GrillaLocalesCtrl', function($scope, $state, growl, i18nService, uiGridConstants, NgMap, localService, usuarioFactory, urlFactory) {

  $scope.usuario = usuarioFactory.payload;
  $scope.grillaTitulo = 'Lista de Locales';

  $scope.traerTodo = function() {
    $scope.traerTodoData = { usuarioId: $scope.usuario.id, usuarioRol: $scope.usuario.rol, accion: 'listado' };
    
    localService.listado($scope.traerTodoData)
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

    $scope.cambiaEstadoData = { idLocal : idItem, accion : 'cambiaEstado' };

    localService.cambiaEstado($scope.cambiaEstadoData)
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


    $scope.frmTitulo = 'Editar Local';  
    
    $scope.frmData =
    {
      id: item.id,
      nombre: item.nombre,
      direccion: item.direccion,
      tel: item.tel,
      latitud : item.latitud,
      longitud : item.longitud,
      accion: 'modificacion'
    };   

    $scope.guardarItemEditado = function() {     
      
      localService.modificacion($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Edición de local ok!", {ttl: 3000});
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

    $scope.frmTitulo = 'Agregar Local';

    $scope.frmData =
    {
      nombre: 'LocalX',
      direccion: $scope.direccion,
      tel: 47864879,
      latitud : '',
      longitud : '',
      accion: 'alta'
    };


    $scope.guardarItemAgregado = function() {
        
      localService.alta($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Nuevo local agregado ok!", {ttl: 3000});
            $scope.traerTodo();       
          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
    };
  };
  
  // Objeto de configuracion de la grilla.
  $scope.gridOptions = {
    // Configuracion para exportar datos.
    exporterCsvFilename: $scope.grillaTitulo + '.csv',
    // exporterCsvColumnSeparator: ',',
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfHeader: { text: $scope.grillaTitulo, style: 'headerStyle' },
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
      { field: 'nombre', name: 'nombre', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.nombre}}</div>', width: 150 },
      { field: 'direccion', name: 'direccion',  cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.direccion}}</div>', width: 150 },
      { field: 'tel', name: 'teléfono', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.tel}}</div>', width: 180  },
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
      { field: 'encargado', name: 'encargado', cellClass: 'ui-grid-vertical-center', 
        cellTemplate: 
        '<div>\
          <button class="btn btn-warning btn-xs rounded-x" style="height:25px; width:25px;" title="Editar" data-toggle="modal" data-target="#popupfrm" ng-click="grid.appScope.editarItem(row.entity);" ><i class="fa fa-user"></i></button>\
        </div>'
        ,
        headerCellClass: 'center', enableFiltering: false, enableColumnMenu: false
      },
      { field: 'empleados', name: 'empleados', cellClass: 'ui-grid-vertical-center', 
        cellTemplate: 
        '<div>\
          <button class="btn btn-warning btn-xs rounded-x" style="height:25px; width:25px;" title="Editar" data-toggle="modal" data-target="#popupfrm" ng-click="grid.appScope.editarItem(row.entity);" ><i class="fa fa-users"></i></button>\
        </div>'
        ,
        headerCellClass: 'center', enableFiltering: false, enableColumnMenu: false
      }
    ];
  };

  // Oculta columnas según rol usuario
  var posEstado = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('estado');
  var posDatos = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('datos');
  var posEncargado = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('encargado');
  var posEmpleados = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('empleados');
  
  if ($scope.usuario.rol == 'admin') {
    $scope.gridOptions.columnDefs[posEstado].visible = true;
    $scope.gridOptions.columnDefs[posDatos].visible = true;
    $scope.gridOptions.columnDefs[posEncargado].visible = true;
    $scope.gridOptions.columnDefs[posEmpleados].visible = true;
  }
  else {
    $scope.gridOptions.columnDefs[posEstado].visible = false;
    $scope.gridOptions.columnDefs[posDatos].visible = false;
    $scope.gridOptions.columnDefs[posEncargado].visible = false;
    $scope.gridOptions.columnDefs[posEmpleados].visible = true;
  }


  // ngmap
  // $scope.Mapa=function (row){
      $scope.map = true;
      $scope.Lat = parseFloat('-34.54892900800333');
      $scope.Log = parseFloat('-58.46860544231572');
      $scope.avatar = urlFactory.iconoArgenta;
      $scope.Nombre = 'local1';
      $scope.customIcon = {
        "scaledSize": [50, 50],
        "url":  $scope.avatar
      };
      

    // };
    // 
    // $scope.latlng = [-25.363882,131.044922];
  $scope.getpos = function(event){
    //$scope.latlng = [event.latLng.lat(), event.latLng.lng()];
    $scope.frmData.latitud = String(event.latLng.lat());
    $scope.frmData.longitud = String(event.latLng.lng());
  };

  $scope.direccion = 'capital federal';
  $scope.onLoad = function() {
    NgMap.getMap().then(function (map) {
        //console.log(map.getBounds().toString());
    });
  };



});









