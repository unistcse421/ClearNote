angular.module('cleannote').factory('auth', ['$http', '$window', '$state', function($http, $window, $state) {
    var auth = {};
    auth.saveToken = function(token) {
	$window.localStorage['cleannote-token'] = token;
    };
    auth.getToken = function() {
	return $window.localStorage['cleannote-token'];
    };
    auth.isLoggedIn = function() {
	var token = auth.getToken();
	if (token) {
	    var payload = JSON.parse($window.atob(token.split('.')[1]));
	    return payload.exp > Date.now() / 1000;
	} else {
	    return false;
	}
    };
    auth.currentUser = function() {
	if (auth.isLoggedIn()) {
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));
	    return payload.username;
	}
    };
    auth.register = function(user) {
	return $http.post('/users/register', user).success(function(data) {
	    auth.saveToken(data.token);
	});
    };
    auth.logIn = function(user) {
	return $http.post('/users/login', user).success(function(data) {
	    auth.saveToken(data.token);
	});
    };
    auth.logOut = function() {
	$window.localStorage.removeItem('cleannote-token');
	$state.go('login');
    };
    return auth;
}]);
