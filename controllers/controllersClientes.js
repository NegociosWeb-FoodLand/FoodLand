// importar los modelos a utilizar
const Restaurantes = require('../models/Restaurante');
const Categorias = require('../models/Categorias');
const Platillos = require('../models/Platillos');

const Pedidos = require('../models/Pedidos');
const DetallePedido = require('../models/Pedidos');

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
    // obtenemos todos los platillos del restaurante seleccionado
    const losPlatos = await Platillos.findAll({
        where:{
            idRestaurante:id
        }
    })

    // obtenemos por destructuring los restaurantes encontrados
    const[losPlatillos] = await Promise.all([losPlatos]);
    // mostramos plas pantallas
    res.render('platillos',{
        losPlatillos
    });
};

// cargar la información de un platillo individual
exports.mostrarInformaciónPlatillo=async(req,res)=>{
    // obtenenos el id del platillo seleccionado
    const{id}= req.params
    
    //obtenemos la información del restaurante seleccionado
    const platillo = await Platillos.findOne({
        where:{
            id:id
        }
    });

    // obtenemos el nombre del restaurante del platillo
    const restaurante = Restaurantes.findOne({
        where : {
            id : platillo.idRestaurante
        }
    });

    // obtenemos el valor por destructuring
    const [elPlatillo, elRestaurante] = await Promise.all([platillo, restaurante]);
    //renderizamos la vista
    res.render('platilloIndividual',{
        elPlatillo,
        elRestaurante
    })

};

// configuramos la fucionalidad de crearPedido y detallePedido
exports.CrerPedidoConDetalle = async(req, res)=>{

    // capturar los datos enviados desde el formulario.
    const{cantidad, id}= req.params;

    // obtener las especificaciones del platillo seleccionado.
    const platillo = await Platillos.findOne({
        where:{
            id:id
        }
    });

    // obteniendo los valores por promise
    const[elPlatillo] = await  Promise.all([platillo]);
    
    // obtenemos el id del usuario

    // obtenemos la fecha de creación
    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // definimos el total
    const total = 0;


     //Guardamos los valores en las base de datos
     await Pedidos.create({
       idUsuario,
       fecha,
       total,
       url
    })

}

// renderizamos la pantalla para mostrar informacion sobre nosotros
exports.mostrarAcerca = async (req, res)=>{
    res.render('acerca',{})
};

// renderizamos la pantalla principal para contacto
exports.mostrarContacto = async (req, res)=>{
    res.render('contacto',{})
};


// renderizamos la pantalla principal para el historial del usuario
exports.mostrarPedidos = async (req, res)=>{
    res.render('comprasUsuario',{})
};

