// Creación de la dependencia del express y definición de router
const express = require('express');
const router = express.Router();

//i

// Importando los modelos de los controladores
const restauranteControllers = require('../controllers/controllersRestaurante')
//defininedo las rutas
module.exports = function(){

    // llamando a la página principal

    router.get('/', restauranteControllers.mostrarPrincipalAdmin);
    router.get('/nuevo_Restaurante', restauranteControllers.formularioGuardar);
    router.post('/nuevo_Restaurante', restauranteControllers.guardarDatos);

    return router;
}