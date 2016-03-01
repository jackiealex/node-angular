define ['app/index'], (app)->
	app.register.controller '404Controller', [
		'$scope'
		($scope)->
			debugger 
	]