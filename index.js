var express = require('express');
var app = express();
var mongowrap = require('./scripts/mongowrap.js');
var path = require('path');
var http = require('http');
var mongodb = require('mongodb');
// For generating access tokens.
var uuidV4 = require('uuid/v4');
var sha1 = require('sha1');
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

app.get('/addbook/', function(request, response) {
  // bookdata, userdata.
  console.log("BOOKDATA:"+decodeURIComponent(request.query.bookdata));
  console.log(request.query.username);
  // Query users for user profile
  // Form book object for storage with user location
  // Add book (identified with mongo generated id) to user's booklist
  mongowrap.finduser(mongo, request.query.username, function(err, result) {
    if (err) {
      response.send({error: "error finding your username for adding book"});
    } else {
      var book = {
        owner: request.query.username,
        location: result.location,
        bookdata: JSON.parse(decodeURIComponent(request.query.bookdata))
      };
    }
    mongowrap.addbook(mongo, book, function(err, result) {
      if (err) {
        response.send({error: "error adding book"});
      } else {
        mongowrap.addbooktouser(mongo, request.query.username, result.insertedId, function(err, addtouserresult) {
          if (err) {
            response.send({error: err});
          } else {
            mongowrap.getbooklist(mongo, function(err, booklistresult) {
              if (err) {
                response.send({error: err});
              } else {
                response.send(booklistresult);
              }
            })
          }
        })
      }
    })
  })
});

app.get('/getuserprofile/', function(request, response) {
  // Receives a username.
  mongowrap.finduser(mongo, request.query.username, function(err, result) {
    if (err) {
      response.send({error: "error retrieving your profile"});
    } else {
      response.send(result);
    }
  })
});

app.get('/getuserbooks/', function(request, response) {
  // Receives an array of userbook id's
  mongowrap.findbooks(mongo, request.query.booklist, function(err, result) {
    if (err) {
      response.send({error: "error retrieving your books"});
    } else {
      response.send(result);
    }
  })
})

app.get('/tokendetails/', function(request, response) {
  // Query mongodb for profile corresponding to access token.
  // Try bundling data into this to fix weird bug on front end.
  mongowrap.getTokenDetails(mongo, request.query.accesstoken, function(err, result) {
    if (err) {
      console.log(err);
      console.log({"error":err});
    } else {
      console.log("Got token details, making call for booklist");
      mongowrap.getbooklist(mongo, function(err, listresult) {
        if (err) {
          console.log(err);
          response.send({error: "error retrieving booklist after getting token details"+err});
        } else {
          result.booklist = listresult;
          response.send(result);
        }
      }.bind(result))
    }
  })
})

app.get('/login/', function(request, response) {
  mongowrap.validatelogin(mongo, request.query.username, request.query.passwordhash, function(err, result) {
    console.log("validatelogin result: " + result);
    if (err) {
      console.log(err);
      response.send({error: err});
    } else {
      // Save user token.
      var accesstoken = sha1(uuidV4());
      mongowrap.saveToken(mongo, accesstoken, result.username, function(err, tokensaveresult) {
        if (err) {
          console.log(err);
          response.send({error: err});
        } else {
          console.log("savetoken result: " + result);
          mongowrap.getbooklist(mongo, function(err, booklistresult) {
            if (err) {
              response.send({error: err});
            } else {
              response.send({profile: result, accessToken: accesstoken, booklist: booklistresult});
            }
          })
        }
      }.bind(result))
    }
  })
})

app.get('/logout/', function(request, response) {
  // Delete profile with this access token from mongodb.
  mongowrap.removeToken(mongo, request.query.accesstoken, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      response.send(result);
    }
  });
})

app.get('/updateuser/', function(request, response) {
  // Update user's real name and location.
  mongowrap.updateuser(mongo, request.query.username, request.query.newname, request.query.newlocation, function(err, result) {
    if (err) {
      console.log(err);
      response.send({error: err});
    } else {
      // Update books.
      mongowrap.updatebooklocations(mongo, request.query.newlocation, JSON.parse(decodeURIComponent(request.query.booklist)), function(err, result) {
        if (err) {
          console.log(err);
          response.send({error: err});
        } else {
          // Fetch new total booklist with updated data.
          mongowrap.getbooklist(mongo, function(err, result) {
            if (err) {
              console.log(err);
              response.send({error: err});
            } else {
              response.send(result);
            }
          })
        }
      })
    }
  })
})

// send auth request to google
app.get('/signup/', function(request, response) {
  // Attempt to add to bookusers
  // If successful, mongo savetoken
  var profile = {
    username: request.query.username,
    passwordhash: request.query.passwordhash,
    location: request.query.location,
    email: decodeURIComponent(request.query.email),
    fullname: request.query.fullname,
    userbooks: [],
    userrequested: [],
    trades: []
  }
  mongowrap.adduser(mongo, profile, request.query.passwordhash, function(err, result) {
    if (err) {
      console.log(err);
      response.send({error:err});
    } else {
      // Generate a random uuid and hash it to use as access token.
      var accesstoken = sha1(uuidV4());
      mongowrap.saveToken(mongo, accesstoken, request.query.username, function(err, result) {
        if (err) {
          console.log(err);
          response.send({error:err});
        } else {
          // Send profile and accesstoken to user
          console.log("Registered new user: "+result);
          mongowrap.getbooklist(mongo, function(err, booklistresult) {
            if (err) {
              response.send({error:"Sign up completed, but failed to retrieve book list"});
            } else {
              response.send({profile: profile, accessToken: accesstoken, booklist: booklistresult});
            }
          })
        }
      })
    }
  }.bind(request))
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
