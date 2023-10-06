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
const btnSubir1 = document.querySelector(".btn-subir");
btnSubir1.disabled = true;
// Declaración del array de etiquetas
const etiquetasArray = [];

// Función para agregar etiquetas al array
function agregarEtiqueta() {
    const etiquetaInput = document.getElementById('etiqueta');
    const etiqueta = etiquetaInput.value.trim();
    
    if (etiqueta) {
        etiquetasArray.push(etiqueta);
        
        // Limpiar el campo de entrada
        etiquetaInput.value = '';
        
        // Mostrar las etiquetas en el contenedor
        const etiquetasContainer = document.getElementById('etiquetas-container');
        etiquetasContainer.innerHTML = etiquetasArray.map(etiqueta => `<span>${etiqueta}</span>`).join(', ');
    }
}

//CARACTERES RESTANTES
// Función para actualizar el contador de caracteres
function actualizarContadorCaracteres(inputElement, contadorElement, maxLength) {
    const texto = inputElement.value;
    const caracteresRestantes = maxLength - texto.length;
    contadorElement.textContent = `${caracteresRestantes} caracteres restantes`;
}

// Obtener elementos de entrada de texto y contadores
const camposFormulario = document.querySelectorAll('.campo-formulario');
camposFormulario.forEach((campo) => {
    const inputElement = campo.querySelector('input[type="text"], textarea');
    const contadorElement = campo.querySelector('.contador-caracteres');
    const maxLength = inputElement.getAttribute('maxlength');

    // Actualizar contador al cargar la página
    actualizarContadorCaracteres(inputElement, contadorElement, maxLength);

    // Escuchar eventos de entrada de texto
    inputElement.addEventListener('input', () => {
        actualizarContadorCaracteres(inputElement, contadorElement, maxLength);
    });
});
// Agrega un manejador de eventos dragover en la div
document.querySelector('.logo-empresa').addEventListener('dragover', function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado
});

// Agrega un manejador de eventos drop en la div
document.querySelector('.logo-empresa').addEventListener('drop', function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado

    // Accede al campo de "seleccionar archivo" (input type="file")
    const inputFile = document.querySelector('#archivo-resumen');

    // Verifica si se soltaron archivos
    if (e.dataTransfer.files.length > 0) {
        // Asigna los archivos al campo de "seleccionar archivo"
        inputFile.files = e.dataTransfer.files;

        // Actualiza el nombre del archivo después de soltarlo
        actualizarNombreArchivo();
    }
});

