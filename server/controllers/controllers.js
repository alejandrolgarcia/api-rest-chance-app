// Configuración global de rutas
const express = require('express');
const app = express();

// Rutas
app.use(require('./user.controller'));
app.use(require('./login.controller'));

module.exports = app;