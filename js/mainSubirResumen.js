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
