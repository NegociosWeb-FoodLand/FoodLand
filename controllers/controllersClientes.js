// declaramos una variable global const elPedidoID
var elPedidoID = null;
var fecha = null;
var losdetallesPedidos = null;
var subtotalGeneral=null;
var losPlatillos = null;

// importar los modelos a utilizar
const Restaurantes = require('../models/Restaurante');
const Categorias = require('../models/Categorias');
const Platillos = require('../models/Platillos');
const Pedidos = require('../models/Pedidos');
const DetallePedido = require('../models/DetallePedido');
const Usuario = require('../models/Usuarios');

// Importar el módulo de envío de correos electrónicos
const enviarEmail = require('../handlers/emailComanda');

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
        elPedidoID,
        losdetallesPedidos,
        subtotalGeneral
    })
};

// configuramos la fucionalidad de crearPedido y detallePedido
exports.CrerPedidoConDetalle = async(req, res,next)=>{

    // capturar los datos enviados desde el formulario.
        const{id}= req.params;
        const{cantidad }=req.body;

    if(elPedidoID){
        // hay un pedido en proceso, solo se guarda el detalle.
        
        const elUsarioid = res.locals.usuario.id;

        // recuperar el id del pedido actual
        const pedido = await Pedidos.findOne({
            where:{
                idUsuario:elUsarioid,
                fecha: fecha
            }
        });

        // obteniendo los valores por promise
        elPedidoID = await  Promise.all([pedido]);

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
        await DetallePedido.create({
            sugerencia,
            cantidad,
            subtotal,
            url:url2,
            platillo:elPlatillo.id,
            pedido:pedido.id
        })

        subtotalGeneral += subtotal;
        subtotalGeneral.toPrecision()
        // traemos todos los platillos del restaurante
        losPlatillos = await Platillos.findAll({
            where:{
                idRestaurante:elPlatillo.idRestaurante
            }
        });
            
        //listamos los detalles del pedido
        mostrarDetalle( pedido.id);
        

    }else{

        // no hay pedidos pendientes, se creará un nuevo pedido.
        // obtenemos el id del usuario

        const elUsarioid = res.locals.usuario.id;

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

        await DetallePedido.create({
            sugerencia,
            cantidad,
            subtotal,
            url:url2,
            platillo:elPlatillo.id,
            pedido:pedido.id
        })

        mostrarDetalle( pedido.id);

        subtotalGeneral += subtotal;
        subtotalGeneral.toPrecision()

        // traemos todos los platillos del restaurante
        losPlatillos = await Platillos.findAll({
            where:{
                idRestaurante:elPlatillo.idRestaurante
            }
        });
    }

    //redireccionamos a la página de los platillos 

    res.render('platillos',{
        elPedidoID,
        losPlatillos
    });
    
}

exports.mostrarDetalleP = async(req, res, next)=>{
    // Obtenemos el detalle a editar
    const {id} = req.params;

    // buscar los datos del detalle seleccionado
    const elDetalle = DetallePedido.findOne({
        where: {
            id: id
        }
    });

    const[detalle] = await  Promise.all([elDetalle]);

    const platillo = Platillos.findOne({
        where: {
            id: detalle.platillo
        }
    });

    const[elPlatillo] = await  Promise.all([platillo]);


    // obtenemos el nombre del restaurante del platillo
    const elRestaurante = Restaurantes.findOne({
        where : {
            id : platillo.idRestaurante
        }
    });

    // obtenemos todos los detalles
    mostrarDetalle(detalle.pedido);
    console.log(detalle.cantidad);

    // renderizamos la página para editar

    res.render('platilloIndividual', {
        detalle,
        elPlatillo,
        elRestaurante,
        losdetallesPedidos,
        elPedidoID
    })
}

