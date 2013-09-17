# Privy, Private Members for Objects in JavaScript

> The thing that makes programming so difficult is it has to be perfect. A program has to be absolutely perfect in all detail, for all possible inputs and all possible uses even including uses that were not anticipated in the design of the program. If any flaw is found in the program the computer has licence to do the worst possible thing at the worst possible time and it is not the computer's fault.
>
> -- Douglas Crockford

## What is the goal?

Privy aims to create truly private members for JavaScript objects that are accessible through prototype methods. It is a real solution, made possible by the power of ~~Greyskull~~ closures, that associates private members with an object for the duration of its lifetime.

Members are private and should not be confused with [protected](http://stackoverflow.com/questions/1020749/what-are-public-private-and-protected-in-object-oriented-programming).

A more detailed explaination can be read on [my website](http://thomasnadin.co.uk/2013/04/03/privy-private-members.html).

## What would typically usage look like?

```JavaScript
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

thomas.name();           // "Thomas"
sarah.sameAge(thomas);   // true
thomas.name.call(sarah); // "Sarah"
```

## NPM Usage

```Bash
$ npm install privy
```

```JavaScript
var Privy = require('privy');
```

## How does this differ from X?

I am unable to comment on all [implementations](https://www.google.co.uk/search?q=private+members+javascript) of private members in JavaScript, but generally most are susceptible to immortal objects, incorrect design of private in Object Orientation or can be exploited by changing the `this` argument. More information can be found further down in the trade off section.

Privy differs due to the nature of its so called accessor function, a handshake takes place between the accessors and the privy functions via a sealer object preventing a man-in-the-middle attack.

Correct use of Privy ensures that only prototype members declared in scope of the sealer will have access to the private members, this is achieved through closures.

## What are the trade offs?

**Costs:**

- One single property used per object.
- One function per constructor to access private members
- One sealer per constructor to communcate between Privy and objects.
- Gaining access to the private member object takes 2 additional function calls.
- Experimental support for inheritance is under analysed at the momement. Available on [inheritance branch](https://github.com/nadinengland/privy/tree/inheritance).

**Benefits:**

- Prototype methods can access the private members, not just privileged ones.
- Privates are created in the constructor and will be eligible for garbage collection when the object goes out of scope.
- Access to members does not require cryptography but rather a fundamental language feature, closure.
- Other objects of the same constructor can see other privates as long as they have a reference to the object (similar to other Object Oriented languages).

## Privy API

### Privy.create(property = '_')

Creates an Privy object that is intended for use with a single constructor. `property` will be used as the property name for private member store function.

```JavaScript
p = Privy.create();            // p.property === '_'
p = Privy.create('_privates'); // p.property === '_privates'
```

### Privy#initiate(object)

Creates a private member store on the `object` based on the `Privy` object's `p.property`.

Returns the newly created private member object.

```JavaScript
var privates = p.initiate(this); // typeof this._ === 'function'
```

### Privy#(object)

Attempts to access the privates of the object; returns `undefined` if unable to do so.

```JavaScript
var privates = p(this); // equivilant to `open(seal(privates))` if `open` was in scope.
```

## Here Be Dragons

Privy ultimately relies on plain objects in JavaScript to transport the private variable closures around the code, watch out for this as some odd side effects can occure with a little bit of malicious code:

```Javascript
var thomas = new Person("thomas", 22);
var sarah  = new Person("sarah", 22);

var temp = thomas._;
thomas._ = sarah_;
sarah._ = temp;

thomas.name() === "sarah";
sarah.name() === "thomas";
sarah.name.call(thomas) === "sarah";
```

Dispite its devious appearance malicious code like this can only swap out the functions effecting which closure is utilised. This isn't an exploit that Privy has introducted but instead it is a conciquence of JavaScript's mutable nature. This and other similar methods do not allow for access to the privates in any other way than defined within the constructor IIFE (i.e. through your public interface). They may be in the wrong place but they cannot be accessed.

## Disclaimer

This was a weekend project and is by no means bullet proof. Privy is an attempt to materialize some thoughts I had on JavaScript.

## License

Copyright (C) 2013 Thomas Nadin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
