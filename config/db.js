// Se importa la dependencia sequelize
const Sequelize = require('sequelize');

// Se definen los parámetros de la conexión con la base de datos
const db = new Sequelize('FoodLand', 'root', '', {
    host : 'localhost',
    dialect : 'mysql',
    port : '3306',
    operatorAliases : false,

    define : {
        timestamps : false
    },

    pool : {
        max : 5,
        min : 0,
        acquire : 30000,
        idle : 10000
    }
});

module.exports = db