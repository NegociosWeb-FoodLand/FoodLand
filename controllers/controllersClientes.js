// importar los modelos a utilizar
const Restaurantes = require('../models/Restaurante');
const Categorias = require('../models/Categorias');
const Platillos = require('../models/Platillos');

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

// cargar los platillos de un restaurante en particular
exports.mostrarPlatillosporRestaurante =async(req,res)=>{

    const{id}=req.params
    console.log(id);
    // obtenemos todos los platillos del restaurante seleccionado
    const losPlatos = await Platillos.findAll({
        where:{
            idRestaurante:id
        }
    })

    // obtenemos por destructuring los restaurantes encontrados
    const[losPlatillos] = await Promise.all([losPlatos]);
    console.log(losPlatillos);
    // mostramos plas pantallas
    res.render('platillos',{
        losPlatillos
    });
};