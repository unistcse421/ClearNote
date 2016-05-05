var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    card: {type: mongoose.Schema.Types.ObjectId, ref: 'Card'}
});

mongoose.model('Comment', CommentSchema);
