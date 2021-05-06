const express = require('express');
const jwt = require('jsonwebtoken');
const unless = require('express-unless');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

// SETTINGS
app.set('port', port);
 
// MIDDLEWARES
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
    res.send('hola');
})


module.exports = app;