var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var _ = require('underscore');

var UserSchema = new mongoose.Schema({
    user_id: {type:String, lowercase: true, unique: true},
    username: String,
    hash: String,
    salt: String,
    takes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
    teaches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
    manages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
    todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
	_id: this._id,
	user_id: this.user_id,
	username: this.username,
	exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
};

UserSchema.set('toJSON', {
    transform: function(doc, ret, options) {
	var retJson = {
	    _id: ret._id,
	    user_id: ret.user_id,
	    username: ret.username
	};
	return retJson;
    }
});

UserSchema.methods.addTake = function(sectionId, cb) {
    exist = _.some(this.takes, function(c) {
	return c == sectionId;
    });
    if (!exist) {
	this.takes.push(sectionId);
	this.save(cb);
    }
};

UserSchema.methods.removeTake = function(sectionId, cb) {
    var cp = function(c) {
	return (('' + c) == sectionId);
    };
    this.takes = _.reject(this.takes, cp);
    this.save(cb);
};

UserSchema.methods.addTeach = function(sectionId, cb) {
    exist = _.some(this.teaches, function(c) {
	return c == sectionId;
    });
    if (!exist) {
	this.teaches.push(sectionId);
	this.save(cb);
    }
};

UserSchema.methods.removeTeach = function(sectionId, cb) {
    this.teaches = _.reject(this.teaches, function(c) {
	return (('' + c) == sectionId);
    });
    this.save(cb);
};

UserSchema.methods.addManage = function(sectionId, cb) {
    exist = _.some(this.manages, function(c) {
	return c == sectionId;
    });
    if (!exist) {
	this.manages.push(sectionId);
	this.save(cb);
    }
};

UserSchema.methods.removeManage = function(sectionId, cb) {
    this.manages = _.reject(this.manages, function(c) {
	return (('' + c) == sectionId);
    });
    this.save(cb);
};

mongoose.model('User', UserSchema);
