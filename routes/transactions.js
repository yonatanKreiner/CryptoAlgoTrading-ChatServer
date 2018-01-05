const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db = null;
let offlineTransactions = null;   
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
router.get('/', async (req, res, next) => {
  let fromDate = new Date(req.query.fromDate);
  let toDate = new Date(req.query.toDate);

  fromDate.setHours(fromDate.getHours() - 2);
  toDate.setHours(toDate.getHours() - 2);

  let transactionsCursor = await offlineTransactions.find({});
  let transactions = await transactionsCursor.toArray();
  let transaction = transactions[4];
  let result = [];

  for (let i= 0; i < transaction.transactions.length; i++){
    let sellTime = transaction.transactions[i].sell.date;
    let buyTime = transaction.transactions[i].buy.date;
    if (buyTime >= fromDate && sellTime <= toDate){
      result.push(transaction.transactions[i]);
    }  
  }

  res.send(result);
});

module.exports = router;
