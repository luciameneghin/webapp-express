const connection = require('../data/db')


const index = (req, res) => {
  const sql = 'SELECT * FROM movies';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nella query del database', err });
    }
    console.log(req.body);
    res.json(results);
  });
};

const show = (req, res) => {
  const id = req.params.id;
  res.send(`film trovato`)
}

module.exports = {
  index, show
}