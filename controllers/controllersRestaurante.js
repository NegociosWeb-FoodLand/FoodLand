// importar los modelos a utilizar
const Restaurantes = require('./models/Restaurante');


// FORMULARIO DE GUARDAR


exports.formularioGuardar = async (req, res) => {
    // Obtener todos los Restaurantes (modelos)
    const restautantes = await Restaurantes.findAll();

    res.render('nuevoRestaurante', {
        nombrePagina : 'Nuevo Restaurante',
        restaurantes
    });
};

exports.guardarDatos = async (req,res)=>{
    //verificando

    const {
        nombre, 
        descripcion, 
        telefono, 
        direccion,
        logo,
        ultimaModificacion,
        idCategoria,
        url
    }= req.body;
    let errores = [];

    if (!nombre || !descripcion || !telefono || !direccion || !logo || !ultimaModificacion || !idCategoria || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoRestaurante', {
            nombrePagina : 'Nuevo Restaurante',
            restautantes,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Restaurantes.create({
            nombre, 
            descripcion, 
            telefono, 
            direccion,
            logo,
            ultimaModificacion,
            idCategoria,
            url 
        }),

        res.redirect('/');
    }
};


// FORMULARIO DE EDITAR


exports.formularioEditar = async (req, res) => {
    // Obtener todos los modelos
    console.log(req.params.id)
    const restaurantesPromise = Restaurantes.findAll();

    // Obtener el restaurante a editar
    const restaurantePromise = Restaurantes.findOne({
        where : {
            id : req.params.id
        }
    });

    // Promise con destructuring
    const [restaurantes, restaurante] = await Promise.all([restaurantesPromise, restaurantePromise]);

    res.render('editor', {
        restaurantes,
        restaurante
    })
};

exports.actualizarRestaurante = async (req, res) => {
    // Obtener todos los restaurantes (modelos)
    const restaurantes = await Restaurantes.findAll();

    // se valida que el input del formulario traiga un valor
    // destructuring

    const {
        nombre, 
        descripcion, 
        telefono, 
        direccion,
        logo,
        ultimaModificacion,
        idCategoria,
        url
    }= req.body;
    let errores = [];

    // Verificar si el nombre del proyecto tiene un valor
    if (!nombre || !descripcion || !telefono || !direccion || !logo || !ultimaModificacion || !idCategoria || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('nuevoRestaurante', {
            nombrePagina : 'Nuevo Restaurante',
            restaurantes,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Restaurantes.update({ 
            nombre, 
            descripcion, 
            telefono, 
            direccion,
            logo,
            ultimaModificacion,
            idCategoria,
            url
            },
            { where : {
                id : req.params.id
            }}
        ),

        res.redirect('/');
    }
};



//Eliminando restaurante
exports.eliminarRestaurante = async (req, res, next) => {
    // Obtener el id mediante query o params
    const { id } = req.params;

    // Eliminar el restaurante
    const resultado = await Restaurante.destroy({
        where : {
            id : id
        }
    });

    if(!resultado) {
        return next();
    }

    res.send(200).send('El restaurante ha sido eliminado correctamente');
}