exports.editarDetalle = async(req, res, next) => {
    console.log("entra a editar el detalle");
    // Obtener el id del detalle
    const {id} = req.params;
    console.log(id);

    // Obtener la cantidad del detalle
    const {cantidad} = req.body;

    // buscar los datos del detalle seleccionado
    const elDetalle = DetallePedido.findOne({
        where: {
            id: id
        }
    });

    // Obtener los datos por promise
    const[detalle] = await  Promise.all([elDetalle]);

    const platillo = Platillos.findOne({
        where: {
            id: detalle.platillo
        }
    });

    const[elPlatillo] = await  Promise.all([platillo]);
    const subtotal = elPlatillo.precio *cantidad;
    await DetallePedido.update({
        sugerencia:"ninguna",
        cantidad:cantidad,
        subtotal:subtotal,
        url:detalle.url2,
        platillo:detalle.platillo,
        pedido:detalle.pedido

    }, 
    {
        where:{
            id:req.params.id
        }
    }
    );

    // obtenemos el nombre del restaurante del platillo
    const elRestaurante = Restaurantes.findOne({
        where : {
            id : platillo.idRestaurante
        }
    });

    // Capturamos todos los detalles del pedido
    mostrarDetalle(detalle.pedido);
    // redireccionamos a la misma página
    res.render('platilloIndividual', {
        losdetallesPedidos,
        elPlatillo,
        elRestaurante

    });
}

exports.eliminarPedidoConDetalle = async(req,res,next)=>{
    // 
}

// renderizamos la pantalla principal para el administrador
exports.comanda = async (req, res)=>{
   
    res.render('comanda',{
        losdetallesPedidos,
        elPedidoID
    })
};

exports.finalizarOrden= async(req,res)=>{
    // no hay mas detalles para el pedido actul
    // reiniciamos la variable del id para un nuevo pedido.
    elPedidoID = null;
<<<<<<< HEAD
    const elUsarioid = res.locals.usuario.id;

    const usuario = await Usuario.findOne({
        where: {
            id: elUsarioid
        }
    });

    console.log(usuario);

        // Envía el correo electrónico con el token generado
        await enviarEmail.enviarCorreoComanda({
            usuario,
            subject : 'Solicitud de pedido',
            vista : 'comandaEmail'
        });
    
        // redireccionar al inicio de sesión
        req.flash('correcto', 'Se ha enviado la confirmacion del pedido a tu correo electrónico');
        // res.redirect('/inicioSesion');
        res.redirect('/');
    }
=======
    console.log("tu pedido ha sido procesado");
    res.render('index',{})
};
>>>>>>> develop

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

<<<<<<< HEAD
=======
exports.eliminarDetalle = async (req, res, next)=>{
    // Obtener el id mediante query o params
    const { id } = req.params;

    // buscar los datos del detalle seleccionado
    const elDetalle = DetallePedido.findOne({
        where: {
            id: id
        }
    });

    // Obtener los datos por promise
    const[detalle] = await  Promise.all([elDetalle]);

    // Obtener el pedido del detalle actual
    const elPedido = await Pedidos.findOne({
        where:{
            id: detalle.pedido
        }
    })

    // Obtener los datos por promise
    const[pedido] = await  Promise.all([elPedido]);

    // Eliminar el detalle
    const resultado = await DetallePedido.destroy({
        where : {
            id  : id
        }
    });

    if(!resultado) {
        return next();
    }

    mostrarDetalle(pedido.id)

    res.redirect('/foodland/compraActual');
    res.send(200).send('El detalle ha sido eliminado correctamente');
}

>>>>>>> develop
function mostrarDetalle( id){
    // mandamos a llamar la vista creada en mysql para la comanda
    var mysql = require('mysql2')
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "FoodLand"
      });

    con.connect(function(err) {
        if (err) throw err;
        //Select all customers and return the result object:
        con.query(`SELECT * FROM vcomanda WHERE pedido = ${id}`, function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          losdetallesPedidos = result;
          console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/ listo");
          console.log(losdetallesPedidos);
          
        });
      });
}