// Función que actualiza el nombre del archivo y el estado del botón "Subir Resumen"
function actualizarNombreArchivo() {
    const btnSubir = document.querySelector(".btn-subir");

      // Obtiene el elemento de entrada de tipo archivo (input type="file") por su ID
    const inputFile = document.getElementById("archivo-resumen");
    // Obtiene el elemento span con la clase "nombre-archivo" que muestra el nombre del archivo
    const nombreArchivoSpan = document.querySelector(".nombre-archivo");

    // Verificar campos del formulario
    const tituloNoVacio = document.getElementById("titulo-resumen").value.trim() !== "";
    const etiquetasNoVacias = document.getElementById("etiquetas").value.trim() !== "";
    const descripcionNoVacia = document.getElementById("descripcion-resumen").value.trim() !== "";
    const materiaCicloNoVacio = document.getElementById("materia-ciclo").value.trim() !== "";

    const titulo = document.querySelector('#titulo-resumen');
    const etiqueta = document.querySelector('#etiquetas');
    const descripcion = document.querySelector('#descripcion-resumen');
    const materia = document.querySelector('#materia-ciclo');

    // Comprueba si se ha seleccionado un archivo
    if (inputFile.files.length > 0 && tituloNoVacio && etiquetasNoVacias && descripcionNoVacia && materiaCicloNoVacio) {
        // Si hay un archivo seleccionado, actualiza el texto del nombre del archivo con su nombre
        nombreArchivoSpan.textContent = inputFile.files[0].name;
        // Agrega la clase "active" al botón para indicar que se puede subir el resumen
        btnSubir.classList.add("active");
        btnSubir1.disabled = false;

         // Comprueba si se cumplen todas las condiciones   
    } else if (inputFile.files.length > 0) {
        // Mostrar "FALTA COMPLETAR CAMPOS" si solo la parte de subir el archivo se cumple
        nombreArchivoSpan.textContent = "FALTA COMPLETAR CAMPOS";
    
        // Agregar la clase "campo-active" a los campos del formulario que no se han completado
        if (!tituloNoVacio) {
            document.getElementById("titulo-resumen").classList.add("campo-active");
        }
        if (!etiquetasNoVacias) {
            document.getElementById("etiquetas").classList.add("campo-active");
        }
        if (!descripcionNoVacia) {
            document.getElementById("descripcion-resumen").classList.add("campo-active");
        }
        if (!materiaCicloNoVacio) {
            document.getElementById("materia-ciclo").classList.add("campo-active");
        }
    
        setTimeout(() => {
            // Revertir el mensaje y quitar la clase después de 3 segundos
            nombreArchivoSpan.textContent = "Seleccionar Archivo";
    
            // Quitar la clase "campo-active" de todos los campos después de 3 segundos
            document.getElementById("titulo-resumen").classList.remove("campo-active");
            document.getElementById("etiquetas").classList.remove("campo-active");
            document.getElementById("descripcion-resumen").classList.remove("campo-active");
            document.getElementById("materia-ciclo").classList.remove("campo-active");
        }, 3000);
    
        btnSubir1.disabled = true;
    }   else {
        // Si no hay archivo seleccionado, vuelve a establecer el texto por defecto
        nombreArchivoSpan.textContent = "Seleccionar Archivo";
        // Quita la clase "active" del botón para indicar que no se puede subir el resumen
        btnSubir.classList.remove("active");
        btnSubir1.disabled = true;
    }
}
// Espera a que se cargue completamente el contenido HTML del documento
document.addEventListener("DOMContentLoaded", function () {
    // Escucha el evento "change" en el input de tipo archivo para detectar cambios en la selección de archivos
    document.getElementById("archivo-resumen").addEventListener("change", actualizarNombreArchivo);

    // Escucha el evento "input" en el input de tipo archivo para detectar cambios en el valor del input
    document.getElementById("archivo-resumen").addEventListener("input", actualizarNombreArchivo);

    // llamar a la función para asegurarte de que el nombre se muestre correctamente al cargar la página
    actualizarNombreArchivo();
});


// Espera a que se cargue completamente el contenido HTML del documento
document.addEventListener("DOMContentLoaded", function () {
    // Escucha el evento "change" en el input de tipo archivo para detectar cambios en la selección de archivos
    document.getElementById("archivo-resumen").addEventListener("change", actualizarNombreArchivo);

    // Llamar a la función para asegurarte de que el nombre se muestre correctamente al cargar la página
    actualizarNombreArchivo();
});


//ANIMACIÓN DE SLIDE

document.addEventListener("DOMContentLoaded", function () {
    let animationActivated = false;

    // Función para activar la animación de deslizamiento
    function activateAnimation() {
        if (!animationActivated && window.scrollY > 100) { // Cambia el valor 100 según tus preferencias
            const summitUpSection = document.querySelector(".resumen-summitup");
            summitUpSection.style.transform = "translateX(0%)"; // Mueve la sección a la posición original
            summitUpSection.style.opacity = "1"; // Hace visible la sección
            animationActivated = true;
        }
    }

    // Agregar el evento scroll para activar la animación cuando se desplace hacia abajo
    window.addEventListener("scroll", activateAnimation);

    // También llamamos a la función al cargar la página para verificar si la animación ya debería estar activada
    activateAnimation();
});


