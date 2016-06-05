var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    card: {type: mongoose.Schema.Types.ObjectId, ref: 'Card'}
});

mongoose.model('Comment', CommentSchema);
