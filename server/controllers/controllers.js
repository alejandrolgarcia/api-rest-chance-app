// Configuración global de rutas
const express = require('express');
const app = express();

// Rutas
app.use(require('./user.controller'));
app.use(require('./login.controller'));
app.use(require('./card.controller'));

module.exports = app;