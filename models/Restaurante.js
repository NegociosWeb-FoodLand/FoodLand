//importamos de sequelize
const Sequelize = require('sequelize');

//importar la configuración de la base de datos (/config/db.js)
const db = require('../config/db.js');

// Importar slug
const slug = require('slug');

// Importar shortid
const shortid = require('shortid');


//Definimos los modelos a utilizar
const Restaurantes = db.define( 'restaurante',{
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

    telefono:{
        type: Sequelize.STRING
    },
    
    direccion:{
        type: Sequelize.TEXT
    },

    logo: {
        type: Sequelize.STRING
    },

    ultimaModificacion: {
        type: Sequelize.DATE
    },
    
    idCategoria: {
        type: Sequelize.INTEGER,
        references: {
            model: 'categoria',
            key: 'id'
        }
    },

    url: {
        type:Sequelize.STRING
    }

}, {
    hooks : {
        beforeCreate(restaurante) {
            console.log('Antes de insertar en la base de datos');
            const url = slug(restaurante.nombre).toLowerCase();           
            restaurante.url = `${url}-${shortid.generate()}`;

            
        },

        beforeUpdate(restaurante) {
            console.log('Antes de actualizar en la base de datos');
            const url = slug(restaurante.nombre).toLowerCase();

            restaurante.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Restaurantes;