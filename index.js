//- Importar los módulos de express
const express = require('express');

//// Importar las rutas disponibles
const routes = require('./routes');

// Importar los módulos para utilizar body parser
const bodyParser = require('body-parser');

// Importar los módulos para direcciones (path)
const path = require('path');

const db = require('./config/db');

// Importar el modelo
require('./models/Categorias');
require('./models/Usuarios');
require('./models/Restaurante');
require('./models/Platillos');
require('./models/Pedidos');
require('./models/DetallePedido');




db.sync()
    .then(() => console.log('Conectado al servidor de BD'))
    .catch(error => console.log(error));

//- creamos una instancia de express
 const app = express();

 // Desde dónde se cargan los archivos estáticos
app.use(express.static('public'));

// Habilitar Pug como nuestro Template Engine
app.set('view engine', 'pug');

// Habilitar BodyParser para leer los datos de los formularios
app.use(bodyParser.urlencoded({extended: true}));

 // Añadir la carpeta (ruta) que contiene las View (vistas)
app.set('views', path.join(__dirname, './views'));

app.use('/', routes());

 // iniciar el servidor en un puerto de escucha; en este caso puerto: 9000
 app.listen(9000);