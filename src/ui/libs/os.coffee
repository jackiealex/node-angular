# npm module
Q = require 'q'
_ = require 'lodash'
fs = require 'fs'
which = require 'which'
# self module
child_process = require 'child_process'

spawn = (cmd, args = [], options = {})->
	deferred = Q.defer()

	opts = _.extend({stdio: 'inherit'}, options)

	if process.platform == 'win32'
		win_cmd = cmd + '.cmd'
		if fs.existsSync win_cmd
			cmd = win_cmd
		else if not fs.existsSync cmd
			cmd = which.sync(cmd)

	ps = child_process.spawn cmd, args, opts

	ps.on 'error', (data) ->
		deferred.reject data

	ps.on 'data', (data) ->
		deferred.notify data
 
	ps.on 'close', (code) ->
		if code == 0
			deferred.resolve code
		else
			deferred.reject code

	deferred.promise.process = ps

	return deferred.promise
 
query = (cmd, file)->
	child_process.spawn 'ps', (err, stdout, stdio)->
		console.log(err, stdout, stdio)

module.exports = {
	spawn: spawn
	query: query
}