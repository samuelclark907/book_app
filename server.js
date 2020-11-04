'use strict';

// Environment


// Application dependencies

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
// const { json } = require('express');
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));

const app = express();

//Application listen


app.use(cors());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// const pg = require('pg');

app.get('/', (request, response) => {
  response.status(200).render('pages/index');
});

app.get('/searches/new', (request, response) => {
  response.status(200).render('pages/searches/new');
});


app.post('/searches', (request, response) => {
  const search = request.body.search;
  console.log(search);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${search}`;


  superagent.get(url)
    .then(data => {
      let bikes = data.body.items.map(book => {
        let image = '';
        console.log(book);
        if (book.imageLinks.thumbnail) {
          image = book.imageLinks.thumbnail;
        } else { image = 'https://i.imgur.com/J5LVHEL.jpg';}
        return new Book(book, image);
      });
      response.status(200).render('pages/searches/show', bikes);
    });
});


// app.get('/', (request, response) => {
//   response.send('Hello Sams World');
// });

// Constructors

function Book(obj, image) {
  this.description = obj.volumeInfo.description;
  this.title = obj.volumeInfo.title;
  this.author = obj.volumeInfo.authors;
  this.image = image;
}




// Start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
