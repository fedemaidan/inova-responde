'use strict';

const express = require('express'); 
var bodyParser  = require('body-parser');
var routes = require ('./routes/index.js');
var cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world\n');
});

// *** main routes *** //
app.use('/', routes);

module.exports = app
