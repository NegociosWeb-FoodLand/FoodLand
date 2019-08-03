// Creación de la dependencia del express y definición de router
const express = require('express');
const router = express.Router();

//i

// Importando los modelos de los controladores
const restauranteControllers = require('../controllers/controllersRestaurante')

const categoriasControllers = require('../controllers/controllersCategorias')

const platillosControllers = require('../controllers/controllersPlatillos')


//defininedo las rutas
module.exports = function(){

    // llamando a la página principal

    router.get('/', restauranteControllers.mostrarPrincipalAdmin);
    
    router.get('/nuevo_Restaurante', restauranteControllers.formularioGuardar);
    router.post('/nuevo_Restaurante', restauranteControllers.guardarDatos);

    router.get('/editar_Restaurante/:id',restauranteControllers.formularioEditar);
    router.post('/nuevo_Restaurante/:id',restauranteControllers.actualizarRestaurante);

    router.get('/nueva_Categoria', categoriasControllers.formularioGuardar);
    router.get('/categoriaForm',categoriasControllers.formularioLlenarCategoria);
    router.post('/nueva_Categoria', categoriasControllers.guardarDatos);

    router.get('/editar_Restaurante/:id',restauranteControllers.formularioEditar);
    router.post('/nuevo_Restaurante/:id',restauranteControllers.actualizarRestaurante);
    router.delete('/:id', restauranteControllers.eliminarRestaurante);

    router.get('/editar_Categoria/:id',categoriasControllers.formularioEditar);
    router.post('/nueva_Categoria/:id',categoriasControllers.actualizarCategoria);

    router.get('/editar_Restaurante/:id',restauranteControllers.formularioEditar);

    router.get('/nuevo_Platillo', platillosControllers.formularioGuardar);
    router.get('/PlatilloForm',platillosControllers.formularioLlenarPlatillo);
    router.post('/nuevo_Platillo', platillosControllers.guardarDatos);

    return router;
}