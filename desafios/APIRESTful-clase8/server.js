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
let idCount = 0;

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
productRouter.get('/', (req, res) => {
    res.sendFile(dirName + '/index.html');
});

productRouter.post('/productos', async function (req, res){
    let archivo = new claseContenedor('./uploads/productos.json');
    await archivo.save(req.body);
    idCount++;
    res.send(await archivo.getById(idCount));
});

productRouter.get('/productos', async function (req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    res.send(await archivo.getAll());
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

//Server config
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${server.address().port}`);
})
server.on('error', err => console.log(`Server error ${err}`));