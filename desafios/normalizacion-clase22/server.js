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

//mongoose models
import * as models from './models/messageModel.js'

function genMes(x) {
    return {
        author: {
            id: 1,
            nombre: x.author,
            apellido: faker.name.findName(),
            edad: faker.random.numeric(2),
            alias: faker.internet.userName(),
            avatar: faker.internet.avatar()
        },
        text: x.message
    }
}

//normalizr start
import { normalize, denormalize, schema } from 'normalizr' 

const user = new schema.Entity('user')
const texto = new schema.Entity('texto')
const autor = new schema.Entity('autor', {
    author: user,
})
const mess = new schema.Entity('mess', {
    author: autor,
    text: texto
})
const messageColl = new schema.Entity('messageColl', {
    nombre: mess
})

import util from 'util'
function print(ob) {
    console.log(util.inspect(ob,false,12,true))
}

async function processMess(x) {

    console.log('objeto normalizado')
    const normalizedMessage = normalize(x, messageColl)
    // print(normalizedMessage)

    const denormalizeMessage = denormalize(normalizedMessage.result, messageColl, normalizedMessage.entities)
    // print(denormalizeMessage)

    let con = new MongoContenedor(models.mongoM);
    await con.connectMongo();
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

//Router config
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
    console.log(datos)
    // let denormalizeDatos = denormalize(datos.result, messageColl, datos.entities)
    // res.json(denormalizeDatos);
});


//sockets starts
const messages = [];
const productos = new claseContenedor('./uploads/productos.json');

io.on('connection', async (socket) => {
    socket.emit('messages', messages)
    socket.emit('muestroProductos')

    socket.on('new-product', async (data) => {
        await productos.save(data);
        io.sockets.emit('muestroProductos')
    })

    socket.on('new-message', data => {
        messages.push(data)
        io.sockets.emit('messages', messages)
    })

    socket.on('procesar-mensaje', data => {
        let datosNor = genMes(data);
        processMess(datosNor)
        io.sockets.emit('messages')
    })
})
//sockets end

//server settings
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
httpServer.on('error', error => console.log(`Error en servidor ${error}`))