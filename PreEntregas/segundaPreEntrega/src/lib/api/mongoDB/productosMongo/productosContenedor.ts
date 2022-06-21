const mongoose = require('mongoose');
const { mongoURL} = require('../../../config/mongoConnect');

type NewProduct = {
    id: number,
    title: string,
    description: string,
    thumbnail: string,
    price: number,
    stock: number
}

export class productMongoManage {
    model: any;


    constructor(model) {
        this.model = model;
    }

    async getLast() {
        try {
            let last:NewProduct = await this.model.findOne().sort({id:-1}).limit(1);
            return last.id;
        } catch {
            console.log("error find last");
        }
    }

    async connect() {
        try {
            await mongoose.connect(mongoURL);
            console.log("conectado a mongo");
        } catch {
            console.log("error conectando a mongo");
        }
    }

    async disconnect() {
        mongoose.connection.close();
        console.log("desconectado de mongo");
    }

    async getAll() {
        try {
            let data = await this.model.find();
            return data;
        } catch {
            console.log("error find()");
        }
    }

    async newProd(obj: NewProduct) {
        try {
            let newId = await this.getLast();
            if(newId == undefined) {
                newId = 1;
            }
            let prodNew = new this.model({
                id: newId + 1,
                title: obj.title,
                description: obj.description,
                thumbnail: obj.thumbnail,
                price: obj.price,
                stock: obj.stock
            })
            await prodNew.save();
            console.log("se guardo correctamente");
        } catch {
            console.log("error al guardar");
        }
    }

    async deleteById(id: number) {
        try {
            await this.model.deleteOne({id: id})
            console.log("se elimino correctamente");
        } catch {
            console.log("error al eliminar");
        }
    }

    async update(obj: NewProduct, id: number) {  
        try {
            await this.model.findOneAndUpdate({id: id}, {
                id: id,
                title: obj.title,
                description: obj.description,
                thumbnail: obj.thumbnail,
                price: obj.price,
                stock: obj.stock
            });
        } catch {
            console.log("error al actualizar");
        }
    }

    async getById(id: number) {
        try {
            let data = await this.model.find({id: id});
            return data;
        } catch {
            console.log("error find()");
        }
    }
}