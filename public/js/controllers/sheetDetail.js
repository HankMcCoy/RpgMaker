RPGr.controller('sheetDetail', [
	'$scope',
	'$routeParams',
	'Sheet',
	function ($scope, $routeParams, Sheet) {
			Sheet.get($routeParams.sheetId, function (sheet) {
					$scope.sheet = sheet;
			});

			dragn.init({
				getDragElement: function (dragTarget) {
					var dragElement;
					if (dragTarget.className.split(' ').indexOf('sheet-text-box') !== -1) {
						dragElement = document.createElement('div');
						dragElement.className = 'drag-box';
						return null;
						return dragElement;
					}
				}
			});
	}]);
