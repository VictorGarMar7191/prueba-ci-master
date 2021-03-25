// vamos a jugar con la conexión de mongo a este lugar
// no nos vamos a conectar directamente a la BD (mongo atlas, ni docker)
// vamos a crear la propia coenxión con mongo memory server

const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

const mongod = new MongoMemoryServer(); // estoy creando un mini server de mongo 

const connect = async () => {
    const uri = await mongod.getUri();

    const mongooseOptions = {
        useNewUrlParser: true,
        autoReconnect: true,
        useUnifiedTopology: true,
        userCreateIndex: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000 // milisegundos
    }

    await mongoose.connect(uri, mongooseOptions);
}

// se ejecuta cuando acaben todos los tests 
const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

// se ejecuta por cada test que hagamos
// cada test está aislado de los demás, por eso se limia la BD antes de cada test
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for(const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
}

module.exports = {
    connect,
    closeDatabase,
    clearDatabase
}