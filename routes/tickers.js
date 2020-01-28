const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db = null;
let bit2c = null;
let bitfinex = null;
// Connection URL
const url = 'MONGO_PATH';

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
router.get('/', async (req, res, next) => {
  let fromDate = new Date(req.query.fromDate);
  let toDate = new Date(req.query.toDate);

  fromDate.setHours(fromDate.getHours() - 2);
  toDate.setHours(toDate.getHours() - 2);

  let filter = {"date": {$lte:toDate, $gte:fromDate}}
  let sort = { date: 1 };
  let projection = {_id:0, 'ask':1, 'date':1,'bid':1};
  let bit2Cursor = await bit2c.find(filter).project(projection).sort(sort);
  let bit2cTickers  = await bit2Cursor.toArray();
  let bit2cTickersCount = bit2cTickers.length;
  let bitfinexCursor = await bitfinex.find(filter).project(projection).sort(sort);
  let bitfinexTickers = await bitfinexCursor.toArray();
  let bitfinexTickersCount = bitfinexTickers.length;

  res.send({bit2cTickersCount:bit2cTickersCount,
            bitfinexTickersCount:bitfinexTickersCount,
            bit2cTickers:bit2cTickers,
            bitfinexTickers:bitfinexTickers});
});

module.exports = router;
