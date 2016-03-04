define ['ng-sortable', 'ng-dropdown'], () ->
    app = angular.module('reimApp', ['ngRoute', 'routeResolverServices', 'oc.lazyLoad', 'ng-sortable', 'ng-dropdown']);
    app.config(
        ( #参数过多，换行显示
            $routeProvider
            $locationProvider
            $controllerProvider
            $compileProvider
            $filterProvider
            $provide
            $ocLazyLoadProvider
            routeResolverProvider
        )->
            $ocLazyLoadProvider.config({
                loadedModules: ['reimApp'],
                jsLoader: requirejs
                # files: [] #主模块需要的资源，这里主要子模块的声明文件
            });

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
            .when('/templates/:id', route.resolve('template/List'))
            .when('/', route.resolve('Home'))
            .when('/test/:id', {
                templateUrl: '/static/app/test/test.html'
                controller: 'TestController'
                resolve:
                    done: ($q, $rootScope, $ocLazyLoad, $scope)->
                        def = $q.defer();
     
                        require ['app/test/TestController'], () ->
                            
                            def.resolve()
                           
                        return def.promise;

            })
            .when('/templates', route.resolve('template/list', {
                lazyload: {
                    # name: ['ng-dropdown', 'ng-sortable'],
                    # name: ['ng-dropdown'],
                    files: [
                        # 'js!/static/app/shared/directives/cloud-dropdown/index.js'
                        # 'js!test/test'
                        # 'js!/static/js/libs/Sortable/ng-sortable'
                    ]
                }
            }))
            .when('/company/:id', route.resolve('Company'))
            .when('/404', route.resolve('404'))
            .otherwise({
                redirectTo: '/404'
            })

    ).controller('MainController', ($scope, $route, $routeParams, $location) ->
        $scope.$route = $route
        $scope.$location = $location
        $scope.$routeParams = $routeParams

        $scope.userProfile = window._userProfile_;
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
