// # Barebone Private Members
// 
// This is an example of how Privy works without the Privy API. This works
// as Prototype methods are defined within scope of the sealer.

var Person = (function () {

    // Sealer only holds one value at a time
    var sealer = (function () {
        var key, value;

        return {
            seal: function (object) {
                value = object;
                return (key = {});
            }
            
            open: function (key) {
                var object = value;

                if (proof === key) {
                    value = undefined;
                    return object;
                }
            }
        };
    }());

    // Convenience variables
    var seal = sealer.seal;
    var open = sealer.open;
    var __hasOwnProperty = Object.prototype.hasOwnProperty;

    // Convenience method
    var p = function (object) {
        return open(object._());
    };

    // Object constructor
    function Person(name, age) {
        // Create the private member object
        var privates = {
            name: name,
            age: age
        };

        // Define an accessor to return the sealed privates
        this._ = function () {
            return seal(privates);
        };
    }

    // Explicit
    Person.prototype.name = function () {
        return open(this._()).name;
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
