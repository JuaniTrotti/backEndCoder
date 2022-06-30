const socket = io.connect();


//mensajes
function addMessage(e) {
    const message = {
        author: document.getElementById("username").value,
        message: document.getElementById("text").value,
    }

    // socket.emit("new-message", message);
    socket.emit("procesar-mensaje", message)
    return false
}

async function render() {
    await fetch("http://localhost:8080/api/mensajes")
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        const html = data.map((elem, index) => {
            return(`<div>
            <strong>${elem.author.nombre}</strong>
            <strong>[${elem.author.apellido}]</strong>
            <em>${elem.text}</em>
            </div>`)
        }).join(" ")
        document.getElementById("messages").innerHTML = html
    })
}


// productos
// function addProduct(e) {
//     const producto = {
//         title: document.getElementById("title").value,
//         price: document.getElementById("price").value,
//         tumbnail: document.getElementById("tumbnail").value,
//     }

//     e.querySelector("#title").value = ""
//     e.querySelector("#price").value = ""
//     e.querySelector("#tumbnail").value = ""
//     e.querySelector("#title").focus();
    
//     socket.emit("new-product", producto);
//     return false
// } 

async function renderProductos() {
    await fetch("http://localhost:8080/api/productos")
        .then((res) => res.json())
        .then((data) => {
            const html = data.map((elem, index) => {
                return(`
                <div class="histContainer cFlex">
                    <div class="nombreContainer cFlex">
                        <div class="producto cFlex">
                            <h3>${elem.title}</h3>
                            <h4>$${elem.price}</h3>
                            <div class="fotoContainer cFlex">
                                <div class="foto cFlex">
                                    <img src="${elem.tumbnail}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `)
            }).join(" ")
            document.getElementById("productos").innerHTML = html
        })
}

socket.on("messages", function() {render()})
socket.on("muestroProductos", function() { renderProductos()})