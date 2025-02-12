const connection = require('../data/db')
const path = require('path')
const fs = require('fs')

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
  const { title, director, abstract, genre, release_year } = req.body; //l'imm non serve perchè gestitata a parte
  //nome del file che è stato uploadato
  const imageName = req.file.filename;

  //gestisco insert, imposto query
  const sql = "INSERT INTO movies(title, director, abstract, genre, release_year, image) VALUES(?,?,?,?,?,?)"
  //uso query
  connection.query(sql, [title, director, abstract, genre, release_year, imageName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nella query del database', err });
    }
    res.status(201).json({ status: 'success', message: 'film aggiunto' })
  })
}


const destroy = (req, res) => {
  const id = req.params.id;

  const sqlSelect = "SELECT image FROM movies WHERE id =?"
  const sqlDelete = 'DELETE FROM movies WHERE id = ?'
  connection.query(sqlSelect, [id], (err, results) => {

    const imageName = results[0].image
    //costruisco il path assoluto dell'immagine
    const imagePath = path.join(__dirname, '../public/movies_cover/', imageName)
    console.log('Path immagine', imagePath);
    //elimino fisicamente immagine dall'hd
    //fs libreria note
    fs.unlink(imagePath, (err) => {
      console.log(err);
      return res.status(500).json({ error: 'Errore nell\'eliminazione del file immagine', err });
    })
    // res.json({ message: imagePath })


    //una volta eliminata l'immagine elimino il record dal db
    connection.query(sqlDelete, [id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Errore nella query del database', err });
      res.json({ message: 'Libro eliminato con successo' })
    })
  })
}


module.exports = {
  index, show, storeReviews, store, destroy
}