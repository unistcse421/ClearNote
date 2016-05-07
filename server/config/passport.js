var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
    {
	usernameField: 'user_id',
	passwordField: 'password'
    },
    function(user_id, password, done) {
	User.findOne({user_id: user_id}, function(err, user) {
	    if (err) { return done(err); }
	    if (!user) {
		return done(null, false, {message: 'Incorrect student id.'});
	    }
	    if (!user.validPassword(password)) {
		return done(null, false, {message: 'Incorrect password.'});
	    }
	    return done(null, user);
	});
    }
));
