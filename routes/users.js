var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var db = null;
var bit2c = null;
var bitfinex = null;
  // Connection URL
  const url = 'mongodb://ariel:ariel@ds127536.mlab.com:27536/collector';
  
  // Database Name
  const dbName = 'collector';

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
   assert.equal(null, err);
   console.log("Connected successfully to server");
  
    db = client.db(dbName);
    bit2c = db.collection('bit2c');
    bitfinex = db.collection('bitfinex');
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
 var limit = parseInt(req.query.limit);
 bit2c.find({}).limit(limit).toArray(function(err, docs) {
   assert.equal(err, null);
   var bit2cTickers = docs;
   bitfinex.find({}).limit(limit).toArray(function(err, docs1) {
      assert.equal(err, null);
      var bitfinexTickers = docs1;
      
      res.send({bit2cTickers:bit2cTickers,bitfinexTickers:bitfinexTickers });
  });
});
});

module.exports = router;
