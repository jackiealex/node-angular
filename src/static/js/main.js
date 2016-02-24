// 此版本的requirejs 支持并行加载，顺序执行
require.config({
  	baseUrl: '/static/js',
  	waitSeconds: 20,
    paths: {
        'domReady': 'libs/requirejs-domready/domReady',
        'angular': 'libs/angular/angular',
        'jquery': 'libs/jquery/jquery',
        'nicescroll': 'libs/jquery.nicescroll/jquery.nicescroll.min'
    },
    shim: {
        'angular': {
            exports: 'ng'
        }
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
    deps: ['angular', 'index']
});

