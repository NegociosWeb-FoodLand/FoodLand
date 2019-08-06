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
        idRestaurante
    }= req.body;
    let errores = [];

    // Verificar si todos los campos tienen un valor
    if (
        !nombre ||
        !descripcion ||
        !precio || 
        !imagen ||
        !idRestaurante
    ) {
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
        // Inserción en la base de datos.
        await Platillos.update({
            nombre, 
            descripcion, 
            precio, 
            imagen, 
            idRestaurante
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

