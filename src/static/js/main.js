// 此版本的requirejs 支持并行加载，顺序执行
require.config({
  	baseUrl: '/static/js',
  	waitSeconds: 20,
    urlArgs: "_s=" +  (new Date()).getTime(),
    paths: {
        'domReady': 'libs/domReady/domReady',
        'angular': 'libs/angular/angular',
        'angular-route': 'libs/angular-route/angular-route',
        'jquery': 'libs/jquery/jquery',
        'nicescroll': 'libs/jquery.nicescroll/jquery.nicescroll.min'
    },
    shim: {
        'angular-route': ['angular']
    },
    // deps: [
    //     '/static/js/mod/test/b.js?delay=3&_r=12312',
    //     '/static/js/mod/test/a.js?delay=3&_r=12',
    //     '/static/js/mod/test/a.js?delay=3&_r=12312333d',
    //     '/static/js/mod/test/a.js?delay=3',
    //     '/static/js/mod/test/c.js?delay=3',
    //     '/static/js/mod/test/a.js?delay=2',
    //     '/static/js/mod/test/b.js?delay=1',
    //     '/static/js/mod/test/a.js?delay=3',
    // ]
    deps: ['jquery', 'angular', '../app/index']
});

