var mongoose = require('mongoose');

var SectionSchema = new mongoose.Schema({
    course_id: String,
    section_id: String,
    semester: String,
    year: Number,
    course_name: String,
    cards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    instructors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    managers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    // instructors: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Section', SectionSchema);
