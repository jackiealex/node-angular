nodemailer = require("nodemailer")
_ = require("lodash")
module.exports = (opts) ->
	opts or (opts = {})
	transporter = nodemailer.createTransport
		service: "Gmail"
		auth:
			# user: "1196618353@qq.com"
			# pass: "zj04030958"
			user: "alexemier@gmail.com"
			pass: "04030958"
		
	console.log 'mail_start'

	opts = _.extend {
		from: "alexemier@gmail.com" # sender address
		to: "zhangjie@591ku.com, 379382995@qq.com" # list of receivers
		# to: "zhangjie@591ku.com" # list of receivers
		subject: "[NODE ERROR]"
		html: "test" # html body
	}, opts

	transporter.sendMail opts, (err, rs) ->
		if err
			console.log "mail fail: " + err
		else
			console.log "mail success: " + rs.response
		return
