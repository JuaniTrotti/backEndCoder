// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const mensajesColection = 'message'

const mensajesSchema = new mongoose.Schema({
    id: {type: Number, require: true, unique: true},
    author: {
        id: {type: Number, require: true, unique: true},
        nombre: {type: String, required: true, max: 50},
        apellido: {type: String, required: true, max: 50},
        edad: {type: Number, required: true},
        alias: {type: String, required: true, max: 50},
        avatar: {type: String, required: true, max: 500}
    },
    text: {type: String, required: true, max: 500}
})
export const mongoM = mongoose.model(mensajesColection, mensajesSchema);
