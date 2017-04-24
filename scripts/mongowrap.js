var mongodb = require('mongodb');

// Collection: pinterestclone

module.exports.getimages = function(mongoConnection, callback) {
  mongoConnection.collection('pinterestclone').find().toArray(function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log("retrieved images from database");
      callback(null, result);
    }
  })
}

module.exports.uploadimage = function(mongoConnection, imageStorageObject, callback) {
  mongoConnection.collection('pinterestclone').insertOne(imageStorageObject, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log("stored imageobject: " + JSON.stringify(imageStorageObject));
      callback(null, result);
    }
  })
}

module.exports.likeimage = function(mongoConnection, imageid, username, callback) {
  var filterclause = {'_id': mongodb.ObjectId(imageid)};
  mongoConnection.collection('pinterestclone').findOne(filterclause, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      // Update the liked array and liked value, then return.
      var updatedlikes = result.likes + 1;
      var updatedlikedata = result.likeData;
      if (updatedlikedata.includes(username)) {
        callback('Unable to process, user already liked this post', null);
      } else {
        updatedlikedata.push(username);
        mongoConnection.collection('pinterestclone').update(filterclause, {$set: {'likes':updatedlikes, 'likeData':updatedlikedata}}, function (err, result) {
          if (err) {
            callback(err, null);
          } else {
            console.log("MongoDB added like for objectid" + imageid);
            callback(null, result);
          }
        })
      }
    }
  })
}

module.exports.unlikeimage = function(mongoConnection, imageid, username, callback) {
  var filterclause = {'_id': mongodb.ObjectId(imageid)};
  mongoConnection.collection('pinterestclone').findOne(filterclause, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      // Update the liked array and liked value, then return.
      var updatedlikes = result.likes - 1;
      // Get index for this username and remove it from the array.
      var updatedlikedata = result.likeData;
      var userindex = updatedlikedata.indexOf(username);
      if (userindex === -1) {
        callback('Unable to process, user has not liked this post', null);
      } else {
        updatedlikedata.splice(userindex, 1);
        mongoConnection.collection('pinterestclone').update(filterclause, {$set: {'likes':updatedlikes, 'likeData':updatedlikedata}}, function (err, result) {
          if (err) {
            callback(err, null);
          } else {
            console.log("MongoDB added like for objectid" + imageid);
            callback(null, result);
          }
        })
      }
    }
  })
}

module.exports.deleteimage = function(mongoConnection, imageid, callback) {
  var filterclause = {'_id': mongodb.ObjectId(imageid)};
  mongoConnection.collection('pinterestclone').remove(filterclause, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log("mongodb removeQuery result: " + JSON.stringify(result));
      callback(null, result);
    }
  });
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

module.exports.saveToken = function(mongoConnection, token, profile, callback) {
  var newEntry = {"accessToken": token, "profile": profile};
  mongoConnection.collection('accessTokens').insertOne(newEntry, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
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
