const fs = require('fs');

// export class producto {
//     nombre: string
//     descripcion: string
//     codigo: string
//     precio: number
//     url: string
//     stock: number
//     timestamp: number

//     constructor(nombre: string,descripcion: string,codigo: string,precio: number,url: string,stock: number,) {
//         this.nombre = nombre;
//         this.descripcion = descripcion;
//         this.codigo = codigo;
//         this.precio = precio;
//         this.url = url;
//         this.stock = stock;
//         this.timestamp = Date.now();
//     }
// }

// export function newProduct(reqbody: object) {
//     return ({
//         nombre: reqbody.nombre,
//         descripcion: "",
//         codigo: "",
//         precio: 0,
//         url: "",
//         stock: 0,
//         timestamp: Date.now()
//     })
// }

export class productManage {
    ruta: string;

    constructor(dir: string) {
        this.ruta = dir;
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

    async save(obj: object) {
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

    async deleteById(id: number) {
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

    async update(obj: object, id: number) {  
        try {
            let data = await this.getAll();
            let find = data.find(x => x.id == id);
            if (find !== undefined) {
                await this.deleteById(id);
                let dato = await this.getAll();
                let newObj = {...obj, id: id};
                dato.push(newObj);
                fs.writeFile(this.ruta, JSON.stringify(dato, null, 2), (err) => {
                    if (err) {
                        console.log("error en la escritura" + err);
                    } else {
                        console.log("seguardo correctamente");
                    }
                });
            }
        }
        catch (err) {
            console.log("error al actualizar" + err)
        }
    }

    async getById(id: number) {
        try {
            let data = await this.getAll();
            return data.find(x => x.id == id);
        }
        catch (error) {
            console.log("error al eliminar" + error)
        }
    }
}
