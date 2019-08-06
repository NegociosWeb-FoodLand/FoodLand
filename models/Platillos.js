//importamos de sequelize
const Sequelize = require('sequelize');

//importar la configuración de la base de datos (/config/db.js)
const db = require('../config/db.js');

// Importar slug
const slug = require('slug');

// Importar shortid
const shortid = require('shortid');

//Definimos los modelos a utilizar
const Platillo = db.define( 'platillo',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre:{
        type: Sequelize.STRING
    },

    descripcion : {
        type: Sequelize.STRING
    },

    precio:{
        type: Sequelize.DECIMAL(10,2),
        
    },

    imagen: {
        type: Sequelize.STRING
    },

    idRestaurante: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Restaurantes',
            key: 'id'
        }
    },

    estado: {
        type: Sequelize.INTEGER
    },

    ultimaModificacion: {
        type: Sequelize.DATE
    },

    url: {
        type:Sequelize.STRING
    }
}, {
    hooks : {
        beforeCreate(platillo) {
            console.log('Antes de insertar en la base de datos');
            const url = slug(platillo.nombre).toLowerCase();

            platillo.url = `${url}-${shortid.generate()}`;
        },

        beforeUpdate(platillo) {
            console.log('Antes de actualizar en la base de datos');
            const url = slug(platillo.nombre).toLowerCase();

            platillo.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Platillo;