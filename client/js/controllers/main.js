angular.module('cleannote').controller('MainCtrl', [
    '$scope',
    'sections',
    'cards',
    'todos',
    function($scope, sections, cards, todos) {
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
