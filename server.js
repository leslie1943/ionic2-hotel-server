//Set up
var express = require('express');
var app = express();

// var room = require('./models/rooms');
var user = require('./models/users');

//Leave request modules
var leave = require('./models/leaves');


var ip = require('ip');
var mongoose = require('mongoose');
var db_options = require('./database/connectionOptions');
var logger = require('morgan');
var bodyParser = require('body-parser');
//Cross-origin resource sharing
var cors = require('cors');

/**
 * Configuration
 * http://mongoosejs.com/docs/connections.html#use-mongo-client
 */

//Connect database
mongoose.connect('mongodb://localhost/hotels',db_options);

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

/**** **** **** **** **** **** **** **** ****
 *          Leave module.*
**** **** **** **** **** **** **** **** ****/
app.post('/api/leave/create',leave);


//set port
app.listen(8080);
console.log("---------------------------------");
console.log("---------------------------------");
console.log("---------------------------------");
console.log("---------------------------------");
console.log("External ip:" + ip.address());
console.log('App listening on port 8080.');
console.log('Started at: http://localhost:8080');
console.log("---------------------------------");
console.log("---------------------------------");
console.log("---------------------------------");
console.log("---------------------------------");