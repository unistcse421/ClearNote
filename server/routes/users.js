var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');
var Section = mongoose.model('Section');
var Card = mongoose.model('Card');
var Comment = mongoose.model('Comment');
var Todo = mongoose.model('Todo');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.post('/register', function(req, res, nest) {
    if (!req.body.user_id || !req.body.password || !req.body.username) {
	return res.status(400).json({message: 'Please fill out all fields'});
    }
    var user = new User();
    user.user_id = req.body.user_id;
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.save(function(err) {
	if (err) {return next(err);}
	return res.json({token: user.generateJWT()});
    });
});

router.post('/login', function(req, res, next) {
    if (!req.body.user_id || !req.body.password) {
	return res.status(400).json({message: 'Please fill out all fields'});
    }
    passport.authenticate('local', function(err, user, info) {
	if (err) { return next(err); }
	if (user) {
	    return res.json({token: user.generateJWT()});
	} else {
	    return res.status(401).json(info);
	}
    })(req, res, next);
});

module.exports = router;
