const fs = require('fs')


class Contenedor {
    constructor(rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
        this.cantidad = 0
    }

    // getById = async (id) => {
    //     try {
    //         const data = await fs.promises.readFile(`${this.rutaArchivo}`, 'utf-8')
    //         for (const i of JSON.parse(data)) {
    //             if (i.id === id) {
    //                 return i
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // deleteById = async (id) => {
    //     try {
    //         const data = await fs.promises.readFile(`${this.rutaArchivo}`, 'utf-8')
    //         const newData = data.slice(id, id + 1)
    //         await fs.promises.writeFile(`${this.rutaArchivo}`, newData)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    deleteAll = async () => {
        try {
            fs.promises.writeFile(`${this.rutaArchivo}`, '')
        } catch (error) {
            console.log(error)
        }
    }

    save = (obj) => {
        fs.readFile(this.rutaArchivo, 'utf-8', (error, data) => {
            if (error) {
                console.log(error)
            } else {
                if (data === '') {
                    fs.writeFile(this.rutaArchivo, JSON.stringify({id: this.cantidad, pro: {...obj}}, null, 2) , error => {
                        if (error) {
                            console.log("no se puedo guardar")
                        } else {
                            this.cantidad++;
                            console.log("se guardo por primer vez")
                        }
                    })
                } else {
                    const dataTemp = [JSON.parse(data), {id: this.cantidad, pro: {...obj}}]
                    fs.writeFile(this.rutaArchivo, JSON.stringify(dataTemp, null, 2) , error => {
                        if (error) {
                            console.log("no se puedo guardar")
                        } else {
                            this.cantidad++;
                            console.log("se guardo correctamente")
                        }
                    })
                }
            }
        })
    }
}

const producto = {
    nombre: 'producto',
    precio: '100',
    descripcion: 'descripcion'
}

const producto2 = {
    nombre: 'producto2',
    precio: '500',
    descripcion: 'descripcion'
}

const producto3 = {
    nombre: 'producto3',
    precio: '500',
    descripcion: 'descripcion'
}

const tienda = new Contenedor('./desafioArchivos.json')
// tienda.save(producto)
tienda.save(producto2)
// tienda.save(producto3)
// console.log(tienda.getAll())
// tienda.deleteAll()
