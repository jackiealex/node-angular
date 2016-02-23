import fs from 'fs';
import Q  from 'q'; 
import _  from 'lodash'; 

function get_content(file_path) {
	var def = Q.defer()
	fs.readFile(file_path, 'utf8', (err, data)=>{
		if(err) {
			return def.resolve({status: false, err: err, msg: err.message})
		}
		def.resolve({status: true, data: data, msg: 'ok'})
	})
	return def.promise
}

function compile_coffee(file_path, done) {
	var coffee = require('coffee-script');
	get_content(file_path).done((rs) =>{
		var code = rs['data']
		if(!rs['status']) {
			return done(rs['err']);
		}
		try {
			var str = coffee.compile(code, {bare: true});
		} catch(e) {
			done('coffee syntax error\n' + e)
		}
		done(str);
	})
};

function compile_stylus(file_path, done, option) {
	var stylus = require('stylus');
	get_content(file_path)
	.then((rs)=>{
		var errCSS = `
			body{position: relative;}
			body::after{content: '{warn>> stylus err, see your NODE CONSOLE}'; z-index: 99999; position:absolute; left: 0; top: 0; right: 0; padding: 8px;background: red; color: #fff}
		`;
		var code = rs['data']
		if(!rs['status']) {
			console.log(rs['err'])
			return done(errCSS)
		}
		stylus(code)
		.set('filename', file_path) //enable finder by relative urls
		.render((err, str)=> {
			if(err) {
				console.log(err);
				done(errCSS);
				return;
			}
			return done(str);
		}); 
	});
};

module.exports = {
	get_content,
	compile_coffee,
	compile_stylus,
}