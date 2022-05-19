console.log("llegueaca, estoy conectado");

const socket = io.connect();

function addMessage(e) {
    const message = {
        author: document.getElementById("username").value,
        message: document.getElementById("text").value,
    }

    socket.emit("new-message", message);
    return false
}

function render(data) {
    const html = data.map((elem, index) => {
        return(`<div>
        <strong>${elem.author}</strong>
        <em>${elem.message}</em>
        </div>`)
    }).join(" ")

    document.getElementById("messages").innerHTML = html
}

function addProduct(e) {
    const producto = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        tumbnail: document.getElementById("tumbnail").value,
    }

    socket.emit("new-product", producto);
    return false
}

function renderProductos(data) {
    // fetch("http://localhost:8080/api/productos")
    //     .then(data => {
    //         const html = data.map((elem, index) => {
    //             return(`<div>
    //             <strong>${elem.title}</strong>
    //             <em>${elem.price}</em>
    //             </div>`)
    //         }).join(" ")

    //         document.getElementById("productos").innerHTML = html
    //     })
    const html = data.map((elem, index) => {
        return(`<div>
        <strong>${elem.title}</strong>
        <em>${elem.price}</em>
        </div>`)
    }).join(" ")

    document.getElementById("productos").innerHTML = html
}

socket.on("messages", function(data) {render(data)})
socket.on("muestroProductos", function(data) { renderProductos(data)})