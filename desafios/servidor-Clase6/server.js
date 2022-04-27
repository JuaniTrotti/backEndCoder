const contenedor = require('./Contenedor.js')

const productosTienda = [
    {title: "Laptop", price: 20000, thumbnail: "laptop.jpg"},
    {title: "Television", price: 10000, thumbnail: "tv.jpg"},
    {title: "Tablet", price: 5000, thumbnail: "tablet.jpg"},
];
const tienda = new contenedor('./prueba.txt');

async function cargarProductos(productos) {
    for (let i of productos) {
        await tienda.save(i);
    }
}

async function getById(id) {
    let res = await tienda.getById(id);
    console.log(res);
}

async function deleteById(id) {
    let res = await tienda.deleteById(id);
    console.log(res);
}

async function deleteAll() {
    await tienda.deleteAll();
}

async function getAll() {
    let res = await tienda.getAll();
    console.log(res);
}

cargarProductos(productosTienda);

setTimeout(() => {
    getAll();
}, 1000);

setTimeout(() => {
    getById(2);
}, 2000);

setTimeout(() => {
    deleteById(2);
}, 3000);

setTimeout(() => {
    getAll();
}, 4000);

// setTimeout(() => {
//     deleteAll();
// }, 5000);