angular.module('cleannote').factory('users', ['$http', function($http) {
    var o = {
	users: []
    };
    o.getAll = function() {
	return $http.get('/users').success(function(data) {
	    angular.copy(data, o.users);
	    console.log('getAll : ' + o.users);
	});
    };
    return o;
}]);
