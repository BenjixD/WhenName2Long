var express = require('express');
var user_db = require('../Schemas/user.js');
var loanCollection = require('../Schemas/loans.js');
var calc = require('../public/javascripts/loan_calculator.js')
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

router.get('/loans', LoggedIn, function(req, res){
	
	var listofLoans = [];
	var loggedIn = logValue(req);
	
	loanCollection.find({'userId': req.user_id}, function(err, data) {

		if(data == null){
			console.log("Nothing to display");
		}
		else{
			for(i = 0; i < data.length; i++){
				listofLoans.push(data[i]);
			}
			res.render('Mortgage', { title:'Loans', loans:listofLoans, user: req.user, status: loggedIn });
		}
		/* test
		*/
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
	var loggedIn = logValue(req);
	res.render('login', { title: 'Log In', status: loggedIn});
});


router.post('/login', passport.authenticate('login-local', {
	successRedirect: '/successlogin',		// Redirect to main page when login complete
	failureRedirect: '/login',	// Return to login when fail, and flash error
	failureFlash: true
}));

router.get('/signup', function(req, res){
	var loggedIn = logValue(req);
	res.render('signup', { title: 'Sign Up', status: loggedIn});
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


router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
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


