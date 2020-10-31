'use strict';

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(express.static('./public'));

app.set('view engine', 'ejs');

// const pg = require('pg');

// const client = new pg.Client(process.env.DATABASE_URL);

const superagent = require('superagent');
const { json } = require('express');

app.get('/', (request, response) => {
  response.send('Hello Sams World');
});


app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
