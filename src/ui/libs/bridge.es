import api from './api'
import fs from 'fs'
import path from 'path'

module.exports = (httpServer)=> {
	httpServer.use('/no_bridge', (req, res)=>{
		var token = req.cookies['access_token']
		var pathname = req['path']
		var method = req['method']
		var query = req['query']
		var body = req['body']
		const date_file = query['data_file'] || body['date_file'];
		if(date_file) {
			fs.readFile(path.join('../', 'mock', 'data', date_file), 'utf8', (err, data)=>{
				console.log(data)
				res.send(data);
			});
			return
		}
		api.request({
			method: method,
			pathname: pathname,
			body: body,
			query: query,
			headers: {
				'Authorization': 'Bearer ' + req.cookies['access_token']
			}
		})
		.done((rs)=>{
			res.send(rs);	
		})
	});
}
	
