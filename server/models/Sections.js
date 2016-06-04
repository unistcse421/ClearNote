var mongoose = require('mongoose');
var _ = require('underscore');

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
});

SectionSchema.methods.addStudents = function(student_ids, cb) {
    var id = '';
    var cp = function(c) {
	return c == id;
    };
    for (i=0; i < student_ids.length; ++i) {
	id = student_ids[i];
	exist = _.some(this.students, cp);
	if (!exist) {
	    this.students.push(id);
	}
    }
    this.save(cb);
};

SectionSchema.methods.removeStudent = function(studentId, cb) {

    var cp = function(d) {
	return d == studentId;
    };
    this.students = _.reject(this.students, cp);
    this.save(cb);
};

SectionSchema.methods.addInstructors = function(instructor_ids, cb) {
    var id = '';
    var cp = function(c) {
	return c == id;
    };
    for (i=0; i < instructor_ids.length; ++i) {
	id = instructor_ids[i];
	exist = _.some(this.instructors, cp);
	if (!exist) {
	    this.instructors.push(id);
	}
    }
    this.save(cb);
};

SectionSchema.methods.removeInstructor = function(instructorId, cb) {

    var cp = function(d) {
	return d == instructorId;
    };
    this.instructors = _.reject(this.instructors, cp);
    this.save(cb);
};

SectionSchema.methods.addManagers = function(manager_ids, cb) {
    var id = '';
    var cp = function(c) {
	return c == id;
    };
    for (i=0; i < manager_ids.length; ++i) {
	id = manager_ids[i];
	exist = _.some(this.managers, cp);
	if (!exist) {
	    this.managers.push(id);
	}
    }
    this.save(cb);
};

SectionSchema.methods.removeManager = function(managerId, cb) {

    var cp = function(d) {
	return d == managerId;
    };
    this.managers = _.reject(this.managers, cp);
    this.save(cb);
};

mongoose.model('Section', SectionSchema);
