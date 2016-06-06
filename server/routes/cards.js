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

router.get('/', auth, function(req, res, next) {
    var query = User.findById(req.payload._id);
    query.exec(function(err, user) {
	if (err) {return next(err);}
	if (!user) {return next(err);}
	Card
	    .find({$or:[{'section': {'$in' : user.takes}}, {'section': {'$in' : user.teaches}}, {'section': {'$in' : user.manages}}]})
	    .populate('creator')
	    .populate('section')
	    .sort('-pub_date')
	    .exec(function(err, cards) {
		if (err) {return next(err);}
		console.log('cards : ' + cards);
		res.json(cards);
	    });
    });
});

router.post('/:card/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.card = req.card;
    comment.creator = req.payload._id;
    comment.save(function(err, comment) {
	if (err) {return next(err);}
	req.card.comments.push(comment);
	req.card.save(function(err, card) {
	    if (err) { return next(err); }
	    comment.populate('creator', function(err, comment) {
	    	if (err) {return next(err);}
		res.json(comment);
	    });
	});
    });
});

router.param('card', function(req, res, next, id) {
    var query = Card.findById(id);
    query.exec(function(err, card) {
	if (err) {return next(err);}
	if (!card) {return next(new Error('can\'t find card'));}
	req.card = card;
	return next();
    });
});

router.get('/:card', function(req, res) {
    req.card
	.populate('comments', function(err, card) {
	    if (err) { return next(err); }
	    Comment.populate(card.comments, 'creator', function(err, comments) {
	    	if (err) {return next(err);}
	    	res.json(card);
	    });
	});
});

module.exports = router;
