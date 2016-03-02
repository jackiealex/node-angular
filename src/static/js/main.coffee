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
        'shared': '../app/shared/'
        # why app for ../app is ok but
        'app': '../app'
        'auto-grow-input': 'libs/jquery.auto-grow-input.min',
        'sortable':'libs/Sortable/Sortable.min',
        'ng-sortable':'libs/ng-sortable/ng-sortable',
        'oc.lazyLoad':'libs/oclazyload/dist/ocLazyLoad.min',
    }
    shim: {
        'angular': {
            exports: 'angular'
        }
        'angular-route': {
            deps: ['angular']
        }
        'oc.lazyLoad': ['sortable']
        'ng-sortable': ['sortable']
        'app/index': ['jquery', 'angular', 'angular-route', 'oc.lazyLoad']
    }
    deps: ['app/index']
});