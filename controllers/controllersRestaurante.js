// importar los modelos a utilizar
const Restaurantes = require('../models/Restaurante');
const Categorias = require('../models/Categorias');
// Importar los módulos para direcciones (path)
const path = require('path');

// importar .... para eliminar archivos del servidor
const fs = require('fs');
const shortid = require('shortid');

const slug = require('slug');

// renderizamos la pantalla principal para el administrador
exports.mostrarPrincipalAdmin = async (req, res)=>{

    // cargamos todos los restaurantes que se encuentran registrados en la BD.
    const restaurantes = await Restaurantes.findAll();
    //renderizamos el dashboard principal del administrador.
    res.render('dashRestaurante',{
        restaurantes
    })
};

// FORMULARIO DE Agregar Restaurantes y editar 
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

// Guardando datos de un nuevo restaurante.
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

        const url = slug(req.files.logo.name).toLowerCase();           
        const nombreImagen = `${url}-${shortid.generate()}`;

        await Restaurantes.create({
            nombre, 
            descripcion, 
            telefono, 
            direccion,
            logo:nombreImagen,
            ultimaModificacion,
            idCategoria,
        }),

        // renombramos la imagen con el valor contenido en la base de datos
        fs.rename( path.join(__dirname, `../public/images/Restaurantes/${req.files.logo.name}`), path.join(__dirname, `../public/images/Restaurantes/${nombreImagen}`),function(err) { if ( err ) console.log('ERROR: ' + err); }); 

        console.log()
        res.redirect('/');
    }
};

// FORMULARIO DE EDITAR

exports.formularioEditar = async (req, res) => {
    // Obtener todos los modelos
    console.log(req.params.id)
    const restaurantesPromise = Restaurantes.findAll();
    // Obtenemos todas las categorias a las que pueden pertenecer los restaurantes
    const lasCategorias = await Categorias.findAll();
    // Obtener el restaurante a editar
    const restaurantePromise = Restaurantes.findOne({
        where : {
            id : req.params.id
        }
    });

    // Promise con destructuring
    const [restaurantes, restaurante] = await Promise.all([restaurantesPromise, restaurantePromise]);

    //obtenemos la categoría mediante el id guardado en el registro.
    const cat = Categorias.findOne({
        where : {
            id : restaurante.idCategoria
        }
    });

    // Promise con destructuring
    const [categoriaSeleccionada] = await Promise.all([cat]);

     //asignando el id
        let nombreCategoria = categoriaSeleccionada.nombre;
        console.log(nombreCategoria);

    res.render('dashRestaurante-form', {
        restaurantes,
        restaurante,
        lasCategorias,
        nombreCategoria
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
        actual,
        idCategoria,
    }= req.body;
    let errores = [];
    //definimos la fecha a guardar
    const ultimaModificacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    // Verificar si el nombre del proyecto tiene un valor
    if (!nombre || !descripcion || !telefono || !direccion   ) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('dashRestaurante', {
            nombrePagina : 'Nuevo Restaurante',
            restaurantes,
            errores
        });
    } else {
        // No existen errores

        //validamos si se seleccionó otra imagen diferente
        if(!req.files.logo){
            //  se seleccionó un logo diferente
            
            //1. guardar la nueva imagen.
            req.files.logo.mv( path.join(__dirname, `../public/images/Restaurantes/${req.files.logo.name}`)),err => {
                if(err) {
                  return res.status(500).send({ message : err })
                } else {
                  console.log('listo');
                }
              };

            // 2. Eliminamos el logo anterior
           const nombre = path.join(__dirname, `../public/images/Restaurantes/${actual}`);
                console.log(nombre);
            
            console.log('---------------------------------------------------');
            console.log(__dirname);
            fs.unlink(path.join(__dirname, `../public/images/Restaurantes/${actual.trim()}`) , (err) => {
                if (err) throw err;
                console.log('successfully deleted /tmp/hello');
              });

            // 3. guardar los datos
            await Restaurantes.update({ 
                nombre, 
                descripcion, 
                telefono, 
                direccion,
                logo,
                ultimaModificacion,
                idCategoria,
                },
                { where : {
                    id : req.params.id
                }}
            ),
            
            //renombramos la imagen con un identificador único
            //fs.rename(path.join(__dirname, `../public/images/Restaurantes/${actual.trim()}`),path.join(__dirname, `../public/images/Restaurantes/${actual.trim()}`))
    
            res.redirect('/');
        

        }else{
            //logo = actual no hubo cambios;
            // Inserción en la base de datos.
        await Restaurantes.update({ 
            nombre, 
            descripcion, 
            telefono, 
            direccion,
            logo:actual,
            ultimaModificacion,
            idCategoria,

            },
            { where : {
                id : req.params.id
            }}
        ),

        res.redirect('/');
        }

        
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

