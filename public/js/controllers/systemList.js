RPGr.controller('systemList', function ($scope, System) {
    System.query(function (data) {
        $scope.systems = data.systems;
    });

    $scope.addSystem = function () {
        var newSystem = { name: $scope.newSystem };
        System.save(newSystem, function (system) {
            $scope.systems.push(system);
        });
        
        $scope.newSystem = '';
    }

    $scope.destroySystem = function (system, idx) {
        System.delete({ systemId: system._id });
        $scope.systems.splice(idx, 1);
    }
});
