define ['app/services/routeResolver'], () ->

    app = angular.module('reimApp', ['ngRoute', 'routeResolverServices']);
    app.config( ($routeProvider, $locationProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)->

        $locationProvider.html5Mode(true);

        # 挂在系统方法
        app.register = {
            controller: $controllerProvider.register,
            filter: $filterProvider.register,
            directive: $compileProvider.directive,
            factory: $provide.factory,
            service: $provide.service
        };

        route = routeResolverProvider.route;

        $routeProvider
        .when('/test/:id',
            templateUrl: '/static/views/test.html'
            controller: 'TestController'
            resolve:
                delay: ($q, $timeout) ->
                    console.log('page end', +new Date)
                    delay = $q.defer()
                    $timeout delay.resolve, 0
                    delay.promise
                resolver: ()->
                    return;
                    require ['app/controllers/TestController'], (Controller) ->
                    
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
        .when('/company/:id', route.resolve('Company'))
        
    ).controller('MainController', ($scope, $route, $routeParams, $location) ->
        $scope.$route = $route
        $scope.$location = $location
        $scope.$routeParams = $routeParams
        return
    );

    app.controller('TestController', [
        "$scope"
        ($scope) ->
            $scope.a = 12;
            $scope.onClick = ()->
                $scope.a = 'a' + +Date.now()
    ]);

    angular.bootstrap(document, ['reimApp']);

    _bindEvents_ = ()=>
        $(window).on 'resize', ()=>
            sideBarHeight = $(window).height() - $('#header').height();
            $('#sideBar').height(sideBarHeight);
            $('#main').css({'min-height': sideBarHeight});
        $(window).trigger('resize');

        $('.header-logo').on 'click', (e)->
            if $('#header').hasClass('collapse')
                return $('#header, #main').removeClass('collapse')
            $('#header, #main').addClass('collapse');

    require ['nicescroll'], ()->
        _bindEvents_()
        $("#sideBar").niceScroll();

    return app
