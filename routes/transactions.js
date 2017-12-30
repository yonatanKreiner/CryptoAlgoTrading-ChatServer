var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var db = null;
var offlineTransactions = null;   
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
    offlineTransactions = db.collection('offline_transactions');
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fromDate = new Date(req.query.fromDate);
  var toDate = new Date(req.query.toDate);

 offlineTransactions.find({}).toArray(function(err, transactions) {
   var transaction = transactions[1];
   var result = [];

   for (let i= 0; i < transaction.transactions.length; i++){
     var sellTime = transaction.transactions[i].sell.date;
     var buyTime = transaction.transactions[i].buy.date;
     if (buyTime >= fromDate && sellTime <= toDate){
      result.push(transaction.transactions[i]);
     }
   }    

   assert.equal(err, null);
   res.send(result);
});
});

module.exports = router;
