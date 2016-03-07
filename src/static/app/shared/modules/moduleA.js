define(['angular-ui-router', 'ng-sortable'], function () {
	var module = angular.module('moduleA', ['ui-router', 'ng-srtable']);
	module.config(['$stateProvider', function ($stateProvider) {
	    $stateProvider.state({
	    	name: 'hello',
	    	url: "/world",
	    	templateUrl: "/static/app/test/sortable.html",
	    	controller: function ($scope) {
	    		
	    	}
	    })
	}]);
	return {
		// mainState: mainState,
		module: module
	}
})