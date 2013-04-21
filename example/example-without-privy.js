// # Barebone Private Members
// 
// This is an example of how Privy works without the Privy API. This works
// as Prototype methods are defined within scope of the sealer.

var Person = (function () {
    // Create a sealer to transmit privates
    var sealer = {
        seal: function (value) {
            this.value = value;
            return this.key = {};
        },
        open: function (key) {
            var value = this.value;
            if (this.key === key) {
                value = undefined;
                return value;
            }
        }
    };

    // Convenience method
    var p = function (object) {
        sealer.open(object._());
    };

    function Person(name, age) {
        // Create the private member object
        var privates = {};

        // Define an accessor to return the sealed privates
        this._ = function () {
            return sealer.seal(privates);
        };
        
        // Define private properties
        privates.name = name;
        privates.age = age;
    }

    // Explicit
    Person.prototype.name = function () {
        return sealer.open(this._()).name;
    };

    // Convenience
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
