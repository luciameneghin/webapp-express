const connection = require('../data/db')

const index = (req, res) => {
  res.send('index funzionante')
}

const show = (req, res) => {
  const id = req.params.id;
  res.send(`film trovato`)
}

module.exports = {
  index, show
}