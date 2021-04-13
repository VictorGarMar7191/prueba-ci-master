const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');   // firebase connection
const UserController = require('./controllers/UserController');
// const Users = require('./models/Users'); Después de controllers y services, ya no es necesario
// const storage = require('./utils/storage'); // quito esta linea porque el middle que hice va a hacer esta parte
const manageFiles = require('./middlewares/manageFiles'); // traigo el middle ware
const app = express();
                                                    // lo que está antes del ? es el nombre que le doy
const MONGO_URI = 'mongodb+srv://victor:prueba1@cluster0.joiol.mongodb.net/apiMongo?retryWrites=true&w=majority';

// en esta parte se lee la variable de entorno node_env
// node_env se usa para saber en qué ambiente estoy: de desarrollo o producción
// si estoy en producción voy a usar el memoryStorage para poder subir a firebase
// en caso contrario, voy a usar diskStorage, esta es una función que otorga multer
// para modificar  archivos en mi compu
const storage = process.env.NODE_ENV === "production"
                ? multer.memoryStorage() 
                : multer.diskStorage({
                    // le digo donde va a guardar las cosas, en la carpeta 'uploads' la cual YA debe de existir
                    // esta carpeta se puede llamar como yo quiera, pero debe estar al mismo nivel de server.js
                    // cb es un callback
                    destination: function(req, file, cb){
                        cb(null, 'uploads')
                    },
                    // aquí voy a renombrar el archivo
                    filename: function(req, file, cb){
                        cb(null, `${Date.now()}_${file.originalname}`);
                    }
                },)

//------------------------------------------------------------------------------------------------------------------//
// multer es un middleware que ayuda a guardar un archivo en el backend
// PRIMER AJUSTE PARA GUARDAR ARCHIVOS EN COMPU 
// hay toda una documentación
const mult = multer({
    // storage: multer.memoryStorage(),
    // aquí estoy asignando la variable storage a multer (memoryStorage o diskStorage, dependiendo el caso)
    storage,    // este cambio para guardar en disco
    limits: {
        // esto es un límite de 5 MB, no se pueden subir archivos más pesados
        fileSize: 5 * 1024 * 1024   
    }
})

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
// aqui expongo los archivos del backend al front end
// le digo que debe exponerla carpeta
// se le conoce como 'SERVIR ARCHIVOS ESTÁTICOS'
// express static va a buscar una carpeta (__dirname) llamada uploads
// para que pueda ser accesible desde el servidor
// https://localhost:3000/direccionDelArchivo
// státicos porque son archivos que no cambian de tipo
// así creo una dirección virtual para tener acceso al archivo
// le digo que no hay un controlador /uploads, sino que lo busque en el directorio 'uploads'
app.use('/uploads', express.static('uploads'));

//------------------------------------------------------------------------------------------------------------------//
// conexión a mongo
// ------- testing
// se le pone este if, para testear si sí se conecta a la base de datos de mongo memory server
// node_env le dice a jest en qué environment está corriendo node, en este caso: test
// y entonces mejor haga el event handler para el mock de la BD
// jest genera automáticamente NODE_ENV
if(process.env.NODE_ENV !== 'test'){
    mongoose.connect(MONGO_URI,{
        useNewUrlParser: true,  // dice que se conecte con mongo con la forma 'nueva'
        useUnifiedTopology: true,
        useCreateIndex: true,   // mongoose junto con mongo crean un nuevo id por cada cosa que se agrega
    }); 
}
// -------testing
// mongoose.connect(MONGO_URI,{
//     useNewUrlParser: true,  // dice que se conecte con mongo con la forma 'nueva'
//     useUnifiedTopology: true,
//     useCreateIndex: true,   // mongoose junto con mongo crean un nuevo id por cada cosa que se agrega
// });    // inicia la conexión
const db = mongoose.connection; // está guardada el status de la conexión con mongo

// se va a ejecutar varias veces si encuentra un error en la conexión
db.on('error', function(err){
    console.log('Connection error', err);
})

// se ejecuta una vez, esto sólo es cuando se haya completado la conexión
db.once('open', function(){
    console.log('Connected to DB!');
});

//------------------------------------------------------------------------------------------------------------------//

app.get('/users', UserController.fetch);

// app.get('/users', (req, res) => {
//     Users.find({}).then((result) => {
//         res.status(200).send(result);
//     })
// });

// para subir una imagen, se pone en post, se pone el middleware

//------------------------------------------------------------------------------------------------------------------//
// 2º CAMBIO --- AQUÍ VOY A USAR OTRO MIDDLE WARE Y SABER EN QUÉ AMBIENTE ESTOY Y GUARDAR LAS COSAS EN EL LADO CORRESPONDIENTE
// creo la carpeta middleware y manageFiles.js

//------------------------------------------------------------------------------------------------------------------//


// app.post('/users', (req, res) => {
    // se le dice cómo se llama el campo donde estará el archivo que se subirá
    // voy a estar subiendo la foto, multer me va a regresar la url donde se guardó mi foto,
    // y en la BD voy a escribir la url donde se guardó mi foto

    // si uso más de un middleware, los pongo entre corchetes
    // primero va lo de multer, y luego mi middleware
// app.post('/users', [mult.single('photo'), manageFiles ], async(req, res) => {
//     // req.file tiene el archivo con todos sus datos que nos manda multer

//     // este codigo está siendo reemplazado por el middleware
//     // if(req.file){
//     //     const url = await storage(req.file);     // aquí subo mi archivo a firebase
//     //     req.body.photo = url;    // voy a guardar la url de la imagne en la base de datos
//     // }
//     Users.create(req.body).then((user) => { // create checa con el schema que hicimos
//         res.status(201).send(user);
//     }).catch((error) => {
//         res.status(400).send(error);
//     })
// })

// después de crear controllers, services
app.post('/users', [mult.single('photo'),manageFiles], UserController.create);
app.get('/users/:id', UserController.findOne);
app.patch('/users/:id', [mult.single('photo'),manageFiles], UserController.update);
app.delete('/users/:id', UserController.remove);

// HEROKU
// node.js va a buscar la variable port, y si no la encuentra pone el puerto 3000
const port = process.env.PORT || 3000;
// app.listen(3000, ()=>{
app.listen(port, ()=>{
    console.log('Server ready 🚀!!!');
})

// ----- esto se pone en testing
module.exports = app;