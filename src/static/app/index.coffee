define ['shared/services/routeResolver'], () ->

    app = angular.module('reimApp', ['ngRoute', 'routeResolverServices']);
    app.config(($routeProvider, $locationProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)->

        $locationProvider.html5Mode(true);

        # 挂在系统方法
        app.register = {
            controller: $controllerProvider.register,
            filter: $filterProvider.register,
            directive: $compileProvider.directive,
            factory: $provide.factory,
            service: $provide.service
        };

        route = routeResolverProvider['route'];

        $routeProvider
        .when('/', route.resolve('Home'))
        .when('/test/:id', {
            templateUrl: '/static/app/test/test.html'
            controller: 'TestController'
            resolve:
                done: ($q, $rootScope)->
                    def = $q.defer();
 
                    require ['app/test/TestController'], () ->
                        setTimeout ()->
                            def.resolve()
                        , 100
                        
                    return def.promise;

        })
        .when('/company/:id', route.resolve('Company'))
        .when('/404', route.resolve('404')).
        otherwise {
            redirectTo: '/404'
        }
    ).controller('MainController', ($scope, $route, $routeParams, $location) ->
        $scope.$route = $route
        $scope.$location = $location
        $scope.$routeParams = $routeParams
        return
    );

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
