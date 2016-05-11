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
	console.log(user);
	if (err) {return next(err);}
	Section.find({$or:[{'_id': {'$in' : user.takes}}, {'_id': {'$in' : user.teaches}}, {'_id': {'$in' : user.manages}}]}).exec(function(err, sections) {
	// Section.find({'_id': {'$in' : user.takes}}).exec(function(err, sections) {
	    if (err) {return next(err);}
	    console.log(sections);
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
	    res.json(sections);
	});
    });
});

router.post('/', auth, function(req, res, next) {
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

router.get('/:section', function(req, res) {
    req.section
	.populate('cards students instructors managers', function(err, section) {
	    if (err) { return next(err); }
	    res.json(section);
	});
});

router.post('/:section/cards', auth, function(req, res, next) {
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

router.get('/:section/cards', function(req, res, next) {
    Card.find({'section': req.section._id})
	.exec(function(err, cards) {
	    if (err) {return next(err);}
	    res.json(cards);
	});
});

router.post('/:section/students', function(req, res, next) {
    req.section.addStudents(req.body, function(err, section) {
    	if (err) { return next(err); }
	var addTake = function(err, user) {
    	    if (err) { return next(err); }
	    user.addTake(section._id);
	};
	for (i=0; i < section.students.length; ++i) {
	    User.findById(section.students[i]).exec(addTake);
	}
    	section.populate('cards students instructors managers', function(err, section) {
    	    if (err) { return next(err); }
    	    res.json(section);
    	});
    });
});

router.get('/:section/students/:id/remove', function(req, res, next) {
    var studentId = req.params.id;
    console.log(studentId);
    req.section.removeStudent(studentId, function(err, section) {
    	if (err) { return next(err); }
	User.findById(studentId).exec(function(err, user) {
    	    if (err) { return next(err); }
	    user.removeTake(section._id);
	});
    	section.populate('cards students instructors managers', function(err, section) {
    	    if (err) { return next(err); }
    	    res.json(section);
    	});
    });
});

router.post('/:section/instructors', function(req, res, next) {
    req.section.addInstructors(req.body, function(err, section) {
    	if (err) { return next(err); }
	var addTake = function(err, user) {
    	    if (err) { return next(err); }
	    user.addTake(section._id);
	};
	for (i=0; i < section.instructors.length; ++i) {
	    User.findById(section.instructors[i]).exec(addTake);
	}
    	section.populate('cards students instructors managers', function(err, section) {
    	    if (err) { return next(err); }
    	    res.json(section);
    	});
    });
});

router.get('/:section/instructors/:id/remove', function(req, res, next) {
    var instructorId = req.params.id;
    console.log(instructorId);
    req.section.removeInstructor(instructorId, function(err, section) {
    	if (err) { return next(err); }
	User.findById(instructorId).exec(function(err, user) {
    	    if (err) { return next(err); }
	    user.removeTake(section._id);
	});
    	section.populate('cards students instructors managers', function(err, section) {
    	    if (err) { return next(err); }
    	    res.json(section);
    	});
    });
});

router.post('/:section/managers', function(req, res, next) {
    req.section.addManagers(req.body, function(err, section) {
    	if (err) { return next(err); }
	var addTake = function(err, user) {
    	    if (err) { return next(err); }
	    user.addTake(section._id);
	};
	for (i=0; i < section.managers.length; ++i) {
	    User.findById(section.managers[i]).exec(addTake);
	}
    	section.populate('cards students instructors managers', function(err, section) {
    	    if (err) { return next(err); }
    	    res.json(section);
    	});
    });
});

router.get('/:section/managers/:id/remove', function(req, res, next) {
    var managerId = req.params.id;
    console.log(managerId);
    req.section.removeManager(managerId, function(err, section) {
    	if (err) { return next(err); }
	User.findById(managerId).exec(function(err, user) {
    	    if (err) { return next(err); }
	    user.removeTake(section._id);
	});
    	section.populate('cards students instructors managers', function(err, section) {
    	    if (err) { return next(err); }
    	    res.json(section);
    	});
    });
});

module.exports = router;
