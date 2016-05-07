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

router.get('/', function(req, res, next) {
    Card.find(function(err, cards) {
	if (err) {return next(err);}
	res.json(cards);
    });
});

// router.post('/cards', function(req, res, next) {
//     var card = new Card(req.body);
//     card.save(function(err, post) {
// 	if (err) {return next(err);}
// 	res.json(card);
//     });
// });

router.post('/:card/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.card = req.card;
    comment.author = req.payload.username;
    comment.save(function(err, comment) {
	if (err) {return next(err);}
	req.card.comments.push(comment);
	req.card.save(function(err, post) {
	    if (err) { return next(err); }
	    res.json(comment);
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
    req.card.populate('comments', function(err, card) {
	if (err) { return next(err); }
	res.json(card);
    });
});

module.exports = router;
