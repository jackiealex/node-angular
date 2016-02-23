 
require('colors');
var replacement = new RegExp(process.cwd(), 'g');
console.out = console.log;
console.err = console.warn;
['log', 'warn'].forEach(function(method){
	var old = console[method];
	console[method] = function(){
		var stack = (new Error()).stack.split(/\n/);
		if(stack[0].indexOf('Error') === 0){
			stack = stack.slice(1);
		}
		var out = stack[1].trim();
		out = out.replace(replacement, '~');
		if(typeof(out) == 'string'){
			out = out.grey;
		}
		var args = [].slice.apply(arguments).concat([out]);
		return old.apply(console, args);
	};
});