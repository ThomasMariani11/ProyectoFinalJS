let productos = []
fetch("./data.json")
    .then(response => response.json())
    .then(data =>{
        productos = data
        cargarProductos(productos)
    })

//variables del codigo
const contenedorProductos = document.querySelector('.contenedor-productos')
const botonesCategorias = document.querySelectorAll('.boton-categoria')
const tituloPrincipal = document.querySelector('.titulo-principal')
let botonesAgregar = document.querySelectorAll('.producto-agregar')
const numero = document.querySelector('#numero')
const contenedorCarrito = document.querySelector('.contenedor-carrito')
let botonesEliminar = document.getElementsByClassName('carrito-producto-eliminar')
const botonComprar = document.getElementById('comprar')
const botonVaciar = document.getElementById('vaciar')
const contenedorAcciones = document.querySelector('.carrito-acciones')
const textoCompra = document.querySelector('.compra')
const textoVacio = document.querySelector('.carrito-vacio')
let numTotal = document.querySelector('#total')
let numTotal2 = document.querySelector('#total2')
const botonComprarConfirm = document.getElementById('compraConfirm')
const divConfirmCompra = document.querySelector('.divConfirm')
const botonCancelar = document.getElementById('btnCancelar')



textoCompra.classList.add('disabled')

//funcion para cargar los productos del array
function cargarProductos(productosElegidos){
    contenedorProductos.innerHTML = ''
    productosElegidos.forEach(producto => {
        const div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML = `    
            <img class="producto-imagen" src="${producto.imagen}" alt="">
            <div class="producto-detalle">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `
        contenedorProductos.append(div)
    })
    actualizarBotonesAgregar()
}




// eventos para los botones de las categorias de la pagina
botonesCategorias.forEach(boton =>{
    boton.addEventListener('click',(e)=>{
        if(e.currentTarget.id == "todos"){
            tituloPrincipal.innerText = 'Todos Los Productos'
            cargarProductos(productos)
        }else{
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id)
            tituloPrincipal.innerText = productoCategoria.categoria.nombre
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id)
            cargarProductos(productosBoton)
        }
    })
})
// funcion para actualizar botones agregar
function actualizarBotonesAgregar(){
    let botonesAgregar = document.querySelectorAll('.producto-agregar')
    
    botonesAgregar.forEach(boton =>{
        boton.addEventListener('click',agregarAlcarrito)
    })
}

// variable para crear o recuperar productos del carrito
let productosCarrito = JSON.parse(localStorage.getItem('productos-en-carrito')) || []

//funcion para agregar al carrito
function agregarAlcarrito(e){
    Swal.fire({
        html: `<h5><b>Producto Agregado</b></h5>`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: 'grey',
        color:'black'
    })
    const idBoton = e.currentTarget.id
    const productoAgregado = productos.find(producto => producto.id === idBoton)
    
    if(productosCarrito.some(producto => producto.id === idBoton)){
        const encontrar = productosCarrito.findIndex(producto => producto.id === idBoton)
        productosCarrito[encontrar].cantidad++


    }else{
        productoAgregado.cantidad = 1
        productosCarrito.push(productoAgregado)
    }  
    actualizarNumero()
    mostrarCarrito()
    total()
    contenedorAcciones.classList.remove('disabled')
    contenedorCarrito.classList.remove('disabled')
    textoCompra.classList.add('disabled')
    localStorage.setItem('productos-en-carrito', JSON.stringify(productosCarrito))
    
}

//funcion para actualizar numero del carrito en la pagina
function actualizarNumero(){
    let nuevoNumero = productosCarrito.reduce((acc,producto) =>acc + producto.cantidad,0)
    numero.innerText = nuevoNumero
}

