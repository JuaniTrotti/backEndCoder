const mongoose = require('mongoose');
const productoCollection = 'product';
const productSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true, index: true},
    title: {type: String, required: true, max: 200},
    description: {type: String, required: true, max: 200},
    thumbnail: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true}
});
export const product = mongoose.model(productoCollection, productSchema);

const carritoCollection = 'cart';
const cartSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true, index: true},
    date: {type: Date, required: true},
    product: {type: Array, required: true}
})
export const cart = mongoose.model(carritoCollection, cartSchema);