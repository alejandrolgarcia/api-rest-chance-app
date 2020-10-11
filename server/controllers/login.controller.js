const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const app = express();

// Login
app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        // Si error
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        // Si falla usuario
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                },
            });
        }
        // Si falla el password
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos',
                },
            });
        }

        let token = jwt.sign({
                user: userDB,
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        // si ok
        res.json({
            ok: true,
            user: userDB,
            token
        });
    });

});

module.exports = app;