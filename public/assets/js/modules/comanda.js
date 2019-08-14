// Importando los módulos necesarios
import Swal from 'sweetalert2';
import axios from 'axios';

console.log('entraste a Axios');
// Obtener el botón desde el DOM
const btnEliminar = document.querySelector('.i.fa.fa-trash');

if(btnEliminar){
    console.log('si');
    btnEliminar.addEventListener('click', e => {
        console.log('entra al boton eliminar detalle');
        if((e.target.classList.contains('fa-trash'))){
            console.log('click');
            console.log(e.target);
            // const icono = e.target;
            // const idTarea = icono.parentElement.parentElement.dataset.tarea;
        }
        // Si se presiona el botón de eliminar
        // if((e.target.classList.contains('eliminar-platillo'))){
        //     console.log('eliminar');
        //     const idPlatillo = e.target.dataset.platilloId;

        //     Swal.fire({
        //         title: '¿Estás seguro que deseas borrar este platillo?',
        //         text: "¡Si eliminas un platillo no se puede recuperar!",
        //         type: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#3085d6',
        //         cancelButtonColor: '#d33',
        //         confirmButtonText: 'Borrar',
        //         cancelButtonText: 'Cancelar'
        //       }).then((result) => {
        //         if (result.value) {
        //             // Se confirma la eliminación dando click en el botón Borrar.
        //             // En este punto se envía una petición a Axios.
        //             // Debemos previamente obtener la URL del sitio.
        //             const url = `${location.origin}/nuevo_platillo/${idPlatillo}`;
        //             console.log(url);
        
        //             axios.delete(url, {params : { idPlatillo } })
        //                 .then(function(respuesta){
        //                     if(respuesta.status === 200){
        //                         Swal.fire(
        //                             '¡Eliminado!',
        //                             respuesta.data,
        //                             'success'
        //                         )
        //                     }
                            
        //                 })
        //                 .catch((error) => {
        //                     Swal.fire({
        //                         type : 'error',
        //                         title : 'Un error ha ocurrido',
        //                         text : 'No se pudo eliminar la categoría'
        //                     });
        //                 })
                    
        //             // Redireccionar al inicio
        //             setTimeout(() => {
        //                 window.location.href = '/nuevo_platillo';
        //             }, 3000);
        //         }
        //       })
    
        // }
    });
}
export default btnEliminar;