//- Importar los módulos de express
const express = require('express');

//// Importar las rutas disponibles
const routes = require('./routes');

// Importar los módulos para utilizar body parser
const bodyParser = require('body-parser');

// Importar los módulos para direcciones (path)
const path = require('path');

//Importar elmódulo para subir archivos con express-fileUpload
const fileUpload = require('express-fileupload');

//importamos la configuración a la base de datos.
const db = require('./config/db');

// Importar express-session para poder manejar sesiones de usuario
const session = require('express-session');

// Importar passport para permitir el inicio de sesión en el sitio
const passport = require('./config/passport');

// Importar los helpers con funciones en común para el proyecto
const helpers = require('./helpers');

// importar connect-flash disponible para el sitio
const flash = require('connect-flash');

// importar cookie-parser para permitir el uso de cookies en el sitio
const cookieParser = require('cookie-parser');

// Importar el modelo
require('./models/Categorias');
require('./models/Usuarios');
require('./models/Restaurante');
require('./models/Platillos');
require('./models/Pedidos');
require('./models/DetallePedido');

//realizamos la conexión a la base de datos.
db.sync()
    .then(() => console.log('Conectado al servidor de BD'))
    .catch(error => console.log(error));

//- creamos una instancia de express
 const app = express();

 // Desde dónde se cargan los archivos estáticos
app.use(express.static('public'));

//Habilitamos funcionalidad de fileUpload para la carga de archivos.
app.use(fileUpload());

// Habilitar Pug como nuestro Template Engine
app.set('view engine', 'pug');

// Habilitar BodyParser para leer los datos de los formularios
app.use(bodyParser.urlencoded({extended: true}));

// Habilitar el uso de mensajes de tipo connect-flash
app.use(flash());

app.use(cookieParser());

// habilitar las sesiones
app.use(session({
    secret: 'unultrasecreto',
    resave: false,
    saveUninitialized: false
}));


// Crear una instancia de passport
app.use(passport.initialize());
app.use(passport.session());

// Pasar el vadump a la aplicación (middleware)
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user}||null;
    next();
});

 // Añadir la carpeta (ruta) que contiene las View (vistas)
app.set('views', path.join(__dirname, './views'));

// importamos todas las rutas que se utilizarán.
app.use('/', routes());

 // iniciar el servidor en un puerto de escucha; en este caso puerto: 9000
 app.listen(9000);