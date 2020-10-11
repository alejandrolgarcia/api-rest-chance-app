const mongoose = require('mongoose');
let timestamps = require('mongoose-timestamp');

let Schema = mongoose.Schema;

let serviceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: [true, 'El nombre del servicio es requerido'],
    },
    desc: {
        type: String,
        required: [true, 'La descripción del servicio es requerido'],
    },
    price: {
        type: Number,
        default: 0.0
    },
    time: {
        type: String,
        required: [true, 'El horario del servicio es requerido'],
    },
    score: {
        type: Number,
        default: 5
    },
    img: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

serviceSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Service', serviceSchema);