//- Importar los módulos de express
const express = require('express');

const db = require('./config/db');

// Importar el modelo
require('./models/Categorias');
require('./models/Usuarios');
require('./models/Restaurante');
require('./models/Platillos');
require('./models/Pedidos');
require('./models/DetallePedido');

//
db.sync()
    .then(() => console.log('Conectado al servidor de BD'))
    .catch(error => console.log(error));

//- creamos una instancia de express
 const app = express();

 // iniciar el servidor en un puerto de escucha; en este caso puerto: 9000
 app.listen(9000);