// # Example usage of Privy
// 
// This is an example of how to define a constructor function with private members
// on created objects. Prototype methods are defined which can access the memebrs.

var Privy = require('../src/privy.js');

var Person = (function () {
    var p = Privy.create();

    function Person(name, age) {
        var privates = p.initiate(this);
    
        privates.name = name;
        privates.age = age;
    }

    Person.prototype.name = function () {
        return p(this).name;
    };

    Person.prototype.sameAge = function (other) {
        return p(this).age === p(other).age;
    };

    return Person;
}).call();

var thomas = new Person("Thomas", 22);
var sarah  = new Person("Sarah", 22);

console.log( thomas.name() );           // "Thomas"
console.log( sarah.sameAge(thomas) );   // true
console.log( thomas.name.call(sarah) ); // "Sarah"
