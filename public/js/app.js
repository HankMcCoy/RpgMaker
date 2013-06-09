var RPGr = angular.module('rpgr', ['rpgr.services'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/systems', {
                templateUrl: 'views/partials/system-list',
                controller: 'systemList'
            })
            .when('/systems/:systemId', {
                templateUrl: 'views/partials/system-detail',
                controller: 'systemDetail'
            })
            .otherwise({ redirectTo: '/systems' });
    }]);
