// Importando los módulos necesarios
import Swal from 'sweetalert2';
import axios from 'axios';

// Obtener el botón desde el DOM
const btnEliminar = document.querySelector('.restaurants-list');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        console.log('entra al boton eliminar-rest');
        // const restauranteHTML = e.target.parentElement.parentElement;
        if((e.target.classList.contains('eliminar-restaurante'))){
            console.log('eliminar');
            const idRestaurante = e.target.dataset.restauranteId;

            Swal.fire({
                title: '¿Estás seguro que deseas inhabilitar este restaurante?',
                text: "¡Si inhabilitas un restaurante no se puede recuperar!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Inhabilitar',
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

                            if(respuesta.status === 200){
                                Swal.fire(
                                    '¡Inhabilitado!',
                                    respuesta.data,
                                    'success'
                                )
                            }
                            
                        })
                        .catch((error) => {
                            console.log(error.response.data);
                            Swal.fire({
                                type : 'error',
                                title : 'Un error ha ocurrido',
                                text : 'No se pudo inhabilitar el restaurante'
                            });
                        })
                    
                    // Redireccionar al inicio
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
            })
        }       
    });
}
export default btnEliminar;
