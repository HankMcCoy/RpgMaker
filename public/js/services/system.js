angular.module('rpgr.services', ['ngResource'])
    .factory('System', function ($resource) {
        return $resource('api/systems/:systemId', { systemId: '@id' }, {
            query: { method: 'GET', isArray: false }
        });
    });
