var mongoose = require('mongoose');

var loansSchema = mongoose.Schema({
 name: String,
 userID: String,
 status: {type: String, default:"ongoing"},	// Possible statuses: cancelled, ongoing, completed
 interestType: String,
 interestRate: Number,
 annuityType: String,
 fixedInterest: Boolean,
 product: String,
 fees: Number,
 purpose: String,
 startDate: String,
 expectedEndDate: String,
 lastPaymentDate: String,
 lastPaymentInterest: Number,
 total: Number,
 currentBalance: Number,
 frequency: String,
 installmentSum: Number,
 investmentIndex: Number,
 notes: String,
 history: Array
});

module.exports = mongoose.model('Loans', loansSchema);