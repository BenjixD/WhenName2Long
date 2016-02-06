var mongoose = require('mongoose');

var historySchema = mongoose.Schema({
	loanID:String,
	userID:String,
	issueDate:String,
	details:String,
	status:String
});

module.exports = mongoose.model('History', historySchema);