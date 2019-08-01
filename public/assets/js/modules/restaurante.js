// Importando los módulos necesarios
import Swal from 'sweetalert2';
import axios from 'axios';

// Obtener el botón desde el DOM
const btnEliminar = document.querySelector('#eliminar-restaurante');

btnEliminar.addEventListener('click', e => {
    
    // Capturar el id del proyecto desde la propiedad HTML5
    const idRestaurante = e.target.dataset.restauranteId;
    //console.log(e.target.dataset);

    Swal.fire({
        title: '¿Estás seguro que deseas borrar este restaurante?',
        text: "¡Si eliminas un restaurante no se puede recuperar!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
            // Se confirma la eliminación dando click en el botón Borrar.
            // En este punto se envía una petición a Axios.
            // Debemos previamente obtener la URL del sitio.
            const url = `${location.origin}`;
            console.log(url);

            axios.delete(idRestaurante)
                .then(function(respuesta){
                    Swal.fire(
                        '¡Eliminado!',
                        respuesta.data,
                        'success'
                    )
                })
                .catch((error) => {
                    console.log(error.response.data);
                    Swal.fire({
                        type : 'error',
                        title : 'Un error ha ocurrido',
                        text : 'No se pudo eliminar el proyecto'
                    });
                })
            
            // Redireccionar al inicio
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        }
      })
});
export default btnEliminar;