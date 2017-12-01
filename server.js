//Set up
var express = require('express');
var app = express();

// var room = require('./models/rooms');
var user = require('./models/users');

var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
//Cross-origin resource sharing
var cors = require('cors');

/**
 * Configuration
 * http://mongoosejs.com/docs/connections.html#use-mongo-client
 */
mongoose.connect('mongodb://localhost/hotels');

app.use(bodyParser.urlencoded({ extended: false })); //parses urlencoded bodies.
app.use(bodyParser.json()); //Send JSON response.
app.use(logger('dev')); // Log requests to API using morgan.
app.use(cors());

/**** **** **** **** **** **** **** **** ****
 *          Room module.*
**** **** **** **** **** **** **** **** ****/
// app.post('/api/rooms', room);
// app.post('/api/rooms/reserve', room);
// app.post('/api/room', room);

/**** **** **** **** **** **** **** **** ****
 *          User module.*
**** **** **** **** **** **** **** **** ****/
app.post('/api/user/register', user);
app.post('/api/user/login', user);
app.post('/api/user/query', user);
app.post('/api/user/delete', user);
app.post('/api/user/update', user);

//set port
app.listen(8080);
console.log('App listening on port 8080.');