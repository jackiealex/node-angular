define ['app/index'], (app)->
	
	app.register.controller 'TemplateController', [
		'$scope'
		($scope)->
			$scope.a ='123'
			# $scope.$apply()
			
	]
