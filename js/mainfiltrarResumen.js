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

$(document).ready(function() {
    try {
      // Aplica Select2 solo a los selectores dentro de la sección .main
      $('.main select').select2({
        dropdownAutoWidth: true, // Oculta la barra desplegable y muestra todas las opciones al hacer clic
        width: '100%' // Establece el ancho del select al 100% para que coincida con tus estilos
      });    
      
      // Función para mostrar u ocultar las pestañas de Carreras y Universidades
      function toggleFiltros(cicloAcademico) {
        if (parseInt(cicloAcademico) > 2022 &&parseInt(cicloAcademico) < 2033 ) {
          $('.filtro-carreras').removeClass('filtro-carreras');
          $('.filtro-universidades').removeClass('filtro-universidades');         
          $('#carreras').addClass('filtro');
          $('#unis').addClass('filtro');
        } else  {
            if(($('#carreras').hasClass('filtro') && !$('#carreras').hasClass('filtro-carreras')) ||
            ($('#universidades').hasClass('filtro') && !$('#universidades').hasClass('filtro-universidades')))
            {
                
                $('#carreras').removeClass('filtro');
                $('#unis').removeClass('filtro');
                $('#carreras').addClass('filtro-carreras');
                $('#unis').addClass('filtro-universidades');
            }            
        }
      }
      
  
      // Maneja el cambio de selección en el select #anio-academico
      $('#anio-academico').on('change', function() {
        var cicloAcademico = $(this).val();
        toggleFiltros(cicloAcademico);
      });
  
      // Maneja el clic en el botón de búsqueda
      $('#buscar').on('click', function() {
        var cicloAcademico = $('#anio-academico').val();
        toggleFiltros(cicloAcademico);
      });
    } catch (error) {
      console.error('Error en el script:', error);
    }
  });
  
// Contador de caracteres
const input = document.getElementById("tema");
const contador = document.getElementById("contador");
const maxLength = 52; // Longitud máxima permitida

// Función para actualizar el contador de caracteres
function actualizarContador() {
  const caracteresEscritos = input.value.length;
  contador.textContent = `${caracteresEscritos}/${maxLength}`;
  if (input.value.length > 0) {
    contador.style.display = "block";
  } else {
    contador.style.display = "none";
  }
}

// Maneja el evento "input" del input
input.addEventListener("input", actualizarContador);

// Llama a la función para mostrar el contador cuando se escriba el primer carácter
input.addEventListener("input", () => {
  if (input.value.length > 0) {
    actualizarContador();
  }
});

  //--------------- RESUMEN
  function recolectarDatosJSON() {
    const materia = $('#materia').val();
    const anioAcademico = $('#anio-academico').val();
    const anios = $('#anios').val() || [];
    const carreras = $('#carreras').val() || [];
    const universidades = $('#universidades').val() || [];
    const tema = $('#tema').val();

    console.log('Datos recopilados:', {
        materia,
        anioAcademico,
        anios,
        carreras,
        universidades,
        tema
    });

    return { materia, anioAcademico, anios, carreras, universidades, tema };
}

