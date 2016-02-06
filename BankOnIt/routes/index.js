var express = require('express');
//var user = require('../Schemas/user.js');
var loanCollection = require('../Schemas/loans.js');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Home', { title: 'Home', username:'Jorden' });
});

router.post('/', function(req, res, next) {
  console.log("Mom's spaghetti");
  console.log(req.body.sign);
  res.redirect(req.body.sign);

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
		res.render('Mortgage', { title:'Loans', loans:listofLoans, username:'Jorden' });
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

router.get('/login', function(req, res){
	res.render('login', { title: 'log in', username:'Jorden' });
});


router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/',		// Redirect to main page when login complete
	failureRedirect: '/login',	// Return to login when fail, and flash error
	failureFlash: true
}));

router.get('/signup', function(req, res){
	res.render('signup', { title: 'signup', username:'Jorden' });
});

router.post('/signup', passport.authenticate('signup-local', {
	successRedirect: '/loans',		// Redirect to main page when login complete
	failureRedirect: '/',	// Return to signup when fail, and flash error
	failureFlash: true
}));

router.post('/successlogin', function(req, res){

});

router.get('/successlogin', function(req,res){
	res.render('Successlogin', { title: 'GOOD JOB', username:'Jorden' });
});

router.post('/successsignup', function(req, res){

});

router.get('/successsignup', function(req,res){
	res.render('Successsignup', { title: 'GOOD JOB', username:'Jorden' });
});

	return router;
};
//module.exports = router;