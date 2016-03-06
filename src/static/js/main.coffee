# 此版本的requirejs 支持并行加载，顺序执行
require.config({
    baseUrl: '/static/js'
    waitSeconds: 20
    urlArgs: if window._env_ is 'development' then "_s=" + (+new Date) else ''
    paths: {
        # 'domReady': 'libs/domReady/domReady'
        'angular': 'libs/angular/angular'
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

        'ng-dropdown':'/static/app/shared/directives/cloud-dropdown/index',
        'route-resolver': '/static/app/shared/services/routeResolver'
        'angular-ui-router': 'libs/angular-ui-router/release/angular-ui-router'
    }
    shim: {
        'angular': {
            exports: 'angular'
        }
        'angular-ui-router': deps: ['angular']
        # 'ng-sortable': ['sortable']
        'app/index': ['jquery', 'angular-ui-router', 'utils']
    }
    map: {
        'ng-sortable': {
            # './Sortable': 'sortable' this not work
            'Sortable': 'sortable'
        }
    }
    deps: ['app/index']
});
