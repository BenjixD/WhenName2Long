var express = require('express');
var user_db = require('../Schemas/user.js');
var loanCollection = require('../Schemas/loans.js');
var calc = require('../public/javascripts/loan_calculator.js')
var router = express.Router();

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

router.get('/contactus', function(req, res, next) {
  res.render('contactus', { title: 'Contact Us', username:'Jorden' });
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
		a.name = "Bonus Waifu Loans";
		a.userID = "1";
 		a.interestType = "compound";
 		a.interestRate = 0.05;
 		a.fixedInterest = true;
 		a.purpose = "buy waifus";
 		a.startDate = "2016-01-31";
 		a.lastPaymentDate = "2016-03-31";
 		a.total = 2500000
 		a.currentBalance = 50000;
 		a.frequency = 'Monthly';
 		a.installmentSum = 5000;
 		a.annuityType = 'Annuity Due';
 		a.expectedEndDate = calc.expected_loan_completion(new Date(a.lastPaymentDate), a.interestRate, a.installmentSum, a.currentBalance, a.frequency, a.annuityType);
 		a.notes = " I am poor";
 		a.save();

		for (var i = data.length - 1; i >= 0; i--) {
			listofLoans.push(data[i]);
			//console.log(data[i].name);
			//console.log("helloworld");
		};
		console.log("hello");
		res.render('Mortgage', { title:'Loans', loans:listofLoans, username:'Jorden' });
	});

//res.redirect('/csc369');
});

router.post('/loans', function(req, res){
	console.log('went to loans');
});

//FOR TESTIN
router.post('/csc369', function(req, res){
	res.redirect('/csc369');
});

router.get('/csc369', function(req,res){
	
	//res.send("Hello world");
	var ans = calc.expected_loan_completion(new Date('2016-01-01'), 0.05, 1000, 4545.95, "Monthly", "Annuity Due"); 
	res.send(ans);
	console.log("hoy");
});
//FOR TESTIN


router.get('/login', function(req, res){
	res.render('login', { title: 'Log In', username:'Jorden' });
});


router.post('/login', passport.authenticate('login-local', {
	successRedirect: '/successlogin',		// Redirect to main page when login complete
	failureRedirect: '/login',	// Return to login when fail, and flash error
	failureFlash: true
}));

router.get('/signup', function(req, res){
	res.render('signup', { title: 'Sign Up', username:'Jorden' });
});

router.post('/signup', passport.authenticate('signup-local', {
	successRedirect: '/successsignup',		// Redirect to main page when login complete
	failureRedirect: '/signup',	// Return to signup when fail, and flash error
	failureFlash: true
}));

router.get('(/profile/id/:id)?', function(req, res) {
	res.render('Profile', { title: "My Profile", username:'Jorden', user : req.user});
});


router.get('/successlogin', LoggedIn, function(req,res){
	res.render('Successlogin', { title: 'GOOD JOB', username:'Jorden' });
});


router.get('/successsignup', function(req,res){
	res.render('Successsignup', { title: 'GOOD JOB', username:'Jorden' });
});

router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});


	return router;
};
function LoggedIn(req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}
//module.exports = router;


