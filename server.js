'use strict';

// app.get('/', (request, response) => {
//   response.send('Hello Sams World');
// });
// Environment


// Application dependencies///////////////////
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


require('dotenv').config();

const { json } = require('express');


const pg = require('pg');

// create pg client

const client = new pg.Client(process.env.DATABASE_URL);

// .catch( err => console.error(err));

// client.on('error', err => console.error(err));


// Express application///////////////////
const app = express();

//Application listen///////////////////
const PORT = process.env.PORT || 3000;

// CORS///////////////////
app.use(cors());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.status(200).render('pages/searches/new');
});

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Now listening on port ${PORT}`);
    });
  });

app.get('/error', errorHandler);

app.get('/searches/new', (request, response) => {
  response.status(200).render('pages/searches/new');
});

app.post('/searches', bookHandler);

// functions

function bookHandler(request,response) {
  const search = request.body.search;
  const searchField = request.body.searchField;
  let useField = '';
  if (searchField === 'title') {
    useField = `intitle:${search}`;
  } else (useField = `inauthor:${search}`);
  // console.log(search);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${useField}`;


  superagent.get(url)
    .then(data => {
      // console.log(data.body.items.volumeInfo.imageLinks);
      let bikes = data.body.items.map(book => {
        let image = '';
        // console.log(book.volumInfo.imagelinks);
        // console.log()
        if (book.volumeInfo.imageLinks) {
          image = book.volumeInfo.imageLinks.thumbnail;
        } else { image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQjim8QJc5Eup07gmPSuP2gStB8jZauU8kK0A&usqp=CAU'; }
        return new Book(book, image);
      });
      response.status(200).render('pages/searches/show', { bikes });
    });
}



// Error Handler///////////////////
function errorHandler(request, response) {
  response.status(500).render('pages/error');
}

// Constructors///////////////////

function Book(obj, image) {
  this.description = obj.volumeInfo.description;
  this.title = obj.volumeInfo.title;
  this.author = obj.volumeInfo.authors;
  this.image = image;
}


// app.get('/', (request, response) => {
//   response.send('Hello Sams World');
// });




// Start our server///////////////////
// app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));


