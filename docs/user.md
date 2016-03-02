### Web|iOS|Android 登录（通过帐号密码交换 access_token oauth）

	POST /oauth2

	reqeust body:
	
	```json
	{
		'client_id': w2Dl7oc0CimMq1yFtLDcdFVBKWEeIjwTr1wRLngd, //标识
		'client_secret': nWx8llO9LmZdxek2g8K7nc6mnWC9rmW1dOEoQ5An, //客户端密钥
		'grant_type': 'password', //'password' || 'weixin'
		'username': username,
		'password': password
		'openid': '微信openid',  //以下2字段仅当是微信有效
		'access_token': '微信access token',
	}
	```

	response body:
	```json
	{
		'access_token': 'xxdkfjsdk',
	}
	```



