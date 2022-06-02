const express = require('express');
const claseContenedor = require('./lib/claseContenedor');
const { Router } = express;
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const { ClienteSqlite } = require("./lib/sqlite/mensajeSqlite")
const { optionsLite } = require("./lib/sqlite/sqlite")
const { ClienteMariaDB } = require("./lib/mariadb/productosMariaDB")
const { options } = require("./lib/mariadb/mariaDB")

const { createTablesSqlite } = require('./lib/sqlite/setterSqlite');
const { createTablesMariaDB } = require('./lib/mariadb/setterMaria');
createTablesSqlite();
createTablesMariaDB();

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

// DataBase
const chat = new ClienteSqlite(optionsLite, 'chat');
const productos = new ClienteMariaDB(options, 'productos');

// sockets

// const messages = [];
// const productos = new claseContenedor('./uploads/productos.json');

io.on('connection', async (socket) => {

    const chats = await chat.getAll();
    console.log(typeof(chats))
    socket.emit('messages', await chat.getAll());
    // socket.emit('muestroProductos', await productos.getAll());

    socket.on('new-product', async (data) => {
        // await productos.save(data);
        await productos.save(data);
        io.sockets.emit('muestroProductos', await productos.getAll());
    })

    socket.on('new-message', async (data) => {
        // messages.push(data)
        await chat.save(data);
        io.sockets.emit('messages', await chat.getAll())
    })
})



const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
httpServer.on('error', error => console.log(`Error en servidor ${error}`))