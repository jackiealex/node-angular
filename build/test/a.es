var co = require('co');
class Animal {
    constructor() {
        console.log(1)
    }
    sayHello() {
        console.log('sayHello')
    }
}
class Dog extends Animal {}
var d = new Dog
d.sayHello()
co(function * () {
    var result = yield Promise.resolve({
        dsfasd: '12123'
    });
    return result;
}).then(function(value) {
    console.log(value);
}, function(err) {
    console.error(err.stack);
});

function * helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloWorldGenerator();
console.log(hw.next());
console.log(hw.next());
console.log(hw.next());
console.log(hw.next());
console.log(hw.next());
var names = ['alex', 'elina'];
var nameArray = ['yaya', 'jie', ...names, 'ling'];
console.log(nameArray);

function test(...args) {
    console.log(args.length);
    console.log(args.length, args[0]);
}
test(1, 2, 3, 4, 5, ...nameArray);

function * foo() {
    yield 'a';
    yield 'b';
    yield 'c';
    yield 'd';
    yield 'e';
    return 'f';
}
for (let v of foo()) {
    console.log(v);
}
var m = foo()
console.log(m.value);
for (var i of nameArray) {
    console.log(i);
}
for (var chr of " ") {
    console.log(chr);
}


