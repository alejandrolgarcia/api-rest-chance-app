const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'SERVICE_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    lastname: {
        type: String,
        required: [true, 'El apellido es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRole,
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
    apple: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('User', userSchema);