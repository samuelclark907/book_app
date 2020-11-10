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

const { json, response, request } = require('express');


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

app.put('edit/:id', editHandler);


app.get((error, request, response) => {
  return errorHandler(error, response);
});

app.get('/books/:id', detailBook);

app.get('*', (request, response) => response.status(404).send('This route not here'));

// functions

function bookHandler(request, response) {
  // console.log('hello world');
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
        // console.log(book.volumeInfo.description);
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
  const SQL = 'INSERT INTO books (title, description, author, image, isbn) VALUES ($1, $2, $3, $4, $5);';
  const params = [request.body.title, request.body.description, request.body.author, request.body.image, request.body.isbn];
  // console.log('params', params);
  client.query(SQL, params)
    .then(results => {
      // console.log(results.rows);
      response.status(200).redirect('/');
    });
}

function detailBook(request, response) {
  // console.log('I');
  const SQL = 'SELECT * FROM books WHERE id=$1;';
  const params = [request.params.id];
  // console.log(params);

  client.query(SQL, params)
    .then(results => {
      // console.log(results.rows);
      response.status(200).render('pages/books/details', { bikes: results.rows });
    });
}

function editHandler(request, response) {
  const SQL = 'UPDATE books SET author = $1, title =$2, isbn =$3, img=$4, description=$5 WHERE id = $6';
  const params = [request.body.author, request.body.title, request.body.isbn, request.body.image, request.body.description, request.params.id];

  client.query(SQL, params)
    .then(response.status(200).redirect(`/books/${request.params.id}`))
    .catch(error => errorHandler(request, response, error));
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
  this.isbn = obj.volumeInfo.industryIdentifiers[0].identifier;
}


// app.get('/', (request, response) => {
//   response.send('Hello Sams World');
// });




// Start our server///////////////////
// app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));


