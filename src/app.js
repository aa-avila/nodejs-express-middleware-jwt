const express = require('express');
const jwt = require('jsonwebtoken');
const unless = require('express-unless');
const bcrypt = require('bcrypt');


const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

/*********************/
// SET PORT
app.set('port', port);

/*********************/
// MIDDLEWARES
app.use(express.json());

const auth = (req, res, next) => {
    try {
        // agarramos el token desde el header de la peticion
        let token = req.headers['authorization'];

        // si no hay token, error
        if (!token) {
            throw new Error("No estas logueado");
        }

        // si hay token, le quitamos el bearer
        token = token.replace('Bearer ', '');

        // "decodificamos" el token con nuestra palabra secreta
        jwt.verify(token, 'Secret', (err, user) => {
            if (err) {
                throw new Error("Token invalido");
            }
            //console.log(user); -> "user" contiene la info contenida en el token
        });

        // si esta todo ok, sigue
        next();
    }
    catch (e) {
        res.status(403).send({message: e.message});
    }
}

auth.unless = unless;
app.use(auth.unless({
    path: [
        { url: '/', methods: ['GET'] },
        { url: '/login', methods: ['GET', 'POST'] },
        { url: '/registro', methods: ['GET', 'POST'] }
    ]
}));

/*********************/
// ROUTES
// Registro POST
app.post('/registro', async (req, res) => {
    try {
        // Verificamos que se envien todos los datos
        if (!req.body.usuario || !req.body.clave || !req.body.email) {
            throw new Error("No enviaste todos los datos necesarios");
        }

        /** Se verifica que no exista el nombre de usuario en la base de datos */
        /** Si ya existe previamente, throw error. Si no, entonces sigue la ejecucion.*/

        // Se encripta la clave
        const claveEncriptada = await bcrypt.hash(req.body.clave, 10);

        console.log(claveEncriptada);

        // Se guarda el usuario con la clave encriptada
        const usuario = {
            usuario: req.body.usuario,
            clave: claveEncriptada,
            email: req.body.email
        }

        // Si todo OK, envia la respuesta
        res.send({ message: "Registro exitoso" });
    }
    catch (e) {
        res.status(413).send({ message: e.message });
    }
});

// Login POST
app.post('/login', (req, res) => {
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

        // Generar sesion (con datos traidos de BD por ej)
        const tokenData = {
            nombre: "Pepito",
            apellido: "Suarez",
            user_id: 123
        }

        const token = jwt.sign(tokenData, 'Secret', {
            expiresIn: 60 * 60 * 24 // expira en 24 hs
        });

        // enviamos token
        res.send({ token });
    }
    catch (e) {
        res.status(413).send({ message: e.message });
    }
});

// HOME
app.get('/', (req, res) => {
    try {
        res.send("HOME");
    }
    catch (e) {
        res.status(413).send({ message: e.message });
    }
});

// Login GET
app.get('/login', (req, res) => {
    try {
        res.send("PAGINA LOGIN");
    }
    catch (e) {
        res.status(413).send({ message: e.message });
    }
});

// Registro GET
app.get('/registro', (req, res) => {
    try {
        res.send("PAGINA REGISTRO");
    }
    catch (e) {
        res.status(413).send({ message: e.message });
    }
});

// Libros GET
app.get('/libros', (req, res) => {
    try {
        // si esta ok, respondemos la peticion (consulta BD etc etc)
        res.send({ message: "Lista de libros..." });
    }
    catch (e) {
        res.status(413).send({ message: e.message });
    }
});




module.exports = app;