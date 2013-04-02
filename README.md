# Privy, Private Members for Objects in JavaScript

> The thing that makes programming so difficult is it has to be perfect. A program has to be absolutely perfect in all detail, for all possible inputs and all possible uses even including uses that were not anticipated in the design of the program. If any flaw is found in the program the computer has licence to do the worst possible thing at the worst possible time and it is not the computer's fault.
>
> -- Douglas Crockford

## What is the goal?

Privy aims to create truly private members for JavaScript objects that are accessible through prototype methods. It is a real solution, made possible by the power of ~~Greyskull~~ closures, that associates private members with an object for the duration of its lifetime.

Members are private and should not be confused with [protected](http://stackoverflow.com/questions/1020749/what-are-public-private-and-protected-in-object-oriented-programming).

## What would typically usage look like?

```JavaScript
var Person = (function () {
  var p = new Privy();

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
- No support for prototypal inheritance _(currently)_.

**Benefits:**

- Prototype methods can access the private members, not just privileged ones.
- Privates are created in the constructor and will be eligible for garbage collection when the object goes out of scope.
- Access to members does not require cryptography but rather a fundamental language feature, closure.
- Other objects of the same constructor can see other privates as long as they have a reference to the object (similar to other Object Oriented languages).

## Privy API

### `Privy([property = "_"])`

Creates an accessor that is intended for use with a single constructor. Passing a value for property will be used as a string for the private property store. New `Privy` accessor is returned.

### `(Privy).initiate(object)`

Creates a private store on the `object` based on the `Privy` object, which by default will be `_`.

Returns the newly created private member object.

## Compatibility

Requires functionally of `Object.defineProperty` and `Object.defineProperties` [introduced in ECMAScript 5](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty).

## Disclaimer

This was a weekend project and is by no means bullet proof. Privy is an attempt to materialize some thoughts I had on JavaScript.

## License

Copyright (C) 2013 Thomas Nadin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
