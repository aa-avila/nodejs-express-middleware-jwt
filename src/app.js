const express = require('express');
const jwt = require('jsonwebtoken');
const unless = require('express-unless');
const bcrypt = require('bcrypt');
const e = require('express');

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

// SETTINGS
app.set('port', port);
 
// MIDDLEWARES
app.use(express.json());


// ROUTES
// Home
app.get('/', (req, res) => {
    res.send('hola');
});

// Registro
app.post('/registro', async(req, res) => {
    try {
        // Verificamos que se envien todos los datos
        if (!req.body.usuario || !req.body.clave || req.body.email) {
            throw new Error("No enviaste todos los datos necesarios");
        }

        /** Se verifica que no exista el nombre de usuario en la base de datos */
        /** Si ya existe previamente, throw error. Si no, entonces sigue la ejecucion.*/

        // Se encripta la clave
        const claveEncriptada = await bcrypt.hash(req.body.clave, 10);

        // Se guarda el usuario con la clave encriptada
        const usuario = {
            usuario: req.body.usuario,
            clave: claveEncriptada,
            email: req.body.email
        }

        // Si todo OK, envia la respuesta
        res.send({message: "Registro exitoso"});
    }
    catch {
        res.status(413).send({message: e.message});
    }
});

// Login
app.post('/', (req, res) => {
    try {
        // Verificamos que se envien todos los datos
        if (!req.body.usuario || !req.body.clave) {
            throw new Error("No enviaste todos los datos necesarios");
        }
        /** Buscamos el usuario en la base de datos. */
        // si no existe, generamos error. Si existe, sigue.

        const claveEncriptada = "sdfksjkjdfsk"; // clave traide desde la BD

        // Verificar la clave
        if (!bcrypt.compareSync(req.body.clave, claveEncriptada)) {
            throw new Error("Fallo el login");
        }

        // Generar sesion
        const tokenData = {
            nombre: "Pepito",
            apellido: "Suarez",
            user_id: 123
        }
        const token = jwt.sign(tokenData, 'Secret', {
            expiresIn: 60 * 60 * 24 // expira en 24 hs
        });

        // enviamos token
        res.send({token});
    }
    catch {

    }
});

module.exports = app;