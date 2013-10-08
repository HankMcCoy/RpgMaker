RPGr.factory('System', ['$http', function ($http) {
    var rootUrl = 'api/systems/';

    return {
    	save: function (system) {
    		$http.post(rootUrl, system);
    	},
    	query: function (callback) {
    		$http.get(rootUrl)
    			.success(function (data) {
    				callback(data.systems);
    			});
    	},
    	get: function (systemId, callback) {
    		$http.get(rootUrl + systemId)
    			.success(function (data) {
    				callback(data);
    			});
    	},
    	delete: function (systemId) {
    		$http.delete(rootUrl + systemId);
    	}
    };
}]);
