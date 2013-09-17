define(function () {
    'use strict';

    // Sealer only holds one value at a time
    var sealer = (function () {
        var value, key;

        return {
            // Store the value and create new key to access it.
            seal: function (object) {
                value = object;
                return (key = {});
            },

            // Return value if proof matches key then replace interal value.
            open: function (proof) {
                var object = value;

                if (proof === key) {
                    value = null;
                    return object;
                }
            }
        };
    }());

    // Conveniences
    var seal = sealer.seal;
    var open = sealer.open;
    var __hasOwnProperty = Object.prototype.hasOwnProperty;

    // Single initiate method is used for all constructor functions
    var initiate = function (object) {
        // multiple access to property
        var property = this.property;

        // Cannot be a property that already exists
        if (__hasOwnProperty.call(object, property)) {
            throw new Error("Object already has a property '" + property + "'");
        }

        // Create new privates for this instance
        var privates = {};

        // Add the Privy function to the object
        object[property] = function () {
            // Return the key for the private through sealer
            return seal(privates);
        };

        return privates;
    };

    // Creates new accessor function for a given property.
    var Privy = function (prop) {
        // Default to underscore
        var property = prop || "_";

        // Syntactic sugar for handshake with Privy function
        var accessor = function (object) {
            return open(object[property]());
        };

        // Add data to accessor
        accessor.initiate = initiate;
        accessor.property = property;

        return accessor;
    };

    // Export the Privy function
    return { create: Privy };
});
