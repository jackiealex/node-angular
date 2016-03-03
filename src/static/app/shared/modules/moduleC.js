define(['shared/modules/moduleA', 'shared/modules/moduleB'], function (moduleA, moduleB) {
	var module= angular.module('moduleC', ['moduleA', 'moduleB']);
	module.controller('CCC1Controller', function ($scope) {
		console.log('hello');
	})
	.service('CCC2Controller', function ($scope, $q) {
		this.name = '12312';
	})
	.controller('CCC3Controller', ['$scope', '$q', '$timeout',function ($scope, $q) {
		console.log('hello');
	}])
	.directive('hello', function(Car, User) {
	    return {
	        restrict: 'E',
	        template: '<div>Hi there</div>',
	        replace: true
	    };
	})
	.service('User', function () {
		this.sayHello = function () {
			alert(111)
		}
		return this;
	})
	.provider("Animal", function (UserBProvider) {
		this.$get = function () {
			return this;
		}
		this.sayHello = function () {
		}
		this.fdfs = 12
	});

	// angular.bootstrap(document, 'moduleC');
	return module
})