const express = require('express')
const router = express.Router();
const moviesController = require('../controllers/moviesControllers')
const upload = require('../middlewares/multer')

//index
router.get('/', moviesController.index);

//show
router.get('/:id', moviesController.show);

//inserire nuova recensione
router.post('/:id/reviews', moviesController.storeReviews);
//nuova rotta per aggiungere film
// aggiungo solo /, perchè è il percorso in cui devo mettere il nuovo film 
//gestione e salvataggio immagine con un middleware
router.post('/', upload.single('image'), moviesController.store)

module.exports = router;