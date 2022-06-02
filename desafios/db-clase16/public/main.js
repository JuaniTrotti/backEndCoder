const socket = io.connect();

function addMessage(e) {
    const message = {
        mail: document.getElementById("username").value,
        mensaje: document.getElementById("text").value,
    } 

    socket.emit("new-message", message);
    return false
}

function render(data) {
    const html = data.map((elem, index) => {

        return(`<div>
        <strong>${elem.mail}</strong>
        <strong>${elem.fecha}</strong>
        <em>${elem.mensaje}</em>
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

    e.querySelector("#title").value = ""
    e.querySelector("#price").value = ""
    e.querySelector("#tumbnail").value = ""
    e.querySelector("#title").focus();
    
    socket.emit("new-product", producto);
    return false
}

async function renderProductos(data) {
    const html = data.map((elem, index) => {
        return(`
        <div class="histContainer cFlex">
            <div class="nombreContainer cFlex">
                <div class="producto cFlex">
                    <h3>${elem.title}</h3>
                    <h3>$${elem.price}</h3>
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

}

socket.on("messages", function(data) {render(data)})
socket.on("muestroProductos", function(data) { renderProductos(data)})