// En Services estará todo lo que tenga que ver con la BD
// lo que se va a crear, modificar, leer, etc

// Quiero testear que lo que se guarde en la bd, realmente lo haga
// los modelos definen la estructura de mi BD
// los services se encargan de conectarse a la BD, hacer las operaciones 
// y los queries necesarios, y tener lógica para no sobrecargar de métodos al controlador
// las funciones que estén aquí también las usaré para el Testing

const Users = require('../models/Users');

const createUser = async(user) => {
    if(!user) throw new Error('No hay un usuario'); // esto genera un error, y esto luego se cacha en un try/catch
    // throw 'Esto es un error' // esto detiene la ejecución, pero no lanza un error
    const dbUser = await Users.create(user);
    return dbUser;
}

// async / await va a retornar una promesa SIEMPRE

// Users.find({}) regresa una promesa,
// se pone async await para tener una nomenclatura de promesas (aunque se pueda hacer sin async await)
const findUsers = async() => {
    return await Users.find({});
}

// Promise.all() Resuelve un arreglo de promesas, se hace un map de promesas,
// para luego resolverlas y manejar los resultados

const findUserbyId = async(id) => {
// const findUserbyId = (id) => {
    // esto ya tiene su try catch incluido, en la promesa implícita se usa un try/catch en la parte del controlador
    // return new Promise((resolve, reject) => {
    //     Users.findById(id).then((user) => {
    //         if(!user) reject(new Error('Usuario no encontrado'))
    //         resolve(user);
    //     }).catch((error) => {
    //         reject(error);
    //     })
    // })
    // el código de arriba y este, hace lo mismo, una es promesa explícita, y otra implícita
    const user = await Users.findById(id);
    if(!user) throw new Error('Usuario no encontrado');
    return user;
}

const updateUser = async (id,user) => {
    // modifica uno, recibe como parámentros tres objetos
    // _id así lo tiene mongo, así vienen los ids en mongo (el _id de mongo debe ser idéntico al id que estoy pasando) 
    // así voy a buscar el usuario dentro de mongo
    // y le paso el script object de user (...user), así creo una copia idèntica de user
    // y así el user original no se modifica y luego puedo hacer otro tipo de validaciones
    // con los datos que traía originalmente user (el objeto que manda el controlador, no el de la BD)
    // es decir, va a sustituir user dentro de la BD con lo que traiga el objeto user que se envía del controlador
    // new: true regresa el usuario actualizado, si no le pongo este parámentro
    // no se va a actualizar dentro de BD el usuario

    // si quisiera usar como registro el user del controller
    // await CustomElementRegistry.create({
    //     model: 'User',
    //     operation: 'update',
    //     object: user
    // });
    // así podría llevar un registro de cuántas modificaciones se han hecho
    if(!user) throw new Error('Se necesita objeto usuario');
    const userDB = await Users.updateOne({_id: id},{$set:{...user}},{new:true});
    if(!userDB) throw new Error('Usuario no encontrado');
    return userDB;
}

const deleteUser = async (id) => {
    return await Users.deleteOne({_id:id});
}

module.exports = {
    createUser,
    findUsers,
    findUserbyId,
    updateUser,
    deleteUser
}