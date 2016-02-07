var mongoose = require('mongoose');

// Market Schema. Prototype for "marketing" debts
var marketSchema = mongoose.Schema({
	loan1: String,
	loan2: String,
	trader1: String, 
	trader2: String, 
	tradeInitDate: String,
	status: String // ongoing, complete, pending, etc?
	balance1: Number, // numerical values of debt of respective traders
	balance2: Number,
	interestRate1: Number, // interest rate of respective debts
	interestRate2: Number, 
	investmentIndex1: Number, // investment unmeasureable by cash, based on its potential value rather than market value, example range {-10, 10}
	investmentIndex2: Number, // 10 not necessarily best, simply higher reward for its risk. Likewise -10 not necessarily worst
	estimatedValue1: Number, // estimated market value of respective loan
	estimatedValue2: Number,
	accept1: Boolean, 
	accept2: Boolean
});

module.exports = mongoose.model('DebtTransactions', marketSchema);

