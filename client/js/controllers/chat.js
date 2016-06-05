angular.module('cleannote').controller('ChatCtrl', [
    '$scope',
    'section',
    'socket',
    'auth',
    function($scope, section, socket, auth) {
	$scope.test = 'hello world';
	socket.emit('join', {'userid': auth.currentUser(), 'roomname': section.course_id + section.section_id});
	$scope.message = '';
	$scope.messages = [];
	$scope.section = section;

	socket.on('join', function(data) {
	    console.log('joined : ' + data);
	});
	socket.on('message', function(data) {
	    console.log('message : ' + data);
	    $scope.messages.push(data);
	});
	$scope.sendMessage = function() {
	    if (!$scope.message || $scope.message === '') return;
	    socket.emit('message', {user: auth.currentUser(), message: $scope.message});
	    $scope.message = '';
	};
    }
]);

angular.module('cleannote')
.directive('schrollBottom', function () {
  return {
    scope: {
      schrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('schrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  };
});
