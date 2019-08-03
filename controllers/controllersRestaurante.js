// importar los modelos a utilizar
    const Restaurantes = require('../models/Restaurante');
    const Categorias = require('../models/Categorias');

// Importar los módulos para direcciones (path)
    const path = require('path');

// importar módulos necesarios para nombrar y eliminar archivos del servidor
    const fs = require('fs');
    const shortid = require('shortid');
    const slug = require('slug');


// renderizamos la pantalla principal para el administrador
exports.mostrarPrincipalAdmin = async (req, res)=>{

    // cargamos todos los restaurantes que se encuentran registrados en la BD.
    const restaurantes = await Restaurantes.findAll();
    //renderizamos el dashboard principal del administrador.
    res.render('dashCategoria',{
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

    //Obtenemos los datos por destructuring
    const {nombre,descripcion,telefono, direccion,nombreCategoria,estado } = req.body;
     
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
  
    //Verificamos si hay errores al momento de capturar los datos.
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
        var nombreImagen ="";
        if(req.files){
            // guardamos la imagen que ha sido seleccionada por el usuario.
            req.files.logo.mv( path.join(__dirname, `../public/images/Restaurantes/${req.files.logo.name}`)),err => {
                if(err) {
                    return res.status(500).send({ message : err })
                } else {
                    console.log('listo');
                }
            };
            const url = slug(req.files.logo.name).toLowerCase();           
            nombreImagen = `${url}-${shortid.generate()}`;

            // renombramos la imagen con el valor contenido en la base de datos
            fs.rename( path.join(__dirname, `../public/images/Restaurantes/${req.files.logo.name}`), path.join(__dirname, `../public/images/Restaurantes/${nombreImagen}`),function(err) { if ( err ) console.log('ERROR: ' + err); });            
            console.log(req.body.logo);
            
        }else{
            // usuario no ha seleccionado ninguna foto, se inserta una por defecto.
            console.log(req.body.logo)
            nombreImagen = "restaurante.png";
        }
        var elEstado=0;
        if(estado ==='Activo'){
            elEstado=1;
        }
        // verificamos si el estado es activo o inactivo
        //Guardamos los valores en las base de datos
        await Restaurantes.create({
            nombre, 
            descripcion, 
            telefono, 
            direccion,
            logo:nombreImagen,
            ultimaModificacion,
            idCategoria,
            estado:elEstado
        }),

        res.redirect('/');
    }

};

// FORMULARIO DE EDITAR
exports.formularioEditar = async (req, res) => {

    // Obtener todos los modelos
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

    //definiendo el estado del restaurante
    var estadoActual="";
    if(restaurante.estado ==1){
        estadoActual='Activo';
    }else{
        estadoActual='Inactivo';
    }
    console.log(estadoActual);

    res.render('dashRestaurante-form', {
        restaurantes,
        restaurante,
        lasCategorias,
        nombreCategoria,
        estadoActual
    })
};

exports.actualizarRestaurante = async (req, res) => {
    // Obtener todos los restaurantes (modelos)
    const restaurantes = await Restaurantes.findAll();

    // destructuring
    const {
        nombre, 
        descripcion, 
        telefono, 
        direccion,
        logo,
        actual,
        nombreCategoria,
        estado
    }= req.body;
    
     
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
    // Verificar si se traen todos los valores.
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
        var nombreImagen ="";
        //validamos si se seleccionó otra imagen diferente
        if(req.files){

            //  se seleccionó un logo diferente
            
            //1. guardar la nueva imagen.
            req.files.logo.mv( path.join(__dirname, `../public/images/Restaurantes/${req.files.logo.name}`)),err => {
                if(err) {
                  return res.status(500).send({ message : err })
                } else {
                  console.log('listo');
                }
              };

            // 2. Eliminamos el logo anterior si es uno diferente al que está por defecto.
            console.log(actual);
            if(actual.trim() !='restaurante.png'){
                fs.unlink(path.join(__dirname, `../public/images/Restaurantes/${actual.trim()}`) , (err) => {
                    if (err) throw err;
                    console.log('Borrado completo');
                  });
            }
            
            // 3. Cambiamos el nombre de la imagen
            const url = slug(req.files.logo.name).toLowerCase();           
            nombreImagen = `${url}-${shortid.generate()}`;

            // renombramos la imagen con el valor contenido en la base de datos
            fs.rename( path.join(__dirname, `../public/images/Restaurantes/${req.files.logo.name.trim()}`), path.join(__dirname, `../public/images/Restaurantes/${nombreImagen}`),function(err) { if ( err ) console.log('ERROR: ' + err); });            
            console.log(req.body.logo);
    
        }else{
            nombreImagen = actual;
        }
        
        var elEstado=0;
        if(estado ==='Activo'){
            elEstado=1;
        }
        //Guardamos los cambios realizados.
        await Restaurantes.update({ 
            nombre, 
            descripcion, 
            telefono, 
            direccion,
            logo:nombreImagen,
            ultimaModificacion,
            idCategoria,
            estado:elEstado
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

     // Eliminar imagen del servidor
     const el_Restaurante = Restaurantes.findOne({
         where : {
             id: id
         }
     });
     // obtenenemos los valores por promise
    const [elRestaurante] = await Promise.all([el_Restaurante]);

     console.log(elRestaurante.logo);
     if(elRestaurante.logo.trim() !='restaurante.png'){
        fs.unlink(path.join(__dirname, `../public/images/Restaurantes/${elRestaurante.logo.trim()}`) , (err) => {
            if (err) throw err;
            console.log('Borrado completo');
          });
    }
    

    // Eliminar el restaurante
    const resultado = await Restaurantes.destroy({
        where : {
            id : id
        }
    });

    
  
    if(!resultado) {
        return next();
         
    }

    res.send(200).send('El restaurante ha sido eliminado correctamente');
}