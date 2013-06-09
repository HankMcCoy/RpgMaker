RPGr.controller('systemList', function ($scope, System) {
    System.query(function (data) {
        $scope.systems = data.systems;
    });
});
