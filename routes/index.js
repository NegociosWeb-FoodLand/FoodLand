// Creación de la dependencia del express y definición de router
const express = require('express');
const router = express.Router();

//i

// Importando los modelos de los controladores
const restauranteControllers = require('../controllers/controllersRestaurante')

const categoriasControllers = require('../controllers/controllersCategorias')

//defininedo las rutas
module.exports = function(){

    // llamando a la página principal

    router.get('/', restauranteControllers.mostrarPrincipalAdmin);
    
    router.get('/nuevo_Restaurante', restauranteControllers.formularioGuardar);
    router.post('/nuevo_Restaurante', restauranteControllers.guardarDatos);

    router.get('/nueva_Categoria', categoriasControllers.formularioGuardar);
    router.post('/nueva_Categoria', categoriasControllers.guardarDatos);

    return router;
}