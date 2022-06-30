import mongoose from "mongoose"
import { urlMongoMessage } from './connection/mongoConnect.js'

class MongoContenedor {
    constructor(models) {
        this.model = models
    }

    async getLast() {
        try {
            let last = await this.model.findOne().sort({id:-1}).limit(1);
            if (last == undefined) {
                let ids = {
                    idm: 0,
                    ida: 0,
                }
                return ids;
            } else {
                let ids = {
                    idm: last.id,
                    ida: last.author.id
                }
                return ids;
            }
         
        } catch {
            console.log("error find last");
        }
    }

    async connectMongo() {
        try {
            const urlMongo = urlMongoMessage
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
            let newid = await this.getLast();
            let newMess = await new this.model({
                id: newid.idm + 1,
                author: {
                    id: newid.ida + 1,
                    nombre: x.author.nombre,
                    apellido: x.author.apellido,
                    edad: x.author.edad,
                    alias: x.author.alias,
                    avatar: x.author.alias
                },
                text: x.text
            })
            await newMess.save();
            console.log('se creo')
        } catch (err) {
            console.log('error al crear' + err)
        }
    }
}

export default MongoContenedor