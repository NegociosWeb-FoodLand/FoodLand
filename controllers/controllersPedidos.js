// importar los modelos a utilizar
const Pedidos = require('./models/Pedidos');


// FORMULARIO DE GUARDAR


exports.formularioGuardar = async (req, res) => {
    // Obtener todos los pedidos (modelos)
    const pedidos = await Pedidos.findAll();

    res.render('nuevoPedido', {
        nombrePagina : 'Nuevo pedido',
        pedidos
    });
};

exports.guardarDatos = async (req,res)=>{
    //verificando

    let {
        id, 
        idUsuario, 
        fecha, 
        total, 
        url
    }= req.body;
    let errores = [];

    if (!idUsuario || !fecha || !total || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoPedido', {
            nombrePagina : 'Nuevo pedido',
            pedidos,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Pedidos.create({
            id, 
            idUsuario, 
            fecha, 
            total, 
            url
        }),

        res.redirect('/');
    }
};


// FORMULARIO DE EDITAR


exports.formularioEditar = async (req, res) => {
    // Obtener todos los modelos
    console.log(req.params.id)
    const pedidosPromise = Pedidos.findAll();

    // Obtener el pedido a editar
    const pedidoPromise = Pedidos.findOne({
        where : {
            id : req.params.id
        }
    });

    // Promise con destructuring
    const [pedidos, pedido] = await Promise.all([pedidosPromise, pedidoPromise]);

    res.render('editor', {
        pedidos,
        pedido
    })
};

exports.actualizarPedido = async (req, res) => {
    // Obtener todos los pedidos (modelos)
    const pedidos = await Pedidos.findAll();

    // se valida que el input del formulario traiga un valor
    // destructuring

    const {
        id, 
        idUsuario, 
        fecha, 
        total, 
        url
    }= req.body;
    let errores = [];

    // Verificar si el nombre del proyecto tiene un valor
    if (!idUsuario || !fecha || !total || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('nuevoPedido', {
            nombrePagina : 'Nuevo pedido',
            pedidos,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Pedidos.update({
            idUsuario, 
            fecha, 
            total, 
            url
            },
            { where : {
                id : req.params.id
            }}
        ),

        res.redirect('/');
    }
};



//Eliminando pedido
exports.eliminarPedido= async (req, res, next) => {
    // Obtener el id mediante query o params
    const { id } = req.params;

    // Eliminar el pedido
    const resultado = await Pedidos.destroy({
        where : {
            id : id
        }
    });

    if(!resultado) {
        return next();
    }

    res.send(200).send('El pedido ha sido eliminado correctamente');
}

