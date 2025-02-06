const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

const moviesRouter = require('./routes/moviesRouters')

//middleware import
const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')
const imagePath = require('./middlewares/imagePath')

app.use(imagePath)
app.use(express.static('public'))
app.use(express.json())

app.use('/api/movies/', moviesRouter)

//rotta server
app.use('/', (req, res) => {
  res.send('server film')
})


//middlewares
app.use(errorsHandler)
app.use(notFound)

//porta in ascolto
app.listen(port, () => {
  console.log(`porta in ascolto: ${port}`);
})