// importar los modelos a utilizar
const Platillos = require('../models/Platillos');
const Restaurantes = require('../models/Restaurante');

// Importar los módulos para direcciones (path)
const path = require('path');

// importar módulos necesarios para nombrar y eliminar archivos del servidor
const fs = require('fs');
const shortid = require('shortid');
const slug = require('slug');

// renderizamos la pantalla principal para el administrador
exports.mostrarPrincipalAdmin = async (req, res)=>{

    // cargamos todos los restaurantes que se encuentran registrados en la BD.
    const platillos = await Platillos.findAll();

    //renderizamos el dashboard principal del administrador.
    res.render('dashPlatillo',{
        platillos
    })
};

// FORMULARIO DE GUARDAR se encarga de mostrar la pantalla principal al administrador
exports.formularioGuardar = async (req, res) => {
    // Obtener todos los platillos (modelos)
    const platillos = await Platillos.findAll();

    // Obtenemos todas las restaurantesen los que pueden estar los platillos
    const losRestaurantes = await Restaurantes.findAll();

    res.render('dashPlatillo', {
        platillos,
        losRestaurantes
    });
};

exports.formularioLlenarPlatillo = async(req, res)=>{
    // Obtener todas las categorias (modelos)
    const platillos = await Platillos.findAll();

    const losRestaurantes = await Restaurantes.findAll();

   res.render('dashPlatillo-form',{
    platillos,
    losRestaurantes
   });
}

exports.guardarDatos = async (req,res)=>{
    // Obtener todos los Platillos (modelos)
    const platillos = await Platillos.findAll();
    
    // Obtenemos todas las restaurantes a las que pueden pertenecer los platillos
    const losRestaurantes = await Restaurantes.findAll();

  //Obtenemos los datos por destructuring
 const {nombre,descripcion, precio, nombreRestaurante, estado } = req.body;

  //filtramos el restaurante que fue seleccionada por el usuario
  const elRestaurante = Restaurantes.findOne({
      where : {
          nombre : nombreRestaurante
      }
  });

   // Promise con destructuring
   const [cat] = await Promise.all([elRestaurante]);
   //asignando el id
      const codRestaurante = cat.id;
  
  //definimos la fecha a guardar
  const ultimaModificacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let errores = [];
  if (!nombre || !descripcion || !precio || !ultimaModificacion) {
      errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
  }
  
  // Si hay errores
  if (errores.length > 0) {
      
      res.render('dashPlatillo-form', {
          nombrePagina : 'Nuevo Platillo',
          platillos,
          errores
      });
      res.render('error en la carga');
  } else {
      // No existen errores

      // verificamos si el usuario ha ingresado una imagen para el platillo
      var nombreImagen="";
      if(req.files){
          // usuario ingresa imagen (se guarda)
          nombreImagen= req.files.imagen.name;
        req.files.imagen.mv( path.join(__dirname, `../public/images/Platillos/${req.files.imagen.name}`)),err => {
            if(err) {
            return res.status(500).send({ message : err })
            } else {
            console.log('listo');
            }
        };

        const url = slug(req.files.imagen.name).toLowerCase();
        nombreImagen = `${url}-${shortid.generate()}`;

        //renombramos la imagen een el servidor
        // renombramos la imagen con el valor contenido en la base de datos
        fs.rename( path.join(__dirname, `../public/images/Platillos/${req.files.imagen.name}`), path.join(__dirname, `../public/images/Platillos/${nombreImagen}`),function(err) { if ( err ) console.log('ERROR: ' + err); });

      }else{
          // usuario no ingresa imagen, se envia una por defecto
          nombreImagen="platillo.png";
      }
      await Platillos.create({
          nombre, 
          descripcion, 
          precio, 
          imagen:nombreImagen,
          ultimaModificacion,
          idRestaurante:codRestaurante,
          estado
      }),

      res.redirect('/nuevo_Platillo');
  }
};

