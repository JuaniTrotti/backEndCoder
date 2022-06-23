// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const mensajesColection = 'nuevo'

const mensajesSchema = new mongoose.Schema({
    author: {
        nombre: {type: String, required: true, max: 50},
        apellido: {type: String, required: true, max: 50},
        edad: {type: Number, required: true},
        alias: {type: String, required: true, max: 50},
        avatar: {type: String, required: true, max: 500}
    },
    text: {type: String, required: true, max: 500}
})
export const mongoM = mongoose.model(mensajesColection, mensajesSchema);
