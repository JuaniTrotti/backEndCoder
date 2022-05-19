// app.listen(PORT);
const express = require('express');
const { Router } = express;
const claseContenedor = require('./claseContenedor.js')

//Router config
const productRouter = new Router();
productRouter.use(express.json());

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRouter);
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, '../public')))


//Navegar entre paginas
app.get('/', (req, res) => {
    res.render('pages/index', {mensaje: "Bienvenidos a mi primera plantilla de ejs"});
});

app.get('/productos', async function(req, res) {
    let archivo = new claseContenedor('./uploads/productos.json');
    let datos = await archivo.getAll()
    res.render('pages/productos', { datos });
})

//EndPoints
productRouter.post('/productos', async function (req, res){
    let archivo = new claseContenedor('./uploads/productos.json');
    await archivo.save(req.body);
    res.redirect('/');
});

//Server config
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${server.address().port}`);
})
server.on('error', err => console.log(`Server error ${err}`));


