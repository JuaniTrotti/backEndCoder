import mongoose from "mongoose"

class MongoContenedor {
    constructor(models) {
        this.model = models
    }

    async connectMongo() {
        try {
            const urlMongo = 'mongodb://localhost:27017/mensajesDesafio'
            await mongoose.connect(urlMongo)
            console.log('conectado a mongo')
        } catch {
            console.log('error conexion mongo')
        }
    }

    async leerMes() {
        try {
            const mensajesMongo = await this.model.find()
            return mensajesMongo
        } catch {
            console.log("nno se puede leer los mensajes")
        }
    }

    async crearMes(x) {
        try {
            await new this.model({...x}).save()
            console.log('se creo')
        } catch (err) {
            console.log('error al crear' + err)
        }
    }
}

export default MongoContenedor