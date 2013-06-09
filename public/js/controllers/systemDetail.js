RPGr.controller('systemDetail', function ($scope, $routeParams, System) {
    System.get({ systemId: $routeParams.systemId }, function (system) {
        $scope.system = system;
    });
});
