// importar los modelos a utilizar
const Proyecto = require('../models/Proyecto');
const Categorias = require('./models/Categorias');
const Usuarios = require('./models/Usuarios');
const Restaurantes = require('./models/Restaurante');
const Platillos = require('./models/Platillos');
const Pedidos = require('./models/Pedidos');
const DetallePedidos = require('./models/DetallePedido');

// FORMULARIO DE GUARDAR


exports.formularioGuardar = async (req, res) => {
    // Obtener todas las categorias (modelos)
    const categorias = await Categorias.findAll();

    res.render('nuevaCategoria', {
        nombrePagina : 'Nueva categoria',
        categorias
    });
};

exports.guardarDatos = async (req,res)=>{
    //verificando

    let {
        id, 
        nombre, 
        descripcion, 
        imagen, 
        estado, 
        ultimaModificacion,
        url
    }= req.body;
    let errores = [];

    if (!nombre || !descripcion || !imagen || !estado || !ultimaModificacion || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevaCategoria', {
            nombrePagina : 'Nueva categoria',
            categorias,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Categorias.create({
            id, 
            nombre, 
            descripcion, 
            imagen, 
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
    const categoriasPromise = Categorias.findAll();

    // Obtener la categoria a editar
    const categoriaPromise = Categorias.findOne({
        where : {
            id : req.params.id
        }
    });

    // Promise con destructuring
    const [categorias, categoria] = await Promise.all([categoriasPromise, categoriaPromise]);

    res.render('editor', {
        categorias,
        categoria
    })
};

exports.actualizarCategoria = async (req, res) => {
    // Obtener todas las categorias (modelos)
    const categorias = await Categorias.findAll();

    // se valida que el input del formulario traiga un valor
    // destructuring

    const {
        id, 
        nombre, 
        descripcion, 
        imagen, 
        estado, 
        ultimaModificacion,
        url
    }= req.body;
    let errores = [];

    // Verificar si el nombre del proyecto tiene un valor
    if (
        !id || 
        !nombre || 
        !descripcion || 
        !imagen ||
        !estado ||
        !ultimaModificacion ||
        !url
    ) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('nuevaCategoria', {
            nombrePagina : 'Nueva categoria',
            categorias,
            errores
        });
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Categorias.update({
            nombre, 
            descripcion, 
            imagen, 
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



//Eliminando usuario
exports.eliminarCategoria = async (req, res, next) => {
    // Obtener el id mediante query o params
    const { id } = req.params;

    // Eliminar el usuario
    const resultado = await Categorias.destroy({
        where : {
            id : id
        }
    });

    if(!resultado) {
        return next();
    }

    res.send(200).send('La categoria ha sido eliminada correctamente');
}

