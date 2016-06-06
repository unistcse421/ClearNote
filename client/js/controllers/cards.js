angular.module('cleannote').controller('CardsCtrl', [
    '$scope',
    '$stateParams',
    'cards',
    'card',
    function($scope, $stateParams, cards, card) {
	$scope.card = card;
	$scope.addComment = function() {
	    if ($scope.body === '') { return; }
	    cards.addComment(card._id, {
		body: $scope.body
	    }).success(function(comment) {
		$scope.card.comments.push(comment);
	    });
	    $scope.body = '';
	};
	$scope.addMemo = function() {
	    if ($scope.memoBody === '') { return; }
	    cards.addMemo(card._id, {
		body: $scope.memoBody
	    }).success(function(memo) {
		$scope.card.memos.push(memo);
	    });
	    $scope.memoBody = '';
	};
    }
]);
