var app = angular.module('cleannote', ['ui.router', 'ui.bootstrap']);

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
	})
	.state('chat', {
	    url: '/chat/{id}',
	    templateUrl: './partials/chat.html',
	    controller: 'ChatCtrl',
	    resolve: {
	    	section: ['$stateParams', 'sections', function($stateParams, sections) {
	    	    return sections.get($stateParams.id);
	    	}]
	    }
	});
	$urlRouterProvider.otherwise('login');
    }
]);
