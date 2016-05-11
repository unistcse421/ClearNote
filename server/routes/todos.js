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
    Todo.find({'creator':req.payload._id}).exec(function(err, todos) {
    	if (err) {return next(err);}
    	res.json(todos);
    });
});

router.post('/', auth, function(req, res, next) {
    var todo = new Todo(req.body);
    todo.creator = req.payload._id;
    todo.save(function(err, todo) {
	if (err) { return next(err); }
	var query = User.findById(req.payload._id);
	query.exec(function(err, user) {
	    if (err) { return next(err); }
	    user.todos.push(todo);
	    user.save(function(err) {
		if (err) { return next(err); }
		res.json(todo);
	    });
	});
    });
});

router.param('todo', function(req, res, next, id) {
    var query = Todo.findById(id);
    query.exec(function(err, todo) {
	if (err) {return next(err);}
	if (!todo) {return next(new Error('can\'t find todo'));}
	req.todo = todo;
	return next();
    });
});

router.get('/:todo', function(req, res) {
    res.json(req.todo);
});

router.put('/:todo/finish', auth, function(req, res, next) {
    req.todo.finish(function(err, todo) {
	if (err) {return next(err);}
	res.json(todo);
    });
});

router.put('/:todo/undo', auth, function(req, res, next) {
    req.todo.undo(function(err, todo) {
	if (err) {return next(err);}
	res.json(todo);
    });
});

module.exports = router;
