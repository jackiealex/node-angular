// npm module
import Q from 'q';
import _ from 'lodash';
import fs from 'fs';
import which from 'which';
// self module
import child_process from 'child_process';

var spawn = function(cmd, args = [], options = {}){
	var deferred = Q.defer();

	var opts = _.extend({stdio: 'inherit'}, options);

	if (process.platform === 'win32') {
		var win_cmd = cmd + '.cmd';
		if (fs.existsSync(win_cmd)) {
			cmd = win_cmd;
		} else if (!fs.existsSync(cmd)) {
			cmd = which.sync(cmd);
		}
	}

	var ps = child_process.spawn(cmd, args, opts);

	ps.on('error', function(data) {
		return deferred.reject(data);
	});

	ps.on('data', function(data) {
		return deferred.notify(data);
	});
 
	ps.on('close', function(code) {
		if (code === 0) {
			return deferred.resolve(code);
		} else {
			return deferred.reject(code);
		}
	});

	deferred.promise.process = ps;

	return deferred.promise;
};
 
var query = function(cmd, file){
	return child_process.spawn('ps', function(err, stdout, stdio){
		return console.log(err, stdout, stdio);
	});
};

module.exports = {
	spawn: spawn,
	query: query
};