const fs = require('fs');

export class carritoManage {
    ruta: string;

    constructor(dir: string) {
        this.ruta = dir;
    }

    async getCarritos() { // devuelve todos los carritos
        try {
            let data = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.log("" + error)
        }
    }

    async carritoById(id: number) { // devuelve el carrito de un id
        try {
            let data = await this.getCarritos();
            let carrito = data.find(x => x.id == id);
            return carrito.productos;
        }
        catch (error) {
            console.log("" + error)
        }
    }

    async createCarrito(obj: object) { // crea un nuevo carrito
        try {
            let data = await this.getCarritos();
            let newId = 1;

            if (data.length > 0) {
                newId = data[data.length - 1].id + 1;
            }
            let newObj = {...obj, id: newId};
            data.push(newObj);
            fs.writeFile(this.ruta, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    console.log("error en la escritura" + err);
                    // return newId;
                } else {
                    console.log("seguardo correctamente");
                }
            });
        }
        catch (error) {
            console.log("error al guardar" + error)
        }
    }
    
    async deleteCarritoById(id: number) { // elimina un carrito por id
        try {
            let data = await this.getCarritos();
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

    maxId(carrito) {
        let max:number = 0;
        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i].id > max) {
                max = carrito[i].id;
            }
        }
        return max;
    } // devuelve el id del ultimo producto guardado

    async pushProduct(id: number, obj: object) { // agrega un producto a un carrito por id
        try {
            console.log(id);
            let data = await this.getCarritos(); // tengo [carrito, carrito]
            let carritoBus = data.find(x => x.id == id); // tengo carrito con id = id
            console.log(carritoBus)
            // let prodGuardado = Math.max(...carritoBus.productos.id) // tengo el id del ultimo producto guardado
            // console.log(prodGuardado);
            let prodGuardado = this.maxId(carritoBus.productos);
            console.log(prodGuardado);
            let newProd = {...obj, id: prodGuardado + 1}; // creo un nuevo producto con id +1 del ultimo producto guardado + 1
            carritoBus.productos.push(newProd); // agrego el nuevo producto al array de productos del carrito

            await this.deleteCarritoById(id); // elimino el carrito por id 
            let newData = await this.getCarritos();

            newData.push(carritoBus); // agrego el carrito modificado al array de carritos
            fs.writeFile(this.ruta, JSON.stringify(newData, null, 2), (err) => {
                if (err) {
                    console.log("error al agregar" + err);
                } else {
                    console.log("se agrego correctamente");
                }
            });
        } 
        catch (error) {
            console.log("" + error)
        }
    }

    async deleteProductById(idCarr: number, idProd: number) { // elimina un producto de un carrito por id
        try {
            //leo e elimino
            let data = await this.getCarritos(); // tengo [carrito, carrito]
            let carritoBus = data.find(x => x.id == idCarr); // tengo carrito con id = id
            let prodArr = carritoBus.productos.filter(x => x.id != idProd); // tengo el array de productos del carrito
            await this.deleteCarritoById(idCarr); // elimino el carrito por id
            
            // leo y vuelvo a guardar
            let newData = await this.getCarritos();
            console.log(newData);
            carritoBus.productos = prodArr; // le asigno el array de productos modificado al carrito
            console.log(carritoBus.prodcutos);

            newData.push(carritoBus); // agrego el carrito modificado al array de carritos
            console.log(newData);
            // guardo
            fs.writeFile(this.ruta, JSON.stringify(newData, null, 2), (err) => {
                if (err) {
                    console.log("error al agregar" + err);
                } else {
                    console.log("se agrego correctamente");
                }
            });
        }
        catch (error) {
            console.log("" + error)
        }
    }
}
