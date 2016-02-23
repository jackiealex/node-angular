module.define = ()->
	len = arguments.length
	deps = []
	if len >= 2
		deps = arguments[len - 2]
		typeof deps
	return null