var express = require('express');
var user_db = require('../Schemas/user.js');
var loanCollection = require('../Schemas/loans.js');
var calc = require('../public/javascripts/loan_calculator.js')
var marketCollection = require('../Schemas/market.js');
var router = express.Router();

module.exports = function(passport){

/* GET home page. */
router.get('/', function(req, res, next) {
	var loggedIn = logValue(req);
  res.render('Home', { title: 'Home', user: req.user, status: loggedIn});
});

router.post('/', function(req, res, next) {

  console.log("Mom's spaghetti");
  console.log(req.body.sign);
  res.redirect(req.body.sign);

});

router.get('/contactus', function(req, res) {
	var loggedIn = logValue(req);
	console.log(loggedIn);
  res.render('contactus', { title: 'Contact Us', user: req.user, status: loggedIn});
});


router.post('/loans', function(req, res){
	console.log("went to loans");
});

// ***************doesnt redirect when entered manually ***************
router.get('/loans', LoggedIn, function(req, res){
	
	var mortgage = [], car = [], credit = [], other = [];
	var loggedIn = logValue(req);
	console.log(req.user._id);
	
	loanCollection.find({'userID': req.user._id, 'product': 'Mortgage'}, function(err, data) {
		
			for(i = 0; i < data.length; i++){
				// recalculate listofLoans' expectedEndDate
				console.log("Pushing data to array");
				data[i].expectedEndDate = calc.expected_loan_completion(new Date(data[i].lastPaymentDate), data[i].interestRate, data[i].installmentSum, data[i].currentBalance, data[i].frequency, data[i].annuityType, data[i].interestType);
				data[i].save();
				mortgage.push(data[i]);
			}

	});
	//console.log(mortgage[0].name);
	
		loanCollection.find({'userID': req.user._id, 'product':'Car'}, function(err, data) {
		
			for(i = 0; i < data.length; i++){
				// recalculate listofLoans' expectedEndDate
				console.log("Pushing data to array");
				data[i].expectedEndDate = calc.expected_loan_completion(new Date(data[i].lastPaymentDate), data[i].interestRate, data[i].installmentSum, data[i].currentBalance, data[i].frequency, data[i].annuityType, data[i].interestType);
				data[i].save();
				car.push(data[i]);
			}

	});
	
		loanCollection.find({'userID': req.user._id, 'product': 'Credit' }, function(err, data) {
		
			for(i = 0; i < data.length; i++){
				// recalculate listofLoans' expectedEndDate
				console.log("Pushing data to array");
				data[i].expectedEndDate = calc.expected_loan_completion(new Date(data[i].lastPaymentDate), data[i].interestRate, data[i].installmentSum, data[i].currentBalance, data[i].frequency, data[i].annuityType, data[i].interestType);
				data[i].save();
				credit.push(data[i]);
			}
		
	});
	
		loanCollection.find({'userID': req.user._id, 'product': 'Others'}, function(err, data) {
		
			for(i = 0; i < data.length; i++){
				// recalculate listofLoans' expectedEndDate
				console.log("Pushing data to array");
				data[i].expectedEndDate = calc.expected_loan_completion(new Date(data[i].lastPaymentDate), data[i].interestRate, data[i].installmentSum, data[i].currentBalance, data[i].frequency, data[i].annuityType, data[i].interestType);
				data[i].save();
				other.push(data[i]);
			}
		
		res.render('Mortgage', { title:'Loans', loans: mortgage, carExp: car, creditExp: credit, otherExp: other, user: req.user, status: loggedIn });
	});
	

//res.redirect('/csc369');
});
//load each specific loan page
router.get('/loans(/id/:id)?', LoggedIn, function(req, res){

	var loggedIn = logValue(req);
	var id = req.params.id;
	console.log(id);

	loanCollection.findOne({'_id': id}, function(err, data){
		res.render('loaninfo', { title: data.name, loans: data, user: req.user, status: loggedIn });
	});

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

//facebook login and signup
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/successlogin',
            failureRedirect : '/'
        }));
//


router.get('/login', function(req, res){
	var loggedIn = logValue(req);
	res.render('login', { title: 'Log In', user: req.user, status: loggedIn});
});


