// config
const CONFIG = (() => {
	let config = null;
	if(process.env['NODE_ENV'] === 'development') {
		config = require('./dev/config');
	} else {
		config = require('./config');
	}
	// console.log(process.env['NODE_ENV'], CONFIG);
	return config
})();

module.exports = CONFIG;