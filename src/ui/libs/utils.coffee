module.exports =
	pageMaker: (option) ->
		current = parseInt(option['current']) 
		totalPage = parseInt(option['totalPage'])
		wing = option['wing'] or 4
		pathname = option['pathname']

		query = option['query']

		starter = if current - wing <= 0 then 1 else current - wing
		ender = if current + wing < totalPage then current + wing else totalPage 
		leftWind = []
		rightWind = []
		leftWind.push(it) for it in [starter..current] by 1

		rightWind.push(it) for it in [current+1..ender] by 1

		prev = if leftWind.length <= 1 then null else current - 1
		next = if rightWind.length <= 1 then null else current + 1
		list = []
		list.push.apply(list, leftWind)
		list.push.apply(list, rightWind)

		queryString = []
		
		for k, v of query
			if v
				queryString.push k + '=' + v
		return {
			start: 1
			end: totalPage
			prev
			list
			next
			current
			totalPage: totalPage
			pathname: pathname or '/'
			queryString: queryString.join('&')
		}
		
	whenHappend: (stamp) ->
		stamp = parseInt(stamp)
		d = Math.abs(+ new Date - stamp)
		d = d / (1000 * 60)
		d = parseInt(d)
		
		if d < 10
			return "just now";
		if d >=10 && d < 60
			return d + 'mins';

		d = parseInt(d / 60)
		if d < 24
			if d is 1
				return d + 'hour'
			return d + 'hours';

		d = parseInt(d / 24)
		if d >=1 && d <30
			if d is 1
				return 'day'
			return d + 'days';

		d = parseInt d / 30
		if d < 12
			if d is 1
				return 'mon'
			return d + 'mons'

		d = d /12
		if d is 1
			return d + 'year'
		return d + 'years'
	
	timeFormat: (stamp) ->
		date = new Date(stamp)

		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()

		hour = date.getHours()
		min = date.getMinutes() 
		sec = date.getSeconds()

		return "#{year}年#{month}月#{day}日 #{hour}:#{min}:#{sec}"

	dateFormat: (stamp) ->
		date = new Date(stamp)

		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()

		hour = date.getHours()
		min = date.getMinutes() 
		sec = date.getSeconds()

		return "#{year}年#{month}月#{day}日"

	checkResultSet: () ->
		rs = [].concat.apply([])