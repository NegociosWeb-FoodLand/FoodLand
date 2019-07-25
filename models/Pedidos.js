//importamos de sequelize
const Sequelize = require('sequelize');

//importar la configuración de la base de datos (/config/db.js)
const db = require('../config/db.js');

// Importar slug
const slug = require('slug');

// Importar shortid
const shortid = require('shortid');

//Definimos los modelos a utilizar
const Pedido = db.define( 'pedido',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    idUsuario: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },

    fecha: {
        type: Sequelize.DATE
    },

    total: {
        type: Sequelize.DECIMAL
    },

    url: {
        type:Sequelize.STRING
    }
}, {
    hooks : {
        beforeCreate(publicacion) {
            console.log('Antes de insertar en la base de datos');
            const url = slug(publicacion.titulo).toLowerCase();

            publicacion.url = `${url}-${shortid.generate()}`;
        },

        beforeUpdate(publicacion) {
            console.log('Antes de actualizar en la base de datos');
            const url = slug(publicacion.nombre).toLowerCase();

            publicacion.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Pedido;