// FORMULARIO DE EDITAR
exports.formularioEditar = async (req, res) => {
   
    // Obtener todos los modelos
    const platillosPromise = Platillos.findAll();

    // Obtener el platillo a editar
    const platilloPromise = Platillos.findOne({
        where : {
            id : req.params.id
        }
    });
    
    // Promise con destructuring
    const [platillos, platillo] = await Promise.all([platillosPromise, platilloPromise]);

    // obtenemos todos los restaurantes posibles para el platillo
    const losRestaurantes = await Restaurantes.findAll();

    // onbtenenos el restaurante seleccionado para el platillo.
        const elRestaurante = Restaurantes.findOne({
            where : {
                id : platillo.idRestaurante
            }
        });
    
        // Promise con destructuring
        const [restauranteSeleccionado] = await Promise.all([elRestaurante]);
    
         //asignando el id
            let nombreRestaurante = restauranteSeleccionado.nombre;

    res.render('dashPlatillo-form', {
        platillos,
        platillo,
        losRestaurantes,
        nombreRestaurante,
        
    })
};

exports.actualizarPlatillo = async (req, res) => {


    // se valida que el input del formulario traiga un valor
    // destructuring
    const {nombre, descripcion,  precio,  actual, nombreRestaurante ,estado }= req.body;
    let errores = [];

        //definimos la fecha a guardar
    const ultimaModificacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // obtenemos el id del restaurante que ha sido seleccionado.
            //filtramos la categoria que fue seleccionada por el usuario
    const Restaurant = Restaurantes.findOne({
        where : {
            nombre : nombreRestaurante
        }
    });

     // Promise con destructuring
     const [rest] = await Promise.all([Restaurant]);

     //asignando el id
    const idRestaurante = rest.id;

    // Verificar si todos los campos tienen un valor
    if (!nombre || !descripcion || !precio || !nombreRestaurante) {
        errores.push({'texto': 'Hay campos que aún se encuentran vacíos.'});
    }

     // Si hay errores
     if (errores.length > 0) {
        res.render('dashPlatillo', {
            nombrePagina : 'Nuevo platillo',
            platillos,
            errores
        });
    } else {
        // No existen errores
        //verificamos si el usuario ha seleccionado una imagen diferente
        var nombreImagen ="";
        if(req.files){
            // el usuario a ingresado una nueva imagen

            //1. guardamos la nueva imagen
            req.files.imagen.mv( path.join(__dirname, `../public/images/Platillos/${req.files.imagen.name}`)),err => {
                if(err) {
                  return res.status(500).send({ message : err })
                } else {
                  console.log('listo');
                }
              };

            // 2. Eliminamos el logo anterior si es uno diferente al que está por defecto.
            if(actual.trim() !='restaurante.png'){
                fs.unlink(path.join(__dirname, `../public/images/Platillos/${actual.trim()}`) , (err) => {
                    if (err) throw err;
                    console.log('Borrado completo');
                  });
            }

            // 3. Cambiamos el nombre de la imagen
            const url = slug(req.files.imagen.name).toLowerCase();           
            nombreImagen = `${url}-${shortid.generate()}`;

            // renombramos la imagen con el valor contenido en la base de datos
            fs.rename( path.join(__dirname, `../public/images/Platillos/${req.files.imagen.name.trim()}`), path.join(__dirname, `../public/images/Platillos/${nombreImagen}`),function(err) { if ( err ) console.log('ERROR: ' + err); });            
        }else{
            nombreImagen = actual;
        }

        //verificamos si el estado es activo o inactivo
        var elEstado=0;
        if(estado ==='Activo'){
            elEstado=1;
        }

        // Inserción en la base de datos.
        await Platillos.update({
            nombre, 
            descripcion, 
            precio, 
            imagen:nombreImagen, 
            ultimaModificacion,
            idRestaurante,
            estado:elEstado
            },
            { where : {
                id : req.params.id
            }}
        ),

        res.redirect('/nuevo_Platillo');
    }
};



//Eliminando platillo
exports.eliminarPlatillo = async (req, res, next) => {
    const {estado }= req.body;
    let errores = [];

     // Si hay errores
     if (errores.length > 0) {
        res.render('dashPlatillo', {
            nombrePagina : 'Nuevo platillo',
            errores
        });
    } else {
        // No existen errores
        const elPlatillo = await Platillos.findOne({
            where : {
                id : req.params.id
            }
        });

        elPlatillo.estado = 0;

            // Actualizar la tarea
        const resultado = await elPlatillo.save();

        if (!resultado){
            next();
        }

        res.status(200).send('Actualizado');
    }
}