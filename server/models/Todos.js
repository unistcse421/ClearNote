var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
    task: String,
    done: {type: Boolean, default: false},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

TodoSchema.methods.finish = function(cb) {
    this.done = true;
    this.save(cb);
};

TodoSchema.methods.undo = function(cb) {
    this.done = false;
    this.save(cb);
};

mongoose.model('Todo', TodoSchema);
