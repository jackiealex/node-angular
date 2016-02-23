api = require('../libs/api')
utils = require('../libs/utils')
Pagelet = require('../libs/pagelet')

template = require('evertpl')
Q = require 'q'
fs = require('fs')
mkdirp = require('mkdirp')
_ = require('lodash')

request = require('request')
Formidable = require('formidable')

_CONST_REMOTE_STATUS_CODE_ = GLOBAL_OBJECT['_CONST_REMOTE_STATUS_CODE_']
_CONST_NODE_ERROR_CODE_ = GLOBAL_OBJECT['_CONST_NODE_ERROR_CODE_']

module.exports =  (req, options = {}) ->

	token = req.cookies['XPUSS']
	form = new Formidable.IncomingForm({})
	
	form.uploadDir = "./__temp_upload__"
	form.multiples = true
	form.keepExtensions = true

	def = Q.defer()

	options = _.extend {
		fileFields: []
	}, options

	fileFields = [].concat(options.fileFields)
	form.parse req, (err, fields, files) ->
		if err
			return def.resolve({code: 'timeout'})
		# reqObject = request.post api.getURIComponent({url: 'http://localhost:3000/?fsdfsd=11', headers: {'Cookie': "token=#{token}"}}), (err, body, resp) ->
		uploadFileServerPath = fields['upload_file_server_path'] or 'admin/image/upload'
		reqObject = request api.getURIComponent({method: 'post', timeout: 50000, pathname:  uploadFileServerPath, headers: {'Cookie': "token=#{token}"}}), (err, resp, body) ->
			if err
	            def.resolve {data: null, node_code: _CONST_NODE_ERROR_CODE_['NODE_TIMEOUT'], msg: err['message']}
	            return
	        # check if remote server has the api
	        if resp.statusCode > 400
	            def.resolve {data: null, node_code: _CONST_NODE_ERROR_CODE_['REMOTE_SERVER_ERR'], msg: body}
	            return
	        try
	            data = JSON.parse body
	        catch e
	            def.resolve {data: null, node_code: _CONST_NODE_ERROR_CODE_['PARSE_ERR'], msg: body}
	            return
	        def.resolve [{data: data, msg: data['msg'], node_code: data['code']}, fields]

	        # 文件删除
			if fileFields.length <= 0
				for fileField of files
					fs.unlink files[fileField]['path']
			else
				for fileField in fileFields
					fs.unlink files[fileField]['path']

		fileForm = reqObject.form()

		if fileFields.length <= 0
			for fileField of files
				fileForm.append('files', fs.createReadStream(files[fileField]['path']))
		else
			for fileField in fileFields
				console.log fileField, 'xxx'
				fileForm.append('files', fs.createReadStream(files[fileField]['path']))
	def.promise



		