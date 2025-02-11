const multer = require('multer')

//upload dell'immagine
//metodo di multer per salvare nell'hardisk fisico il file
const storage = multer.diskStorage({
  //stabilisco destinazione
  destination: './public/movies_cover',
  filename: (req, file, cb) => {
    console.log(file); //tutte le info che mi scendono posso gestirle qua dentro al multer
    //creo un nome univoco per il file
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
})


//oggetto che salva i dati che vengono caricati
const upload = multer({ storage });

module.exports = upload;


// const multer = require('multer');

// // upload dellimmagine
// const storage = multer.diskStorage({
//   destination: "./public/img/books",
//   filename: (req, file, cb) => {
//     // creo un nome univoco per il file
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   }
// })

// const upload = multer({ storage });

// module.exports = upload;