router.post('/login', passport.authenticate('login-local', {
	successRedirect: '/successlogin',		// Redirect to main page when login complete
	failureRedirect: '/login',	// Return to login when fail, and flash error
	failureFlash: true
}));

router.get('/signup', function(req, res){
	var loggedIn = logValue(req);
	res.render('signup', { title: 'Sign Up', user: req.user, status: loggedIn});
});

router.post('/signup', passport.authenticate('signup-local', {
	successRedirect: '/successsignup',		// Redirect to main page when login complete
	failureRedirect: '/signup',	// Return to signup when fail, and flash error
	failureFlash: true
}));



router.get('/successlogin', LoggedIn, function(req,res){
	var loggedIn = logValue(req);
	res.render('Successlogin', { title: 'GOOD JOB', user: req.user, status: loggedIn});
});


router.get('/successsignup', LoggedIn, function(req,res){

		var loggedIn = logValue(req);

	res.render('Successsignup', { title: 'GOOD JOB', user: req.user, status: loggedIn});
});

router.get('/profile(/id/:id)?', LoggedIn, function(req, res) {

		var id;
		var loggedIn = logValue(req);

		if (req.originalUrl == '/profile'){ 
			id = req.user._id;
		}
		else{
			id = req.params.id;
		}

		user_db.findOne({"_id": id}, function(err, data)
		{
			if(data == null){
				res.redirect("/");
			}

			else{
				res.render('Profile', { title: "My Profile", user : data, status: loggedIn});
			}
		});
	});

router.get('/makeloan', LoggedIn, function(req, res){

	var loggedIn = logValue(req);

	var int_type = ['Flat','Simple','Compound'];
	var ann_type = ['Annuity', 'Annuity_Due'];
	var fix_int = ['Yes', 'No'];
	var freq = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
	var loan_type = ["Mortgage Loans", "Car Loans", "Credit Card Loans", "Others"];

	res.render('newloan', { title: "Request Loan",
							user: req.user,
							it : int_type, 
							at : ann_type, 
							fi : fix_int,
							fe : freq,
							lt : loan_type,
							status: loggedIn}); 
	//res.redirect('/csc369');
});



router.get('/debtmarket', LoggedIn, function(req, res){

	var pending = [], confirm = [], ongoing = [];
	var loggedIn = logValue(req);

	if (!loggedIn)
		res.redirect('/');
	else
	{
		marketCollection.find({'trader1': req.user._id, 'status' : 'Pending'}, function(err, data) {
			if(err){
				console.log("get(debtmarket) find returns error");
				throw err;
			}

		console.log("ooooooo0o0o0o0");
		pending = data;
		});

		marketCollection.find({'trader2' : req.user._id, 'status' : 'Pending'}, function(err, data) {
			if(err){
				console.log("get(debtmarket) find returns error");
				throw err;
			}

		confirm = data;
		});

		marketCollection.find({'$or' : [{'trader1' : req.user._id}, {'trader2' : req.user._id}], 'status' : 'Ongoing'}, function(err, data) {
			if(err){
				console.log("get(debtmarket) find returns error");
				throw err;
			}

		ongoing = data;
		});

		res.render('DebtMarket', { title: 'Debt Market', user: req.user, status: loggedIn, pending: pending, confirm: confirm, ongoing: ongoing});
	}	
});


//PROBLEM****************
//************Does NOT REDIRECT WHEN NOT LOGGED IN *************
router.get('/requesttrade', LoggedIn, function(req, res) {

	var loggedIn = logValue(req);

	loanCollection.find({'product' : "Mortgage", 'userID': {'$ne': req.user._id}}, function(err, data) {
		if(err){
			console.log("get(requesttrade) find returns error");
			throw err;
		}
			res.render('RequestTrade', {title: "Trade Request", loans: data , user: req.user, status: loggedIn});
	});
	
});

