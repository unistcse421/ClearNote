angular.module('cleannote').controller('MainCtrl', [
    '$scope',
    '$uibModal',
    'sections',
    'cards',
    'todos',
    function($scope, $uibModal, sections, cards, todos) {
	$scope.sections = sections.sections;
	$scope.cards = cards.cards;
	$scope.todos = todos.todos;
	$scope.showAddSectionModal = function() {
	    var addSectionModalInstance = $uibModal.open({
		templateUrl: './partials/addSectionModal.html',
		controller: 'AddSectionModalInstanceCtrl',
		scope: $scope
	    });
	    addSectionModalInstance.result.then(function(data) {

	    });
	    $scope.modalInstance = addSectionModalInstance;
	};
	$scope.showAddCardModal = function() {
	    var addCardModalInstance = $uibModal.open({
		templateUrl: './partials/addCardModal.html',
		controller: 'AddCardModalInstanceCtrl',
		scope: $scope
	    });
	    addCardModalInstance.result.then(function(data) {

	    });
	    $scope.modalInstance = addCardModalInstance;
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

angular.module('cleannote').controller('AddSectionModalInstanceCtrl', [
    '$scope',
    'sections',
    function($scope, sections) {
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
	$scope.ok = function() {
	    $scope.modalInstance.close();
	    $scope.addSection();
	};
	$scope.cancel = function() {
	    $scope.modalInstance.dismiss();
	};
    }
]);

angular.module('cleannote').controller('AddCardModalInstanceCtrl', [
    '$scope',
    'cards',
    function($scope, cards) {
	$scope.addCards = function() {
	    if (!$scope.card_title || $scope.card_title === '') {return;}
	    if (!$scope.card_content || $scope.card_content === '') {return;}
	    if (!$scope.card_type || $scope.card_type === '') {return;}
	    cards.create({
		card_type: $scope.card_type,
		title: $scope.card_title,
		content: $scope.card_content,
	    });
	    $scope.card_type = '';
	    $scope.card_title = '';
	    $scope.card_content = '';
	};
	$scope.ok = function() {
	    $scope.modalInstance.close();
	    $scope.addCards();
	};
	$scope.cancel = function() {
	    $scope.modalInstance.dismiss();
	};
    }
]);
