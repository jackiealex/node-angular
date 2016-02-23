// init global var
require('consolestack') if process.env['NODE_ENV'] == 'development'

require './global'
config = require('./config')
_FN_ENSURE_CONTEXT_ = (options = {}) => {
	GLOBAL_OBJECT['mode'] = _CONST_MODE_ = options['mode'] or process.env['NODE_ENV']
	GLOBAL_OBJECT['_CONST_LOCAL_SERVER_PORT_'] = options['local_server_port'] or if _CONST_MODE_ is 'development' then config['dev_port'] else config['pro_port']
	GLOBAL_OBJECT['_CONST_REMOTE_SERVER_DOMAIN_'] = options['remote_server_name'] or if _CONST_MODE_ is 'development' then config['dev_remote_server_name'] else config['pro_remote_server_name']
	GLOBAL_OBJECT['_CONST_REMOTE_SERVER_NAME_'] = options['remote_server_name'] or if _CONST_MODE_ is 'development' then config['dev_remote_server_name'] else (config['pro_remote_server_ip'] || config['pro_remote_server_name']) 
	GLOBAL_OBJECT['_CONST_STATIC_CDN_'] = options['cdn'] or if _CONST_MODE_ is 'development' then config['dev_static_CDN'] else config['pro_static_CDN']
}
// override
// for env cli control
argv = require('optimist').argv

_FN_ENSURE_CONTEXT_({
	mode: argv['mode']
	local_server_port: argv['port']
	remote_server_name: argv['api']
	cdn: argv['cdn']
})

//forever start  app.js --mode pro --port 9527 --api test.api.591ku.com

AppBaseController = require('./libs/AppBaseController')
Pagelet = require('./libs/pagelet')
api = require('./libs/api')
utils = require('./libs/utils')
 

template = require('evertpl')
fs = require('fs')
bodyParser = require('body-parser')
cookieParser = require('cookie-parser')
session = require('cookie-session')
mkdirp = require('mkdirp')
express = require('express')
_ = require('lodash')
 
_CONST_REMOTE_STATUS_CODE_ = GLOBAL_OBJECT['_CONST_REMOTE_STATUS_CODE_']
_CONST_NODE_ERROR_CODE_ = GLOBAL_OBJECT['_CONST_NODE_ERROR_CODE_']

mkdirp.sync('__temp_upload__')

get_static_md5_content = () ->
	md5_map_content = '{}'
	try{
		md5_map_content = fs.readFileSync('./static/js/md5_map.json')
	}
	catch (e){
		console.log('not production mode', e)
	}
	return md5_map_content

// class definition area
class APP extends AppBaseController {
	constructor(options) {
		template.config({
			src: './views'
			env: GLOBAL_OBJECT['mode']
			local: {
				mode:  GLOBAL_OBJECT['mode']
				api_domain:  GLOBAL_OBJECT['_CONST_REMOTE_SERVER_DOMAIN_']
				static_cdn:  GLOBAL_OBJECT['_CONST_STATIC_CDN_']
				md5_map_content: get_static_md5_content()
			}
		})
		template.helper('whenHappend', utils.whenHappend)
		template.helper('timeFormat', utils.timeFormat)
		template.helper('dateFormat', utils.dateFormat)
		super(options)
	}
}

// init app instance
app = new APP({
	port: GLOBAL_OBJECT['_CONST_LOCAL_SERVER_PORT_']
	mode: GLOBAL_OBJECT['mode']
	assets: [
		{pattern: '/static', root: './static'}
		// {pattern: '/static', root: './output/static'}
		{pattern: '/resource', root: './__temp_upload__'}
		{pattern: '/favicon.ico', root: './static/img/icons/logo.png'}
	]
})

// use middle ware
app.server.disable('x-powered-by');
app.server.use bodyParser.urlencoded({extended: false})
app.server.use bodyParser.json()
app.server.use(cookieParser())

app.server.use session({
	name: 'NYUSS'
	keys: ['rushu']
	// secureProxy: true
	secret: 'you never get the secret'
})

// add access log
app.server.all('/*', (req, res, next) => {
	startTime = new Date
	console.log(startTime, req.path, ' arrive', 'METHOD', req.method)
	res.on('finish', (e) => {
		endTime = new Date
		console.log(endTime, req.path, ' depart ', (endTime - startTime) + 'ms RTT')
	});
	next()
});
  

// not found
app.server.use((req, res, next)=>{
	if(req.query['__pipe__'])
		pagelet = new Pagelet {
			template: 'page/sorry/404.html'
		}
		return pagelet.pipe(res)

	html = template.renderFile 'page/sorry/404.html', {}
	res.send(html)
})

app.server.use((err, req, res, next) =>{
	console.log err
	html = template.renderFile 'page/sorry/5xx.html', {}
	res.send(html)
})
// app start
app.start(()=> {
	console.log(this.options);
	console.log('global: ', GLOBAL_OBJECT);
	console.log('\n浏览器访问：http://localhost:' + this.options.port);
})
	