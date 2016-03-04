define ['app/index'], (app)->
	
	app.register.controller 'Test2Controller', [
		'$scope'
		($scope)->
			$scope.$apply()
			
	]
