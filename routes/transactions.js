var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var db = null;
var offlineTransactions = null;   
  // Connection URL
  const url = 'mongodb://ariel:ariel@ds127536.mlab.com:27536/collector';
  
  // Database Name
  const dbName = 'collector';

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
   assert.equal(null, err);
   console.log("Connected successfully to server");
  
    db = client.db(dbName);
    offlineTransactions = db.collection('offline_transactions');
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
 offlineTransactions.find({}).toArray(function(err, transactions) {
   assert.equal(err, null);
   res.send(transactions);
});
});

module.exports = router;
