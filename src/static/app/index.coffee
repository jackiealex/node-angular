define(['angular-route'], (ng) ->
    
    console.log(12)
    angular.copy({})

    app = angular.module('reimApp', ['ngRoute']);
    app.controller('MainController', ($scope, $route, $routeParams, $location) ->
        $scope.$route = $route
        $scope.$location = $location
        $scope.$routeParams = $routeParams
        return
    ).config ($routeProvider, $locationProvider) ->

        $locationProvider.html5Mode(true);

        $routeProvider
        .when('/test/:id',
            templateUrl: '/static/views/test.html'
            # controller: 'TestController'
            resolve:
                delay: ($q, $timeout) ->
                    delay = $q.defer()
                    $timeout delay.resolve, 0
                    delay.promise
        )
        .when('/test2/:id',
            templateUrl: '/static/views/test2.html'
            # controller: 'TestController'
            resolve:
                delay: ($q, $timeout) ->
                    delay = $q.defer()
                    $timeout delay.resolve, 0
                    delay.promise
        )
    angular.bootstrap(document, ['reimApp']);


    require(['nicescroll'], ()->
        $("#sideBar .scroller").niceScroll();
    )

)