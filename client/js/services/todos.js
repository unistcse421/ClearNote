angular.module('cleannote').factory('todos', ['$http', 'auth', function($http, auth) {
    var o = {
	todos: []
    };
    o.getAll = function() {
	return $http.get('/todos').success(function(data) {
	    angular.copy(data, o.todos);
	});
    };
    o.create = function(todo) {
	return $http.post('/todos', todo, {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    o.todos.push(data);
	});
    };
    o.finish = function(todo) {
	return $http.put('/todos/' + todo._id + '/finish', null, {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    todo.done = true;
	});
    };
    o.undo = function(todo) {
	return $http.put('/todos/' + todo._id + '/undo', null, {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    todo.done = false;
	});
    };
    return o;
}]);
