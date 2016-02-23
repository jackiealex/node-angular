fs =  require('fs')
path = require('path')

cheerio = require('cheerio')
ejs = require('ejs')
template = require('evertpl')
_ = require('lodash')

api = require('../api')
Q = require('q')
uid = require('uid')

_CONST_REMOTE_STATUS_CODE_ = global['GLOBAL_OBJECT']['_CONST_REMOTE_STATUS_CODE_']
_CONST_NODE_ERROR_CODE_ = global['GLOBAL_OBJECT']['_CONST_NODE_ERROR_CODE_']

#@ input html source, placeholder
# @output js, css, html

group = () ->
	pageletList = [].apply.call([], arguments)

keepInline = (str) ->
	return str.replace(/[\r\n\t\u2028\u2029]/g, ' ')

_const_error_template = fs.readFileSync 'libs/pagelet/tmpl/error.html', 'utf8'
_const_chunk_start_template = keepInline fs.readFileSync 'libs/pagelet/tmpl/chunk_start.html', 'utf8'
_const_chunk_in_template = keepInline fs.readFileSync 'libs/pagelet/tmpl/chunk_in.html', 'utf8'
_const_chunk_end_template = keepInline fs.readFileSync 'libs/pagelet/tmpl/chunk_end.html', 'utf8'

showBreaker = (str) ->
	map = {
		'\n': '\\n',
		'\r': '\\r',
		'\t': '\\t',
		'\u2028': '\\u8',
		'\u2029': '\\u9'
	}
	return str.replace /[\r\t\n\u2028\u2029]/g, (matcher, index) ->
		return map[matcher]

# data
# template
# render to html
# can do pipe-start pipe-in pipe-end
# classify html js dom to json object
# output to response
# pagelet must do pipe start if its responder do not pipe-start
# multi pagelets would share single request and respond instance
class Pagelet
	cssSelector = 'link[href]'
	jsSelector = 'script[src]'

	constructor: (res, opts) ->
		@res = res
		@options = _.extend {
			selector: '.center'
			sid: ''
			template: ''
			autoEnd: true
			op: 'html'
			data: {}
			format: (rs) ->
				return rs
		}, opts

		@_css_ = []
		@_js_ = []
		@_html_ = ''

		@__cfID__ = res.req['query']['cfID'] || +new Date
		@__children_ids__ = []
		@__parentID__ = ''
		@__pipeID__ = 'pipe_' + uid(32)
		@count = 1
	_render: (data) ->
		html = template.renderFile(@options['template'], data)
		return html
	appendChildWithID: (id) ->
		@__children_ids__.push(id)
	 
	_getRemoteData: (callback) ->
		_that = @
		api.request @options['request']
		.done (rs) ->
			callback.call(_that, rs)
 
	_getCSSResouceList: () ->
		cssNodes = @$(cssSelector)
		cssNodes.each (index, node) =>
			@_css_.push node['attribs']['href']

	_getJSResouceList: ->

		jsNodes = @$(jsSelector)
		jsNodes.each (index, node) =>
			if node['attribs']['src']
				@_js_.push node['attribs']['src']

	_getHTMLString: () ->
		@$([cssSelector, jsSelector].join(',')).remove()
		@_html_ =  @$.html()

	_analyze: () ->
		@_getCSSResouceList()
		@_getJSResouceList()
		@_getHTMLString()
		data =  {
			__cfID__: @__cfID__
			__pipeID__: @__pipeID__
			__parentID__: @__parentID__ 
			children: @__children_ids__.join('-')
			selector:  @options['selector']
			op: @options['op']
			css: if  @_css_.length > 0 then ("['" + @_css_.join("','") + "']") else '[]'
			js: if @_js_.length > 0 then ("['" + @_js_.join("','") + "']") else '[]'
			html: keepInline @_html_
		}
		return data

	input: (source) ->
		@$ = cheerio.load(source)

	output: () ->
		hcj = @_analyze()
		html = ejs.render(_const_chunk_in_template, hcj)
		return keepInline html 

	pipeError: (rs) ->
		__api_name__ = 'not a request from pagelet see, api.request(s)'
		if @options['request']
			__api_name__ = @options['request']['pathname']

		_.defaults rs, {
			msg: '-'
			node_code: 'woops none code',
			data: {none: '...'}
			__api_name__
			__query_string__: JSON.stringify(@options['request']['query'])
		}

		source = ejs.render(_const_error_template, rs)
		resObj = {
			__cfID__: @__cfID__
			__pipeID__: @__pipeID__
			__parentID__: @__parentID__ 
			children: @__children_ids__.join('-')
			selector:  @options['selector']
			op: @options['op']
			css: '[]'
			js: '[]'
			inline_scripts: []
			inline_styles: []
			html: keepInline source
		}
		
		html = ejs.render(_const_chunk_in_template, resObj)

		@res.write(html)
		if @options.autoEnd
			@res.end()
	getResponse: ()->
		return @res
	_getPipeState: () ->
		return @res['_pipe_state_'] or 'CHUNK_START'

	_setPipeState: (state) ->
		@res['_pipe_state_'] = state

	_doStartPipe: () ->
		res = @res
		html = ejs.render(_const_chunk_start_template, {__cfID__: @__cfID__, count: @count})
		res.write(html)
		@_setPipeState('CHUNK_IN')

	_doEndPipe: () ->
		res = @res
		html = ejs.render(_const_chunk_end_template, {__cfID__: @__cfID__})
		res.write(html)
		res.end()
		@_setPipeState('CHUNK_END')

	# each pipe will get the pipe state pipeStart, piping pipeEnd
	_setSiblingsCount: (count)->
		@count = count
	pipe: () ->
		res = @res
		autoEnd = @options['autoEnd']
		def = Q.defer()

		if @_getPipeState(res) is 'CHUNK_START'
			@_doStartPipe(res)

		_that = @
		if not @options.request
			data = @options['data']
			source = @_render(data)
			@input(source)
			res.write(@output())
			_that._setPipeState('CHUNK_IN')
			if autoEnd
				@_doEndPipe()
			def.resolve()

		else
			@_getRemoteData (rs) ->
				if rs['node_code'] is _CONST_REMOTE_STATUS_CODE_['SUCCESS']
					data = _that.options.format(rs)
					
					source = _that._render(data)

					_that.input(source)
					
					res.write(_that.output())
					_that._setPipeState(res, 'CHUNK_IN')

					if autoEnd
						@_doEndPipe(res)
						_that._setPipeState(res, 'CHUNK_IN')

				else
					_that.pipeError(rs)

				def.resolve()

		def.promise
	end: () ->
		@_doEndPipe();
module.exports = Pagelet


# when new a pagelet it will start fetch data
# when pipe method called, it will pipe, if the data is fetch it will waiting the data fetch end the pipe out

