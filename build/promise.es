var co = require('co');
var a = (sec = 1)=> {
	var promise = new Promise(function (resolve, reject) {
		setTimeout(function (argument) {
			var he = '1000 *' + sec + ' time:' + Date.now();
			console.log(he)
			resolve(he)
		}, 1000* sec)
	});
	return promise;
}

// Promise.all(a(), a(), a(3)).then((rs)=> {
// 	// console.log(rs)
// });

function *gen() {
	yield a(1);
	yield a(2);
	yield a(7);
	return 'done';
};

// function sleep(ms){
//   return function(callback){
//     setTimeout(callback, ms);
//   };
// }
// co(function* (){
//   console.log('1');
//   yield sleep(6000);
//   console.log('2');
// });

co(function *() {
	yield a(2);
	yield [a(3), a(10)]
	return a(4);
}).then((rs)=>{
	console.log(rs, "dd")
})