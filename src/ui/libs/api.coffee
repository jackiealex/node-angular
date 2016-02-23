fs = require 'fs'
url = require 'url'

request = require 'request'
Q = require 'q'
_ = require 'lodash'

_CONST_HOST_NAME_ = GLOBAL_OBJECT['_CONST_REMOTE_SERVER_NAME_']
_CONST_HOST_IP_ = GLOBAL_OBJECT['_CONST_REMOTE_SERVER_IP_']
_CONST_REMOTE_STATUS_CODE_ = GLOBAL_OBJECT['_CONST_REMOTE_STATUS_CODE_']
_CONST_NODE_ERROR_CODE_ = GLOBAL_OBJECT['_CONST_NODE_ERROR_CODE_']

syslog = (type, msg) ->
    console.log(type, msg)
 
getURIComponent = (req) ->
    urlStr = req.url

    urlComponent =
        protocol: 'http:'
        host: GLOBAL_OBJECT['_CONST_REMOTE_SERVER_NAME_']
        # host: _CONST_HOST_NAME_
        pathname: '/'
        query: {}

    urlComponent['query'] = req['query']
    urlComponent['pathname'] = req['pathname']

    headers = req['headers'] || {}
    headers['NODE-UI'] = 'start_time:' + +new Date
    headers['XP-TERMINAL'] = 'node-ui'
    # console.log GLOBAL_OBJECT['_CONST_REMOTE_SERVER_NAME_']
    options = {
        uri: ''
        headers: headers
        method: req['method'] || 'GET'
        timeout: req['timeout'] || 20 * 1000
    }

    if /^http(s)?:/.test urlStr
        options.uri = urlStr
    else
        options.uri = url.format urlComponent

    return options

doRequest = (req = {}) ->
    # @ important 将所有的remote code \node code 都挂载到node_code
    # req =
    #     method: 'get' 
    #     url: 'http://users'
    #     pathname: '/dfdf'
    #     query:
    #         id: '123'
    def = Q.defer()

    local = req['local']
    if GLOBAL_OBJECT['mode'] is 'development' and local
        if typeof local is 'object'
            def.resolve { data: data, msg: 'ok from local data ', node_code: _CONST_REMOTE_STATUS_CODE_['SUCCESS']}
        else
            fs.readFile local, 'utf8', (err, data) ->
                if err
                    return def.resolve { data: null, msg: err['message'], node_code: _CONST_NODE_ERROR_CODE_['FILE_NOT_FOUND']}
                return def.resolve { data: JSON.parse(data), msg: 'ok from local file', node_code: _CONST_REMOTE_STATUS_CODE_['SUCCESS']}
        return def.promise
    
    options = getURIComponent(req)

    reqObject = request options, (err, res, body) ->
        # timeout
        if err
            def.resolve { data: null, node_code: _CONST_NODE_ERROR_CODE_['NODE_TIMEOUT'], msg: err['message']}
            syslog(1, err)
            return
        # check if remote server has the api
        if res.statusCode > 400
            def.resolve {data: null, node_code: res.statusCode, msg: body}
            syslog(3, {msg: body, err: res.statusCode})
            return
        try
            data = JSON.parse body
        catch e
            def.resolve {data: null, node_code: _CONST_NODE_ERROR_CODE_['PARSE_ERR'], msg: body}
            syslog(2, {msg: 'format error', err: e})
            return
        def.resolve {data: data, msg: data['msg'], node_code: data['code']}

    reqBody = req['body']   
    if reqBody
        form = reqObject.form()
        for iK, iV of reqBody
            vList = [].concat(iV)
            for val in vList
                form.append(iK, val)
    def.promise

doRequests = () ->
    args = [].concat.apply([], arguments);
    def = Q.defer()

    defs = _.map args, (req) ->
            doRequest req
    Q.all(defs)
    .done (rs) ->
        def.resolve rs

    return def.promise

exports.request = doRequest
exports.requests = doRequests

exports.getURIComponent = getURIComponent


