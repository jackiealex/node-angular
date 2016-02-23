PageletManager = require('./index')
fs = require('fs')
source = fs.readFileSync '../../views/test.html', 'utf8'

console.log(source)

pageletManager = new PageletManager(source)

rs = pageletManager.getResult()

console.log(rs)
