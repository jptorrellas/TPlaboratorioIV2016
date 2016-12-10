angular.module('miSitio')

.controller('MenuCtrl', function($scope, $rootScope, $state, $auth, growl, usuarioService, usuarioFactory, urlFactory) {


  // Logout
  $scope.logout = function() { 
    // Desconectamos al usuario
    $auth.logout()
    .then(function() {
        // Mensaje de despedida
        growl.info("Hasta pronto " + $scope.usuarioActual.nombre + "!", {ttl: 5000});
        // Vacía usuarioFactory.payload
        usuarioFactory.payload = {};
        $scope.usuarioActual = {};
        // Abre el login
        $state.go('login');
    });
  };

  // Los $rootScope son para que actualice en tiempo real los cambios de Usuario.
  $rootScope.usuarioActual = usuarioFactory.payload;
  $rootScope.usuarioActual.nombre = usuarioFactory.payload.nombre;
  $rootScope.urlImg = urlFactory.imgPerfilUsuario + usuarioFactory.payload.foto;

  $scope.frmEditarPerfilTitulo = 'Editar Perfil';
  
  $scope.iniciarEditarPerfilData = function() {
    $scope.editarPerfilData =
    {
      id: $rootScope.usuarioActual.id,
      nombre: $rootScope.usuarioActual.nombre,
      apellido: $rootScope.usuarioActual.apellido,
      email: $rootScope.usuarioActual.email,
      tel: $rootScope.usuarioActual.tel,
      password1: $rootScope.usuarioActual.password,
      password2: $rootScope.usuarioActual.password,
      rol: $rootScope.usuarioActual.rol,
      foto: $rootScope.urlImg,
      accion: 'modificacion'
    };
  };
  $scope.iniciarEditarPerfilData();

  $scope.btnModificarFotoPerfil = 'Modificar foto perfil';  
  $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
  $scope.imagenPerfilAbierta = 0;
  
  $scope.modificarFotoPerfil = function(valor=null) {
    
    $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
  
    if ($scope.btnModificarFotoPerfil == 'Modificar foto perfil' && valor == null) {
      $scope.btnModificarFotoPerfil = 'Cancelar modificación foto perfil';
      $scope.cargaFotoPerfilShow = true;
      return;
    }
    if ($scope.btnModificarFotoPerfil == 'Cancelar modificación foto perfil' || valor == false) {
      $scope.btnModificarFotoPerfil = 'Modificar foto perfil';
      $scope.imagenPerfilAbierta = 0;
      $scope.imagenPerfilElegida = '';
      $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
      $scope.cargaFotoPerfilShow = false;
    }
    // si se cierra el popup recupera datos originales de perfil
    if (valor == false) {

      $scope.iniciarEditarPerfilData();
    }
  };

  $scope.guardarPerfilEditado = function() {    

    if ($scope.imagenPerfilAbierta == 0) {
      $scope.editarPerfilData.foto = '';
    }
    else {
      $scope.editarPerfilData.foto = $scope.fotoPerfilAGuardar;
    }
    
    usuarioService.modificacion($scope.editarPerfilData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {

          usuarioFactory.payload = respuesta.datos;
          $rootScope.usuarioActual = usuarioFactory.payload;
          $rootScope.urlImg = urlFactory.imgPerfilUsuario + usuarioFactory.payload.foto;
          growl.success("Edición de perfil ok!", {ttl: 3000});       
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
        }
      }
    );
    $scope.cargaFotoPerfilShow = false;
  };
 

  // ngImageCrop
  var handleFileSelect=function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.imagenPerfilElegida=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput3')).on('change',handleFileSelect);
  // fin ngImageCrop

  $scope.imagenPerfilElegida = '';
  $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
})

