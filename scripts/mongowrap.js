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
  mongoConnection.collection('bookusers').findOne(filterclause, function (err, bookuserresult) {
    if (err) {
      callback(err, null);
    } else {
      if (bookuserresult.userrequested.includes(bookid)) {
        callback("You have already requested this bookid", null);
      } else {
        var userreq = bookuserresult.userrequested? bookuserresult.userrequested.slice() : [bookid];
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
                        var returnprofile = bookuserresult;
                        returnprofile.userrequested = setclause.userrequested;
                        result.profile = returnprofile;
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

module.exports.gettradeslist = function(mongoConnection, callback) {
  mongoConnection.collection('booktrades').find().toArray(function (err, result) {
    if (err) {
      console.log("errored retrieving booktrades");
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}

module.exports.accepttrade = function(mongoConnection, tradeid, callback) {
  // To complete a trade:
  // Update the trade status.
  // Update the book locations and remove the userid's of either user from each book's requestedby
  // Find any open trades involving either book, set them to "nolongerheld"
  console.log("TRADEID: "+tradeid);
  var filterclause = {_id: mongodb.ObjectId(tradeid)};
  var setclause = {status: 'completed'};
  mongoConnection.collection('booktrades').findOne(filterclause, function(err, firstresult) {
    if (err) {
      console.log("error looking up trade");
      callback(err, null);
    } else {
      console.log("FIRSTRESULT: "+firstresult);
      // Update book data.
      var offerfilter = {_id: mongodb.ObjectId(firstresult.offerbook._id)};
      var targetfilter = {_id: mongodb.ObjectId(firstresult.targetbook._id)};
      // Remove the targetbook's owner from the offerbook's requested by, if it exists.
      var offerreqby = findandremove(firstresult.targetbook.owner, firstresult.offerbook.requestedby);
      // Remove the offerbook's owner from the targetbook's requested by array, if it exists.
      var targetreqby = findandremove(firstresult.offerbook.owner, firstresult.targetbook.requestedby);
      // Set the offer book's location and owner to the target book's location and owner.
      var offerset = {location: firstresult.targetbook.location, owner: firstresult.targetbook.owner, requestedby: targetreqby};
      var targetset = {location: firstresult.offerbook.location, owner: firstresult.offerbook.owner, requestedby: offerreqby};
      console.log("OFFERSET: "+JSON.stringify(offerset));
      mongoConnection.collection('books').update(offerfilter, {$set: offerset}, function(err, result) {
        if (err) {
          callback(err, null);
        } else {
          mongoConnection.collection('books').update(targetfilter, {$set: targetset}, function(err, result) {
            if (err) {
              callback(err, null);
            } else {
              var multiupdate = {multi: true};
              var multifilterclause =
                {$or:[
                    {'targetbook._id':mongodb.ObjectId(firstresult.offerbook._id), 'status':'open'},
                    {'offerbook._id':mongodb.ObjectId(firstresult.offerbook._id), 'status':'open'},
                    {'targetbook._id':mongodb.ObjectId(firstresult.targetbook._id), 'status':'open'},
                    {'offerbook._id':mongodb.ObjectId(firstresult.targetbook._id), 'status':'open'}
                  ]};
              var multisetclause = {$set:{status: 'nolongerheld'}};
              // Find any open trades involving either book, set them to "nolongerheld"
              mongoConnection.collection('booktrades').update(multifilterclause, multisetclause, multiupdate, function(err, result) {
                console.log("completed multi update");
                if (err) {
                  callback(err, null);
                } else {
                  // callback(null, result);
                  // update tradeid to complete! success!
                  mongoConnection.collection('booktrades').update(filterclause, {$set: setclause}, function(err, result) {
                    if (err) {
                      callback(err, null);
                    } else {
                      // callback(null, result);
                      // Update each user's userbooks.
                      mongoConnection.collection('bookusers').findOne({username: firstresult.targetbook.owner}, function(err, result) {
                        if (err) {
                          callback(err, null);
                        } else {
                          // USERBOOKS STORES OID'S. USERREQUESTED STORES SIMPLE STRINGS.
                          var targetownerbooks = result.userbooks.slice();
                          // Push the offerbook's id into userbooks.
                          targetownerbooks.push(mongodb.ObjectId(firstresult.offerbook._id));
                          var targetownerrequested = result.userrequested.slice();
                          // EXPECT TO SEE > -1 ON THIS LOG.
                          // targetownerbooks.splice(targetownerbooks.indexOf(mongodb.ObjectId(firstresult.targetbook._id)));
                          targetownerbooks = findandremovebook(firstresult.targetbook._id, targetownerbooks);
                          // If target owner happens to have requested the book he is being offered, remove it from his requested.
                          if (targetownerrequested.includes(firstresult.offerbook._id)) {targetownerrequested.splice(targetownerrequested.indexOf(firstresult.offerbook._id))}
                          mongoConnection.collection('bookusers').update({username: firstresult.targetbook.owner}, {$set: {userbooks:targetownerbooks, userrequested:targetownerrequested}}, function(err, result) {
                            if (err) {
                              callback(err, null);
                            } else {
                              mongoConnection.collection('bookusers').findOne({username:firstresult.offerbook.owner}, function(err, result) {
                                if (err) {
                                  callback(err, null);
                                } else {
                                  var offerownerbooks = result.userbooks.slice();
                                  var offerownerrequested = result.userrequested.slice();
                                  // Remove the targetbook from the offerer's list of requested books.
                                  // (Expect the issue to be here -> does userbooks store objectid's or string id's?)
                                  offerownerrequested.splice(offerownerrequested.indexOf(firstresult.targetbook._id));
                                  offerownerbooks.push(mongodb.ObjectId(firstresult.targetbook._id));
                                  // offerownerbooks.splice(offerownerbooks.indexOf(mongodb.ObjectId(firstresult.offerbook._id)));
                                  console.log(JSON.stringify(offerownerbooks));
                                  offerownerbooks = findandremovebook(firstresult.offerbook._id, offerownerbooks);
                                  console.log(JSON.stringify(offerownerbooks));
                                  mongoConnection.collection('bookusers').update({username:firstresult.offerbook.owner},{$set: {userbooks:offerownerbooks, userrequested:offerownerrequested}}, function(err, result) {
                                    if (err) {
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
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

function findandremovebook(oid, anarray) {
  var index = null;
  console.log(typeof oid);
  anarray = anarray.slice();
  for (var i = 0; i < anarray.length; i++) {
    console.log(typeof anarray[i]);
    if (anarray[i].toString() === oid) {
      console.log("found match, removing...");
      index = i;
    }
  }
  if (index !== null) {
    console.log("splicing");
    anarray.splice(index, 1);
    return anarray;
  } else {
    return anarray;
  }
}

function findandremove(username, requestedby) {
  var index = null;
  for (var i = 0; i < requestedby.length; i++) {
    if (requestedby[i].username === username) {
        index = i;
    }
  }
  if (index !== null) {
    requestedby.splice(index, 1);
    return requestedby;
  } else {
    return requestedby;
  }
}

module.exports.rejecttrade = function(mongoConnection, tradeid, callback) {
  var filterclause = {_id: mongodb.ObjectId(tradeid)}
  mongoConnection.collection('booktrades').findOne(filterclause, function (err, result) {
    if (err) {
      console.log("error looking up trade");
      callback(err, null);
    } else {
      var setclause = {status: 'rejected'};
      mongoConnection.collection('booktrades').update(filterclause, {$set: setclause}, function(err, result) {
        if (err) {
          console.log("error updating trade status to rejected");
          callback(err, null);
        } else {
          callback(null, result);
        }
      })
    }
  })
}

module.exports.setuptrade = function(mongoConnection, targetbookdata, userbookdata, ownername, username, callback) {
  // Query ownername and username to get their email addresses.
  var owneremail;
  var ownerlocation;
  var useremail;
  var userlocation;
  mongoConnection.collection('bookusers').findOne({'username':ownername}, function (err, result) {
    if (err) {
      console.log("errored trying to find bookownername");
      callback(err, null);
    } else {
      owneremail = result.email;
      ownerlocation = result.location;
      mongoConnection.collection('bookusers').findOne({'username':username}, function(err, result) {
        if (err) {
          console.log("errored trying to find username in setuptrade");
          callback(err, null);
        } else {
          useremail = result.email;
          userlocation = result.location;
          // Set up trade object.
          var tradeobject =
            {
              proposer: {username:username, location:userlocation, email:useremail},
              recipient: {username:ownername, location:ownerlocation, email:owneremail},
              offerbook: userbookdata,
              targetbook: targetbookdata,
              status: "open"
            };
          // Store object.
          mongoConnection.collection('booktrades').insertOne(tradeobject, function(err, result) {
            if (err) {
              console.log("errored trying to insert trade");
              callback(err, null);
            } else {
              // Retrieve updated trades list and return to user.
              mongoConnection.collection('booktrades').find().toArray(function(err, result) {
                if (err) {
                  console.log("errored trying to retrieve booktrades");
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

module.exports.updatetradestatus = function(mongoConnection, tradeid, status) {
  var filterclause = {_id:mongodb.ObjectId(tradeid)}
  mongoConnection.collection('booktrades').findOne(filterclause, function(err, result) {
    if (err) {
      console.log("errored trying to find trade for update status")
      callback(err, null);
    } else {
      var setclause = {status: status};
      mongoConnection.update(filterclause, {$set:setclause}, function(err, result) {
        if (err) {
          console.log("error updating trade status");
          callback(err, null);
        } else {
          // retrieve updated trades list and return to front.
          mongoConnection.collection('booktrades').find().toArray(function(err, result) {
            if (err) {
              console.log("error trying to retrieve booktrades");
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

module.exports.addbook = function(mongoConnection, bookobject, callback) {
  mongoConnection.collection('books').insertOne(bookobject, function (err, result) {
    // console.log(JSON.stringify(bookobject));
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
      // callback(null, result);
      var userfilterclause = {username: result.profile.username};
      mongoConnection.collection('bookusers').findOne(userfilterclause, function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
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
