/* 
// Función para manejar el envío del formulario desde tu HTML
async function enviarFormulario() {
    try {
        // Obtén los datos del formulario (puedes hacerlo como lo estabas haciendo)
        const data = {
            'titulo-resumen': document.getElementById('titulo-resumen').value,
            'etiquetas': document.getElementById('etiquetas').value,
            'descripcion-resumen': document.getElementById('descripcion-resumen').value,
            'materia-ciclo': document.getElementById('materia-ciclo').value,
            'lugar-estudios': document.getElementById('lugar-estudios').value
        };

        // Realiza una solicitud POST al servidor
        const response = await fetch('/guardar-resumen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Verifica la respuesta del servidor
        if (response.ok) {
            // La solicitud fue exitosa, muestra una alerta de éxito con SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Resumen guardado con éxito',
            });

            // Puedes realizar otras acciones aquí, como limpiar el formulario, recargar la página, etc.

        } else {
            // La solicitud tuvo un error, muestra una alerta de error con SweetAlert2
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar el resumen',
            });
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);

        // En caso de error, muestra una alerta de error con SweetAlert2
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar el formulario',
        });
    }
}
*/
