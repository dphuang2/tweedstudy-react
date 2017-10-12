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
