var mongodb = require('mongodb');

// Collections: bookusers, books, accesstokens

module.exports.getbooklist = function(mongoConnection, callback) {
  mongoConnection.collection('books').find().toArray(function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log("retrieved books from database");
      callback(null, result);
    }
  })
}

// module.exports.findbooks = function(mongoConnection, bookidarray, callback) {
//   tracker = 0;
//   returnarr = [];
//   bookidarray.forEach(function(bookid) {
//     var filterclause = {_id:mongodb.ObjectId(bookid)}
//     mongoConnection.collection('books').findOne(filterclause, function(err, result) {
//       tracker++;
//       if (err) {
//         console.log("error looking up book id+bookid");
//         callback(err, null);
//       } else {
//         returnarr.push(result);
//       }
//       if (tracker === bookidarray.length) {
//         callback(null, returnarr);
//       }
//     })
//   })
// }

module.exports.updateuser = function(mongoConnection, username, newfullname, newlocation, callback) {
  var filterclause = {username: username};
  var setclause = {fullname: newfullname, location: newlocation, fullname: newfullname};
  mongoConnection.collection('bookusers').update(filterclause, {$set:setclause}, function(err, result) {
    if (err) {
      console.log("error trying to update user");
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}


module.exports.updatebooklocations = function(mongoConnection, newlocation, bookidarray, callback) {
  console.log(JSON.stringify(bookidarray));
  tracker = 0;
  bookidarray.forEach(function(bookid) {
    var filterclause = {_id:mongodb.ObjectId(bookid)};
    var setclause = {location: newlocation}
    mongoConnection.collection('books').update(filterclause, {$set:setclause}, function(err, result) {
      tracker++;
      if (err) {
        console.log("error updating book location");
        callback(err, null);
      } else {
        if (tracker === bookidarray.length) {
          callback(null, result);
        }
      }
    })
  })
}

module.exports.wantrequest = function(mongoConnection, bookid, username, ownername, location, callback) {
  // Update user's books requested.
  console.log("WANTREQUEST FROM MONGOWRAP BOOKID: " + bookid);
  var filterclause = {username:username};
  mongoConnection.collection('bookusers').findOne(filterclause, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      if (result.userrequested.includes(bookid)) {
        callback("You have already requested this bookid", null);
      } else {
        var userreq = result.userrequested? result.userrequested.slice() : [bookid];
        userreq.push(bookid);
        console.log(JSON.stringify(userreq));
        var setclause = {userrequested: userreq};
        mongoConnection.collection('bookusers').update(filterclause, {$set: setclause}, function(err, result) {
          if (err) {
            callback(err, null);
          } else {
            // Update book's requested by.
            // An object in requested by should have the form {username: ANAME, location: ALOCATION}
            var bookfilterclause = {_id:mongodb.ObjectId(bookid)};
            mongoConnection.collection('books').findOne(bookfilterclause, function(err, result) {
              if (err) {
                callback(err, null);
              } else {
                var reqby;
                if (result.requestedby) {
                   reqby = result.requestedby.slice();
                   reqby.push({username: username, location: location})
                } else {
                   reqby = [{username:username,location:location}];
                }
                var booksetclause = {requestedby:reqby};
                mongoConnection.collection('books').update(bookfilterclause, {$set: booksetclause}, function(err, result) {
                  if (err) {
                    callback(err, null);
                  } else {
                    mongoConnection.collection('books').find().toArray(function (err, result) {
                      if(err) {
                        callback(err, null);
                      } else {
                        callback(null, result);
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  })
}


module.exports.addbook = function(mongoConnection, bookobject, callback) {
  mongoConnection.collection('books').insertOne(bookobject, function (err, result) {
    console.log(JSON.stringify(bookobject));
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports.addbooktouser = function(mongoConnection, username, bookid, callback) {
  var filterclause = {'username': username}
  console.log("add book to user username: " + username);
  console.log("add book to user bookid: " + bookid);
  mongoConnection.collection('bookusers').findOne(filterclause, function(err, result) {
    if (err) {
      console.log("errored trying to find user");
      callback(err, null);
    } else {
      if (result === null) {
        callback("User does not exist: "+username, null);
      } else {
        console.log(result);
        var updatedbooklist = result.userbooks.slice();
        // console.log(bookid);
        updatedbooklist.push(bookid);
        console.log(JSON.stringify(updatedbooklist));
        mongoConnection.collection('bookusers').update({_id:mongodb.ObjectId(result._id)}, {$set:{userbooks: updatedbooklist}}, function(err, result) {
          if (err) {
            console.log("errored trying to add book to user");
            callback(err, null);
          } else {
            console.log("successfully added book to user: "+JSON.stringify(result));
            callback(null, result);
          }
        })
      }
    }
  })
}

module.exports.finduser = function(mongoConnection, username, callback) {
  var filterclause = {'username': username};
  mongoConnection.collection('bookusers').findOne(filterclause, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      if (result === null) {
        callback("User does not exist: "+username, null);
      } else {
        callback(null, result);
      }
    }
  })
}

module.exports.validatelogin = function(mongoConnection, username, passwordhash, callback) {
  var filterclause = {'username': username};
  mongoConnection.collection('bookusers').findOne(filterclause, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      if (result === null) {
        callback("User does not exist: "+username, null);
      } else {
        // Check for matching passwordhash.
        if (passwordhash !== result.passwordhash) {
          callback("Password incorrect", null);
        } else {
          callback(null, result);
        }
      }
    }
  })
}

module.exports.adduser = function(mongoConnection, profile, passwordhash, callback) {
  var filterclause = {'username': profile.username};
  mongoConnection.collection('bookusers').findOne(filterclause, function(err, result) {
    // If username was found, callback with error.
    if (err) {
      callback(err, null);
    } else {
      if (result!==null) {
        callback("Username already exists: " + profile.username, null);
      } else {
        mongoConnection.collection('bookusers').insertOne(profile, function(err, result) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, result);
          }
        })
      }
    }
  })
}

module.exports.getTokenDetails = function(mongoConnection, token, callback) {
  var filterclause = {'accessToken': token};
  mongoConnection.collection('accessTokens').findOne(filterclause, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      // If no results found, redirect to a page notifying user
      console.log("MongoDB fetched details for token " + token);
      console.log("MONGODB RESULT:"+JSON.stringify(result)) ;
      callback(null, result);
    }
  });
}

module.exports.saveToken = function(mongoConnection, token, username, callback) {
  var newEntry = {"accessToken": token, "profile": username};
  mongoConnection.collection('accessTokens').insertOne(newEntry, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      // console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      callback(null, result);
    }
  });
}

module.exports.removeToken = function(mongoConnection, token, callback) {
  var filterclause = {'accessToken': token};
  mongoConnection.collection('accessTokens').remove(filterclause,function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log("mongodb removeQuery result: " + JSON.stringify(result));
      callback(null, result);
    }
  });
}
