var mongoose = require('mongoose');

var MemoSchema = new mongoose.Schema({
    body: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    card: {type: mongoose.Schema.Types.ObjectId, ref: 'Card'}
});

mongoose.model('Memo', MemoSchema);
