var mongodb = require('mongodb');

// Collection: pinterestclone

// module.exports.getimages = function(mongoConnection, callback) {
//   mongoConnection.collection('pinterestclone').find().toArray(function(err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       console.log("retrieved images from database");
//       callback(null, result);
//     }
//   })
// }
//
// module.exports.uploadimage = function(mongoConnection, imageStorageObject, callback) {
//   mongoConnection.collection('pinterestclone').insertOne(imageStorageObject, function (err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       console.log("stored imageobject: " + JSON.stringify(imageStorageObject));
//       callback(null, result);
//     }
//   })
// }
//
// module.exports.likeimage = function(mongoConnection, imageid, username, callback) {
//   var filterclause = {'_id': mongodb.ObjectId(imageid)};
//   mongoConnection.collection('pinterestclone').findOne(filterclause, function (err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       // Update the liked array and liked value, then return.
//       var updatedlikes = result.likes + 1;
//       var updatedlikedata = result.likeData;
//       if (updatedlikedata.includes(username)) {
//         callback('Unable to process, user already liked this post', null);
//       } else {
//         updatedlikedata.push(username);
//         mongoConnection.collection('pinterestclone').update(filterclause, {$set: {'likes':updatedlikes, 'likeData':updatedlikedata}}, function (err, result) {
//           if (err) {
//             callback(err, null);
//           } else {
//             console.log("MongoDB added like for objectid" + imageid);
//             callback(null, result);
//           }
//         })
//       }
//     }
//   })
// }
//
// module.exports.unlikeimage = function(mongoConnection, imageid, username, callback) {
//   var filterclause = {'_id': mongodb.ObjectId(imageid)};
//   mongoConnection.collection('pinterestclone').findOne(filterclause, function (err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       // Update the liked array and liked value, then return.
//       var updatedlikes = result.likes - 1;
//       // Get index for this username and remove it from the array.
//       var updatedlikedata = result.likeData;
//       var userindex = updatedlikedata.indexOf(username);
//       if (userindex === -1) {
//         callback('Unable to process, user has not liked this post', null);
//       } else {
//         updatedlikedata.splice(userindex, 1);
//         mongoConnection.collection('pinterestclone').update(filterclause, {$set: {'likes':updatedlikes, 'likeData':updatedlikedata}}, function (err, result) {
//           if (err) {
//             callback(err, null);
//           } else {
//             console.log("MongoDB added like for objectid" + imageid);
//             callback(null, result);
//           }
//         })
//       }
//     }
//   })
// }
//
// module.exports.deleteimage = function(mongoConnection, imageid, callback) {
//   var filterclause = {'_id': mongodb.ObjectId(imageid)};
//   mongoConnection.collection('pinterestclone').remove(filterclause, function (err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       console.log("mongodb removeQuery result: " + JSON.stringify(result));
//       callback(null, result);
//     }
//   });
// }
//

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

module.exports.addbook = function(mongoConnection, bookobject, callback) {
  mongoConnection.collection('books').insertOne(bookobject, function (err, result) {
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