// Función para manejar el envío del formulario desde tu HTML
async function enviarFormulario() {
    try {
      // Obtén los datos del formulario y verifica que sean válidos
      const tituloResumen = document.getElementById('titulo-resumen').value.trim();
      const etiquetasText = document.getElementById('etiquetas').value.trim();
      const descripcionResumen = document.getElementById('descripcion-resumen').value.trim();
      const materiaCiclo = document.getElementById('materia-ciclo').value.trim();
      const lugarEstudios = document.getElementById('lugar-estudios').value.trim();
  
      // Convierte el texto de etiquetas en un array eliminando los caracteres "," y dividiendo por ","
      //const etiquetas = etiquetasText.split(',').filter(tag => tag.trim() !== ' ');
  
      // Obtén el archivo seleccionado
      const archivoSubida = document.getElementById('archivo-resumen').files[0];
  
      if (!tituloResumen || etiquetas.length === 0 || !descripcionResumen || !materiaCiclo || !archivoSubida) {
        // Mostrar una alerta indicando que faltan campos obligatorios
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos obligatorios y agrega al menos una etiqueta.',
        });
        return; // No se envía la solicitud al servidor
      }
  
      // Mostrar los datos recopilados hasta ese momento en la consola
      console.log('Datos recopilados hasta el momento:');
      console.log('Título del resumen:', tituloResumen);
      console.log('Etiquetas:', etiquetas);
      console.log('Descripción del resumen:', descripcionResumen);
      console.log('Materia o ciclo:', materiaCiclo);
      console.log('Lugar de estudios:', lugarEstudios);
  
      console.log('Enviando formulario...');
  
      // Crear un objeto con los datos válidos
      const data = {
        'titulo-resumen': tituloResumen,
        'etiquetas': etiquetas,
        'descripcion-resumen': descripcionResumen,
        'materia-ciclo': materiaCiclo,
        'lugar-estudios': lugarEstudios,
      };
  
      // Crear un objeto FormData que contenga tanto el JSON como el archivo
      const formData = new FormData();
      formData.append('data', JSON.stringify(data)); // Agregar el objeto JSON
      formData.append('archivo-resumen', archivoSubida); // Agregar el archivo de subida
      
      // Mostrar el contenido de formData
        console.log('Contenido de formData:');
        for (const entry of formData.entries()) {
        const [key, value] = entry;
        if (key === 'archivo-resumen') {
            // Mostrar solo el título del archivo
            console.log('Nombre del archivo:', value.name);
        } else {
            console.log(`${key}: ${value}`);
        }
        }




      const response = await fetch('http://localhost:3000/guardar-resumen', {
        method: 'POST',
        body: formData,
      });
  
      // Verificar la respuesta del servidor
      if (response.ok) {
        // La solicitud fue exitosa, muestra una alerta de éxito con SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Resumen guardado con éxito',
        });
  
        // Puedes realizar otras acciones aquí, como limpiar el formulario, recargar la página, etc.
      } else {
        console.error('Error en la solicitud:', response.status, response.statusText);
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




// Obtiene el elemento del campo de entrada de "Lugar de Estudios"
const lugarEstudiosInput = document.getElementById('lugar-estudios');

// Define un arreglo con las opciones válidas para el criterio dorado
const opcionesValidas = [
  'PUCP',
  'UNMSM',
  'UPCH',
  'UPC',
  'UNSA',
  'UNSAAC',
  'UNI',
  'USMP',
  'UP',
  'UNALM',
  'UDEP',
  'ULIMA',
  'USIL',
  'UNITRU',
  'UCSUR',
  'UNAP',
  'URP',
  'UPN',
  'UNFV',
  'UNAP',
  'UCSM',
  'UCV',
  'UCSP',
  'UNP'
];

// Agrega un evento "input" al campo de entrada para verificar el criterio
lugarEstudiosInput.addEventListener('input', () => {
  const inputValue = lugarEstudiosInput.value.trim().toUpperCase();

  // Verifica si el valor del campo de entrada está en el arreglo de opciones válidas
  if (opcionesValidas.includes(inputValue)) {
    // Aplica el estilo dorado al campo de entrada
    lugarEstudiosInput.style.color = 'gold';
    lugarEstudiosInput.style.textShadow = '0 0 10px gold';
  } else {
    // Si no coincide, vuelve al estilo original
    lugarEstudiosInput.style.color = '#444';
    lugarEstudiosInput.style.textShadow = 'none';
  }
});


    document.querySelector('.barra-busqueda button').addEventListener('click', function() {
        const inputValue = document.querySelector('.barra-busqueda input').value.trim();
        window.location.href = `buscar.html?query=${encodeURIComponent(inputValue)}`;
    });








