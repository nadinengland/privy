(function () {
    var Privy, createSealer;

    createSealer = function () {
        var value, key;

        return {
            seal: function (object) {
                value = object;
                key = {};

                return key;
            },
            open: function (given) {
                var old_value = value;

                if (given === key) {
                    value = undefined;
                    return old_value;
                }
            }
        };
    }

    Privy = (function () {
        var privy, initiate;

        privy = function (property) {
            var accessor, sealer = createSealer();

            if (property === undefined) {
                property = "_";
            }

            // Syntactic sugar for handshake with privy function
            accessor = function (object) {
                return sealer.open(object[property]());
            };

            // Make variables publicly available.
            accessor.sealer = sealer;
            accessor.property = property;
            accessor.initiate = initiate;

            return accessor;
        };

        initiate = function (object) {
            var privates = {},
                self = this;

            // Simple error handling
            if (object === undefined) {
                throw new Error("Must provide an object to create privates.");
            }

            // Cannot be a property that already exists
            if (Object.prototype.hasOwnProperty.call(object, this.property)) {
                throw new Error("Object already has a property " + accessor.property);
            }

            // Add the privy function
            Object.defineProperty(object, this.property, {
                value: function () {
                    // Send the privates through the sealer
                    return self.sealer.seal(privates);
                }
            });

            return privates;
        };

        return privy;
    }());

    if (typeof module !== "undefined" && typeof require !== "undefined") {
        module.exports = Privy;
    } else {
        window["Privy"] = Privy;
    }
}());