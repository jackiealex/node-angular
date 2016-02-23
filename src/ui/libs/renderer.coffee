fs = require 'fs'
Q = require 'q'
_ = require 'lodash'

_storeCache = {}

get_content = (path, cache) ->
	def = Q.defer()

	if cache
		if _storeCache[path]
			def.resolve _storeCache[path]
	else
		fs.readFile path, 'utf8', (err, data) ->
			if err
				return def.resolve({status: false, err: err, msg: err.message})
			def.resolve({status: true, data: data})
			_storeCache[path] = data

	def.promise
compile_coffee = (path, done) ->
	if not typeof done is 'function'
		throw Error('cb function is required')

	coffee = require 'coffee-script'
	get_content(path)
	.then (rs) ->
		code = rs['data']
		if not rs['status']
			return done(rs['err']);
		try
			str = coffee.compile(code, {bare: true});
		catch e
			done 'coffee syntax error\n' + e
		done str

compile_stylus = (path, done, option) ->
	if not typeof done is 'function'
		throw Error('cb function is required')
	
	stylus = require 'stylus'
	get_content(path)
	.then (rs) ->
		errCSS = """
			body{position: relative;}
			body::after{content: '{warn>> stylus err, see your NODE CONSOLE}'; z-index: 99999; position:absolute; left: 0; top: 0; right: 0; padding: 8px;background: red; color: #fff}
		"""
		code = rs['data']
		if not rs['status']
			console.log(rs['err'])
			return done(errCSS)
		stylus(code)
		.set('filename', path) #enable finder by relative urls
		.render (err, str) ->
			if err
				console.log(err)
				done errCSS
				return
			done str

module.exports =
	get_content: get_content
	compile_coffee: compile_coffee
	compile_stylus: compile_stylus

