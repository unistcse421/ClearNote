angular.module('cleannote').factory('sections', ['$http', 'auth', function($http, auth) {
    var o = {
	sections: []
    };
    o.getAll = function(sectionId) {
	return $http.get('/sections', {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    console.log(data);
	    angular.copy(data, o.sections);
	    o.sections.forEach(function (section, index) {
		if (section._id === sectionId) {
		    section.selected = true;
		} else {
		    section.selected = false;
		}
	    });
	});
    };
    o.create = function(section) {
	return $http.post('/sections', section, {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    o.sections.push(data);
	});
    };
    o.get = function(id) {
	return $http.get('/sections/' + id).then(function(res) {
	    console.log(res.data);
	    return res.data;
	});
    };
    o.addStudents = function(section_id, student_ids) {
	return $http.post('/sections/' + section_id + '/students', student_ids);
    };
    o.removeStudent = function(section_id, id) {
	return $http.get('/sections/' + section_id + '/students/' + id + '/remove');
    };
    o.addInstructors = function(section_id, instructor_ids) {
	return $http.post('/sections/' + section_id + '/instructors', instructor_ids);
    };
    o.removeInstructor = function(section_id, id) {
	return $http.get('/sections/' + section_id + '/instructors/' + id + '/remove');
    };
    o.addManagers = function(section_id, manager_ids) {
	return $http.post('/sections/' + section_id + '/managers', manager_ids);
    };
    o.removeManager = function(section_id, id) {
	return $http.get('/sections/' + section_id + '/managers/' + id + '/remove');
    };
    o.getSelectedSection = function(sectionId) {
	for (var i=0; i<o.sections.length; i++) {
	    if (sectionId == o.sections[i]._id) {
		return o.sections[i];
	    }
	}
	return undefined;
    };
    return o;
}]);
