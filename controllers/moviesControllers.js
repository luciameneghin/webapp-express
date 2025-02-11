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
        image: req.imagePath + movie.image,
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

  connection.query(sqlMovies, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nella query del database', error });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'post non trovato' })
    }

    const movie = results[0]
    //console.log(movie);

    connection.query(sqlReviews, [id], (err, reviewsResaults) => {
      if (err) return res.status(500).json({ error: 'Errore nella query del database', error });
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


const store = (req, res) => {
  console.log(req.file); // mi mostra tutte le info dell'immagine che upload dal sito
  const { title, director, abstract } = req.body; //l'imm non serve perchè gestitata a parte
  //nome del file che è stato uploadato
  const imageName = req.file.filename;

  //gestisco insert, imposto query
  const sql = "INSERT INTO movies(title, director, abstract, image) VALUES(?,?,?,?)"
  //uso query
  connection.query(sql, [title, director, abstract, imageName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nella query del database', err });
    }
    res.status(201).json({ status: 'success', message: 'film aggiunto' })
  })
}


module.exports = {
  index, show, storeReviews, store
}