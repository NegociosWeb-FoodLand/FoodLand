// Creación de la dependencia del express y definición de router
const express = require('express');
const router = express.Router();

//i

// Importando los modelos de los controladores
const restauranteControllers = require('../controllers/controllersRestaurante');
const categoriasControllers = require('../controllers/controllersCategorias');
const platillosControllers = require('../controllers/controllersPlatillos');
const usuariosControllers = require('../controllers/controllersUsuarios');

// importando controladores del lado del cliente
const clienteOperaciones = require('../controllers/controllersClientes');
const authControllers = require('../controllers/authController')



//defininedo las rutas
module.exports = function(){

    // llamando a la página principal

    router.get('/', authControllers.usuarioAutenticado,
        restauranteControllers.mostrarPrincipalAdmin
    );
    
    router.get('/nuevo_Restaurante', restauranteControllers.formularioGuardar);
    router.post('/nuevo_Restaurante', restauranteControllers.guardarDatos);

    router.get('/editar_Restaurante/:id',restauranteControllers.formularioEditar);
    router.post('/nuevo_Restaurante/:id',restauranteControllers.actualizarRestaurante);

    router.get('/nueva_Categoria', categoriasControllers.formularioGuardar);
    router.get('/categoriaForm',categoriasControllers.formularioLlenarCategoria);
    router.post('/nueva_Categoria', categoriasControllers.guardarDatos);

    router.get('/editar_Categoria/:id',categoriasControllers.formularioEditar);
    router.post('/nueva_Categoria/:id',categoriasControllers.actualizarCategoria);
    router.get('/editar_Restaurante/:id',restauranteControllers.formularioEditar);

    router.get('/modificarPlatillo/:id',platillosControllers.formularioEditar);
    router.post('/nuevo_Platillo/:id', platillosControllers.actualizarPlatillo);
    router.delete('/nuevo_Platillo/:id', platillosControllers.eliminarPlatillo);

    router.get('/nuevoUsuario', usuariosControllers.formularioLlenarUsuario);
    router.post('/nuevoUsuario', usuariosControllers.guardarDatos);

        // Restaurante
        router.get('/nuevo_Restaurante', authControllers.usuarioAutenticado,
        restauranteControllers.formularioGuardar
    );
    router.post('/nuevo_Restaurante', authControllers.usuarioAutenticado,
        restauranteControllers.guardarDatos
    );

    router.get('/editar_Restaurante/:id', authControllers.usuarioAutenticado,
        restauranteControllers.formularioEditar
    );
    router.post('/nuevo_Restaurante/:id', authControllers.usuarioAutenticado,
        restauranteControllers.actualizarRestaurante
    );

    router.delete('/:id', authControllers.usuarioAutenticado,
        restauranteControllers.eliminarRestaurante
    );

    // Categoria
    router.get('/nueva_Categoria', authControllers.usuarioAutenticado,
        categoriasControllers.formularioGuardar
    );
    router.get('/categoriaForm', authControllers.usuarioAutenticado,
        categoriasControllers.formularioLlenarCategoria
    );
    router.post('/nueva_Categoria', authControllers.usuarioAutenticado, 
        categoriasControllers.guardarDatos
    );

    // Platillo
    router.get('/nuevo_Platillo', authControllers.usuarioAutenticado,
        platillosControllers.formularioGuardar
    );
    router.get('/PlatilloForm', authControllers.usuarioAutenticado,
        platillosControllers.formularioLlenarPlatillo
    );
    router.post('/nuevo_Platillo', authControllers.usuarioAutenticado,
        platillosControllers.guardarDatos
    );    

    // Usuario
    router.get('/nuevoUsuario', usuariosControllers.formularioLlenarUsuario);
    router.post('/nuevoUsuario', usuariosControllers.guardarDatos);
    router.get('/inicioSesion', usuariosControllers.iniciarSesion);
    router.post('/inicioSesion', authControllers.autenticarUsuario);
    router.get('/cerrarSesion', authControllers.cerrarSesion);

    // restablecer contraseña
    router.get('/restablecer', usuariosControllers.formularioRestablecerPassword);
    router.post('/restablecer', authControllers.enviarToken);
    router.get('/restablecer/:token', authControllers.validarToken);
    router.post('/restablecer/:token', authControllers.actualizarPassword);


    /*--------------------Rutas del área del cliente-----------------------*/
    router.get('/foodLand', authControllers.usuarioAutenticado,clienteOperaciones.principalCliente);
    router.get('/foodLand/nuestrosRestaurantes',authControllers.usuarioAutenticado,clienteOperaciones.mostrarRestaurantes);
    router.get('/foodLand/nuestrosRestaurantes/platillos/:id',authControllers.usuarioAutenticado,clienteOperaciones.mostrarPlatillosporRestaurante);
    router.get('/foodLand/nuestrosRestaurantes/platillos/platilloOrden/:id',authControllers.usuarioAutenticado,clienteOperaciones.mostrarInformaciónPlatillo);
    router.get('/foodLand/nosotros',authControllers.usuarioAutenticado,clienteOperaciones.mostrarAcerca);
    router.get('/foodLand/contacto',authControllers.usuarioAutenticado,clienteOperaciones.mostrarContacto);
    router.get('/foodLand/misPedidos',authControllers.usuarioAutenticado,clienteOperaciones.mostrarPedidos);
    router.get('/foodland/confirmandoPedido',authControllers.usuarioAutenticado,clienteOperaciones.finalizarOrden);

    router.post('/foodLand/platillos/pedidos/:id',authControllers.usuarioAutenticado,
        clienteOperaciones.CrerPedidoConDetalle
    );

    return router;
}