const contenedor = document.querySelector('#contenedor');
document.querySelector('#boton-menu').addEventListener('click',()=>{
    contenedor.classList.toggle('active');
})
const comprobarancho = () => {
    if(window.innerWidth <= 768){
        contenedor.classList.remove('active');
    } else {
        contenedor.classList.add('active');     
    }
}
window.addEventListener('resize',()=>{
    comprobarancho();
})
comprobarancho();

    // JavaScript específico para "buscar.html"
    const queryParam = new URLSearchParams(window.location.search).get('query');
    const busquedaInput = document.getElementById('busqueda');

    // Establece el valor del campo de búsqueda si se encuentra un valor en la URL
    if (queryParam) {
        busquedaInput.value = queryParam;
        // Realiza la búsqueda de resúmenes si el valor se encuentra en la URL
        buscarResumenes(queryParam);
    }

    // Agrega un evento de clic al botón de búsqueda para redirigir con la consulta
    document.querySelector('.barra-busqueda button').addEventListener('click', function() {
        const inputValue = busquedaInput.value.trim();
        window.location.href = `buscar.html?query=${encodeURIComponent(inputValue)}`;
    });

   // Función para realizar la búsqueda de resúmenes
   async function buscarResumenes(query) {
    try {
        const response = await fetch('http://localhost:3000/buscar-resumenes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtroTexto: query })
        });

        if (!response.ok) {
            throw new Error('No se pudo realizar la búsqueda de resúmenes.');
        }

        const data = await response.json();

        if (data.resumenes && data.resumenes.length > 0) {
            const mainElement = document.querySelector('.main');

            // Limpia el contenido actual de la sección "main"
            mainElement.innerHTML = '';

            data.resumenes.forEach(function (resumen) {
                const resumenElement = document.createElement('div');
                resumenElement.classList.add('resumen');

                // Construye la información del resumen (título, descripción, etc.)
                // Aquí puedes personalizar cómo se muestra la información
                const tituloElement = document.createElement('h4');
                tituloElement.textContent = resumen.titulo_resumen;
                resumenElement.appendChild(tituloElement);

                const descripcionElement = document.createElement('p');
                descripcionElement.textContent = resumen.descripcion_resumen;
                resumenElement.appendChild(descripcionElement);

                const etiquetasElement = document.createElement('div');
                etiquetasElement.classList.add('etiquetas');
                if (resumen.etiquetas && resumen.etiquetas.length > 0) {
                    resumen.etiquetas.forEach(function (etiqueta) {
                        const span = document.createElement('span');
                        span.textContent = etiqueta;
                        etiquetasElement.appendChild(span);
                    });
                } else {
                    const span = document.createElement('span');
                    span.textContent = 'El creador del resumen no puso etiquetas';
                    etiquetasElement.appendChild(span);
                }
                resumenElement.appendChild(etiquetasElement);

                // Enlace para descargar el PDF
                const pdfLink = document.createElement('a');
                pdfLink.classList.add('descargar');
                pdfLink.setAttribute('href', `http://localhost:3000/descargar-pdf/${resumen.id}`);
                pdfLink.setAttribute('target', '_blank');
                pdfLink.textContent = 'Descargar PDF';
                resumenElement.appendChild(pdfLink);

                mainElement.appendChild(resumenElement);
            });
        } else {
            // Mostrar un mensaje si no se encontraron resúmenes
            const mainElement = document.querySelector('.main');
            mainElement.innerHTML = '<p>No se encontraron resúmenes.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los resultados de búsqueda:', error);
    }
}


// Verifica si la página se cargó por primera vez o si se está llamando desde otra página
if (!queryParam) {
    // Realiza la búsqueda de resúmenes si la página se carga por primera vez
    buscarResumenes(busquedaInput.value.trim());
}


    // Verifica si la página se cargó por primera vez o si se está llamando desde otra página
    if (!queryParam) {
        // Realiza la búsqueda de resúmenes si la página se carga por primera vez
        buscarResumenes(busquedaInput.value.trim());
    }
  