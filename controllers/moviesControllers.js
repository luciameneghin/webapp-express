const connection = require('../data/db')


const index = (req, res) => {
  const sql = 'SELECT * FROM movies';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nella query del database', err });
    }

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

    const movie = results[0]
    //console.log(movie);

    connection.query(sqlReviews, [id], (e, reviewsResaults) => {
      if (e) return res.status(500).json({ error: 'Errore nella query del database', err });
      movie.reviews = reviewsResaults;
      // console.log(reviewsResaults);
      const movies = results.map(movie => {
        return {
          ...movie,
          image: req.imagePath + movie.image
        }
      })
      res.json(movies[0]);

    })
  })
}



const storeReviews = (req, res) => {
  console.log('qualcosa');
  const id = req.params.id;
  const sql = 'INSERT INTO reviews (text, name, vote, movie_id) VALUES(?,?,?,?)'
  const { text, name, vote } = req.body;

  connection.query(sql, [text, name, vote, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nella query del database', err });
    }
    res.status(201);
    console.log(results);
    res.json({ message: 'Review added', id: results.insertId })
  })
}
module.exports = {
  index, show, storeReviews
}