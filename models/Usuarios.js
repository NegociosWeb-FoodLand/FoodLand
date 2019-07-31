//importamos de sequelize
const Sequelize = require('sequelize');

//importar la configuración de la base de datos (/config/db.js)
const db = require('../config/db.js');

// Importar slug
const slug = require('slug');

// Importar shortid
const shortid = require('shortid');

const Usuarios = db.define('usuario',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    usuarioNombre: {
        type:Sequelize.STRING
    },

    password : {
        type : Sequelize.STRING(60),
        allowNull : false,
        validate : {
            notEmpty : {
                msg : 'La contraseña no puede ser vacía'
            }
        }
    },

    correo: {
        type:Sequelize.STRING,
        allowNull : false,
        validate : {
            isEmail : {
                msg : 'Verifica que tu correo es un correo electrónico válido'
            },
            notEmpty : {
                msg : 'El correo electrónico no puede ser vacío'
            }
        },
        unique : {
            args : true,
            msg : 'Ya existe un usuario registrado con ésta dirección de correo electrónico'
        }
    },

    estado: {
        type:Sequelize.INTEGER
    },

    rol: {
        type:Sequelize.STRING
    },

    url: {
        type:Sequelize.STRING
    }
}, {
    hooks : {
        beforeCreate(usuario) {
            console.log('Antes de insertar en la base de datos');
            const url = slug(usuario.usuarioNombre).toLowerCase();

            usuario.url = `${url}-${shortid.generate()}`;
        },

        beforeUpdate(usuario) {
            console.log('Antes de actualizar en la base de datos');
            const url = slug(usuario.usuarioNombre).toLowerCase();

            usuario.url = `${url}-${shortid.generate()}`;
        }
    }
});

// importar los modelos para realizarlos
module.exports = Usuarios;