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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sections', auth, function(req, res, next) {
    Section.find(function(err, sections) {
	if (err) {return next(err);}
	sections = sections.map(function (section) {
	    return section.toObject();
	});
	for (var j=0; j < sections.length; ++j) {
	    var section = sections[j];
	    section.manage_authorized = false;
	    for (var i=0; i < section.managers.length; ++i) {
		var managerId = section.managers[i];
		if (managerId == req.payload._id) {
		    section.manage_authorized = true;
		    break;
		}
	    }
	}
	// });
	res.json(sections);
    });
});

router.post('/sections', auth, function(req, res, next) {
    var section = new Section(req.body);
    var query = User.findById(req.payload._id);
    query.exec(function(err, manager) {
	section.managers.push(manager);
	section.save(function(err, post) {
	    if (err) {return next(err);}
	    manager.manages.push(section);
	    manager.save(function(err, manager) {
		if (err) { return next(err); }
		res.json(section);
	    });
	});
    });
});

router.param('section', function(req, res, next, id) {
    var query = Section.findById(id);
    query.exec(function(err, section) {
	if (err) {return next(err);}
	if (!section) {return next(new Error('can\'t find section'));}
	req.section = section;
	return next();
    });
});

router.get('/sections/:section', function(req, res) {
    req.section
	.populate('cards students instructors managers', function(err, section) {
	    if (err) { return next(err); }
	    res.json(section);
	});
});

router.get('/cards', function(req, res, next) {
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

router.post('/sections/:section/cards', auth, function(req, res, next) {
    var card = new Card(req.body);
    card.section = req.section;
    card.author = req.payload.username;
    card.save(function(err, card) {
	if (err) {return next(err);}
	req.section.cards.push(card);
	req.section.save(function(err, section) {
	    if (err) { return next(err); }
	    res.json(card);
	});
    });
});

router.post('/cards/:card/comments', auth, function(req, res, next) {
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

router.get('/sections/:section/cards', function(req, res, next) {
    Card.find({'section': req.section._id})
    .exec(function(err, cards) {
	if (err) {return next(err);}
	res.json(cards);
    });
});

router.param('card', function(req, res, next, id) {
    var query = Card.findById(id);
    query.exec(function(err, card) {
	if (err) {return next(err);}
	if (!card) {return next(new Error('can\'t find card'))}
	req.card = card;
	return next();
    });
});

router.get('/cards/:card', function(req, res) {
    req.card.populate('comments', function(err, card) {
	if (err) { return next(err); }
	res.json(card);
    });
});

router.get('/todos', function(req, res, next) {
    Todo.find(function(err, todos) {
	if (err) {return next(err);}
	res.json(todos);
    });
});

router.post('/todos', auth, function(req, res, next) {
    var todo = new Todo(req.body);
    todo.save(function(err, todo) {
	if (err) { return next(err); }
	res.json(todo);
    });
});

router.param('todo', function(req, res, next, id) {
    var query = Todo.findById(id);
    query.exec(function(err, todo) {
	if (err) {return next(err);}
	if (!todo) {return next(new Error('can\'t find todo'))}
	req.todo = todo;
	return next();
    });
});

router.get('/todos/:todo', function(req, res) {
    res.json(req.todo);
});

router.put('/todos/:todo/finish', auth, function(req, res, next) {
    req.todo.finish(function(err, todo) {
	if (err) {return next(err);}
	res.json(todo);
    });
});

router.put('/todos/:todo/undo', auth, function(req, res, next) {
    req.todo.undo(function(err, todo) {
	if (err) {return next(err);}
	res.json(todo);
    });
});

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
