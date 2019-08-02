// importar los modelos a utilizar

const Usuarios = require('../models/Usuarios');



// FORMULARIO DE GUARDAR


exports.formularioGuardar = async (req, res) => {
    // Obtener todos los usuarios (modelos)
    const usuarios = await Usuarios.findAll();

    res.render('dashUsuarios', {
        usuarios
    });
};

exports.formularioLlenarUsuario = async(req, res)=>{
    // Obtener todos los usuarios
    const usuarios = await Usuarios.findAll();

    res.render('dashUsuarios-form', {
        usuarios
    })
}

exports.guardarDatos = async (req,res)=>{
    //verificando

    const {usuarioNombre, correo, estado, rol, url}= req.body;
    let errores = [];

    if (!usuarioNombre || !correo || !estado || !rol || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('dashUsuarios', {
            nombrePagina : 'Nuevo usuario',
            usuarios,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Usuarios.create({
            usuarioNombre,
            password, 
            correo, 
            estado, 
            rol,
            url
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

    const {usuarioNombre, correo, estado, rol, url}= req.body;
    let errores = [];

    // Verificar si el nombre del proyecto tiene un valor
    if (!usuarioNombre || !correo || !estado || !rol || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('dashUsuarios-form', {
            nombrePagina : 'Editar usuario',
            usuarios,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Usuarios.update({
            usuarioNombre, 
            correo, 
            estado, 
            rol,
            url
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