function buscarResumenesPorTema(tema) {
  $.ajax({
    url: 'http://localhost:3000/filtrar-resumenes',
    type: 'POST',
    data: JSON.stringify({ filtroTexto: tema }),
    contentType: 'application/json',
    success: function(response) {
      mostrarResumenes(response.resumenes);
    },
    error: function(error) {
      console.error('Error al buscar resúmenes:', error);
    }
  });
}
function buscarResumenesPorCriterios(filtros) {
  $.ajax({
    url: 'http://localhost:3000/filtrar-resumenes',
    type: 'POST',
    data: JSON.stringify(filtros), // Envía todos los filtros como un objeto JSON
    contentType: 'application/json',
    success: function(response) {
      mostrarResumenes(response.resumenes);
    },
    error: function(error) {
      //console.error('Error al buscar resúmenes:', error);
      mostrarResumenes([]); // Muestra la tarjeta de resumen de error      
    }
  });
}
function mostrarResumenes(resumenes) {
  const resumenesContainer = $('.resumenes-container');
  resumenesContainer.empty();

  if (resumenes.length > 0) {
      console.log('Se encontraron resúmenes:', resumenes);

      // Agregar contenedor wrapper
      const wrapper = $('<div class="resumenes-wrapper">');

      resumenes.forEach(function(resumen) {
          const card = $('<div class="resumen-card">');
          
          // Título del resumen
          const titulo = $('<h2>').text(resumen.titulo_resumen);
          card.append(titulo);
          
          // Descripción del resumen
          const descripcion = $('<p>').text(resumen.descripcion_resumen);
          card.append(descripcion);
          
          // Etiquetas
          const etiquetas = $('<div class="etiquetas">');
          if (resumen.etiquetas && resumen.etiquetas.length > 0) {
              resumen.etiquetas.forEach(function(etiqueta) {
                  etiquetas.append($('<span>').text(etiqueta));
              });
          } else {
              etiquetas.append($('<span>').text('El creador del resumen no puso etiquetas'));
          }
          card.append(etiquetas);
          
          // Enlace para descargar el PDF
          const pdfLink = $('<a class="descargar">')
              .attr('href', `http://localhost:3000/descargar-pdf/${resumen.id}`)
              .attr('target', '_blank')
              .text('Descargar PDF');
          card.append(pdfLink);

          wrapper.append(card);
      });

      resumenesContainer.append(wrapper); // Agregar el contenedor wrapper
  } else {
    // Agregar tarjeta de error
    const errorCard = $('<div class="error-card">');
  
    // Título del error en una caja
    const errorTitleBox = $('<div class="error-title-box hover-scale">'); // Aplicamos la clase hover-scale para el efecto de agrandamiento al pasar el mouse
    const errorTitulo = $('<h2>').text('Lo sentimos, no se encontraron resúmenes');
    errorTitleBox.append(errorTitulo);
  
    // Contenedor para el mensaje de error y posibles razones
    const errorContent = $('<div class="error-content">');
  
    // Mensaje de error y posibles razones en una caja
    const errorMessageBox = $('<div class="error-message-box">');
    const errorMessage = $('<p>').text('Posibles razones por las que no se encontraron resúmenes:');
    errorMessageBox.append(errorMessage);
  
    const reasonsList = $('<ul>');
    const reason1 = $('<li>').text('No hay resúmenes disponibles para los criterios seleccionados.');
    const reason2 = $('<li>').text('Los filtros de búsqueda son demasiado restrictivos.');
    const reason3 = $('<li>').text('Puede que la información ingresada no sea correcta.');
  
    reasonsList.append(reason1, reason2, reason3);
    errorMessageBox.append(reasonsList);
  
    errorContent.append(errorMessageBox);
  
    // Imagen triste centrada en una caja
    const errorImageBox = $('<div class="error-image-box">');
    const errorImage = $('<img>')
      .addClass('error-image hover-scale') // Aplicamos la clase hover-scale para el efecto de agrandamiento al pasar el mouse
      .attr('src', 'https://previews.123rf.com/images/nasirkhan/nasirkhan1510/nasirkhan151000010/46801750-representaci%C3%B3n-3d-de-hombre-deprimido-frustrados-trastorno-triste-con-la-persona-que-expresa-ni-idea.jpg')
      .attr('alt', 'Imagen triste');
    errorImageBox.append(errorImage);
  
    // Agregar todas las cajas al contenedor principal
    errorCard.append(errorTitleBox, errorContent, errorImageBox);
  
    resumenesContainer.append(errorCard); // Agregar la tarjeta de error
  }
  
  
  
}




$(document).ready(function() {
  try {
    // Maneja el clic en el botón de búsqueda
    $('#buscar').on('click', function() {
      //const tema = $('#tema').val(); // Obtén el tema desde el campo de entrada
      //buscarResumenesPorTema(tema); // Llama a la función para buscar resúmenes por tema
      const filtros = recolectarDatosJSON(); // Obtén todos los filtros
      buscarResumenesPorCriterios(filtros); // Llama a la función para buscar resúmenes por múltiples criterios
    });

      // Agrega un controlador de eventos para los enlaces "Descargar PDF"
      $('.descargar-pdf').on('click', function(event) {
        // Evita la acción predeterminada del enlace
        event.preventDefault();

        // Obtiene la URL de descarga del enlace
        const urlDescarga = $(this).attr('href');

        // Abre la URL de descarga en una nueva ventana o pestaña
        window.location.href = urlDescarga;
      });
    
  } catch (error) {
    console.error('Error en el script:', error);
  }
});

//-------------------------------------------------------------------------------------------
$(document).ready(function() {
    // Maneja el clic derecho en un resumen
    $('.resumen-card').on('contextmenu', function(event) {
        event.preventDefault(); // Evita que aparezca el menú contextual del navegador
        const clickedCard = $(this);
        const lastCard = $('.resumen-card').last(); // Último resumen en la fila

        // Realiza una animación de fadeOut lenta en el resumen clicado
        clickedCard.fadeOut(800, function() {
            // Una vez que se completa el fadeOut, mueve el último resumen en su lugar con un efecto de desplazamiento
            clickedCard.insertBefore(lastCard).css({
                opacity: 0,
                marginLeft: '50px' // Desplazamiento horizontal
            }).animate({
                opacity: 1,
                marginLeft: '0' // Regresa al valor original
            }, 800);
        });
    });
});

document.querySelector('.barra-busqueda button').addEventListener('click', function() {
  const inputValue = document.querySelector('.barra-busqueda input').value.trim();
  window.location.href = `buscar.html?query=${encodeURIComponent(inputValue)}`;
});







