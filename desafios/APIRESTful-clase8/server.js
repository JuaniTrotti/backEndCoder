const express = require('express');
const multer = require('multer');
const { Router } = express;
const claseContenedor = require('./claseContenedor.js')

//Router config
const productRouter = new Router();
productRouter.use(express.json());
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', productRouter);

//Multer config
// var storage = multer.diskStorage({
// 	destination: function(req, file, cb) {
// 		cb(null, 'uploads')
// 	},
// 	filename: function(req, file, cb) {
// 	 cb(null, `${Date.now()}-${file.originalname}`)
// 	}
// })
// var upload = multer({ storage: storage })

//EndPoints
app.get('/', (req, res) => {
    res.sendFile(dirName + '/index.html');
});

productRouter.post('/productos', async function (req, res){
    let archivo = new claseContenedor('./uploads/productos.json');
    await archivo.save(req.body);
    res.send(await archivo.returnLast());
});

productRouter.get('/productos', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    res.json(await archivo.getAll());
});

productRouter.put('/productos/:id', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    if (await archivo.update(req.body, req.body.id) !== undefined) {
        res.send(await archivo.getById(req.body.id));
    } else {
        res.send("no existe el producto con id: " + req.body.id);
    }
})

productRouter.delete('/productos/:id', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    await archivo.deleteById(req.params.id);
    res.send(await archivo.getAll());
});


//elimina todos los productos desde un boton en la pagina
productRouter.post('/eliminar', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    await archivo.deleteAll();
    res.send("se elimino todo");
});

//actualiza un producto desde la pagina por id
productRouter.post('/actualizar', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    if (await archivo.update(req.body, req.body.id) !== undefined) {
        res.send(await archivo.getById(req.body.id));
    } else {
        res.send("no existe el producto con id: " + req.body.id);
    }
})

//elimna un producto desde la pagina por id
productRouter.post('/eliminarId', async function(req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    if (await archivo.deleteById(req.body.id) !== undefined) {
        res.send("Se elimino el producto con id: " + req.body.id);
    } else {
        res.send("No se encontro el producto con id: " + req.body.id);
    }
})

//Server config
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${server.address().port}`);
})
server.on('error', err => console.log(`Server error ${err}`));


