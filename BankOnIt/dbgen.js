// Automatically adds 25 loans to the database when you start the server

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

// var mongoose = require('mongoose');
var user = require('./Schemas/user.js');
var loanCollection = require('./Schemas/loans.js');

var generate = function(db, callback) {
	for (var i = 1; i <= 25; i++) {
	   	x = i.toString();
	   	y = i % 2;
		db.collection('generatedLoans').insertOne( {
	    name: "Loan " + x,
	    userID: x,
	    status: "ongoing",
	    interestType: "compound",
	    interestRate: y+1,
	    fixedInterest: true,
	    fees: i,
	    purpose: x,
	    startDate: "1/1/16",
	    expectedEndDate: "12/31/17",
 		lastPaymentDate: x,
 		lastPaymentInterest: i,
 		total: i,
 		currentBalance: i,
 		frequency: y+1,
 		installmentSum: i,
 		notes: x,
 		history: []
	}/*, function(err, result) {
    assert.equal(err, null);
    console.log("Generated loans.");
    callback(result);
  	}*/);
	}
};

MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
  	generate(db, function() {
    db.close();
  });
});

//module.exports = generate; // Not needed unless you want to call generate from another file
