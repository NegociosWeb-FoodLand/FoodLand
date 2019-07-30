//importamos de sequelize
const Sequelize = require('sequelize');

//importar la configuración de la base de datos (/config/db.js)
const db = require('../config/db.js');

// Importar slug
const slug = require('slug');

// Importar shortid
const shortid = require('shortid');

//Definimos los modelos a utilizar
const Categoria = db.define( 'categoria',{
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

    imagen: {
        type: Sequelize.STRING
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
        beforeCreate(categoria) {
            console.log('Antes de insertar en la base de datos');
            const url = slug(categoria.nombre).toLowerCase();

            categoria.url = `${url}-${shortid.generate()}`;
        },

        beforeUpdate(categoria) {
            console.log('Antes de actualizar en la base de datos');
            const url = slug(categoria.nombre).toLowerCase();

            categoria.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Categoria;