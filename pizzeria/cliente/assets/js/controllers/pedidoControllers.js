angular.module('miSitio')

.controller('GrillaPedidosCtrl', function($scope, $state, growl, i18nService, uiGridConstants, NgMap, pedidoService, localService, usuarioService, productoService, usuarioFactory, urlFactory) {

  $scope.usuario = usuarioFactory.payload;
  $scope.urlimg = urlFactory.imgProducto;
  $scope.grillaTitulo = 'Lista de Pedidos';
  $scope.localActual = usuarioFactory.payload.local;
  $scope.productoActual = '';
  if ($scope.usuario.rol == 'empleado' || $scope.usuario.rol == 'encargado') {
    $scope.idEmpleadoActual = $scope.usuario.id;
  }
  else {
    $scope.idEmpleadoActual = null;
  }



  $scope.traerCboLocales = function() {

    $scope.traerCboLocalesData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, filtro: 'grilla', accion: 'listado' };
    
    localService.listado($scope.traerCboLocalesData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.listaLocales = respuesta.datos;
          if ($scope.frmTitulo == 'Editar Pedido') { 
            $scope.frmData.local = $scope.localActual;
          }
          if ($scope.frmTitulo == 'Hacer Pedido') { 
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

  $scope.traerProductosDeLocal = function(local) {

    $scope.traerProductosDeLocalData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, localActual: local, filtro: 'grilla', accion: 'listado' };
    
    productoService.listado($scope.traerProductosDeLocalData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.listaProductosRecibida = respuesta.datos;

          // Agrego propiedad cantidad a cada producto de la lista
          for (var i = $scope.listaProductosRecibida.length - 1; i >= 0; i--) {
            $scope.listaProductosRecibida[i].cantidad = 0;
          }
          $scope.listaProductos = $scope.listaProductosRecibida;
          // if ($scope.frmTitulo == 'Editar Pedido') { 
          //   $scope.frmData.local = $scope.localActual;
          // }
          // if ($scope.frmTitulo == 'Hacer Pedido') { 
          //   $scope.frmData.local = $scope.listaLocales[0].nombre;
          // }
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };
  if ($scope.localActual != null && $scope.localActual != undefined && $scope.localActual != '') {
    $scope.traerProductosDeLocal($scope.localActual);
  } 

  $scope.traerClientes = function() {

    $scope.traerClienteslData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, filtro: 'cboClientes', accion: 'listado' };
    
    usuarioService.listado($scope.traerClienteslData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.listaClientes = respuesta.datos;

          // if ($scope.frmTitulo == 'Editar Pedido') { 
          //   $scope.frmData.local = $scope.localActual;
          // }
          // if ($scope.frmTitulo == 'Hacer Pedido') { 
          //   $scope.frmData.local = $scope.listaLocales[0].nombre;
          // }
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };
  $scope.traerClientes();

  $scope.traercboPedidosEstado = function() {
    $scope.traercboPedidosEstadoData = { accion: 'listadoPedidosEstados' };
    
    pedidoService.listado($scope.traercboPedidosEstadoData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.listaPedidosEstados = respuesta.datos;
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };
  $scope.traercboPedidosEstado();

  $scope.traerTodo = function() {
    $scope.traerTodoData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, localActual: $scope.localActual, filtro: 'grilla', accion: 'listado' };
    
    pedidoService.listado($scope.traerTodoData)
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

  $scope.calculartotal = function() {

    $scope.frmData.total = 0;
    console.log('entro');

    for (var i = $scope.listaProductos.length - 1; i >= 0; i--) {
      if (($scope.listaProductos[i].cantidad != '' && $scope.listaProductos[i].cantidad != null && $scope.listaProductos[i].cantidad != undefined && $scope.listaProductos[i].cantidad != 0) ) {
        $scope.frmData.total = $scope.frmData.total + ($scope.listaProductos[i].precio * $scope.listaProductos[i].cantidad);
      } 
    }
    if ($scope.frmData.total != 0) {
      $scope.totalShow = true;
      $scope.btnCarcularTotalHide = true;
      $scope.btnModificarPedidoShow = true;
      $scope.cantidadDisabled = true;
    }
    else {
      growl.error("No seleccionó ningún producto", {ttl: 3000});
      console.log('error proucto', $scope.frmData.total);
    }

  };
  
  $scope.cambiaEstadoItem = function(idItem, estado) {

    $scope.cambiaEstadoData = { idPedido: idItem, estado: estado, accion : 'cambiaEstado' };
    pedidoService.cambiaEstado($scope.cambiaEstadoData)
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

  $scope.verDetallesItem = function(item) {


    $scope.frmDetallesPedidoData =
    {
      idPedido: item.id,
      fecha: item.fecha,
      cliente: item.cliente,
      local: item.local,
      total: item.importe_total,
      estado: item.estado,
      productos: item.productos
    };

    console.log("item", item);
  };

  $scope.agregarItem = function() {

    $scope.frmTitulo = 'Hacer Pedido';
    $scope.totalShow = false; 
    $scope.btnCarcularTotalHide = false; 
    $scope.btnModificarPedidoShow = false; 
    $scope.cantidadDisabled = false;
    

    if ($scope.localActual != null && $scope.localActual != undefined && $scope.localActual != '') {
      $scope.traerProductosDeLocal($scope.localActual);
    }

    $scope.frmData =
    {
      idCliente: '',
      idEmpleado: $scope.idEmpleadoActual,
      local: $scope.listaLocales[0].nombre,
      total: 0,
      productos: [],     
      accion: 'alta'
    };

    if ($scope.usuario.rol == 'cliente') {
      $scope.frmData.idCliente = $scope.usuario.id;
    }
    


    $scope.guardarItemAgregado = function() {

      //Agrega a frmData.productos los productos seleccionados
      for (var i = $scope.listaProductos.length - 1; i >= 0; i--) {
        if($scope.listaProductos[i].cantidad != '' && $scope.listaProductos[i].cantidad != null && $scope.listaProductos[i].cantidad != undefined && $scope.listaProductos[i].cantidad != 0) {
          $scope.frmData.productos.push($scope.listaProductos[i]);
        }
      }
        
      pedidoService.alta($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Nuevo pedido agregado ok!", {ttl: 3000});
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
  //$scope.gridOptions.exporterSuppressColumns= [ 'foto', 'datos' ];

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
      { field: 'cliente', name: 'cliente', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.cliente}}</div>', width: 150 },
      { field: 'fecha', name: 'fecha',  cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.fecha}}</div>', width: 150 },
      { field: 'importe_total', name: 'importe total', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.importe_total}}</div>', width: 180  },
      { field: 'estado', name: 'estado', cellClass: 'ui-grid-vertical-center', //cellTemplate: '<div>{{row.entity.estado}}</div>',
        cellTemplate: 
        '<div>\
          <select style="height:25px; width: 140px; padding-left: 5px;" ng-model="row.entity.estado" ng-change="grid.appScope.cambiaEstadoItem({{row.entity.id}}, row.entity.estado)">\
            <option ng-repeat="estado in grid.appScope.listaPedidosEstados" ng-value="{{estado.descripcion}}" >{{estado.descripcion}}</option>\
          </select>\
        </div>', 
        width: 180,
        filter: { type: uiGridConstants.filter.SELECT,
          selectOptions: [
            {value: 'pendiente', label: 'pendiente'},
            {value: 'preparando', label: 'preparando'},
            {value: 'terminado', label: 'terminado'},
            {value: 'entregado', label: 'entregado'},
            {value: 'cancelado', label: 'cancelado'}
          ] 
        },
        cellFilter: 'estado'
      },
      { field: 'detalles', name: 'detalles', cellClass: 'ui-grid-vertical-center', 
        cellTemplate: 
        '<div>\
          <button class="btn btn-primary btn-xs rounded-x" style="height:25px; width:25px;" title="Ver Detalles" data-toggle="modal" data-target="#popupFrmDetallesPedido" ng-click="grid.appScope.verDetallesItem(row.entity);" ><i class="fa fa-eye"></i></button>\
        </div>'
        ,
        headerCellClass: 'center', enableFiltering: false, enableColumnMenu: false
      }
    ];
  };

  // Oculta columnas según rol usuario
  var posEstado = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('estado');
  var posDetalles = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('detalles');
  
  if ($scope.usuario.rol != 'cliente') {
    $scope.gridOptions.columnDefs[posEstado].visible = true;
    $scope.gridOptions.columnDefs[posDetalles].visible = true;
  }
  else {
    $scope.gridOptions.columnDefs[posEstado].visible = false;
    $scope.gridOptions.columnDefs[posDetalles].visible = false;
  }

});









