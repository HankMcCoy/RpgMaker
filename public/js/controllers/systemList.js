RPGr.controller('systemList', function ($scope, System) {
    System.query(function (systems) {
        $scope.systems = systems;
    });

    $scope.addSystem = function () {
        var newSystem = { name: $scope.newSystem };
        System.save(newSystem, function (result) {
            System.get({ systemId: result.id }, function (system) {
                $scope.systems.push(system);
            });
        });
        
        $scope.newSystem = '';
    }

    $scope.destroySystem = function (system, idx) {
        System.delete(system.id);
        $scope.systems.splice(idx, 1);
    }
});
