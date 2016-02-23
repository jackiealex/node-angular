(function() {
    function doHotLoad(file) {
        var ext = file.substr(file.lastIndexOf('.'));
        switch(ext) {
            // fix me for hot reload
            case '.coffee':
            case '.js':
                file = file.replace('.coffee', '.js');
                var script = document.querySelector('script[src^="'+file+'"]');
                script.src = file + '?_r=' + +new Date;
                console.log(file, ' updated');
                break;
            case '.styl':
            case '.css':
                file = file.replace('.styl', '.css');
                var link = document.querySelector('link[href^="'+file+'"]');
                link.href = file + '?_r=' + +new Date;
                console.log(file, ' updated');
                break;
            default:
                var img = new Image()
                var src =  file + '?_r=' + +new Date;
                img.onload = function (e) {
                    var imgs = document.querySelectorAll('img[src^="'+file+'"]');
                    for (var i = imgs.length - 1; i >= 0; i--) {
                        imgs[i].src= src;
                    }
                    console.log(file, ' updated');
                }
                img.src = src;

        }
    }

    window.__getSocketSingleton__ = function() {
        if(window.socket) {
            return window.socket;
        }
        var socket = window.socket = io.connect('http://' + location.host, {
            transports: [
                'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
            ]
        });
        
        return socket;
    };
    
    var socket = __getSocketSingleton__();

    socket.on('connect', function() {
        console.log('connected');
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
    });
    
    socket.on('reload', function(file, action) {
        doHotLoad(file)
        // window.location.reload();
    });

    socket.on('push', function(data) {
    });

    return __getSocketSingleton__();
}());