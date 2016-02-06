var express = require('express');
var router = express.Router();
var user = require('../Schemas/user.js');
var loanCollection = require('../Schemas/loans.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Home', { title: 'Home' });
});

router.post('/', function(req, res, next) {
  console.log(req.body.button);
  res.render('Home', { title: 'Home' });
});

router.post('/loans', function(req, res){
	console.log("went to loans");
});

router.get('/loans', function(req, res){
	
	var listofLoans = [];
	
	loanCollection.find({}, function(err, data) {
		/* test
		*/

		var a = new loanCollection();
		// add message
		a.name = "Waifu Loans";
		a.userID = "1";
 		a.interestType = "compound";
 		a.interestRate = 5;
 		a.fixedInterest = true;
 		a.purpose = "buy waifus";
 		a.startDate = "1/10/31";
 		a.expectedEndDate = "2/10/31";
 		a.total = 2500000
 		a.currentBalance = 50000;
 		a.frequency = 10;
 		a.installmentSum = 5000;
 		a.notes = " I am poor";
 		a.save();

		for (var i = data.length - 1; i >= 0; i--) {
			listofLoans.push(data[i]);
			console.log(data[i].name);
			console.log("helloworld");
		};
		console.log("hello");
		res.render('Mortgage', { title:'Loans', loans:listofLoans });
	});

//res.redirect('/csc369');
});

router.post('/loans', function(req, res){
	console.log('went to loans');
});

router.post('/csc369', function(req, res){
	res.redirect('/csc369');
});

router.get('/csc369', function(req,res){
	
	res.send("Hello world");
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/',		// Redirect to main page when login complete
	failureRedirect: '/login',	// Return to login when fail, and flash error
	failureFlash: true
}));


module.exports = router;