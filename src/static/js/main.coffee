# 此版本的requirejs 支持并行加载，顺序执行
require.config({
    baseUrl: '/static/js'
    waitSeconds: 20
    urlArgs: "_s=" + (+new Date)
    paths: {
        'domReady': 'libs/domReady/domReady'
        'angular': 'libs/angular/angular'
        'angular-route': 'libs/angular-route/angular-route'
        'jquery': 'libs/jquery/jquery'
        'nicescroll': 'libs/jquery.nicescroll/jquery.nicescroll.min'
    }
    shim: {
        'angular': {
            exports: 'angular'
        }
        'angular-route': {
            deps: ['angular']
        }
        'app/index': ['jquery', 'angular', 'angular-route']
    }
    deps: ['app/index']
});