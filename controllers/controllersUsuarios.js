// importar los modelos a utilizar
const Usuarios = require('../models/Usuarios');

// Importar los módulos para direcciones (path)
const path = require('path');

// importar .... para eliminar archivos del servidor
const fs = require('fs');
const shortid = require('shortid');

const slug = require('slug');

const archivo = require('express-fileupload');

// FORMULARIO INICIO DE SESION
exports.iniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('login', {
        nombrePagina: 'Inicio de sesión FoodLand',
        error
    })
};

exports.formularioRestablecerPassword = async(req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    });
}

// FORMULARIO DE AGREGAR

exports.formularioLlenarUsuario = async(req, res)=>{
    // Obtener todos los usuarios
    const usuarios = await Usuarios.findAll();

    res.render('registrarse', {
        usuarios
    })
}

exports.guardarDatos = async (req,res)=>{
    //verificando

    const usuarios = await Usuarios.findAll();

    const {usuarioNombre, correo, password}= req.body;
    
    let errores = [];

    if (!usuarioNombre || !correo || !password) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('registrarse', {
            nombrePagina : 'Nuevo usuario',
            usuarios,
            errores
        });
        console.log('error en la carga');
    } else {

        var imagenUsuario="";
        // console.log(req.files);
        
        if(req.files){
            req.files.imagen.mv(path.join(__dirname, `../public/images/Usuarios/${req.files.imagen.name}`)), err => {
                if(err){
                    return res.status(500).send({message: err})
                } else {
                    console.log('listo');
                }
            };

            const url = slug(req.files.imagen.name).toLowerCase();
            imagenUsuario = `${url}-${shortid.generate()}`;

            // renombramos la imagen con el valor contenido en la base de datos
            fs.rename(path.join(__dirname, `../public/images/Usuarios/${req.files.imagen.name}`), path.join(__dirname, `../public/images/Usuarios/${imagenUsuario}`), function(err) { if( err ) console.log('ERROR: '+ err); });
            // console.log(req.body.imagen);
        } else {
            // El usuario no ha seleccionado ninguna foto, se inserta una por defecto
            // console.log(req.body.imagen);
            imagenUsuario = "Usuario.png";
        }
        // No existen errores
        const elEstado = 1;
        
        //Guardamos los valores en las base de datos
        await Usuarios.create({
            usuarioNombre,
            password, 
            correo, 
            imagen:imagenUsuario,
            estado:elEstado
        }),

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

