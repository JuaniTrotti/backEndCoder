const mongoose = require('mongoose');
const express = require("express");
const { checkAuth } = require("./lib/api/auth");

//container MongoDB
const { carritoMongoManage } = require("./lib/api/mongoDB/carritoMongo/carritoMongoContainer");
const { productMongoManage } = require("./lib/api/mongoDB/productosMongo/productosContenedor");

//container Firebase
const { carritoFirebaseManage } = require("./lib/api/fireBase/carritoFirebase/carritoFirebaseContainer");

//models 
import * as models from './lib/models/productModel';

//url mongo 
const { mongoURL } = require("./lib/config/mongoConnect");

//url firebase

// App config
const app = express();
app.use(express.urlencoded({ extended: true }));

// Router config
const { Router } = express;
const apiRouter = new Router();
const productosRouter = new Router();
const carritoRouter = new Router();

apiRouter.use(express.json());
app.use('/api', apiRouter);
apiRouter.use('/productos', productosRouter);
apiRouter.use('/carrito', carritoRouter);

// Productos endpoint
productosRouter.get('/:id?', async (req, res) => {
    let {id} = req.params;
    let conn = new productMongoManage(models.product);
    await conn.connect();
    if (id === undefined) {
        let datos = await conn.getAll();
        res.json(datos);
    } else {
        let producto = await conn.getById(id);
        if(producto === undefined) {
            res.json("no existe el producto");
        }
        res.json(producto);
    }
    await conn.disconnect();
})

productosRouter.post('/', async (req, res) => {
    if (checkAuth()) {
        let conn = new productMongoManage(models.product);
        await conn.connect();
        await conn.newProd(req.body);
        await conn.disconnect();
    } else {
        res.json("no esta autorizado");
    }
})

productosRouter.put('/:id', async (req, res) => {
    if (checkAuth()) {
        let {id} = req.params;
        let conn = new productMongoManage(models.product);
        await conn.connect();
        if (await conn.getById(id) === undefined) {
            res.json("no existe el producto");
        } else {
            await conn.update(req.body, id);
            res.json("actualizado")
        }
        await conn.disconnect();
    } else {
        res.json("no esta autorizado");
    }
})

productosRouter.delete('/:id', async (req, res) => {
    if (checkAuth()) {
        let {id} = req.params;
        let conn = new productMongoManage(models.product);
        await conn.connect();
        await conn.deleteById(id)
        res.json(await conn.getAll());
        await conn.disconnect();
    } else {
        res.json("no esta autorizado");
    }
})

// Carrito endpoint
carritoRouter.post('/', async (req, res) => {
    let carrito = new carritoMongoManage(models.cart);
    await carrito.connect();
    res.json(await carrito.createCarrito(req.body));
    await carrito.disconnect();
})

carritoRouter.delete('/:id', async (req, res) => {
    let carrito = new carritoMongoManage(models.cart);
    await carrito.connect();
    res.json(await carrito.deleteCarritoById(req.params.id));
    await carrito.disconnect();
})

carritoRouter.get('/:id/productos', async (req, res) => {
    let carrito = new carritoMongoManage(models.cart);
    await carrito.connect();
    res.json(await carrito.carritoById(req.params.id));
    await carrito.disconnect();
})

carritoRouter.post('/:id?/productos', async (req, res) => {
    let carrito = new carritoMongoManage(models.cart);
    await carrito.connect();
    await carrito.pushProduct(req.params.id, req.body);
    res.json("se agrego el producto");
    await carrito.disconnect();
})

carritoRouter.delete('/:idCarr/productos/:idProd', async (req, res) => {
    let carrito = new carritoMongoManage(models.cart);
    await carrito.connect();
    await carrito.deleteProductById(req.params.idCarr, req.params.idProd);
    res.json("se elimino el producto");
    await carrito.disconnect();
})


// Server Config
const PORT:number = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
server.on("error", error => console.log(error));