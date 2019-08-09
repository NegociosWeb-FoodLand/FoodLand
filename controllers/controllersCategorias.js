// importar los modelos a utilizar
const Categorias = require('../models/Categorias');

// Importar los módulos para direcciones (path)
const path = require('path');

// importar .... para eliminar archivos del servidor
const fs = require('fs');
const shortid = require('shortid');

const slug = require('slug');

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
   const {nombre ,descripcion ,estado , url } = req.body;
    console.log('.----------------------------------------------------------------------');
    (req.body);


    //definimos la fecha a guardar
<<<<<<< HEAD
    ultimaModificacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
=======
    var  ultimaModificacion1 = new Date().toISOString().slice(0, 19).replace('T', ' ');
>>>>>>> a5903baf06bedf1cece415132568f933247337f2

    //Verificamos si hay errores 

    let errores = [];

    if (!nombre || !descripcion || !estado) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }
    
    // Si hay errores
    if (errores.length > 0) {
        res.render('dashCategoria-form', {
            nombrePagina : 'Nueva categoria',
            lasCategorias,
            errores
        });
        res.render('error en la carga');
    } else {
        // No existen errores
        var nombreImagen ="";
        console.log(req.files);
        if(req.files){
            // guardamos la imagen que ha sido seleccionada por el usuario.
            req.files.icono.mv( path.join(__dirname, `../public/images/Categorias/${req.files.icono.name}`)),err => {
                if(err) {
                    return res.status(500).send({ message : err })
                } else {
                    console.log('listo');
                }
            };
            const url = slug(req.files.icono.name).toLowerCase();           
            nombreImagen = `${url}-${shortid.generate()}`;

            // renombramos la imagen con el valor contenido en la base de datos
            fs.rename( path.join(__dirname, `../public/images/Categorias/${req.files.icono.name}`), path.join(__dirname, `../public/images/Categorias/${nombreImagen}`),function(err) { if ( err ) console.log('ERROR: ' + err); });            
            console.log(req.body.icono);
            
        }else{
            // usuario no ha seleccionado ninguna foto, se inserta una por defecto.
            console.log(req.body.icono)
            nombreImagen = "categoria.png";
        }
        
        //Guardamos los valores en las base de datos
        await Categorias.create({
            nombre, 
            descripcion, 
            imagen:nombreImagen, 
            estado, 
            ultimaModificacion:ultimaModificacion1,
            url
        }),
        res.redirect('/nueva_Categoria');
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

    res.render('dashCategoria-form', {
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
        estado,
        actual
    }= req.body;
    let errores = [];

    //definimos la fecha a guardar
    const ultimaModificacion1 = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    // Verificar si el nombre del proyecto tiene un valor
    if (
        !nombre || 
        !descripcion || 
        !estado
    ) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('dashCategoria', {
            nombrePagina : 'Nueva categoria',
            categorias,
            errores
        });
    } else {
        // No existen errores
        var nombreImagen ="";

        //validamos si se seleccionó otra imagen diferente
        if(req.files){
            //  se seleccionó un logo diferente
            
            //1. guardar la nueva imagen.
            req.files.icono.mv( path.join(__dirname, `../public/images/Categorias/${req.files.icono.name}`)),err => {
                if(err) {
                  return res.status(500).send({ message : err })
                } else {
                  console.log('listo');
                }
              };

            // 2. Eliminamos el logo anterior
            console.log(actual);
            if(actual.trim() !='categoria.png'){
                fs.unlink(path.join(__dirname, `../public/images/Categorias/${actual.trim()}`) , (err) => {
                    if (err) throw err;
                    console.log('Borrado completo');
                  });
            }

            // 3. identificador de la imagen
            const url = slug(req.files.icono.name).toLowerCase();           
            nombreImagen = `${url}-${shortid.generate()}`;

            // renombramos la imagen con el valor contenido en la base de datos
            fs.rename( path.join(__dirname, `../public/images/Categorias/${req.files.icono.name}`), path.join(__dirname, `../public/images/Categorias/${nombreImagen}`),function(err) { if ( err ) console.log('ERROR: ' + err); });            
            console.log(req.body.icono);
    
        }else{
            nombreImagen = actual;
        }
              
        //Guardamos los cambios realizados.
            await Categorias.update({
                nombre, 
                descripcion, 
                imagen:nombreImagen, 
                estado, 
                ultimaModificacion:ultimaModificacion1
                },
                { where : {
                    id : req.params.id
                }}
            ),
            
            res.redirect('/nueva_Categoria');
    }
};



//Eliminando categoría
exports.eliminarCategoria = async (req, res, next) => {
    // Obtener el id mediante query o params
    const { id } = req.params;

    // Eliminar imagen del servidor
    const la_Categoria = Categorias.findOne({
        where : {
            id: id
        }
    });
    // obtenenemos los valores por promise
    const [laCategoria] = await Promise.all([la_Categoria]);

    console.log(laCategoria.imagen);
    if(laCategoria.imagen.trim() !='categoria.png'){
        fs.unlink(path.join(__dirname, `../public/images/Categorias/${laCategoria.imagen.trim()}`) , (err) => {
            if (err) throw err;
            console.log('Borrado completo');
           });
     }

    // Eliminar la categoria
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
