// Importar passport
const passport = require('passport');
// Importar el modelo de Usuario
const Usuario = require('../models/Usuarios');
// Importar el módulo crypto
const crypto = require('crypto');
// Importar Sequelize y los operadores de Sequelize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// Importar bcrypt
const bcrypt = require('bcrypt-nodejs');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/inicioSesion',
    failureFlash: true,
    badRequestMessage: 'Debes ingresar tu correo electrónico y tu contraseña'
});

exports.cerrarSesion = (req, res) => {
   // Redirigir al inicio de sesión
   req.session.destroy(() => {
       res.redirect('/inicioSesion');
   })
}

// Verificar si está autenticado o no
exports.usuarioAutenticado = (req, res, next) => {
    // si está autenticado que continue
    if (req.isAuthenticated()){
        return next();
    }


    // Si no está autenticado que inicie sesión
    return res.redirect('/inicioSesion');
}

// Generar token si el usuario es válido
exports.enviarToken = async(req, res) => {
    // verificar si el usuario existe
    const {correo} = req.body;
    const usuario = await Usuario.findOne({
        where: {
            correo: correo
        }
    });

    console.log('hola usuario' + usuario);

    if(!usuario){
        req.flash('error', 'El correo electrónico no es válido');
        res.redirect('/reestablecer');
    }

    // El usuario existe
    // Generar un token y una fecha de expiración para el mismo
    usuario.token = crypto.randomBytes(20).toString("hex");
    usuario.expiracion = Date.now() + 3600000;

    // Guardar el token y la expiración en la base de datos
    await usuario.save();

    // URL de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    console.log(resetUrl);
}

exports.validarToken = async(req, res) => {
    // Buscar el usuario que pertenece a dicho token
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token
        }
    });

    // Si no encuentra el usuario
    if(!usuario) {
        req.flash('error', 'El hipervínculo que seguiste no es válido');
        res.redirect('/reestablecer');
    }

    // Si el usuario existe, mostrarle el formulario para generar una nueva contraseña
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer la contraseña'
    });
}

exports.actualizarPassword = async(req, res) => {
    // Obtener el usuario mediante el token y verificar que
    // la fecha de expiración aún sea válida
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // Verificar si obtenemos un modelo de usuario
    if(!usuario) {
        req.flash('error', 'Token no válido o vencido, intenta de nuevo');
        res.redirect('/reestablecer');
    }

    // El token del usuario es correcto y aún no vence
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // Limpiar los valores del token y de la expiración
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos en la base de datos
    await usuario.save();

    // Redireccionar al inicio de sesión
    req.flash('correcto', 'la contraseña se ha modificado correctamente');
    req.redirect('/inicioSesion');
}
