const uploadImage = require('../utils/storage');

module.exports = (req, res, next) => {
    // primero voy a checar en qué entorno estoy
    if(process.env.NODE_ENV === "production"){
        if(!req.file) res.status(400).send({message:'no se envió ninguna imagen'});
        const url = uploadImage(req.file);
        req.body.photo = url;
    // } else {
    } else {
        //-----testting, me di cuenta que no siempre voy a tener un req.file 
        if(!req.file) return next();
        // -------
        req.body.photo =  `${req.protocol}://${req.hostname}/${req.file.path}`;  // esta es la dir que me da postman
                                // de la ruta donde está mi archivo en mi servidor local
        // req.body.photo = req.file.path; // en path viene la ubicación de mi archivo dentro de mi servidor
    }
    next(); // recuerda que esto es para que pueda seguir el flujo y pasar al controlador
}