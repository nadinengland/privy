# WeakMaps in ES6 Harmony

When [WeapMaps](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/WeakMap) land in the upcoming ES6 Harmony proposal private member in JavaScript will be simple to implement:

```JavaScript
var Person = (function () {
    var privates = new WeakMap();

    function Person(name, age) {
        // Create new privates
        privates.set(this, {
            name: name,
            age: age
        });
    }

    Person.prototype.name = function () {
        return privates.get(this).name;
    };

    Person.prototype.sameAge = function (other) {
        return privates.get(this).age === privates.get(other).age;
    };

    return Person;
}).call();
```

This is because the new Map object can take objects as keys. WeakMap builds on this by not holding strong references to keys or values, allowing them both to be GC'd naturally.

You can already try this in Node with `node --harmony`, FireFox >=6.0 or Chrome switching on `Enable Experimental JavaScript` at `chrome://flags`.