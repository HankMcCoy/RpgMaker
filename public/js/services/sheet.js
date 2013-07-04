angular.module('rpgr.services', ['ngResource'])
    .factory('Sheet', function ($resource) {
        return $resource('api/sheets/:sheetId', { systemId: '@id' }, {
            query: { method: 'GET', isArray: false }
        });
    });
