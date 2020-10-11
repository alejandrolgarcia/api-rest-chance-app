const mongoose = require('mongoose');
let timestamps = require('mongoose-timestamp');

let Schema = mongoose.Schema;

let cardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    profession: {
        type: String,
        required: [true, 'La profesión del usuario es requerida'],
    },
    phone: {
        type: String,
        required: [true, 'El número de teléfono es requerido'],
    },
    email: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    company: {
        type: String,
        required: false,
    },
    slogan: {
        type: String,
        required: false,
    },
    score: {
        type: Number,
        default: 1
    },
    status: {
        type: Boolean,
        default: true,
    },
});

cardSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Card', cardSchema);