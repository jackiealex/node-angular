qiniu = require("qiniu")
Buffer = require("buffer")
Q = require("q")

qiniu.conf.ACCESS_KEY = "iqdqcxMfKgzY4SLqIAxGbufYuEsuxwzJQ9zx5Ky2"
qiniu.conf.SECRET_KEY = "dfPTfQMzmlWJ-h6cweb950yKBTJd8gLFJhv8zcfo"

getBucketTokenSync = (bucketname) ->
	putPolicy = new qiniu.rs.PutPolicy(bucketname)
	putPolicy.token()

getMediaAcessURLSync = (domain, key) ->
	baseUrl = qiniu.rs.makeBaseUrl(domain, key)
	policy = new qiniu.rs.GetPolicy()
	policy.makeRequest baseUrl

getThumbImage = (domain, key, w = 100, h = null) ->
	url = qiniu.rs.makeBaseUrl(domain, key)
	iv = new qiniu.fop.ImageView()
	policy = new qiniu.rs.GetPolicy()

	iv.width = w
	iv.height = h
	
	# console.log iv

	url = iv.makeRequest(url)
	url = policy.makeRequest(url)
	url

uploadFileByBuffer = (buffer, uptoken, key) ->
	extra = new qiniu.io.PutExtra()
	def = Q.defer()
	qiniu.io.put uptoken, key, buffer, extra, (err, rs) ->
		if err
			def.resolve
				status: false
				data: null
				err: err

			return
		def.resolve
			status: true
			data: rs

		return

	def.promise

exports.getBucketTokenSync = getBucketTokenSync
exports.uploadFileByBuffer = uploadFileByBuffer

exports.getMediaAcessURLSync = getMediaAcessURLSync
exports.getThumbImage = getThumbImage
