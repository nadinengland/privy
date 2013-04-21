var Privy = require('..');

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

var thomas = new Person("Thomas", 22),
    sarah  = new Person("Sarah", 22);

console.log( thomas.name() );           // "Thomas"
console.log( sarah.sameAge(thomas) );   // true
console.log( thomas.name.call(sarah) ); // "Sarah"
