var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var db = null;
var bit2c = null;
var bitfinex = null;
  // Connection URL
  const url = 'mongodb://bitteamisrael:Ariel241096@ds135667-a0.mlab.com:35667,ds135667-a1.mlab.com:35667/bitteamdb?replicaSet=rs-ds135667';
  //const url = 'mongodb://ariel:ariel@ds127536.mlab.com:27536/collector';

  // Database Name
  const dbName = 'bitteamdb';
  //const dbName = 'collector';

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
 var fromDate = new Date(req.query.fromDate);
 var toDate = new Date(req.query.toDate);

 fromDate.setHours(fromDate.getHours() - 2);
 toDate.setHours(toDate.getHours() - 2);

 var filter = {"date": {$lte:toDate, $gte:fromDate}}
 var sort = { date: 1 };
 var projection = {_id:1, 'ask':1, 'date':1,'bid':1};
 bit2c.find(filter).project(projection).sort(sort).toArray(function(err, docs) {
   assert.equal(err, null);
   var bit2cTickers = docs;
   var bit2cTickersCount = docs.length;
   bitfinex.find(filter).project(projection).sort(sort).toArray(function(err, docs1) {
      assert.equal(err, null);
      var bitfinexTickers = docs1;
      var bitfinexTickersCount = docs1.length;
      res.send({bit2cTickersCount:bit2cTickersCount,bitfinexTickersCount:bitfinexTickersCount,bit2cTickers:bit2cTickers,bitfinexTickers:bitfinexTickers});
  });
});
});

module.exports = router;
