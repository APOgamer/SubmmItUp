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

document.querySelector('.barra-busqueda button').addEventListener('click', function() {
    const inputValue = document.querySelector('.barra-busqueda input').value.trim();
    window.location.href = `buscar.html?query=${encodeURIComponent(inputValue)}`;
});