require('./config/config');

const express = require('express')
const app = express()
 
app.get('/user', function (req, res) {
  res.send('Hello World')
})
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', 3000);
});