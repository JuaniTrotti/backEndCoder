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

//Vars
// let dirName = __dirname;

//Multer config
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads')
	},
	filename: function(req, file, cb) {
	 cb(null, `${Date.now()}-${file.originalname}`)
	}
})
var upload = multer({ storage: storage })

//EndPoints
app.get('/', (req, res) => {
    res.sendFile(dirName + '/index.html');
});

productRouter.post('/productos', async function (req, res){
    let archivo = new claseContenedor('./uploads/productos.json');
    await archivo.save(req.body);
    res.send(await archivo.returnLast());
    // res.json(data[data.length].id);
});

productRouter.get('/productos', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    res.json(await archivo.getAll());
});

productRouter.put('/productos/:id', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    await archivo.update(req.body, req.params.id);
    res.send(await archivo.getAll());
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
    res.send(await archivo.getAll());
});


//Server config
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${server.address().port}`);
})
server.on('error', err => console.log(`Server error ${err}`));


// setTimeout(async function() {
//     let archivo = new claseContenedor('./uploads/productos.json');
//     let data = await archivo.returnLast();
//     // console.log(typeof data);
//     console.log(data)
// } , 1000);