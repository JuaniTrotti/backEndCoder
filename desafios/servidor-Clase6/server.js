const express = require('express');
const contenedor = require('./Contenedor.js')


const tienda = new contenedor('./prueba.txt');

const PORT = 8080;
const app = express();

async function idRandom() {
    const arr = await tienda.getAll();
    const num = Math.floor((Math.random() * (arr.length-1))+1);
    const elemento = await tienda.getById(num);
    return elemento
}

async function all() {
    let datos = await tienda.getAll();
    return datos;
}

const server = app.listen(PORT, () => {
    console.log('servidor escuchando en el puerto ' + PORT);
})


app.get('/', (req, res) => {
    res.send('Bienvenido a la tienda de productos');
})


app.get('/productoRandom', async function (req, res) {
    const data = await idRandom();
    res.send({data});
})

app.get('/productos', async function (req, res) {
    const data = await all();
    res.send({data});
})

