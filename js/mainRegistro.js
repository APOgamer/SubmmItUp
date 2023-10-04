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

function validarFormulario() {
    // Obtener los valores de los campos
    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var errores = 0
    // Limpiar mensajes de error previos
    document.getElementById("nombreError").style.display = "none";
    document.getElementById("emailError").style.display = "none";
    document.getElementById("passwordError").style.display = "none";

    // Validar nombre (entre 3 y 15 caracteres)
    if (nombre.length < 3 || nombre.length > 15) {
        document.getElementById("nombreError").style.display = "block";
        errores = 1
    }

    // Validar correo electrónico (formato básico)
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailRegex)) {
        document.getElementById("emailError").style.display = "block";
        errores = 1
    }

    // Validar contraseña (mínimo 8 caracteres)
    if (password.length < 8) {
        document.getElementById("passwordError").style.display = "block";
        errores = 1
    }

    // Si no hay errores, hacer un console.log
    if (errores === 0) {
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Crear un objeto JSON con los datos
        const userData = {
            nombre: nombre,
            email: email,
            password: password
        };

        // Imprimir el objeto JSON en la consola
        console.log(JSON.stringify(userData, null, 2));
    }
}

///////////////////////// FONDO /////////////////////////
// Obtener referencias a las cajas de texto
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Obtener el elemento donde mostrar la cantidad total de caracteres
const caracteresTotales = document.getElementById('caracteresTotales');

// Función para contar caracteres en todas las cajas de texto
function contarCaracteres() {
    // Obtén todas las cajas de texto por su ID
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Calcula la longitud de los valores en las cajas de texto
    const totalCaracteres = nombre.length + email.length + password.length;

    // Devuelve la cantidad total de caracteres
    return totalCaracteres;
    
}
setInterval(contarCaracteres, 100);

// Configuración
const numImages = 10; // Número de imágenes de fondo
const blurAmount = 10; // Nivel de desenfoque (0 para ninguna desenfocada, 100 para muy desenfocada)
const minSpeed = 1; // Velocidad mínima
const maxSpeed = 4; // Velocidad máxima
const imageWidth = 250; // Tamaño de las imágenes
const imageHeight = 300; // Tamaño de las imágenes
const minDistance = 500; // Distancia mínima entre las imágenes
// Array para almacenar las imágenes
const imagesArray = [];

// Función para crear una imagen desenfocada aleatoria con velocidad aleatoria hacia la derecha
function createRandomImage() {
    const image = document.createElement("img");
    image.src= 'https://static.filadd.com/files/f%2313521/html/external_resources/bg1.png';
    //image.src = `https://placehold.co/${imageWidth}x${imageHeight}`;
    image.style.width = imageWidth + "px";
    image.style.height = imageHeight + "px";
    image.style.position = "absolute";
    image.style.filter = `blur(${blurAmount}px)`;
    image.style.left = 0
    image.style.top = Math.random() * window.innerHeight + "px";
    
    // Velocidad aleatoria hacia la derecha
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    image.speed = (speed * (contarCaracteres()/8)) + speed;
    
    document.getElementById("background").appendChild(image);
    
    // Agregar la imagen al array
    imagesArray.push(image);
}

// Crear las imágenes de fondo
for (let i = 0; i < numImages; i++) {
    createRandomImage();
}


// Función para animar las imágenes de fondo
function animateBackground() {
    const images = document.querySelectorAll("#background img");
    images.forEach((image, index) => {
        const currentLeft = parseFloat(image.style.left);

        // Calcular nueva posición
        const newX = currentLeft + image.speed;

        // Si se sale de la pantalla, eliminar la imagen y crear una nueva
        if (newX > window.innerWidth) {
            document.getElementById("background").removeChild(image);
            imagesArray.splice(index, 1); // Eliminar la imagen del array

            // Crear una nueva imagen
            createRandomImage();
        } else {
            image.style.left = newX + "px";
        }
    });

    requestAnimationFrame(animateBackground);
}
// Iniciar la animación
animateBackground();


document.querySelector('.barra-busqueda button').addEventListener('click', function() {
    const inputValue = document.querySelector('.barra-busqueda input').value.trim();
    window.location.href = `buscar.html?query=${encodeURIComponent(inputValue)}`;
});