.controller('LoginCtrl', function($scope, $state, $auth, growl, usuarioService, usuarioFactory) {

  var respuesta = {};

  $scope.loginData = 
  {
    email: 'admin@argenta.com',
    password : '123',
    accion: 'login'
  };

  $scope.recuperarPasswordData =
  {
    email: '',
    accion: 'recuperaPassword'
  };

  // Login
  $scope.login = function() {        

    $auth.login($scope.loginData, { timeout: 10000 })
    .then(
      function(respuesta) {
        //console.log(respuesta);
        if ($auth.isAuthenticated()) {
          
          // Guarda datos de usuario en usuarioFactory.payload
          var payload = $auth.getPayload();
          usuarioFactory.payload = payload;

          // Limpia el formulario
          $scope.loginData = {};
          $scope.frmLogin.$setPristine();
          $scope.frmLogin.$setUntouched();

          // Mensaje de bienvenida
          growl.info("Bienvenido " + usuarioFactory.payload.nombre + "!", {ttl: 2000});

          if (usuarioFactory.payload.rol == "admin") {
            $state.go('menu.adminGrillaUsuarios');
          }
          if (usuarioFactory.payload.rol == "encargado") {
            $state.go('menu.encargadoGrillaUsuarios');
          }
          if (usuarioFactory.payload.rol == "empleado") {
            $state.go('menu.empleadoGrillaUsuarios');
          }
          if (usuarioFactory.payload.rol == "cliente") {
            $state.go('menu.clienteGrillaUsuarios');
          }
        }
        else {
          // Limpia el formulario
          $scope.loginData = {};
          $scope.frmLogin.$setPristine();
          $scope.frmLogin.$setUntouched();
          growl.error("Credenciales incorrectas.", {ttl: 5000});
        }
      },
      function(error) {
        growl.error("Problema de conexión con el servidor", {ttl: 5000});
      })

      .catch(function(error){
          // Limpia el formulario
          $scope.loginData = {};
          $scope.frmLogin.$setPristine();
          $scope.frmLogin.$setUntouched();
          growl.error("Problema de conexión con el servidor", {ttl: 5000});
      }
    ); 
  };

  // Recupera Password
  $scope.recuperarPassword = function() {
    
    usuarioService.recuperaPassword($scope.recuperarPasswordData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {
          // Limpia el formulario
          $scope.recuperarPasswordData = {};
          $scope.frmRecuperarPassword.$setPristine();
          $scope.frmRecuperarPassword.$setUntouched();
          growl.success(respuesta.mensaje, {ttl: 3000});
        }
        else {
          // Limpia el formulario
          $scope.recuperarPasswordData = {};
          $scope.frmRecuperarPassword.$setPristine();
          $scope.frmRecuperarPassword.$setUntouched();
          growl.error(respuesta.mensaje, {ttl: 3000});
        }
      }
    );              
  };
})

.controller('RegistroCtrl', function($scope, $state, growl, usuarioService, usuarioFactory) {

  $scope.rol = usuarioFactory.payload.rol;
  $scope.frmTitulo = 'Registro de Usuario';
  $scope.btnCargarFotoPerfil = 'Cargar foto perfil';
  
  $scope.altaUsuarioData =
  {
    nombre: 'ClienteNombre',
    apellido: 'ClienteApellido',
    email: 'clenteprueba@argenta.com',
    tel: 1566666666,
    password1: '123',
    password2: '123',
    rol: 'cliente',
    foto: '',
    accion: 'alta'
  };

  $scope.cargarFotoPerfil = function() {
    
    if ($scope.btnCargarFotoPerfil == 'Cargar foto perfil') {
      $scope.btnCargarFotoPerfil = 'Cancelar foto perfil';
      $scope.cargaFotoShow = true;
      return;
    }
    if ($scope.btnCargarFotoPerfil == 'Cancelar foto perfil') {
      $scope.btnCargarFotoPerfil = 'Cargar foto perfil';
      $scope.cargaFotoShow = false;
      $scope.altaUsuarioData.foto = '';
      $scope.myImage = '';
      $scope.imagenAbierta = 0;
    }
  };

  $scope.altaUsuario = function() {
    
    if ($scope.imagenAbierta == 0) {
      $scope.altaUsuarioData.foto = '';
    }
    
    usuarioService.alta($scope.altaUsuarioData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {

          if ($scope.rol == null) {
            growl.success("Se acaba de registrar en el sistema! Ya puede acceder con sus credenciales.", {ttl: 5000});
            $state.go('login');
          }
          if ($scope.rol == 'admin') {
            growl.success("Alta de usuario ok!", {ttl: 3000});
            $state.go('menu.adminGrillaUsuarios');
          }         
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
        }
      }
    );
  };

  // ngImageCrop
  $scope.myImage='';
  $scope.imagenAbierta = 0;
  //$scope.myCroppedImage='';

  var handleFileSelect=function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.myImage=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
  // fin ngImageCrop  
})

