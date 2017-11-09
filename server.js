//URI used to connect with mongo db
var mongo_connection_uri = 'mongodb://tweed-study:uiuc2017@ds251245.mlab.com:51245/tweed-study'
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/model'), //created model loading here
  bodyParser = require('body-parser');
  
//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/Tododb'); 

// Middleware for parsing incoming HTTP requests and then passing it onto the server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/route'); //importing route
routes(app); //register the route

app.listen(port);

/*
 *TODO: Team #3 
 *Task: Pull data from someone's feed and save it into an object and print out the complete response
 */
console.log('P.U.R.E express server started on port ' + port);

/**
 The following code snippet establishes a connection with mongodb
 */
mongodb.MongoClient.connect(mongo_connection_uri, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    // Save database object from the callback for reuse.
    var db = database;
    console.log("Database connection ready");
});

/**
 The following code snippets establish the routes for MongoDB interaction
 */
var friends_db = require('./db_routs/friends_db');
var messages_db = require('./db_routes/messages_db');
var tweets_db = require('./db_routes/tweets_db');
var user_db = require('./db_routes/users_db');

app.use('/db/users', user_db);
app.use('/db/friends', friends_db);
app.use('db/tweets', tweets_db);
app.use('db/messages', messages_db);