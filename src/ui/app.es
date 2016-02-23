// import node module
import path from 'path';

// import 3rd part module
import express from 'express';
import _ from 'lodash';

// import self-defined module
import renderer from './libs/renderer'

// config
const CONFIG = (() => {
	let config = null;

	if(process.env['NODE_ENV'] === 'development') {
		config = require('../config/dev');
	} else {
		config = require('../config');
	}
	// console.log(process.env['NODE_ENV'], CONFIG);
	return config
})();

/**
 * define class Application
 */
class Application {
	constructor(options) {
		this.options = _.extend({
			http_port: 8080,
			engine: 'ejs',
			views: './views',
			assets: [],
		}, options);
		
		this.port = CONFIG['http_port'];

		this.initialize();
		this.watch();

		this.start();
	}
	watch() {
		if(process.env['NODE_ENV']  !== 'development') {
			return
		}

		var Gaze = require('gaze');
		var target_files = CONFIG['watcher']['static'] || [];
		var gaze = new Gaze(target_files, {
			mode: 'poll',
			debounceDelay: 1000
		});

		console.log(target_files)

		gaze.on('all', (action, file_name)=>{
			console.log(file_name, ' changed');
			var root = path.resolve(__dirname, '../', '');
			this.io.emit('reload', file_name.replace(root, ''), action);
		});
	}
	initialize() {
		// init server
		this.server = express();

		// init static from assets
		const assets = this.options['assets'];
		for(let item of assets) {
			this.addStaticRoute(item['pattern'], item['dir'])
		}

		// set template engine
		switch(this.options['engine']) {
			case 'ejs':
				this.server.set('view engine', 'ejs'); 
				this.server.engine('html', require('ejs').renderFile);
				break;
			default:
				this.server.engine('html', this.options['engine']);
				break
		}
	}
	addStaticRoute (pattern, dir) {
		this.server.use(pattern, express.static(dir));
		this.server.use(pattern, (req, res, next)=>{

			let delay = req.query.delay || 0

			let ext = path.extname(req.path)
			let file_path_name = req.path

			switch (ext) {
				case '.js':
					var ext_from = '.coffee'
					var ext_to = '.js'
					var content_type = 'application/javascript'
					var origin_coffee_file = path.join(dir, file_path_name).replace(ext_to, ext_from)

					renderer.compile_coffee( origin_coffee_file, (str)=>{
						console.log('memory ', origin_coffee_file)
						res.send(str)
					})
					break;

				case '.css':
					var ext_from = '.styl'
					var ext_to = '.css'
					var content_type = 'text/css'

					res.type(content_type)

					var origin_stylus_file = path.join(dir, file_path_name).replace(ext_to, ext_from)
					renderer.compile_stylus(origin_stylus_file, (str)=>{
						console.log('memory ', origin_stylus_file)
						res.send(str)
					})
					break;

				default:
					next('Error file ' + file_path_name + ' not found')
					break;

			}
		})
	}
	start() {
		var server = require('http').Server(this.server);

		var io = this.io = require('socket.io')(server)

		io.on('connection', (socket)=>{

			console.log('connected')

		});

		server.listen(this.port, ()=>{
			console.log('app started on port', this.port)
		});
	}
}

var app = new Application({
	http_port: CONFIG['http_port'],
	views: './views',
	engine: 'ejs',
	assets: [
		{pattern: '/static', dir: './static'},
		{pattern: '/favicon.ico', dir: './static/favicon.ico'}
	]
});

app.server.get('/', (req, res)=>{
	res.render('index.html');
})