.controller('GrillaUsuariosCtrl', function($scope, $state, growl, i18nService, uiGridConstants, usuarioService, localService, usuarioFactory, urlFactory) {

  $scope.usuario = usuarioFactory.payload;
  $scope.urlimg = urlFactory.imgPerfilUsuario;
  $scope.grillaTitulo = 'Lista de Usuarios';

  $scope.listaLocales = [];

  
  $scope.traerCboLocales = function() {

    if ($scope.frmData.rol == "empleado") {
      
      $scope.traerCboLocalesTodos = function() {

        $scope.traerCboLocalesData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, filtro: 'cboEmpleado', accion: 'listado' };
        
        localService.listado($scope.traerCboLocalesData)
        .then( 
          function(respuesta) { 
            if (respuesta.estado == true) {
              $scope.listaLocales = respuesta.datos;
              if ($scope.frmTitulo == 'Editar Usuario' && $scope.rolUsuarioAeditar == 'empleado') { 
                $scope.frmData.local = $scope.localUsuarioAeditar;
              }
              if ($scope.frmTitulo == 'Agregar Usuario') { 
                $scope.frmData.local = $scope.listaLocales[0].nombre;
              }
            }
            else {
              growl.error(respuesta.mensaje, {ttl: 3000}); 
            }
          }
        );
      };
      $scope.traerCboLocalesTodos();
    }

    if ($scope.frmData.rol == "encargado") {

      $scope.traerCboLocalesSinEncargado = function() {

        $scope.traerCboLocalesData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, filtro: 'cboEncargado', accion: 'listado' };
        
        localService.listado($scope.traerCboLocalesData)
        .then( 
          function(respuesta) { 
            if (respuesta.estado == true) {
              $scope.listaLocales = respuesta.datos;
              if ($scope.frmTitulo == 'Editar Usuario' && $scope.rolUsuarioAeditar == 'encargado') {
                $scope.listaLocales.push({nombre : $scope.localUsuarioAeditar});                
                $scope.frmData.local = $scope.localUsuarioAeditar;
              }
              if ($scope.frmTitulo == 'Editar Usuario' && $scope.rolUsuarioAeditar == 'empleado') {                
                $scope.frmData.local = '';
                $scope.frmData.local = $scope.listaLocales[0].nombre;
              }
              if ($scope.frmTitulo == 'Agregar Usuario') { 
                $scope.frmData.local = $scope.listaLocales[0].nombre;
              }
            }
            else {
              growl.error("Todos los Locales tienen encargados", {ttl: 3000});
              $scope.listaLocales = [];
              if ($scope.frmTitulo == 'Editar Usuario' && $scope.rolUsuarioAeditar == 'encargado') {
                $scope.listaLocales.push({nombre : $scope.localUsuarioAeditar});
                $scope.frmData.local = $scope.listaLocales[0].nombre;
              }
              if ($scope.frmTitulo == 'Editar Usuario' && $scope.rolUsuarioAeditar == 'empleado') {                
                $scope.frmData.local = '';
              }
              if ($scope.frmTitulo == 'Agregar Usuario') { 
                $scope.frmData.local = '';
              }
            }
          }
        );
      };
      $scope.traerCboLocalesSinEncargado();
    }

    if ($scope.frmData.rol == "admin") {
      $scope.frmData.local = "Sin Local";
    }

    if ($scope.frmData.rol == "cliente") {
      $scope.frmData.local = "Sin Local";
    }
  };

  $scope.traerTodo = function() {
    $scope.traerTodoData = { idUsuario: $scope.usuario.id, rolUsuario: $scope.usuario.rol, accion: 'listado' };
    
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

    $scope.cambiaEstadoData = { idUsuario: idItem, accion : 'cambiaEstado' };

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
    $scope.localUsuarioAeditar = item.local;
    $scope.rolUsuarioAeditar = item.rol; 
    
    $scope.frmData =
    {
      id: item.id,
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      tel: item.tel,
      password1: item.password,
      password2: item.password,
      rol: item.rol,
      local: item.local,
      foto: urlFactory.imgPerfilUsuario +  item.foto,
      accion: 'modificacion'
    };
    $scope.traerCboLocales();

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
      tel: 1566688899,
      password1: '123',
      password2: '123',
      rol: 'cliente',
      local: $scope.listaLocales[0],
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
        { field: 'id', name: '#', cellClass: 'ui-grid-vertical-center', cellTemplate: '<div>{{row.entity.id}}</div>', width: 50 },
        { field: 'foto', name: 'foto', headerCellClass: 'center', cellTemplate:'<div class="ui-grid-cell-contents" style="width:100%; height: 100%; text-align:center;"><img style="width:50px; height:50px; border-radius:50%;" ng-src="{{grid.appScope.urlimg}}{{row.entity.foto}}"></div>', width: 80, enableFiltering: false, enableColumnMenu: false },
        { field: 'nombre', name: 'nombre', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.nombre}}</div>', width: 150 },
        { field: 'apellido', name: 'apellido',  cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.apellido}}</div>', width: 150 },
        { field: 'email', name: 'email',  cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.email}}</div>', width: 180 },
        { field: 'tel', name: 'teléfono', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.tel}}</div>', width: 180  },
        { field: 'rol', name: 'rol', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.rol}}</div>', width: 160,
          filter: { type: uiGridConstants.filter.SELECT,
            selectOptions: [
              {value: 'admin', label: 'administrador'},
              {value: 'encargado', label: 'encargado'},
              {value: 'empleado', label: 'empleado'},
              {value: 'cliente', label: 'cliente'}
            ] 
          },
          cellFilter: 'rol'
        },
        { field: 'local', name: 'local', cellClass: 'ui-grid-vertical', cellTemplate: '<div>{{row.entity.local}}</div>', width: 180  },
        { field: 'estado', name: 'estado', cellClass: 'ui-grid-vertical-center', 
          cellTemplate: 
          '<div>\
            <input type="checkbox" ng-if="grid.appScope.usuario.rol == \'admin\' || (grid.appScope.usuario.rol == \'encargado\'  && row.entity.rol == \'empleado\' ) " ng-checked="{{row.entity.estado}}" ng-click="grid.appScope.cambiaEstadoItem(row.entity.id)">\
          </div>', 
          width: 110,
          filter: { type: uiGridConstants.filter.SELECT,
            selectOptions: [
              {value: '1', label: 'activo'},
              {value: '0', label: 'inactivo'}
            ] 
          },
          cellFilter: 'estado'
        },
        { field: 'opciones', name: 'opciones', cellClass: 'ui-grid-vertical-center', 
          cellTemplate: 
          '<div>\
            <button class="btn btn-warning btn-xs rounded-x" style="height:25px; width:25px;" title="Editar" data-toggle="modal" data-target="#popupfrm" ng-click="grid.appScope.editarItem(row.entity);" ><i class="fa fa-pencil"></i></button>\
          </div>'
          ,
          headerCellClass: 'center', enableFiltering: false, enableColumnMenu: false
        }
      ];
    };

    // Oculta columnas según rol usuario
    var posEstado = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('estado');
    var posLocal= $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf('local');
    
    if ($scope.usuario.rol == 'admin') {
      $scope.gridOptions.columnDefs[posEstado].visible = true;
      return;
    }
    // else {
    //   $scope.gridOptions.columnDefs[posEstado].visible = false;
    // }
    if ($scope.usuario.rol == 'encargado' ) {
      $scope.gridOptions.columnDefs[posEstado].visible = true;
      return;
    }
    else {
      $scope.gridOptions.columnDefs[posEstado].visible = false;
    }
    if ($scope.usuario.rol == 'empleado' ) {
      $scope.gridOptions.columnDefs[posLocal].visible = false;
      return;
    }
});









