angular.module('miSitio')

.controller('GrillaLocalesCtrl', function($scope, $state, growl, i18nService, uiGridConstants, usuarioService, usuarioFactory, localService, urlFactory) {

  $scope.usuario = usuarioFactory.payload;
  $scope.urlimg = urlFactory.imgPerfilUsuario;
  $scope.grillaTitulo = 'Lista de Usuarios';

  $scope.traerTodo = function() {
    $scope.traerTodoData = { usuarioId: $scope.id, accion: 'listado' };
    
    usuarioService.listado($scope.traerTodoData)
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

    $scope.cambiaEstadoData = { idUsuario : idItem, accion : 'cambiaEstado' };

    usuarioService.cambiaEstado($scope.cambiaEstadoData)
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


    $scope.frmTitulo = 'Editar Usuario';
    $scope.btnModificarFoto = 'Modificar foto';   
    
    $scope.frmData =
    {
      id: item.id,
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      telefono: item.tel,
      password1: item.password,
      password2: item.password,
      rol: item.rol,
      foto: urlFactory.imgPerfilUsuario +  item.foto,
      accion: 'modificacion'
    };

    $scope.fotoAGuardar = $scope.frmData.foto;   

    $scope.guardarItemEditado = function() {     
    
      if ($scope.imagenAbierta == 0) {
        $scope.frmData.foto = '';
      }
      else {
        $scope.frmData.foto = $scope.fotoAGuardar;
      }
      
      usuarioService.modificacion($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Edición de usuario ok!", {ttl: 3000});
            $scope.traerTodo();
          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
      $scope.cargaFotoShow = false;
    };
  };

  $scope.agregarItem = function() {

    $scope.frmTitulo = 'Agregar Usuario';
    $scope.btnModificarFoto = 'Modificar foto';

    $scope.frmData =
    {
      nombre: 'Pruebanombre',
      apellido: 'PruebaApellido',
      email: 'prueba@argenta.com',
      telefono: 1566688899,
      password1: '123',
      password2: '123',
      rol: 'cliente',
      foto: urlFactory.imgPerfilUsuario + 'defaultPerfil.jpeg',
      accion: 'alta'
    };

    $scope.fotoAGuardar = $scope.frmData.foto;

    $scope.guardarItemAgregado = function() {
    
      if ($scope.imagenAbierta == 0) {
        $scope.frmData.foto = '';
      }
      else {
        $scope.frmData.foto = $scope.fotoAGuardar;
      }
    
      usuarioService.alta($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Nuevo usuario agregado ok!", {ttl: 3000});
            $scope.traerTodo();       
          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
    };
  };

  $scope.modificarFoto = function(valor=null) {
    
    $scope.fotoAGuardar = $scope.frmData.foto;
  
    if ($scope.btnModificarFoto == 'Modificar foto' && valor == null) {
      $scope.btnModificarFoto = 'Cancelar modificación foto';
      $scope.cargaFotoShow = true;
      return;
    }
    if ($scope.btnModificarFoto == 'Cancelar modificación foto' || valor == false) {
      $scope.btnModificarFoto = 'Modificar foto';
      $scope.imagenAbierta = 0;
      $scope.imagenElegida = '';
      $scope.fotoAGuardar = $scope.frmData.foto;
      $scope.cargaFotoShow = false;
    }
  };

  // ngImageCrop
  $scope.imagenElegida='';
  $scope.imagenAbierta = 0;

  var handleFileSelect=function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.imagenElegida=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput2')).on('change',handleFileSelect);
  // fin ngImageCrop
  
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
        { field: 'foto', name: 'foto', headerCellClass: 'center', cellTemplate:'<div class="ui-grid-cell-contents" style="width:100%; height: 100%; text-align:center;"><img style="width:50px; height:50px; border-radius:50%;" ng-src="{{grid.appScope.urlimg}}{{row.entity.foto}}"></div>', width: 80, enableFiltering: false, enableColumnMenu: false },
        { field: 'nombre', name: 'nombre', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.nombre}}</div>', width: 150 },
        { field: 'apellido', name: 'apellido',  cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.apellido}}</div>', width: 150 },
        { field: 'email', name: 'email',  cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.email}}</div>', width: 180 },
        { field: 'tel', name: 'teléfono', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.tel}}</div>', width: 180  },
        { field: 'rol', name: 'rol', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.rol}}</div>', width: 180  },
        { field: 'estado', name: 'estado', cellClass: 'ui-grid-vertical-center',  
          cellTemplate: 
          '<div>\
            <input type="checkbox" ng-checked="{{row.entity.estado}}" ng-click="grid.appScope.cambiaEstadoItem(row.entity.id)">\
          </div>', 
          width: 100  
        },
        { field: 'opciones', name: 'opciones', cellClass: 'ui-grid-vertical-center', 
          cellTemplate: 
          '<div>\
            <button class="btn btn-warning btn-xs" data-toggle="modal" data-target="#popupfrm" ng-click="grid.appScope.editarItem(row.entity);" ><i class="fa fa-pencil"></i> Editar</button>\
          </div>'
          ,
          headerCellClass: 'center', enableFiltering: false, enableColumnMenu: false
        }
      ];
    };

    // Oculta columnas según rol usuario
    var posEstado = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('estado');
    
    if ($scope.usuario.rol == 'admin') {
      $scope.gridOptions.columnDefs[posEstado].visible = true;
    }
    else {
      $scope.gridOptions.columnDefs[posEstado].visible = false;
    }
});