router.get('/requestconfirm(/id/:id)?', LoggedIn, function(req, res) {

	var loggedIn = logValue(req);
	var tradeId = req.params.id;
	console.log(tradeId);

	console.log("Requesting debt trade from: "+ req.user._id);

	loanCollection.findOne({'_id': tradeId}, function(err, traderLoan){

		console.log(traderLoan._id);
			//find the trader loan with tradeId
		loanCollection.find({'product': 'Mortgage', 'userID': req.user._id}, function(err, data) {
			if(err){
				console.log("post(requesttrade) find returns error");
				throw err;
			}
				// Render different page if can't make Request Trade do both things
			//res.redirect('/csc369');
			res.render('RequestConfirm', {title: "What to Trade For?", loan1: data, user: req.user, status: loggedIn, loan2: traderLoan});
		});
		

	});
});

router.post('/posttrade', function(req, res){
	if(req.user == null) {
		console.log("Guest tried to enter /posttrade");
		res.redirect('/');
	}
	else {
		console.log('Registering trade of debts ' + req.body.loan1 + ", " + req.body.loan2);
		marketCollection.find({'$or': [{'loan1' : req.body.loan1}, {'loan1' : req.body.loan2}, {'loan2' : req.body.loan1}, {'loan2' : req.body.loan2}]}, function(err, data) {
			if(err) {
				console.log("Error during debt trade registration");
				throw err;
			}
			if (data) {
				console.log("Trade between the chosen debt already exists!");
				res.redirect('/requesttrade');
			}
			else {
				var tr = new marketCollection();
				tr.loan1 = req.body.loan1;
				tr.loan2 = req.body.loan2;
				tr.trader1 = req.body.loan1.userID;
				tr.trader2 = req.body.loan2.userID;
				tr.balance1 = req.body.loan1.currentBalance;
				tr.balance2 = req.body.loan2.currentBalance;
				tr.interestRate1 = req.body.loan1.interestRate;
				tr.interestRate2 = req.body.loan2.interestRate;
				tr.tradeInitDate = new Date().toDateString();
				tr.accept1 = false;
				tr.accept2 = false;
				tr.status = "Pending";
				tr.save();
				res.redirect('/debtmarket');

			}
		})
	}
})

router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});



router.post('/makeloan', function (req, res){
	console.log("Request to make new loan for UserID " + req.user._id);
	console.log(req.body.name);
	console.log(req.body.interestType);
	console.log(req.body.interestRate);
	console.log(req.body.annuityType);
	console.log(req.body.fixedInterest);
	console.log(req.body.installmentSum);
	console.log(req.body.fees);
	console.log(req.body.total);
	console.log(req.body.frequency);
	console.log(req.body.notes);
	console.log(req.body.purpose);
	loanCollection.find({}, function(err, data){
		
		var newloan = new loanCollection();
		
		newloan.name = req.body.name;
	    newloan.userID = req.user._id;
	    newloan.product = req.body.product;
	    newloan.interestType = req.body.interestType;
	    newloan.interestRate = req.body.interestRate;
	    newloan.annuityType = req.body.annuityType;
	    newloan.fixedInterest = req.body.fixedInterest;
	    newloan.installmentSum = req.body.installmentSum;
		newloan.fees = req.body.fees;
		newloan.total = req.body.total;
 		newloan.frequency = req.body.frequency;
	    newloan.notes = req.body.notes;
		newloan.purpose = req.body.purpose;
 		newloan.history = [];
 		newloan.startDate = new Date().toDateString();
 		newloan.lastPaymentInterest = 0;
		newloan.lastPaymentDate= newloan.startDate;
		newloan.investmentIndex = 0;
		newloan.currentBalance = newloan.total;
		newloan.save();
		newloan.expectedEndDate = calc.expected_loan_completion(new Date(newloan.lastPaymentDate), newloan.interestRate, newloan.installmentSum, newloan.currentBalance, newloan.frequency, newloan.annuityType, newloan.interestType);
		newloan.save();
		res.redirect("/loans");
	});

});

	return router;
};
function changeToProfile() {
    setTimeout("location.href = '/';", 5000);
}

function logValue(req){

	var loggedIn;
	if(req.isAuthenticated()){
		loggedIn = true;
	}
	else{
		loggedIn = false;
	}
	return loggedIn;
}
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


