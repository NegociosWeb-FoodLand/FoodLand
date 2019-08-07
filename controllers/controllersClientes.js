// importar los modelos a utilizar
const Restaurantes = require('../models/Restaurante');
const Categorias = require('../models/Categorias');

// renderizamos la pantalla principal para el administrador
exports.principalCliente = async (req, res)=>{
    res.render('index',{})
};


// carga de todos los restaurantes disponibles
exports.mostrarRestaurantes = async(req,res)=>{
    // traemos todos los restaurantes disponibles
    const losRestaurantes = await Restaurantes.findAll();

    // traemos todas las categorias disponibles
    const lasCategorias = await Categorias.findAll();

    //mostramos la vista de los restaurantes
    res.render('categoriasRestaurantes',{
        losRestaurantes,
        lasCategorias
    });

};
