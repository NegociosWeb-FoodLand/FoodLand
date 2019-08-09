// Importar passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al Modelo desde el cual se realiza la autenticación
const Usuario = require('../models/Usuarios');

// Definir nuestra estrategia de autentificación
passport.use(
    new LocalStrategy(
        // Por defecto passport espera un usuario y una contraseña
        {
            usernameField: 'correo',
            passwordField: 'password'
        },
        async(correo, password, done) => {
            try {
                console.log('Entra al try');
                // Realizar una búsqueda del usuario
                const usuario = await Usuario.findOne({
                    where: { correo: correo}
                });

                // El usuario existe, verificar si la contraseña es correcta
                if (!usuario.verificarPassword(password)){
                    console.log('Entra al if');
                    return done(null, false, {
                        message: 'La contraseña es incorrecta'
                    });
                }

                // El usuario y la contraseña son correctas
                return done(null, usuario);
                console.log(message);
            } catch(error){
                // el usuario no existe
                return done(null, false, {
                    message: 'La cuenta de correo electrónico no se encuentra registrado'
                });
            }
        }
    )
);

// Permite a passport leer los valores 
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Exportar
module.exports = passport;
