(function () {
    var Privy, createSealer;

    // Sealer factory: only holds one value
    createSealer = function () {
        var value, key, sealer = {};

        // Seals `object` and returns one time key to retreive it
        sealer.seal = function (object) {
            value = object;
            return key = {};
        };

        // Returns the sealed object once if `given` was used to seal it
        sealer.open = function (given) {
            var object = value;

            // Only give object if key is correct
            if (given === key) {
                // Empty the sealer
                value = undefined;

                return object;
            }
        };

        return sealer;
    };

    // Privy IIFE, used to initate functions
    Privy = (function () {
        var Privy, initiate;

        // Privy is a function that will return an access for a given property.
        Privy = function (property) {
            var accessor, sealer;

            // Default to underscore
            property = property || "_";

            // Create a new sealer for this constructor
            sealer = createSealer();

            // Syntactic sugar for handshake with Privy function
            accessor = function (object) {
                return sealer.open(object[property](accessor.key));
            };

            // Make variables publicly available.
            accessor.sealer = sealer;
            accessor.property = property;
            accessor.key = {};

            // add the same initiate method
            accessor.initiate = initiate;

            return accessor;
        };

        // Single initiate method is used for all "classes"
        initiate = function (object) {
            var privates = {},
                accessor = this;

            // Simple error handling
            if (object === undefined) {
                throw new Error("Must provide an object to create privates.");
            }

            
            if (!Object.prototype.hasOwnProperty.call(object, accessor.property)) {
                // Add the Privy function to the object
                object[accessor.property] = (function () {
                    var head, last;

                    // Function to get the private's key and create privates
                    // If fn is a function it will be added to the next store
                    // in the chain of private functions.
                    return function (key, fn) {
                        var store = head;

                        // if its a function, add it to the end of the chain
                        if (typeof fn === 'function') {
                            // Create the new store
                            store = { key: key, fn: fn };

                            if (head === undefined) {
                                last = head = store;
                            } else {
                                last.next = store;
                                last = last.next;
                            }

                            // Store created, done
                            return;
                        }

                        while (store !== undefined) {
                            if (store.key === key) {
                                // Call the function returing the key
                                return store.fn();
                            }

                            store = store.next;
                        }
                    };
                }).call();
            }

            // Add a new private member object to the chain
            object[accessor.property].call(object, accessor.key, function () {
                // Return the key for the private through sealer
                return accessor.sealer.seal(privates);
            });

            return privates;
        };

        // Return the "constructor" Privy
        return Privy;
    }());

    if (typeof module !== "undefined" && typeof require !== "undefined") {
        module.exports = Privy;
    } else {
        window["Privy"] = Privy;
    }
}).call();