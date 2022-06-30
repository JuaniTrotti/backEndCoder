//import de siempre
import express from 'express';
import MongoContenedor from './mongoContenedor.js'
import Router from "express";
import { createServer } from 'http';
import { Server } from 'socket.io'

//import nuevos
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { urlMongoSession } from './connection/mongoConnect.js';
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

//mongoose models start
import * as models from './models/messageModel.js'

//faker mock start
import { faker }from '@faker-js/faker';
faker.locale = 'es';

function generarProducto() {
    return {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.business()
    }
}
//faker end

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

//Router config start
const productRouter = Router();
productRouter.use(express.json());
app.use('/api', productRouter);

//session start
app.use(
    session({
  
      store: MongoStore.create({
          mongoUrl: urlMongoSession,
          mongoOptions: advancedOptions,
          ttl: 600,
      }),
  
      secret: 'obiwankenobi',
      resave: false,
      saveUninitialized: false,
    })
)
//session end

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    if (req.session.contador) {
        req.session.contador++
        let name = req.session.nombre
        let cont = req.session.contador
        res.render('pages/index', {name, cont})
    } else {
        req.session.contador = 1
        res.render('pages/login')
    }
});

app.post('/loginReg', (req, res) => {
    console.log(req.body)
    res.redirect('/login')
})

app.get('/olvidar', (req, res) => {
    req.session.destroy( err => {
        if (err) {
          res.json({error: 'olvidar', descripcion: err})
        } else {
            res.redirect('/login')
        }
    })
})

productRouter.get('/productos', async function (req, res) {
    let newDatos = [];
    for (let i=0; i<5; i++) {
        newDatos.push(generarProducto())
    }
    res.json(newDatos);
});

productRouter.get('/mensajes', async function(req, res) {
    let con = new MongoContenedor(models.mongoM);
    await con.connectMongo();
    let datos = await con.leerMes()
    
    res.json(datos);
});
//Router end

//sockets starts
async function processMess(x, con) {
    await con.connectMongo();
    await con.crearMes(x)
}

io.on('connection', async (socket) => {
    const con = new MongoContenedor(models.mongoM);
    socket.emit('messages')
    socket.emit('muestroProductos')

    socket.on('procesar-mensaje', async data => {
        let datosNor = genMes(data);
        await processMess(datosNor, con)
        io.sockets.emit('messages')
    })
})

function genMes(x) {
    return {
        author: {
            nombre: x.author,
            apellido: faker.name.findName(),
            edad: faker.random.numeric(2),
            alias: faker.internet.userName(),
            avatar: faker.internet.avatar()
        },
        text: x.message
    }
}
//sockets end

//server settings
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
httpServer.on('error', error => console.log(`Error en servidor ${error}`))