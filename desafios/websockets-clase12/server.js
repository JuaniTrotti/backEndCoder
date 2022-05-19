const express = require('express');
const claseContenedor = require('./claseContenedor');
const { Router } = express;
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//Router config
const productRouter = new Router();
productRouter.use(express.json());
app.use('/api', productRouter);

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});

productRouter.get('/productos', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    res.json(await archivo.getAll());
});


// sockets
const messages = [];
const productos = new claseContenedor('./uploads/productos.json');

io.on('connection', async (socket) => {
    socket.emit('messages', messages)
    socket.emit('muestroProductos', await productos.getAll())

    socket.on('new-product', async (data) => {
        await productos.save(data);
        const datos = await productos.getAll();
        io.socket.emit('muestroProductos', datos)
    })

    socket.on('new-message', data => {
        messages.push(data)
        io.sockets.emit('messages', messages)
    })
})



const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
httpServer.on('error', error => console.log(`Error en servidor ${error}`))