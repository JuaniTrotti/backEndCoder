// const express = require('express');
import express from 'express';
// const claseContenedor = require('./claseContenedor');
import claseContenedor from './claseContenedor.js';
import MongoContenedor from './mongoContenedor.js'
// const { Router } = express;
import Router from "express";
// const { Server: HttpServer } = require('http');
import { createServer, get } from 'http';
// const { Server: IOServer } = require('socket.io');
import { Server } from 'socket.io'

//mongoose models start
import * as models from './models/messageModel.js'

//normalizr start
import { normalize, denormalize, schema } from 'normalizr' 

const user = new schema.Entity('user')
const author = new schema.Entity('author', {
    author: user
})
const text = new schema.Entity('text')
const mess = new schema.Entity('mess', {
    author: author,
    text: text,
})

import util from 'util'
function print(ob) {
    console.log(util.inspect(ob,false,12,true))
}

async function processMess(x) {
    let con = new MongoContenedor(models.mongoM);
    await con.connectMongo();
    let mensajesGuardados = await con.leerMes()
    
    console.log('/* ---------------------------------------- *\\')
    console.log('objeto normalizado')
    const normalizedMessage = normalize(mensajesGuardados, mess)
    print(normalizedMessage)
    
    console.log('objeto desnormalizado')
    const denormalizeMessage = denormalize(normalizedMessage.result, mess, normalizedMessage.entities)
    print(denormalizeMessage)
    console.log('/* ---------------------------------------- *\\')
    
    await con.crearMes(x)
}
//noramlizr end


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

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});

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

    console.log('esto esta en la base' )
    console.log(datos)
    res.json(datos);
});
//Router end

//sockets starts
const messages = [];
const productos = new claseContenedor('./uploads/productos.json');

io.on('connection', async (socket) => {
    socket.emit('messages')
    socket.emit('muestroProductos')

    socket.on('new-product', async (data) => {
        await productos.save(data);
        io.sockets.emit('muestroProductos')
    })

    socket.on('procesar-mensaje', async data => {
        let datosNor = genMes(data);
        await processMess(datosNor)
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