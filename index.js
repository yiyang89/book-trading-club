var express = require('express');
var app = express();
var mongowrap = require('./scripts/mongowrap.js');
var path = require('path');
var http = require('http');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
// SET THIS TO A DB ON MLAB FOR DEPLOYMENT.
var url = process.env.MONGO_ADDRESS;
var mongo;

// Each type of passport plugin will require its specific oauth strategy.
// Need to create credentials on https://console.developers.google.com/
// MOVE THESE INTO ENV VARIABLES BEFORE DEPLOYING.
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.render('pages/index', {'user':null, 'token':null});
});

app.get('/tokendetails', function(request, response) {
  // Query mongodb for profile corresponding to access token.
  // Try bundling data into this to fix weird bug on front end.
  mongowrap.getTokenDetails(mongo, request.params.ACCESSTOKEN, function(err, result) {
    if (err) {
      console.log(err);
      console.log({"error":err});
    } else {
      console.log("sending result for tokendetails");
      // response.send(result);
      response.send(result);
    }
  })
})

app.get('/logout/', function(request, response) {
  // Delete profile with this access token from mongodb.
  mongowrap.removeToken(mongo, request.params.ACCESSTOKEN, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      response.send(result);
    }
  });
})

// auth code from https://c9.io/barberboy/passport-google-oauth2-example
// send auth request to google
app.get('/login/', function(request, response) {

})

// auth code from https://c9.io/barberboy/passport-google-oauth2-example
// send auth request to google
app.get('/signup/', function(request, response) {

})

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connected to mongodb');
    mongo = db;
    app.listen(app.get('port'), function() {
      console.log('Node app is running on port', app.get('port'));
    });
  }
});
