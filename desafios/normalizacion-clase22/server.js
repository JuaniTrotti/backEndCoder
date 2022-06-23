// const express = require('express');
import express from 'express';
// const claseContenedor = require('./claseContenedor');
import claseContenedor from './claseContenedor.js';
import MongoContenedor from './mongoContenedor.js'
// const { Router } = express;
import Router from "express";
// const { Server: HttpServer } = require('http');
import { createServer } from 'http';
// const { Server: IOServer } = require('socket.io');
import { Server } from 'socket.io'

//mongoose
// const { mongoose } = require('mongoose');
import mongoose from 'mongoose';
import * as models from './models/messageModel.js'
// const mongoM  = require('./models/messageModel').default

// async function connectMongo() {
//     try {
//         const urlMongo = 'mongodb://localhost:27017/mensajesDesafio'
//         await mongoose.connect(urlMongo)
//         console.log('conectado a mongo')
//     } catch {
//         console.log('error conexion mongo')
//     }
// } 

function genMes() {
    return {
        author: {
            nombre: faker.name.firstName(),
            apellido: faker.name.findName(),
            edad: faker.random.numeric(2),
            alias: faker.internet.userName(),
            avatar: faker.internet.avatar()
        },
        text: faker.lorem.sentence(4)
    }
}

//normalizr
// const { normalize, denormalize, schema } = require('normalizr');
import { normalize, denormalize, schema } from 'normalizr' 

//faker mock
import { faker }from '@faker-js/faker';
import { createRequire } from 'module';
faker.locale = 'es';

function generarProducto() {
    return {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.business()
    }
}

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


// sockets
const messages = [];
const productos = new claseContenedor('./uploads/productos.json');

io.on('connection', async (socket) => {
    let newus = new MongoContenedor(models.mongoM)
    await newus.connectMongo()
    await newus.crearMes(genMes())
    console.log(await newus.leerMes())


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
})

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
httpServer.on('error', error => console.log(`Error en servidor ${error}`))