angular.module('cleannote').controller('CardsCtrl', ['$scope', '$stateParams', 'cards', 'card', function($scope, $stateParams, cards, card) {
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
