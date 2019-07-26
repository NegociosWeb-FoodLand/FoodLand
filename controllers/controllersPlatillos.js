// importar los modelos a utilizar
const Platillos = require('./models/Platillos');


// FORMULARIO DE GUARDAR


exports.formularioGuardar = async (req, res) => {
    // Obtener todos los platillos (modelos)
    const platillos = await Platillos.findAll();

    res.render('nuevoPlatillo', {
        nombrePagina : 'Nuevo platillo',
        platillos
    });
};

exports.guardarDatos = async (req,res)=>{
    //verificando

    let {
        id, 
        nombre, 
        descripcion, 
        precio, 
        imagen, 
        idRestaurante,
        estado,
        ultimaModificacion,
        url
    }= req.body;
    let errores = [];

    if (
        !nombre ||
        !descripcion ||
        !precio || 
        !imagen ||
        !idRestaurante ||
        !estado ||
        !ultimaModificacion ||
        !url
    ) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoPlatillo', {
            nombrePagina : 'Nuevo platillo',
            usuarios,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Platillos.create({
            id, 
            nombre, 
            descripcion, 
            precio, 
            imagen, 
            idRestaurante,
            estado,
            ultimaModificacion,
            url
        }),

        res.redirect('/');
    }
};


// FORMULARIO DE EDITAR


exports.formularioEditar = async (req, res) => {
    // Obtener todos los modelos
    console.log(req.params.id)
    const platillosPromise = Platillos.findAll();

    // Obtener el platillo a editar
    const platilloPromise = Platillos.findOne({
        where : {
            id : req.params.id
        }
    });

    // Promise con destructuring
    const [platillos, platillo] = await Promise.all([platillosPromise, platilloPromise]);

    res.render('editor', {
        platillos,
        platillo
    })
};

exports.actualizarPlatillo = async (req, res) => {
    // Obtener todos los platillos (modelos)
    const platillos = await platillos.findAll();

    // se valida que el input del formulario traiga un valor
    // destructuring

    const {
        nombre, 
        descripcion, 
        precio, 
        imagen, 
        idRestaurante,
        estado,
        ultimaModificacion,
        url
    }= req.body;
    let errores = [];

    // Verificar si todos los campos tienen un valor
    if (
        !nombre ||
        !descripcion ||
        !precio || 
        !imagen ||
        !idRestaurante ||
        !estado ||
        !ultimaModificacion ||
        !url
    ) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('nuevoPlatillo', {
            nombrePagina : 'Nuevo platillo',
            platillos,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Platillos.update({
            nombre, 
            descripcion, 
            precio, 
            imagen, 
            idRestaurante,
            estado,
            ultimaModificacion,
            url
            },
            { where : {
                id : req.params.id
            }}
        ),

        res.redirect('/');
    }
};



//Eliminando platillo
exports.eliminarPlatillo = async (req, res, next) => {
    // Obtener el id mediante query o params
    const { id } = req.params;

    // Eliminar el platillo
    const resultado = await Platillos.destroy({
        where : {
            id : id
        }
    });

    if(!resultado) {
        return next();
    }

    res.send(200).send('El platillo ha sido eliminado correctamente');
}

