define ['app/index'], (app)->
	# !!!
	# 当Controller加载失败，看看静态资源路径和Controller名字是否正确（XXXController)
	app.register.controller 'DemoController', [
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

	    