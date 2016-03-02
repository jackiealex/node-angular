import fs  from 'fs'
import url from 'url'

import request from 'request'
import Q from 'q'
import _ from 'lodash'
import CONFIG  from '../config'

function syslog(type, msg) {
    console.log(type, msg)
}
// var log = console.log;
// console.log = function () {
//     var e = new Error()
//     log(e)
// }

// 因为云报销的状态码大于0 都可能是OK的
const NODE_CODE = {
    NODE_TIMEOUT: -4408,
    PARSE_ERROR: -1000,
    LENGTH_REQUIRED_ERROR: -4411,
}
 
function getURIComponent(req) {
    var urlStr = req.url
    var urlComponent = {
        protocol: 'http:',
        // host: if CONFIG['mode'] is 'development' then _CONST_HOST_NAME_ else _CONST_HOST_IP_
        host: CONFIG['remote_api_domain'],
        pathname: '/',
        query: {}
    }

    urlComponent['query'] = req['query']
    urlComponent['pathname'] = CONFIG['branch'] + '/' + req['pathname'].replace(/\//, '');

    var headers = req['headers'] || {}
    headers['NODE-UI'] = 'start_time:' + +new Date
    headers['the-server-name'] = 'node-ui'

    var options = {
        uri: '',
        headers: headers,
        method: (req['method'] || 'GET').toUpperCase(),
        timeout: req['timeout'] || 20 * 1000,
    }

    if(/^http(s)?:/.test(urlStr)) {
        options.uri = urlStr
    } else {
        options.uri = url.format(urlComponent)
    }

    options.url = options.uri;

    return options;
}
function doRequest(req = {}) {
    // @ important 将所有的remote code \node code 都挂载到node_code
    // req =
    //     method: 'get' 
    //     url: 'http://users'
    //     pathname: '/dfdf'
    //     body
    //     query:
    //         id: '123'
    var def = Q.defer()
    var options = getURIComponent(req);

    // console.log(options, req)

    var reqObject = request(options, (err, res, body)=>{
        var data = null;
        // timeout
        if(err) {
            def.resolve({ data: null, node_code: NODE_CODE['NODE_TIMEOUT'], msg: err['message']})
            syslog(1, err)
            return
        }
        // check if remote server has the api
        if(res.statusCode > 400) {
            def.resolve({data: {code: res.statusCode}, node_code: NODE_CODE['LENGTH_REQUIRED_ERROR'], msg: body})
            syslog(3, {msg: body, err: res.statusCode})
            return
        }
        try {
            data = JSON.parse(body)
        }
        catch(e) {
            def.resolve({ data: null, node_code: NODE_CODE['PARSE_ERROR'], msg: body})
            syslog(2, {msg: 'format error', err: e})
            return
        }
        def.resolve({data: data, msg: data['msg'], node_code: data['status']})
    });

    var reqBody = req['body'];
    if(reqBody && options.method !== 'GET') {
        var form = reqObject.form();
        for(var k in reqBody) {
            var v = reqBody[k];
            var vArray = [].concat(v);
            for(var i=0;i<vArray.length;i++) {
                form.append(k, vArray[i]);
                console.log("====", k, vArray[i]);
            }
        }
    }

    return def.promise
}

function doRequests() {

    var args = [].concat.apply([], arguments);
    var def = Q.defer()

    var defs = _.map(args, (req)=>{
        return doRequest(req)
    });
    Q.all(defs) .done((rs)=>{
        def.resolve(rs)
    });
    return def.promise
}

exports.request = doRequest
exports.requests = doRequests