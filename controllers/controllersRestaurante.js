// importar los modelos a utilizar
const Restaurantes = require('../models/Restaurante');
const Categorias = require('../models/Categorias');
// Importar los módulos para direcciones (path)
const path = require('path');

const carros = require('express-fileupload');
// renderizamos la pantalla principal para el administrador
exports.mostrarPrincipalAdmin = async (req, res)=>{

    // cargamos todos los restaurantes que se encuentran registrados en la BD.
    const restaurantes = await Restaurantes.findAll();
    //renderizamos el dashboard principal del administrador.
    res.render('index',{
        restaurantes
    })
};


// FORMULARIO DE GUARDAR
exports.formularioGuardar = async (req, res) => {
    // Obtener todos los Restaurantes (modelos)
    const restautantes = await Restaurantes.findAll();
    
    // Obtenemos todas las categorias a las que pueden pertenecer los restaurantes
    const lasCategorias = await Categorias.findAll();

    res.render('dashRestaurante-form', {
        restautantes,
        lasCategorias
    });
};

exports.guardarDatos = async (req,res)=>{
      // Obtener todos los Restaurantes (modelos)
      const restautantes = await Restaurantes.findAll();
    
      // Obtenemos todas las categorias a las que pueden pertenecer los restaurantes
      const lasCategorias = await Categorias.findAll();
    //Obtenemos los datos por destructuring
   const {nombre,descripcion,telefono, direccion,logo,nombreCategoria } = req.body;
    console.log('.----------------------------------------------------------------------');
    console.log(req.body);
    console.log(req.files);
   req.files.logo.mv( path.join(__dirname, `../public/images/Restaurantes/${req.files.logo.name}`)),err => {
    if(err) {
      return res.status(500).send({ message : err })
    } else {
      console.log('listo');
    }
  };
   
    //filtramos la categoria que fue seleccionada por el usuario
    const laCategoria = Categorias.findOne({
        where : {
            nombre : nombreCategoria
        }
    });

     // Promise con destructuring
     const [cat] = await Promise.all([laCategoria]);
     //asignando el id
        const idCategoria = cat.id;
    
    //definimos la fecha a guardar
    const ultimaModificacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    let errores = [];
    if (!nombre || !descripcion || !telefono || !direccion  || !ultimaModificacion) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        
        res.render('dashRestaurante-form', {
            nombrePagina : 'Nuevo Restaurante',
            restautantes,
            errores
        });
        res.render('error en la carga');
    } else {
        // No existen errores
        await Restaurantes.create({
            nombre, 
            descripcion, 
            telefono, 
            direccion,
            logo:req.files.logo.name,
            ultimaModificacion,
            idCategoria,
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

