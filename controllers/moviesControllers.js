const connection = require('../data/db')


const index = (req, res) => {
  const sql = 'SELECT * FROM movies';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nella query del database', err });
    }
    const imagePath = require('../middlewares/imagePath')
    const movies = results.map(movie => {
      return {
        ...movie,
        image: req.imagePath + movie.image
      }
    })

    res.json(movies);
  });
};

const show = (req, res) => {
  const id = req.params.id;
  const sqlMovies = 'SELECT * FROM movies WHERE id = ?'
  const sqlReviews = `SELECT * 
  FROM reviews R
  WHERE R.movie_id = ?`

  connection.query(sqlMovies, [id], (e, results) => {
    if (e) {
      return res.status(500).json({ error: 'Errore nella query del database', err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'post non trovato' })
    }

    let movie = results[0]

    connection.query(sqlReviews, [id], (e, reviewsResaults) => {
      if (e) return res.status(500).json({ error: 'Errore nella query del database', err });
      movie.reviews = reviewsResaults;
      res.json(movie);
    })
  })
}

module.exports = {
  index, show
}