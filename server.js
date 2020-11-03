'use strict';

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.set('view engine', 'ejs');

// const pg = require('pg');

// const client = new pg.Client(process.env.DATABASE_URL);

const superagent = require('superagent');

const { json } = require('express');

// app.get('/', (request, response) => {
//   response.send('Hello Sams World');
// });




// app.listen(PORT, () => {
//   console.log(`Now listening on port ${PORT}`);
// });

// function bookAuthor(req,res) {
//   let title = 
//   let author =
// }

// function bookTitle(req,res) {

// }


app.get('/', (request, response) => {
  const first = 'millie';
  const petNames = [
    'scooby',
    'stormageddon',
    'elliot',
    'maisie',
    'oz',
    'lemon',
    'jalapeno',
    'ollie',
    'obi juan',
    'randal',
    'lady',
    'kora',
    'maybell',
    'dobbie',
    'lucipurr',
    'marvel',
    'jupitaurious'
  ];

  const data = {
    pets: petNames,
    name: 'michael'
  };

  response.status(200).render('index', data);
});

app.post('/contact', (request, response) => {
  // const firstName = request.query.first; //app.get
  // const lastName = request.query.last;  //app.get

  const firstName = request.body.first; //app.post
  const lastName = request.body.last; //app.post

  console.log(firstName, lastName);
  response.status(200).send(firstName + ' ' + lastName);

});


// Start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
