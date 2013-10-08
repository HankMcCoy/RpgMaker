var RPGr = angular.module('rpgr', [])
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
            .when('/sheets/:sheetId', {
                templateUrl: 'views/partials/sheet-detail',
                controller: 'sheetDetail'
            })
            .otherwise({ redirectTo: '/systems' });
    }]);
