define ['angularAMD', 'angular-ui-router', 'ui-router-extras-future'], (angularAMD)->
    app = angular.module('reimApp', ['ui.router', 'ct.ui.router.extras.future']);
    app.config(
        ( #参数过多，换行显示
            $urlRouterProvider
            $locationProvider
            $stateProvider
            $futureStateProvider
        )->

            loadAndRegisterFutureStates = ($http, $q)->
                state = {
                    "urlPrefix": "/xx",
                    "stateName": "hello",
                    "type": "ngload",
                    "src": "app/shared/modules/moduleA"
                }
                $futureStateProvider.futureState state
                return $q.when(state);
            ngloadStateFactory = ($q, futureState)->
                def = $q.defer();
                debugger
                require ["ngload!" + futureState.src, 'ngload', 'angularAMD'], (result, ngload, angularAMD)->
                    debugger
                    angularAMD.processQueue();
                    def.resolve(undefined);
                return def.promise;

            $futureStateProvider.stateFactory('ngload', ngloadStateFactory);
            $futureStateProvider.addResolve(loadAndRegisterFutureStates);

            $urlRouterProvider.otherwise("/404", {
                templateUrl: "/static/app/404/index.html"    
            });
            $locationProvider.html5Mode(true)
            # 挂在系统方法
            $stateProvider
            .state('state1', {
                url: "/state1222",
                templateUrl: "/static/app/test/test.html"
            })
            .state('hello', {
                url: "/world",
                templateUrl: "/static/app/test/sortable.html"
            })
            .state('state2', {
                url: "/list/223",
                templateUrl: "/static/app/test/test.html"
                controller: ($scope)->
                    $scope.things = ["A", "Set", "Of", "Things"];
            })
            .state('state2.xxx', {
                url: "/22333/ffufufu",
                templateUrl: "/static/app/test/test.html"
                controller: ($scope)->
                    $scope.things = ["A", "Set", "Of", "Things"];
            });

    ).controller('MainController', ($scope)->
        $scope.userProfile = {nickname: 'alex'};
    )

    angularAMD.bootstrap(app);

    _bindEvents_ = ()=>
        $(window).on 'resize', ()=>
            sideBarHeight = $(window).height();
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
