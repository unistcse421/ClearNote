var path = require('path');
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
    res.render(path.join(__dirname, '../../client/index.html'));
});

module.exports = router;
