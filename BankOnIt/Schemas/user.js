var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	name: String,
	nationality: String,
	age: {type: Number, default: 0},
	email: String,
	homePhone:String,
	cellPhone:String,
	homeAddress:String,
	loans:Array
});

module.exports = mongoose.model('User', userSchema);