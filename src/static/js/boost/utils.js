(function(exports) {
	exports.Utils = {
		nextTick: function(fn, delay) {
			setTimeout(function() {
				fn()
			}, delay || 0);
		},
		uid: function  () {
			  function s4() {
			    return Math.floor((1 + Math.random()) * 0x10000)
			      .toString(16)
			      .substring(1);
			  }
			  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			    s4() + '-' + s4() + s4() + s4();
		},
		size: function  (obj, valid) {
			var count = 0;
			for(var i in obj) {
				if(obj[i] && valid) {
					count++;
				}
			}
			return count;
		},
		queryString: function(str) {
			if (typeof str !== 'string') {
				return {};
			}
			str = str.trim().replace(/^(\?|#|&)/, '');
			if (!str) {
				return {};
			}
			return str.split('&').reduce(function(ret, param) {
				var parts = param.replace(/\+/g, ' ').split('=');
				var key = parts[0];
				var val = parts[1];
				key = decodeURIComponent(key);
				// missing `=` should be `null`:
				// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
				val = val === undefined ? null : decodeURIComponent(val);
				if (!ret.hasOwnProperty(key)) {
					ret[key] = val;
				} else if (Array.isArray(ret[key])) {
					ret[key].push(val);
				} else {
					ret[key] = [ret[key], val];
				}
				return ret;
			}, {});
		},
		JSONParse: function(string) {
			return (new Function('return ' + string))();
		},
		api: function(url, opts) {
			var baseUrl = 'http://api.cloudbaoxiao.com/dev/';
			var def = $.Deferred();
			var regSlashStart = /^\//;
			if(regSlashStart.test(url)) {
				url = url.replace(regSlashStart, '');
			}
			url = baseUrl + url;
			console.log(url)
			opts = $.extend({
				method: 'get',
				dataType: 'json',
				data: {},
				onError: function(rs) {
					var msg = rs['msg'] || JSON.stringify(rs);
					alert(url + ':' + msg);
					console.warn(url, rs);
				}
			}, opts);
			$.ajax({
				method: opts['method'],
				dataType: opts['dataType'],
				headers: {
					'X-REIM-JWT': window.__CBX_UTOKEN__ || ''
				},
				url: url,
				data: opts['data'],
				success: function(rs, succ) {
					if (opts['dataType'] == 'text') {
						return def.resolve.apply(null, arguments);
					}
					if (rs['status'] <= 0) {
						opts.onError(rs)
					}
					def.resolve(rs);
				},
				error: function(e, opts) {
					alert('request error')
					def.resolve.apply(null, arguments);
				}
			});
			return def.promise();
		},
		dateFormat: function(date, joint) {
			if (!joint) {
				joint = '-';
			}
			var d = new Date(date);
			var str = [
				d.getFullYear(),
				utils.offsetNumber(d.getMonth() + 1),
				utils.offsetNumber(d.getDate())
			].join(joint);
			return str;
		},
		dateTimeFormat: function(date) {
			var d = new Date(date);
			var dateStr = [
				d.getFullYear(),
				utils.offsetNumber(d.getMonth() + 1),
				utils.offsetNumber(d.getDate())
			].join('/');
			var timeStr = [
				utils.offsetNumber(d.getHours()),
				utils.offsetNumber(d.getMinutes())
			].join(':');
			return dateStr + ' ' + timeStr;
		}
	}
})(window);