//funcion para mostrar carrito
function mostrarCarrito(){
    if(!productosCarrito){
        return
    }
    contenedorCarrito.innerHTML = ''
    productosCarrito.forEach(producto =>{
        const div2 = document.createElement('div')
        div2.classList.add('carrito-producto')
        div2.innerHTML = `    
            <img class="carrito-producto-img" src="${producto.imagen}" alt="">
            <div class="carrito-producto-nombre">
                <small>Titulo</small>
                <h6>${producto.categoria.nombre}</h6>
            </div>
            <div class="carrito-producto-cantidad">
                <small>cantidad</small>
                <p>X${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>precio</small>
                <p>${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>subtotal</small>
                <p>$${producto.precio * producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash">Eliminar</i></button>
        `
        contenedorCarrito.append(div2)
    })

    if(productosCarrito.length == 0){
        textoVacio.classList.remove('disabled')
        contenedorAcciones.classList.add('disabled')
        divConfirmCompra.classList.add('disabled')
    }else{
        textoVacio.classList.add('disabled')
    }
    actualizarBotonesAgregar()
    actualizarBotonesEliminar()
    actualizarNumero()
}
//funcion para actualizar los botones de eliminar 
function actualizarBotonesEliminar(){
    botonesEliminar = document.getElementsByClassName('carrito-producto-eliminar')
    const arrayDeNodosDocument = Array.from(botonesEliminar)
    arrayDeNodosDocument.forEach(boton =>{
        boton.addEventListener('click',eliminarDelcarrito)
    })
}
//evento para que quede el ultimo contenido guardado
document.addEventListener('DOMContentLoaded', ()=>{
    mostrarCarrito()
    total()
})

//funcion eliminar del carrito
function eliminarDelcarrito(e){
    let idBoton = e.currentTarget.id
    const index = productosCarrito.findIndex(producto => producto.id === idBoton)
    if(productosCarrito[index].cantidad > 1){
        productosCarrito[index].cantidad--
    }else{
        productosCarrito.splice(index,1)
    }
    mostrarCarrito()
    total()
    localStorage.setItem('productos-en-carrito',JSON.stringify(productosCarrito))
    actualizarNumero()
}


//modal carrito
if(document.getElementById('buttonModal')){
    const modal = document.getElementById('MyModal')
    const button1 = document.getElementById('buttonModal')
    const span = document.getElementsByClassName('close')[0]
    const body = document.getElementsByTagName('body')

    button1.onclick = function (){
        modal.style.display = 'block';
        body.style.position = 'static';
        body.style.height = '100%';
        body.style.overflow = 'hidden';
    }
    span.onclick = function (){
        modal.style.display = 'none';
        body.style.position = 'inherit';
        body.style.height = 'auto';
        body.style.overflow = 'visible';
    }

}

//evento para boton comprar
botonComprar.addEventListener('click',comprarCarrito)

//evento para vaciar carrito
botonVaciar.addEventListener('click',vaciarCarrito)

//funcion para vaciar carrito
function vaciarCarrito(){
    textoVacio.classList.remove('disabled')
    contenedorCarrito.classList.add('disabled')
    contenedorAcciones.classList.add('disabled')
    productosCarrito = []
    localStorage.setItem('productos-en-carrito',JSON.stringify(productosCarrito))
    actualizarNumero()
}

//funcion para la parte coomprar en el carrito
function comprarCarrito(){
    contenedorCarrito.classList.add('disabled')
    contenedorAcciones.classList.add('disabled')
    divConfirmCompra.classList.remove('disabled')
}
//evento para confirmar compra
botonComprarConfirm.addEventListener('click',mensajeCompra)

//funcion para la parte de confirmacion
function mensajeCompra(){
    Swal.fire({
        background: 'grey',
        color:'black',
        html: `<h3><b>¡Muchas Gracias Por Tu Compra!</b></h3>`,
        icon: "success",
    });
    textoVacio.classList.remove('disabled')
    divConfirmCompra.classList.add('disabled')
    productosCarrito = []
    localStorage.setItem('productos-en-carrito',JSON.stringify(productosCarrito))
    actualizarNumero()
}
//evento para cancelar compra
botonCancelar.addEventListener('click',cancelarCompra)

//funcion para la parte de cancelar compra carrito
function cancelarCompra(){
    contenedorCarrito.classList.remove('disabled')
    contenedorAcciones.classList.remove('disabled')
    divConfirmCompra.classList.add('disabled')
}
//funcion para calcular total
function total(){
    let nuevoTotal = productosCarrito.reduce((acc,producto) => acc + (producto.cantidad * producto.precio),0)
    numTotal.innerText = nuevoTotal
    numTotal2.innerText = nuevoTotal
}
