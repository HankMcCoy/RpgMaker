RPGr.factory('Sheet', ['$http', function ($http) {
    var rootUrl = 'api/sheets/';

    return {
    	save: function (sheet, callback) {
    		$http.post(rootUrl, sheet)
    			.success(callback);
    	},
    	query: function (queryOptions, callback) {
    		if (typeof queryOptions === 'function')
    			callback = queryOptions;

    		$http.get(rootUrl, {
    				systemId: queryOptions.systemId
    			})
    			.success(function (data) {
    				callback(data.sheets);
    			});
    	},
    	get: function (sheetId, callback) {
    		$http.get(rootUrl + sheetId)
    			.success(callback);
    	},
    	delete: function (sheetId) {
    		$http.delete(rootUrl + sheetId);
    	}
    };
}]);
