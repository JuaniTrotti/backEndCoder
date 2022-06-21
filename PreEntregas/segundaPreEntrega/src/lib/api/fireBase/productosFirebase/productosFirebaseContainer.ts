var admin = require("firebase-admin");

//tipo
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

    constructor(collection: String) {
        this.collection = db.collection(collection)
        console.log(`Firebase conectada con la collection ${collection}`)
    }

    async newProd(document: NewProduct){
      let doc = await this.collection.doc().create(document)
      return doc;
    }

    async getAll(){
      let data = await this.collection.get();
      return data;
    }

    async getById(id: number){
    let data = await this.collection.doc(id).get();
      return data;
    }

    async delete(id: number){
        await this.collection.doc(id).delete();
        console.log("eliminado");
    }

    async update(id: number, obj: NewProduct){
      let newprd = this.collection.doc(id).updateOne(obj)
      return newprd;
    }
}