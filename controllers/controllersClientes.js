// declaramos una variable global const elPedidoID
var elPedidoID = null;
var fecha = null;
// importar los modelos a utilizar
const Restaurantes = require('../models/Restaurante');
const Categorias = require('../models/Categorias');
const Platillos = require('../models/Platillos');
const Pedidos = require('../models/Pedidos');
const DetallePedido = require('../models/DetallePedido');

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
        lasCategorias,
        elPedidoID
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
        losPlatillos,
        elPedidoID
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
        elRestaurante,
        elPedidoID
    })

};

// configuramos la fucionalidad de crearPedido y detallePedido
exports.CrerPedidoConDetalle = async(req, res,next)=>{
    console.log("llego al controlador");
    // capturar los datos enviados desde el formulario.
    const{id}= req.params;
    const{cantidad}=req.body;

    if(elPedidoID){
    
        const elUsarioid = res.locals.usuario.id;
            // hay un pedido en proceso, solo se guarda el detalle.
                // recuperar el id del pedido actual
            const pedido = await Pedidos.findOne({
                where:{
                    idUsuario:elUsarioid,
                    fecha: fecha
                }
            });
            // obteniendo los valores por promise
            elPedidoID = await  Promise.all([pedido]);

            //comenzamos a guardar el detalle del pedido

            // obtener las especificaciones del platillo seleccionado.
            const platillo = await Platillos.findOne({
                where:{
                    id:id
                }
            });

            // obteniendo los valores por promise
            const[elPlatillo] = await  Promise.all([platillo]);

            const sugerencia = "ninguna";
            const subtotal = cantidad * elPlatillo.precio;
            const url2 = "dfmdflkhjn";

            //guardamos el detalle del pedido
            console.log("la cantidad es " + cantidad)
            console.log(pedido.id);
            console.log(elPlatillo.precio);
            console.log("*******************************************************************");
            await DetallePedido.create({
            sugerencia,
            cantidad,
            subtotal,
            url:url2,
            platillo:elPlatillo.id,
            pedido:pedido.id
            })

            console.log("el detalle tambíen se ha guardado correctamente")
            
    }else{
        // no hay pedidos pendientes, se creará un nuevo pedido.
        // obtenemos el id del usuario
        const elUsarioid = res.locals.usuario.id;
        console.log(res.locals.usuario.id);

        // obtenemos la fecha de creación
         fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // definimos el total
        const total = 0;

        const url = "userfh32ggf-cm";

        //Guardamos los valores en las base de datos
        await Pedidos.create({
        idUsuario:elUsarioid,
        fecha,
        total,
        url
        })

        // recuperar el id del pedido actual
        const pedido = await Pedidos.findOne({
            where:{
                idUsuario:elUsarioid,
                fecha: fecha
            }
        });
        // obteniendo los valores por promise
        elPedidoID = await  Promise.all([pedido]);

        //comenzamos a guardar el detalle del pedido

        // obtener las especificaciones del platillo seleccionado.
        const platillo = await Platillos.findOne({
            where:{
                id:id
            }
        });

        // obteniendo los valores por promise
        const[elPlatillo] = await  Promise.all([platillo]);

        const sugerencia = "ninguna";
        const subtotal = cantidad * elPlatillo.precio;
        const url2 = "dfmdflkhjn";

        //guardamos el detalle del pedido
        console.log("la cantidad es " + cantidad)
        console.log(pedido.id);
        console.log(elPlatillo.precio);
        console.log("*******************************************************************");
        await DetallePedido.create({
        sugerencia,
        cantidad,
        subtotal,
        url:url2,
        platillo:elPlatillo.id,
        pedido:pedido.id
        })

        console.log("el detalle tambíen se ha guardado correctamente")
 
    }
    // traemos todos los restaurantes disponibles
    const losRestaurantes = await Restaurantes.findAll();

    // traemos todas las categorias disponibles
    const lasCategorias = await Categorias.findAll();

    // obtenemos todos los detalles del pedido actual.
    // const losdetallesPedidos = await DetallePedido.findOne({
    //     where:{
    //         pedido=
    //     }
    // });

    //redireccionamos a la página de los platillos 

    res.render('categoriasRestaurantes',{
        elPedidoID,
        losRestaurantes,
        lasCategorias
    });
    
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
