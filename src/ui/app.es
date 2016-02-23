import express from 'express';

// config
const _config_ = (() => {
	let config = null;
	if(process.env['NODE_ENV'] === 'devlopment') {
		config = require('../config/dev');
	} else {
		config = require('../config');
	}
	return config
})();

console.log(_config_)

class Application {
	constructor() {
		this.app = express()
		this.port = 11
	}

	start() {
		console.log(1);
	}
}

new Application();