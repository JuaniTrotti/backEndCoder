const mongoose = require('mongoose')
const mongoUser = require('../models/userModel')

class mongoCon {
    constructor(con) {
        this.model = mongoUser
        this.connection = con
    }

    async connectMongo() {
        try {
            await mongoose.connect(this.connection)
            console.log('mongo connected')
        } catch {
            console.log('error conexion mongo')
        }
    }

    async getLast() {
        try {
            let last = await this.model.findOne().sort({id:-1}).limit(1);
            if (last == undefined) {
                let ids = 0;
                return ids;
            } else {
                let ids = last.id
                return ids;
            }
        } catch {
            console.log("error find last");
        }
    }

    async findUser(usermail) {
        try {
            const userfind = await this.model.findOne({email: usermail})
            if (userfind == undefined) {
                return false
            } else {
                return true
            }
        } catch (err) {
            console.log('error ' + err)
        }
    }

    async getUser(usermail) {
        try {
            const userfind = await this.model.findOne({email: usermail})
            return userfind
        } catch (err) {
            console.log('error' + err)
        }
    }

    async newUser(user) {
        try {
            let newid = await this.getLast()
            let newUsuario = await new this.model({
                id: newid + 1,
                user: user.name,
                email: user.email,
                password: user.password
            })
            await newUsuario.save()
            console.log("se creo")
        } catch (err) {
            console.log("error al crear ")
        }
    } 
}

module.exports = mongoCon;