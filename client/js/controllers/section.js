angular.module('cleannote').controller('SectionCtrl', [
    '$scope',
    '$uibModal',
    'sections',
    'section',
    'users',
    function($scope, $uibModal, sections, section, users) {
	$scope.section = section;
	$scope.users = users;
	$scope.selectStudents = function() {
	    var selectStudentModalInstance = $uibModal.open({
		templateUrl: './partials/selectStudentModal.html',
		controller: 'SelectStudentModalInstanceCtrl',
		scope: $scope
	    });
	    selectStudentModalInstance.result.then(function(data) {
		sections.addStudents($scope.section._id, data).then(function(res) {
		    console.log(res.data);
		    $scope.section = res.data;
		});
	    });
	    $scope.modalInstance = selectStudentModalInstance;
	};

	$scope.selectInstructors = function() {
	    var selectInstructorModalInstance = $uibModal.open({
		templateUrl: './partials/selectInstructorModal.html',
		controller: 'SelectInstructorModalInstanceCtrl',
		scope: $scope
	    });
	    selectInstructorModalInstance.result.then(function(data) {
		sections.addInstructors($scope.section._id, data).then(function(res) {
		    $scope.section = res.data;
		});
	    });
	    $scope.modalInstance = selectInstructorModalInstance;
	};

	$scope.selectManagers = function() {
	    var selectManagerModalInstance = $uibModal.open({
		templateUrl: './partials/selectManagerModal.html',
		controller: 'SelectManagerModalInstanceCtrl',
		scope: $scope
	    });
	    selectManagerModalInstance.result.then(function(data) {
		sections.addManagers($scope.section._id, data).then(function(res) {
		    $scope.section = res.data;
		});
	    });
	    $scope.modalInstance = selectManagerModalInstance;
	};

	// $scope.select

	$scope.removeStudent = function(id) {
	    sections.removeStudent($scope.section._id, id).then(function(res) {
		$scope.section = res.data;
	    });
	};
	$scope.removeInstructor = function(id) {
	    sections.removeInstructor($scope.section._id, id).then(function(res) {
		$scope.section = res.data;
	    });
	};
	$scope.removeManager = function(id) {
	    sections.removeManager($scope.section._id, id).then(function(res) {
		$scope.section = res.data;
	    });
	};
    }
]);

angular.module('cleannote').controller('SelectStudentModalInstanceCtrl', [
    '$scope',
    function($scope) {
	$scope.search = '';
	$scope.students = $scope.users.users;
	$scope.users.getAll();
	$scope.selections = {students: {}};
	$scope.$watch('selections.students', function(n) {
	    for (var k in n)
		if (n.hasOwnProperty(k) && !n[k])
		    delete n[k];
	}, true);
	$scope.ok = function() {
	    $scope.modalInstance.close(Object.keys($scope.selections.students));
	};
	$scope.cancel = function() {
	    $scope.modalInstance.dismiss();
	};
    }
]);


angular.module('cleannote').controller('SelectInstructorModalInstanceCtrl', [
    '$scope',
    function($scope) {
	$scope.search = '';
	$scope.instructors = $scope.users.users;
	$scope.users.getAll();
	$scope.selections = {instructors: {}};
	$scope.$watch('selections.instructors', function(n) {
	    for (var k in n)
		if (n.hasOwnProperty(k) && !n[k])
		    delete n[k];
	}, true);
	$scope.ok = function() {
	    $scope.modalInstance.close(Object.keys($scope.selections.instructors));
	};
	$scope.cancel = function() {
	    $scope.modalInstance.dismiss();
	};
    }
]);

angular.module('cleannote').controller('SelectManagerModalInstanceCtrl', [
    '$scope',
    function($scope) {
	$scope.search = '';
	$scope.managers = $scope.users.users;
	$scope.users.getAll();
	$scope.selections = {managers: {}};
	$scope.$watch('selections.managers', function(n) {
	    for (var k in n)
		if (n.hasOwnProperty(k) && !n[k])
		    delete n[k];
	}, true);
	$scope.ok = function() {
	    $scope.modalInstance.close(Object.keys($scope.selections.managers));
	};
	$scope.cancel = function() {
	    $scope.modalInstance.dismiss();
	};
    }
]);
