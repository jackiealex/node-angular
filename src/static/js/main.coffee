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

        'auto-grow-input': 'libs/jquery.auto-grow-input.min'
        'sortable':'libs/Sortable/Sortable.min'
        'ng-sortable':'libs/Sortable/ng-sortable'
        # 'oclazyLoad':'libs/oclazyload/dist/ocLazyLoad.min',

        'ng-dropdown':'/static/app/shared/directives/cloud-dropdown/index'
        
        # angular
        "ngload": 'libs/angularAMD/ngload',
        "angularAMD": 'libs/angularAMD/angularAMD',
        "ngload": 'libs/ngload/ngload',
        'angular-ui-router': 'libs/angular-ui-router/release/angular-ui-router'
        'ui-router-extras-future': 'libs/ui-router-extras/release/modular/ct-ui-router-extras.future'
        'ui-router-extras-core': 'libs/ui-router-extras/release/modular/ct-ui-router-extras.core'
    }
    shim: {
        'angular': {
            exports: 'angular'
        }
        'angularAMD': 'angular'
        'ngload': 'angularAMD'
        'angular-ui-router': 'angular'
        "ui-router-extras-core": "angular"
        "ui-router-extras-future": ["angular", "ui-router-extras-core"]

        'app/index': ['jquery', 'angular', 'utils']
    }
    map: {
        'ng-sortable': {
            # './Sortable': 'sortable' this not work
            'Sortable': 'sortable'
        }
    }
    deps: ['app/index']
});
