const mongoose = require('mongoose');
const carritoCollection = 'cart';
const cartSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true, index: true},
    date: {type: Date, required: true},
    product: {type: Array, required: true}
})
const cart = mongoose.model(carritoCollection, cartSchema);
export default cart;