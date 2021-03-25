const mongoose = require('mongoose');
const { Schema } = mongoose;

// abstracción que usa Mongoose para hacer queries
const UserSchema = new Schema({
    name:String,    // shorthand porque sólo tiene un tipo de dato o restricción
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:String,
    age: {
        type:Number,
        default: 0
    },
    gender: {
        type: String,
        enum: ['M', 'F', 'O']
    },
    birth_date: Date,
    photo: {
        type:String,
        // match: regex
    }
},{timestamps:true}) // automáticamente agrega created_at y update_at

// vincula la colección de mongo con el schema de user
// model(nombre de mi colección, nombre del schema con el que lo voy a estar usando)
const users = mongoose.model('users', UserSchema)

module.exports = users;