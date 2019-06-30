'use strict';

const express = require('express'); 
var bodyParser  = require('body-parser');
var routes = require ('./routes/index.js');
var cors = require('cors');
const fs = require('fs')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  
fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(html);  
    res.end();  

});
});

// *** main routes *** //
app.use('/', routes);

module.exports = app
