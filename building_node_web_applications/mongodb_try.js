var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('mtest', server);
// Access a collection once the database connection is open //
client.open(function(err) {
  if (err) {
    throw err;
  }
  else {
    client.collection('test_insert', function(err, collection) {
      if (err) {
	throw err;
      }
      else {
	console.log('We are now able to perform queries.');
      }
    });
    collection.insert(
      {
	"title": "I like cake",
	"body": "It is quite good"
      },
  }
// Safe mode indicates databse operation should be completed before the callback is executed: the callback logic is dependent on the database operation being complete. //
      {safe: true},
      function(err, documents) {
	if (err) {
	  throw err;
	}
	else {
	 console.log('Document ID is: ' + documents[0]._id);
	}
    );

  });
