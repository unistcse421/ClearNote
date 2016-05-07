var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    user_id: {type:String, lowercase: true, unique: true},
    username: String,
    hash: String,
    salt: String,
    takes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
    teaches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
    manages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}]
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

mongoose.model('User', UserSchema);
