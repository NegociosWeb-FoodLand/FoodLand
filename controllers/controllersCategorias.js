// importar los modelos a utilizar
const Categorias = require('../models/Categorias');

// Importar los módulos para direcciones (path)
const path = require('path');

const imgcat = require('express-fileupload');

// renderizamos la pantalla principal para el administrador
exports.mostrarPrincipalAdmin = async (req, res)=>{

    //renderizamos el dashboard principal del administrador.
    res.render('dashCategoria')
};


// FORMULARIO DE GUARDAR

exports.formularioGuardar = async (req, res) => {
    // Obtener todas las categorias (modelos)
    const categorias = await Categorias.findAll();

    res.render('dashCategoria', {
        categorias
    });
};
exports.formularioLlenarCategoria = async(req, res)=>{
     // Obtener todas las categorias (modelos)
     const categorias = await Categorias.findAll();

    res.render('dashCategoria-form',{
        categorias
    });
}

exports.guardarDatos = async (req,res)=>{

    // Obtenemos todas las categorias a las que pueden pertenecer los restaurantes
    const lasCategorias = await Categorias.findAll();
    
    
    //Obtenemos los datos por destructuring
   const {nombre ,descripcion ,imagen ,estado ,ultimaModificacion, url } = req.body;
    console.log('.----------------------------------------------------------------------');
    console.log(req.body);
    console.log(req.files);
   req.files.logo.mv( path.join(__dirname, `../public/images/Categorias/${req.files.logo.name}`)),err => {
    if(err) {
      return res.status(500).send({ message : err })
    } else {
      console.log('listo');
    }
  };


    //definimos la fecha a guardar
    var  ultimaModificacion1 = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //Verificamos si hay errores 

    let errores = [];

    if (!nombre || !descripcion || !imagen || !estado || !ultimaModificacion || !url) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('dashCategoria', {
            nombrePagina : 'Nueva categoria',
            categorias,
            errores
        });
        res.render('error en la carga');
    } else {
        // No existen errores
        // Inserción en la base de datos.
        await Categorias.create({
            nombre, 
            descripcion, 
            imagen:req.files.imagen.name, 
            estado, 
            ultimaModificacion:ultimaModificacion1,
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

