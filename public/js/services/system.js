angular.module('rpgr.services', ['ngResource'])
    .factory('System', function ($resource) {
        return $resource('api/systems/:systemId', {}, {
            query: { method: 'GET', isArray: false }
        }); 
    });
