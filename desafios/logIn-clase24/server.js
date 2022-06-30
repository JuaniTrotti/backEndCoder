//express server
import express from 'express'
import Router from 'express'
import session from 'express-session'
//mongo atlas
import MongoStore from 'connect-mongo'
import { urlMongoCon  } from './connection/mongoConnect.js'

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }


import { createServer } from 'http';
const app = express()
const httpServer = createServer(app);

app.use(express.static('./public'))
app.set('view engine', 'ejs')


//session start
app.use(
  session({

    store: MongoStore.create({
        mongoUrl: urlMongoCon,
        mongoOptions: advancedOptions,
        ttl: 600,
    }),

    secret: 'obiwankenobi',
    resave: false,
    saveUninitialized: false,
  })
)
//session end

//end points start
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html')
})

app.get('/main', (req, res) => {
  req.session.nombre = req.body
  console.log('entre')
  console.log(req.session.nombre)
  console.log(req.session.contador)
  if (req.session.contador) {
    req.session.contador++
    res.send(`${req.session.nombre}, visitaste la pagina ${req.session.contador} veces`)
  } else {
    req.session.contador = 1
    res.redirect('/')
  }
})

app.get('/olvidar', (req, res) => {
  const nombre = req.session.nombre
  req.session.destroy( err => {
    if (err) {
      res.json({error: 'olvidar', descripcion: err})
    } else {
    //   res.send(`Hasta luego ${nombre}`)
        res.redirect('/')
    }
  })
})

const PORT = 8080
const server = app.listen(PORT, () => {
  console.log('Servidor escuchando en el ', PORT)
})