var LocalStrategy = require('passport-local').Strategy;
var User = require('../Schemas/user.js');
var badLogin = 'Invalid username & password combination!';
var emailTaken = 'An account is already bound to this email!';


module.exports = function(passport) {
	
	// serialize user for session
	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
	
	passport.use('local-signup', new LocalStrategy({
		username : 'email',
		password : 'password',
		passReqToCallback : true
	}, 
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'email': email}, function(err, user) {
				if (err)
					return done(err);
				if (user)
					return done(null, false, req.flash('signupMessage', emailTaken));
				else {
					var newUser = new User();
                    newUser.firstName = '';
                    newUser.lastName = '';
					newUser.email = email;
					newUser.password = newUser.generateHash(password);
				
					newUser.save(function(err) {
						console.log("new user sign uped");
                        if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));


    
	// login strategy
    passport.use('local-login', new LocalStrategy({
	   usernameField: 'email',
	   passwordField: 'password',
	   passReqToCallback: true
    }, function(req, email, password, done){
	   User.findOne({ 'email' :  email }, function(err, user) {
              // if there are any errors, return the error before anything else
             if (err)
                 return done(err);

                // if no user is found, return the message
                if (!user)
                  return done(null, false, req.flash('loginMessage', badLogin)); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', badLogin)); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });
    }));
};
