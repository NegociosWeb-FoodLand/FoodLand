// importar los modelos a utilizar
const Proyecto = require('../models/Proyecto');
const Categoria = require('./models/Categorias');
const Usuarios = require('./models/Usuarios');
const Restaurantes = require('./models/Restaurante');
const Platillos = require('./models/Platillos');
const Pedidos = require('./models/Pedidos');
const DetallePedidos = require('./models/DetallePedido');

// FORMULARIO DE GUARDAR


exports.formularioGuardar = async (req, res) => {
    // Obtener todos los usuarios (modelos)
    const usuarios = await Usuarios.findAll();

    res.render('nuevoUsuario', {
        nombrePagina : 'Nuevo usuario',
        usuarios
    });
};

exports.guardarDatos = async (req,res)=>{
    //verificando

    let {id, usuarioNombre, correo, estado, rol}= req.body;
    let errores = [];

    if (!usuarioNombre || !correo || !estado || !rol) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoUsuario', {
            nombrePagina : 'Nuevo usuario',
            usuarios,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Usuarios.create({
            id, 
            usuarioNombre, 
            correo, 
            estado, 
            rol
        }),

        res.redirect('/');
    }
};


// FORMULARIO DE EDITAR


exports.formularioEditar = async (req, res) => {
    // Obtener todos los modelos
    console.log(req.params.id)
    const usuariosPromise = Usuarios.findAll();

    // Obtener el usuario a editar
    const usuarioPromise = Usuarios.findOne({
        where : {
            id : req.params.id
        }
    });

    // Promise con destructuring
    const [usuarios, usuario] = await Promise.all([usuariosPromise, usuarioPromise]);

    res.render('editor', {
        usuarios,
        usuario
    })
};

exports.actualizarUsuario = async (req, res) => {
    // Obtener todos los usuarios (modelos)
    const usuarios = await Usuarios.findAll();

    // se valida que el input del formulario traiga un valor
    // destructuring

    const {id, usuarioNombre, correo, estado, rol}= req.body;
    let errores = [];

    // Verificar si el nombre del proyecto tiene un valor
    if (!usuarioNombre || !correo || !estado || !rol) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('nuevoUsuario', {
            nombrePagina : 'Nuevo usuario',
            usuarios,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Usuarios.update({
            id, 
            usuarioNombre, 
            correo, 
            estado, 
            rol
            },
            { where : {
                id : req.params.id
            }}
        ),

        res.redirect('/');
    }
};



//Eliminando usuario
exports.eliminarUsuario = async (req, res, next) => {
    // Obtener el id mediante query o params
    const { id } = req.params;

    // Eliminar el usuario
    const resultado = await usuarios.destroy({
        where : {
            id : id
        }
    });

    if(!resultado) {
        return next();
    }

    res.send(200).send('El usuario ha sido eliminado correctamente');
}

