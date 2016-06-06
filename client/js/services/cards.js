angular.module('cleannote').factory('cards', ['$http', 'auth', function($http, auth) {
    var o = {
	sectionId: '',
	edit_auth: false,
	cards: []
    };
    o.getAll = function(sectionId) {
	o.sectionId = sectionId;
	if (!sectionId || sectionId === '') {
	    return $http.get('/cards', {
		headers: {Authorization: 'Bearer ' + auth.getToken()}
	    }).success(function(data) {
		o.edit_auth = false;
		angular.copy(data, o.cards);
	    });
	}
	return $http.get('/sections/' + sectionId + '/cards', {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    o.edit_auth = data.edit_auth;
	    angular.copy(data.cards, o.cards);
	});
    };
    o.create = function(card) {
	if (!o.sectionId || o.sectionId === '') return;
    	return $http.post('/sections/' + o.sectionId + '/cards', card, {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    o.cards.unshift(data);
	});
    };
    o.get = function(id) {
	return $http.get('/cards/' + id).then(function(res) {
	    return res.data;
	});
    };
    o.addComment = function(id, comment) {
	return $http.post('/cards/' + id + '/comments', comment, {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	});
    };

    return o;
}]);
