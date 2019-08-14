// Importando los módulos necesarios
import Swal from 'sweetalert2';
import axios from 'axios';

// Obtener el botón desde el DOM
const btnEliminar = document.querySelector('.platillos-list');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        
        console.log('entra al boton eliminar platillo');
        // Si se presiona el botón de eliminar
        if((e.target.classList.contains('eliminar-platillo'))){
            console.log('eliminar');
            const idPlatillo = e.target.dataset.platilloId;
            console.log(btnEliminar.textContent)
            Swal.fire({
                title: '¿Estás seguro que deseas realizar los cambios?',
                text: "Se actualizará el estado",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.value) {
                    // Se confirma la eliminación dando click en el botón Borrar.
                    // En este punto se envía una petición a Axios.
                    // Debemos previamente obtener la URL del sitio.
                    const url = `${location.origin}/nuevo_platillo/${idPlatillo}`;
                    console.log(url);
        

                    axios.delete(url, {params : { idPlatillo } })
                        .then(function(respuesta){

                            if(respuesta.status === 200){
                                Swal.fire(
                                    '¡Cambios Realizados!',
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
                                text : 'No se pudo realizar el cambio'
                            });
                        })
                    
                    // Redireccionar al inicio
                    setTimeout(() => {
                        window.location.href = '/nuevo_platillo';
                    }, 1000);
                }
              })
    
        }
    });
}
export default btnEliminar;
