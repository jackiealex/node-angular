define([], function () {
	var module = angular.module('moduleB', [])
	module.controller('BBB1Controller', function ($scope) {
		console.log('111');
	})
	.controller('BBB2Controller', function ($scope) {
		console.log('111');
	})
	.provider('UserB', function () {
		this.$get = function () {
		}

		this.ssdd = 121
	})
	return module
})