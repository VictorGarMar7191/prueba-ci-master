const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectID: "masterencode-c6def",
    keyFilename: 'service.json',    // ubiación del archivo JSON
});

// url de la pestaña storage en firebase, aquí se van a estar guardando las imágenes
const bucket = storage.bucket("masterencode-c6def.appspot.com");

module.exports = (file) => {
    // se regresa una promesa porque este proceso puede tardar mucho
    return new Promise((resolve, reject) => {
        if(!file) reject('Noai noai un pishi archivo');

        // se pone así por si se sube un archivo con el mismo nombre varias veces
        // es similar al timestamp
        const newFileName = `${file.originalname}_${Date.now()}`;

        // dice a firebase que se va a crear un nuevo archivo con ese nombre
        // el backend le pasa el archivo a firebase de forma seccionada (por cachitos, chunks)
        const fileUpload = bucket.file(newFileName);

        const valid_mimetypes = ['image/jpeg', 'image/png'];

        if(valid_mimetypes.indexOf(file.mimetype) === -1) reject('Es necesario enviar un tipo válido');

        // voy a crea un stream de datos
        // le voy a pasar los chunks de mi archivo
        const blobStream = fileUpload.createWriteStream({
            // aquí digo qué tipo de archivo es el que mandaré
            // un buffer de datos
            metadata: {
                contentType: file.mimetype
            }
        });


        // .on() es como un eventListener en JS
        // como se envían muchos pedazos de bytes, esto me ayuda a saber en qué parte del archivo que
        // se mandó, se vaya generando un log y puedo saber si hubo un error y en qué parte
        // si algo sale mal haz esto
        blobStream.on('error', (error) => {
            reject(error)
        }) // si pasa un error, la promesa debe regresar un error

        // cuando termines de guardar el archivo, se regresa la url que se genera a partir del archivo guardado
        // es la última parte que se ejecuta
        // si algo sale bien, haz esto
        blobStream.on('finish', () => {
            //firebasestorage es la dirección que usa firebase para mostrar archivos
            // alt=media es porque le estoy diciendo que va a mostrar (el archivo)
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`;
            resolve(url);
        })

        // empieza transmitiendo datos
        blobStream.end(file.buffer); // aquí empiezo la transmisión de datos del backend al bucket
        // file.buffer viene de multer
        // buffer es el arreglo de bytes del archivo
    })
}