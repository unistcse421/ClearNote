angular.module('cleannote').controller('SectionCtrl', [
    '$scope',
    'sections',
    'section',
    function($scope, sections, section) {
	$scope.section = section;
    }
]);
