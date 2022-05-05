const fs = require('fs')

class Contenedor {
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

    async update(obj, id) {  
        try {
            let data = await this.getAll();
            let find = data.find(x => x.id == id);
            if (find !== undefined) {
                await this.deleteById(id);
                let dato = await this.getAll();
                let newObj = {...obj, id: parseInt(id)};
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

    async getById(id) {
        try {
            let data = await this.getAll();
            return data.find(x => x.id == id);
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

module.exports = Contenedor;