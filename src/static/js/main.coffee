# 此版本的requirejs 支持并行加载，顺序执行
require.config({
    baseUrl: '/static/js'
    waitSeconds: 20
    urlArgs: if window._env_ is 'development' then "_s=" + (+new Date) else ''
    paths: {
        # 'domReady': 'libs/domReady/domReady'
        'angular': 'libs/angular/angular'
        'angular-route': 'libs/angular-route/angular-route'
        'jquery': 'libs/jquery/jquery'
        'nicescroll': 'libs/jquery.nicescroll/jquery.nicescroll.min'
        'underscore': 'libs/underscore/underscore-min'
        'shared': '../app/shared/'
        'utils': 'boost/utils'
        # 'plugins': '../plugins'
        # fix me
        # why app for ../app is ok but
        'app': '../app'

        'auto-grow-input': 'libs/jquery.auto-grow-input.min',
        'sortable':'libs/Sortable/Sortable.min',
        'ng-sortable':'libs/Sortable/ng-sortable',
        # 'oclazyLoad':'libs/oclazyload/dist/ocLazyLoad.min',
        'ocLazyLoad':'libs/oclazyload/dist/ocLazyLoad',

        'ng-dropdown':'/static/app/shared/directives/cloud-dropdown/index',
        'route-resolver': '/static/app/shared/services/routeResolver'
    }
    shim: {
        'angular': {
            exports: 'angular'
        }
        'angular-route': {
            deps: ['angular']
        }
        'ocLazyLoad': ['angular']
        # 'ng-sortable': ['sortable']
        'route-resolver': ['ocLazyLoad']
        'app/index': ['jquery', 'angular', 'angular-route', 'utils', 'route-resolver']
    }
    map: {
        'ng-sortable': {
            # './Sortable': 'sortable' this not work
            'Sortable': 'sortable'
        }
    }
    deps: ['app/index']
});
