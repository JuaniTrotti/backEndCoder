const express = require("express");
const { productManage } = require("./lib/api/productos/productosContenedor");
const { carritoManage } = require("./lib/api/carrito/carritoUsuarios");
const { checkAuth } = require("./lib/api/auth");

const { Router } = express;

// App config
const app = express();
app.use(express.urlencoded({ extended: true }));

// Router config
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
    let archivo = new productManage('./src/uploads/productos.json');
    if (id === undefined) {
        let datos = await archivo.getAll();
        res.json(datos);
    } else {
        let producto = await archivo.getById(id);
        if(producto === undefined) {
            res.json("no existe el producto");
        }
        res.json(producto);
    }
})
productosRouter.post('/', async (req, res) => {
    if (checkAuth()) {
        let archivo = new productManage('./src/uploads/productos.json');
        // let prod = new producto(req.body);
        // await archivo.save(prod);
        await archivo.save(req.body);
        res.json("producto guardado");
    } else {
        res.json("no esta autorizado");
    }
})
productosRouter.put('/:id', async (req, res) => {
    if (checkAuth()) {
        let {id} = req.params;
        let archivo = new productManage('./src/uploads/productos.json');
        if (await archivo.getById(id) === undefined) {
            res.json("no existe el producto");
        } else {
            // let prod = new producto(req.body);
            await archivo.update(req.body, id);
            res.json("actualizado") //lo dejo asi porque no tengo el front para cargar producto
        }
    } else {
        res.json("no esta autorizado");
    }
})
productosRouter.delete('/:id', async (req, res) => {
    if (checkAuth()) {
        let {id} = req.params;
        let archivo = new productManage('./src/uploads/productos.json');
        await archivo.deleteById(id)
        res.json(await archivo.getAll());
    } else {
        res.json("no esta autorizado");
    }
})

// Carrito endpoint
carritoRouter.post('/', async (req, res) => {
    let carrito = new carritoManage('./src/uploads/carrito.json');
    await carrito.createCarrito(req.body)
    res.json("seguardo");
})

carritoRouter.delete('/:id', async (req, res) => {
    let carrito = new carritoManage('./src/uploads/carrito.json');
    res.json(await carrito.deleteCarritoById(req.params.id));
})

carritoRouter.get('/:id/productos', async (req, res) => {
    let carrito = new carritoManage('./src/uploads/carrito.json');
    res.json(await carrito.carritoById(req.params.id));
})

carritoRouter.post('/:id?/productos', async (req, res) => {
    let carrito = new carritoManage('./src/uploads/carrito.json');
    await carrito.pushProduct(req.params.id, req.body);
    res.json("se agrego el producto");
})

carritoRouter.delete('/:idCarr/productos/:idProd', async (req, res) => {
    let carrito = new carritoManage('./src/uploads/carrito.json');
    await carrito.deleteProductById(req.params.idCarr, req.params.idProd);
    res.json("se elimino el producto");
})


// Server Config
const PORT:number = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
server.on("error", error => console.log(error));