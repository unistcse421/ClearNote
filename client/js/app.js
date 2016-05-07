require('angular');
require('angular-ui-router');

var app = angular.module('cleannote', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('home', {
	    url: '/home?sectionId',
	    templateUrl: './partials/home.html',
	    controller: 'MainCtrl',
	    resolve: {
		sectionPromise : ['sections', '$stateParams', function(sections, $stateParams) {
		    return sections.getAll($stateParams.sectionId);
		}],
		cardPromise : ['cards', '$stateParams', function(cards, $stateParams) {
		    return cards.getAll($stateParams.sectionId);
		}],
		todoPromise : ['todos', function(todos) {
		    return todos.getAll();
		}]
	    }
	})
	.state('cards', {
	    url: '/cards/{id}',
	    templateUrl: './partials/cards.html',
	    controller: 'CardsCtrl',
	    resolve: {
		card: ['$stateParams', 'cards', function($stateParams, cards) {
		    return cards.get($stateParams.id);
		}]
	    }
	})
	.state('login', {
	    url: '/login',
	    templateUrl: './partials/login.html',
	    controller: 'AuthCtrl',
	    onEnter: ['$state', 'auth', function($state, auth) {
		if (auth.isLoggedIn()) {
		    $state.go('home');
		}
	    }]
	})
	.state('register', {
	    url: '/register',
	    templateUrl: './partials/register.html',
	    controller: 'AuthCtrl',
	    onEnter: ['$state', 'auth', function($state, auth) {
		if (auth.isLoggedIn()) {
		    $state.go('home');
		}
	    }]
	})
	.state('sections', {
	    url: '/sections/{id}',
	    templateUrl: './partials/sections.html',
	    controller: 'SectionCtrl',
	    resolve: {
	    	section: ['$stateParams', 'sections', function($stateParams, sections) {
	    	    return sections.get($stateParams.id);
	    	}]
	    }
	});
	$urlRouterProvider.otherwise('login');
    }
]);

app.factory('auth', ['$http', '$window', '$state', function($http, $window, $state) {
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

app.factory('sections', ['$http', 'auth', function($http, auth) {
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

app.factory('cards', ['$http', 'auth', function($http, auth) {
    var o = {
	sectionId: '',
	cards: []
    };
    o.getAll = function(sectionId) {
	o.sectionId = sectionId;
	if (!sectionId || sectionId === '') {
	    return $http.get('/cards').success(function(data) {
		angular.copy(data, o.cards);
	    });
	}
	return $http.get('/sections/' + sectionId + '/cards').success(function(data) {
	    angular.copy(data, o.cards);
	});
    };
    o.create = function(card) {
	if (!o.sectionId || o.sectionId === '') return;
    	return $http.post('/sections/' + o.sectionId + '/cards', card, {
	    headers: {Authorization: 'Bearer ' + auth.getToken()}
	}).success(function(data) {
	    o.cards.push(data);
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

app.factory('todos', ['$http', 'auth', function($http, auth) {
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

app.controller('MainCtrl', ['$scope', 'sections', 'cards', 'todos', function($scope, sections, cards, todos) {
    $scope.sections = sections.sections;
    $scope.cards = cards.cards;
    $scope.todos = todos.todos;
    $scope.addSection = function() {
	if(!$scope.course_id || $scope.course_id === '') { return; }
	if(!$scope.section_id || $scope.section_id === '') { return; }
	if(!$scope.semester || $scope.semester === '') { return; }
	if(!$scope.year || $scope.year === '') { return; }
	if(!$scope.course_name || $scope.course_name === '') { return; }
	sections.create({
	    course_id: $scope.course_id,
	    section_id: $scope.section_id,
	    semester: $scope.semester,
	    year: $scope.year,
	    course_name: $scope.course_name
	});
	$scope.course_id = '';
	$scope.section_id = '';
	$scope.semester = '';
	$scope.year = '';
	$scope.course_name = '';
    };
    $scope.addCards = function() {
	if (!$scope.card_title || $scope.card_title === '') {return;}
	if (!$scope.card_content || $scope.card_content === '') {return;}
	cards.create({
	    card_type: $scope.card_type,
	    title: $scope.card_title,
	    content: $scope.card_content,
	});
	$scope.card_type = '';
	$scope.card_title = '';
	$scope.card_content = '';
    };
    $scope.addTodo = function() {
	if (!$scope.todo_task || $scope.todo_task === '') { return; }
	todos.create({
	    task: $scope.todo_task
	});
	$scope.todo_task = '';
    };
    $scope.finishTask = function(todo) {
	todos.finish(todo);
    };
    $scope.undoTask = function(todo) {
	todos.undo(todo);
    };
}]);

app.controller('CardsCtrl', ['$scope', '$stateParams', 'cards', 'card', function($scope, $stateParams, cards, card) {
    $scope.card = card;
    $scope.addComment = function() {
	if ($scope.body === '') { return; }
	cards.addComment(card._id, {
	    body: $scope.body,
	    author: 'user'
	}).success(function(comment) {
	    $scope.card.comments.push(comment);
	});
	$scope.body = '';
    };
}]);

app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth) {
	$scope.user = {};
	$scope.register = function() {
	    auth.register($scope.user).error(function(error) {
		$scope.error = error;
	    }).then(function() {
		$state.go('home');
	    });
	};
	$scope.logIn = function() {
	    auth.logIn($scope.user).error(function(error) {
		$scope.error = error;
	    }).then(function() {
		$state.go('home');
	    });
	};
    }
]);

app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
    }
]);

app.controller('SectionCtrl', [
    '$scope',
    'sections',
    'section',
    function($scope, sections, section) {
	$scope.section = section;
    }
]);
