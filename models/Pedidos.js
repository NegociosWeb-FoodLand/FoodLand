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
});

module.exports = Pedido;