define ['app/index'], (app)->
	app.register.controller 'CompanyController', [
		'$scope'
		'$routeParams'
		($scope, $routeParams)->
			setTimeout((args) ->
				$scope.list = [
					'google'
					'baidu'
					'alibaba'
					'tencent'
				]
				$scope.$apply();
			, 1000* 3)
	]

	    