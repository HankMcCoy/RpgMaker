RPGr.controller('sheetDetail', [
	'$scope',
	'$routeParams',
	'Sheet',
	function ($scope, $routeParams, Sheet) {
	    Sheet.get($routeParams.sheetId, function (sheet) {
	        $scope.sheet = sheet;
	    });
	}]);
