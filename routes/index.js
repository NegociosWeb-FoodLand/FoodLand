// Creación de la dependencia del express y definición de router
const express = require('express');
const router = express.Router();

//i

// Importando los modelos de los controladores
const restauranteControllers = require('../controllers/controllersRestaurante')

const categoriasControllers = require('../controllers/controllersCategorias')

const usuariosControllers = require('../controllers/controllersUsuarios')

const authControllers = require('../controllers/authController')
const platillosControllers = require('../controllers/controllersPlatillos')


//defininedo las rutas
module.exports = function(){

    // llamando a la página principal

    router.get('/', authControllers.usuarioAutenticado,
        restauranteControllers.mostrarPrincipalAdmin
    );
    
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
    router.get('/inicioSesion', usuariosControllers.iniciarSesion
    );
    router.post('/inicioSesion', authControllers.autenticarUsuario);
    router.get('/cerrarSesion', authControllers.cerrarSesion);

    // reestablecer contraseña
    router.get('/reestablecer', usuariosControllers.formularioRestablecerPassword);
    router.post('/reestablecer', authControllers.enviarToken);
    router.get('/reestablecer/:token', authControllers.validarToken);
    router.post('/reestablecer/:token', authControllers.actualizarPassword);
    return router;
}