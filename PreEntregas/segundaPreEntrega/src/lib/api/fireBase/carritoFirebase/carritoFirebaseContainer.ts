var admin = require("firebase-admin");

//tipos
type NewCarrito = {
    id: number,
    date: Date,
    product: Array<NewProduct>
}

type NewProduct = {
    id: number,
    title: string,
    description: string,
    thumbnail: string,
    price: number,
    stock: number
}

//config 
const serviceAccount = require("../../../config/proyectofinalbackend-f565c-firebase-adminsdk-ws82t-d0d346b623.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

//class carrito
export class carritoFirebaseManage {
    collection: any;

    constructor(collection) {
        this.collection = db.collection(collection)
        console.log(`Firebase conectada con la collection ${collection}`)
    }

    async getCarritos() {
        try {
            let data = await this.collection.get();
            return data;
        } catch {
            console.log("error");
        }
    } 

    async carritoById(id: number) {
        try {
            let data = await this.collection.doc(id).get();
            return data;
        } catch {
            console.log("error");
        }
    }

    async createCarrito(obj: NewCarrito) {
        try {
            let newId:number = await this.maxId();
            let objCarr = {
                id: newId + 1,
                date: new Date(),
                product: [obj.product]
            }
            await this.collection.doc(newId).set(objCarr);
            console.log("carrito creado");
        } catch {
            console.log("error");
        }
    }

    async deleteCarritoById(id: number) {
        try {
            await this.collection.doc(id).delete();
            console.log("carrito eliminado");
        } catch {
            console.log("error");
        }
    }

    async maxId() {
        try {
            let data = await this.collection.orderBy("id", "desc").limit(1).get();
            if(data.empty) {
                return 0;
            } else {
                return data;
            }
        } catch {
            console.log("error");
        }
    }

    async pushProduct(id: number, obj: NewProduct) {
        try {
            console.log("push product")
        } catch {
            console.log("error")
        }
    }

    async deleteProductById(idCarr: number, idProd: number) {
        try {
            console.log("delete product")
        } catch {
            console.log("error")
        }
    }
}