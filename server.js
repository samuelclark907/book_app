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

// app.get('/', (request, response) => {
//   response.send('Hello Sams World');
// });




// Start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
