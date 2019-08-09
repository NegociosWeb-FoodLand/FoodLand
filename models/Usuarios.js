//importamos de sequelize
const Sequelize = require('sequelize');

//importar la configuración de la base de datos (/config/db.js)
const db = require('../config/db.js');

// Importar slug
const slug = require('slug');

// Importar shortid
const shortid = require('shortid');

// Importar bcrypt
const bcrypt = require('bcrypt-nodejs');

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

    imagen: {
        type: Sequelize.STRING
    },

    estado: {
        type:Sequelize.INTEGER
    },

    token: {
        type:Sequelize.STRING
    },

    expiracion: {
        type: Sequelize.DATE
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

            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        },

        beforeUpdate(usuario) {
            console.log('Antes de actualizar en la base de datos');
           
            const url = slug(usuario.usuarioNombre).toLowerCase();

            usuario.url = `${url}-${shortid.generate()}`;

            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

// Métodos personalizados
// Verificar si el password enviado es igual al existente
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

// importar los modelos para realizarlos
module.exports = Usuarios;