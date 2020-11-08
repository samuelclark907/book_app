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

const { json, response } = require('express');


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

// app.get('/', (request, response) => {
//   response.status(200).render('pages/searches/new');
// });

app.get('/', (request, response) => {
  const SQL = 'SELECT * FROM books';

  client.query(SQL)
    .then(results => {
      let bookInfo = results.rows;
      // let booksLength = results.rows.length;
      // console.log(bookInfo);
      response.status(200).render('pages/index', { bikes: bookInfo });
    });
});

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Now listening on port ${PORT}`);
    });
  });

app.get('/searches/new', (request, response) => {
  response.status(200).render('pages/searches/new');
});
app.post('/add', addBooks);

app.post('/searches', bookHandler);


app.get((error, request, response) => {
  return errorHandler(error, response);
});

app.get('/books/:id', detailBook);

app.get('*', (request, response) => response.status(404).send('This route not here'));

// functions

function bookHandler(request, response) {
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
      response.status(200).render('pages/searches/show', { bikes: bikes });
    });
}



function addBooks(request, response) {
  const SQL = 'INSERT INTO books (image, title, author, description) VALUES ($1, $2, $3, $4);';
  const params = [request.body.image, request.body.title, request.body.author, request.body.description];
  // console.log('req', request.body);
  client.query(SQL, params)
    .then(results => {
      // console.log(results.rows);
      response.status(200).redirect('/');
    });
}

function detailBook(request, response) {
  console.log('I');
  const SQL = 'SELECT * FROM books WHERE id=$1;';
  const params = [request.params.id];
  console.log(params);

  client.query(SQL, params)
    .then(results => {
      console.log(results.rows);
      response.status(200).render('pages/books/details', { bikes: results.rows }) ;
    });
}





// Error Handler///////////////////
function errorHandler(error, response) {
  response.status(500).render('pages/error', { error: error });
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


