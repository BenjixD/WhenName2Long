var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	nationality: String,
	age: {type: Number, default: 0},
	email: String,
	password: String,
	homePhone:String,
	cellPhone:String,
	homeAddress:String,
	loans:Array
});

// methods ===
// generate hash for passwords
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(13), null);
};

// vertify correct password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);