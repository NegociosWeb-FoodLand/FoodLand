// importar los modelos a utilizar
const DetallePedidos = require('./models/DetallePedido');

// FORMULARIO DE GUARDAR


exports.formularioGuardar = async (req, res) => {
    // Obtener todos los detalles de pedido (modelos)
    const dPedidos = await DetallePedidos.findAll();

    res.render('nuevoDPedido', {
        nombrePagina : 'Nuevo detalle de pedido',
        usuarios
    });
};

exports.guardarDatos = async (req,res)=>{
    //verificando

    const {
        sugerencia, 
        cantidad, 
        subtotal, 
        url, 
        platillo, 
        pedido
    }= req.body;
    let errores = [];

    if (
        !sugerencia || 
        !cantidad || 
        !subtotal || 
        !url || 
        !platillo || 
        !pedido) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoDPedido', {
            nombrePagina : 'Nuevo detalle de pedido',
            usuarios,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await DetallePedidos.create({
            sugerencia, 
            cantidad, 
            subtotal, 
            url, 
            platillo, 
            pedido
        }),

        res.redirect('/');
    }
};


// FORMULARIO DE EDITAR


exports.formularioEditar = async (req, res) => {
    // Obtener todos los modelos
    console.log(req.params.id)
    const dpedidosPromise = DetallePedidos.findAll();

    // Obtener el detalle de pedido a editar
    const dpedidoPromise = DetallePedidos.findOne({
        where : {
            id : req.params.id
        }
    });

    // Promise con destructuring
    const [dpedidos, dpedido] = await Promise.all([dpedidosPromise, dpedidoPromise]);

    res.render('editor', {
        dpedidos,
        dpedido
    })
};

exports.actualizarDPedido = async (req, res) => {
    // Obtener todos los detalles de pedidos (modelos)
    const dpedidos = await DetallePedidos.findAll();

    // se valida que el input del formulario traiga un valor
    // destructuring

    const {
        sugerencia, 
        cantidad, 
        subtotal, 
        url, 
        platillo, 
        pedido
    }= req.body;
    let errores = [];

    // Verificar si los campos tienen un valor
    if (!sugerencia || 
        !cantidad || 
        !subtotal || 
        !url || 
        !platillo || 
        !pedido) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('nuevoDPedido', {
            nombrePagina : 'Nuevo detalle de pedido',
            dpedidos,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await DetallePedidos.update({
            sugerencia, 
            cantidad, 
            subtotal, 
            url, 
            platillo, 
            pedido
            },
            { where : {
                id : req.params.id
            }}
        ),

        res.redirect('/');
    }
};



//Eliminando Detalle de pedido
exports.eliminarDPedido = async (req, res, next) => {
    // Obtener el id mediante query o params
    const { id } = req.params;

    // Eliminar el detalle de pedido
    const resultado = await DetallePedidos.destroy({
        where : {
            id : id
        }
    });

    if(!resultado) {
        return next();
    }

    res.send(200).send('El detalle de pedido ha sido eliminado correctamente');
}

