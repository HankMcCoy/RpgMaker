RPGr.controller('systemDetail', [
	'$scope',
	'$routeParams',
	'System',
	'Sheet',
	function ($scope, $routeParams, System, Sheet) {
	    System.get($routeParams.systemId, function (system) {
	        $scope.system = system;
	    });
	    Sheet.query({ systemId: $routeParams.systemId }, function (sheets) {
	    	$scope.sheets = sheets;
	    });

	    $scope.addSheet = function () {
	        var newSheet = {
	        	systemId: $scope.system.id,
	        	name: $scope.newSheet
	        };
	        Sheet.save(newSheet, function (result) {
	            Sheet.get(result.id, function (sheet) {
	                $scope.sheets.push(sheet);
	            });
	        });
	        
	        $scope.newSheet = '';
	    };

	    $scope.destroySheet = function (sheet, idx) {
      	  Sheet.delete(sheet.id);
      	  $scope.sheets.splice(idx, 1);
	    };
	}]);
