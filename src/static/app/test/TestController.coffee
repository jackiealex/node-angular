define ['app/index'], (app)->
	app.register.controller 'TestController', [
		'$scope'
		'$routeParams'
		($scope, $routeParams)->
			# mock ajax
			setTimeout((args) ->
				$scope.list = [
					'google'
					'baidu'
					'alibaba'
					'tencent'
				]
				$scope.a = 'ffff'
				$scope.b = 'bbbb'

				# do apply when ajax is ended
				$scope.$apply()
				
				
			, 1000* 3)
	]

