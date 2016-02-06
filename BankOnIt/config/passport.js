var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../Schemas/user.js');
var badLogin = 'Invalid username & password combination!';
var emailTaken = 'An account is already bound to this email!';
var configAuth = require('./auth');


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

    passport.use(new FacebookStrategy({
    	clientID : configAuth.facebookAuth.clientID,
    	clientSecret : configAuth.facebookAuth.clientSecret,
    	callbackURL : configAuth.facebookAuth.callbackURL
    }, 
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
    return passport;
};
