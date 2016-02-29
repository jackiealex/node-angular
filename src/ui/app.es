// import node module
import path from 'path'

// import 3rd part module
import express from 'express'
import _ from 'lodash'
import colors from 'colors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'cookie-session'

// import self-defined module
import renderer from './libs/renderer'
import api from './libs/api'

import CONFIG from './config/index'

// conditionally import for the developer
(function (NODE_ENV) {
	if(NODE_ENV === 'development') {
		require('colors');
	}
})(process.env['NODE_ENV'])

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

		gaze.on('all', (action, file_name)=>{
			console.log(file_name, ' changed');
			var root = path.resolve(__dirname, '../', '');
			this.io.emit('reload', file_name.replace(root, ''), action);
		});
	}
	initialize() {
		// init server
		this.server = express();

		// add middleware
		this.server.use(bodyParser.urlencoded({extended: false}))
		this.server.use(bodyParser.json())
		this.server.use(cookieParser())
		this.server.use(session({
			name: 'CBXUSS',
			keys: ['cloudbaoxiao.com', 'rushu.com'],
			// secureProxy: true
			secret: 'you never get the secret'
		}));

		//init delay lab
		const delayLab = this.options.delayLab
		this.addDelayLab(delayLab['pattern'], delayLab['dir']);

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
	addDelayLab(pattern, dir) {
		this.server.use(pattern, (req, res, next)=> {
			let delay = req.query.delay || 0

			if(!delay) {
				return next();
			}

			let file_path_name = path.join(dir, req.path);
			
			var fs = require('fs');

			delay = delay * 1000;
			console.log(`${file_path_name} is delay-test: delay ms`.green);

			fs.readFile(file_path_name, 'utf8', (err, str)=>{
				setTimeout(()=>{
					res.send(str);	
				}, delay);
			})
		})
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
	delayLab: {
		pattern: '/static',
		dir: './static'
	},
	assets: [
		{pattern: '/static', dir: './static'},
		{pattern: '/favicon.ico', dir: './static/favicon.ico'}
	]
});

app.server.get('/login', (req, res)=>{
	res.render('login.html');
});

app.server.post('/passport', (req, res)=>{
	var username = req.body['uid'];
	var password = req.body['uid'];
	api.request({
		method: 'POST',
		pathname: '/users/0',
		headers: {
			'Authorization': 'Bearer ' + req.cookies['access_token']
		},
		query: {
			grant_type: 'password',
			client_id: 'w2Dl7oc0CimMq1yFtLDcdFVBKWEeIjwTr1wRLngd',
			client_secret: 'nWx8llO9LmZdxek2g8K7nc6mnWC9rmW1dOEoQ5An',
			username: username,
			password: password
		}
	}).done((rs)=>{
		if(rs['node_code']>=0) {
			res.redirect('/');
		} else {
			res.redirect('/login?code='+rs['code']);
		}
	});
});


app.server.get('*', (req, res)=>{
	// check is the user is login successfully by using api get its profile, if the use go the page directly
	api.request({
		pathname: '/users/0',
		headers: {
			'Authorization': 'Bearer ' + req.cookies['access_token']
		}
	}).done((rs)=>{
		if(rs['node_code']>0) {
			res.render('index.html', {profile_string: JSON.stringify(rs.data)});
		} else {
			res.redirect('/login');
		}
	});
})