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

type NewCarrito = {
    id: number,
    date: Date,
    product: NewProduct[]
}

export class carritoMongoManage {
    model: any;

    constructor(model) {
        this.model = model;
    }

    async getLast() {
        try {
            let last:NewCarrito = await this.model.findOne().sort({id:-1}).limit(1);
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

    async getCarritos() {
        try {
            let data = await this.model.find();
            return data;
        } catch {
            console.log("error find()");
        }
    } 

    async carritoById(id: number) {
        try {
            let data:NewCarrito = await this.model.findOne({id:id});
            return data.product;
        } catch {
            console.log("error find()");
        }
    }

    async createCarrito(obj: NewCarrito) {
        try {
            let newId = await this.getLast();
            if(newId == undefined) {
                newId = 0;
            }
            let carritoNew = new this.model({
                id: newId + 1,
                date: new Date(),
                product: []
            });
            await carritoNew.save();
            console.log("se creo correctamente");
        } catch {
            console.log("error create()");
        }
    }

    async deleteCarritoById(id: number) {
        try {
            await this.model.deleteOne({id: id})
            console.log("se elimino correctamente");
        } catch {
            console.log("error al eliminar");
        }
    }

    async pushProduct(id: number, obj: NewProduct) {
        try {
            await this.model.updateOne({id: id}, {$push: {product: obj}});
            console.log("se agrego correctamente");
        } catch {
            console.log("error al agregar");
        }
    }

    async deleteProductById(idCarr: number, idProd: number) {
        try {
            await this.model.updateOne({id: idCarr}, {$pull: {product: [{id: idProd}]}});
            console.log("se elimino correctamente");
        } catch {
            console.log("error al eliminar");
        }
    }
}