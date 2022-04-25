const fs = require('fs')
const { listenerCount } = require('process')

class contenedor {
    constructor(ruta) {
        this.ruta = ruta;
    }

    async getAll() {
        try {
            let data = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.log("error en la lectura" + error);
        }
    }

    async save(obj) {
        try {
            let data = await this.getAll();
            let newId = 1;
            if (data.length > 0) {
                newId = data[data.length - 1].id + 1;
            }
            let newObj = {...obj, id: newId};
            data.push(newObj);
            fs.writeFile(this.ruta, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    console.log("error en la escritura" + err);
                } else {
                    console.log("seguardo correctamente");
                }
            });
        }
        catch (error) {
            console.log("error al guardar" + error)
        }
    }

    async getById(id) {
        try {
            let data = await this.getAll();
            return data.find(x => x.id == id);
        }
        catch (error) {
            console.log("error al eliminar" + error)
        }
    }

    async deleteById(id) {
        try {
            let data = await this.getAll();
            let newData = data.filter(x => x.id != id);
            fs.writeFile(this.ruta, JSON.stringify(newData, null, 2), (err) => {
                if (err) {
                    console.log("error al eliminar" + err);
                } else {
                    console.log("se elimino correctamente");
                }
            })
        }
        catch (error) {
            console.log("error al eliminar" + error)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.ruta, '[]');
            console.log("se elemino todo correctamente")
        }
        catch (error) {
            console.log("error al eliminar" + error)
        }
    }
}
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

setTimeout(() => {
    deleteAll();
}, 5000);
