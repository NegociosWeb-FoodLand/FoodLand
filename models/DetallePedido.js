//importamos de sequelize
const Sequelize = require('sequelize');

//importar la configuración de la base de datos (/config/db.js)
const db = require('../config/db.js');

// Importar slug
const slug = require('slug');

// Importar shortid
const shortid = require('shortid');

const DetallePedido = db.define('detallepedido', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    sugerencia: {
        type: Sequelize.TEXT
    },

    cantidad: {
        type: Sequelize.INTEGER
    },

    subtotal: {
        type: Sequelize.DECIMAL
    },

    url: {
        type:Sequelize.STRING
    },

    platillo: {
        type: Sequelize.INTEGER,
        references: {
            model: 'platillos',
            key: 'id'
        }
    },

    pedido: {
        type:Sequelize.INTEGER,
        references: {
            model: 'pedidos',
            key: 'id'
        }
    }

});

module.exports = DetallePedido;