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
    return o;
}]);
