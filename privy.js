(function () {
    var Privy = {}, createAccessor, createPrivates, createSealer;

    createSealer = function () {
        var value, key;

        return {
            seal: function (object) {
                value = object;
                key = {};

                return key;
            },
            open: function (given) {
                if (given === key) {
                    return value;
                }
            }
        };
    }

    createAccessor = function (property) {
        var secret = {},
            sealer = createSealer();

        if (property === undefined) {
            property = "_";
        }

        // Syntactic sugar for handshake with privy function
        function accessor(object) {
            var proof = {};

            // Verifies that the private function is who they say they are.
            return object[property](proof, function (key) {
                // Privy function should set access value to proof
                if (sealer.open(key) !== proof) {
                    throw new Error('Unauthorized access to private members.');
                }

                // We now trust the private function
                return sealer.seal(secret);
            });
        }

        // Make variables publicly available.
        accessor.secret = secret;
        accessor.sealer = sealer;
        accessor.property = property;

        return accessor;
    };

    createPrivates = function (object, accessor) {
        var privates = {};

        // Simple error handling
        if (object === undefined || accessor === undefined) {
            throw new Error("Must provide an object and an accessor");
        }

        // Cannot be a property that already exists
        if (Object.prototype.hasOwnProperty.call(object, accessor.property)) {
            throw new Error("Object already has a property " + accessor.property);
        }

        // Add the privy function
        Object.defineProperty(object, accessor.property, {
            value: function (proof, callback) {
                // Clear expecting
                var key = callback(accessor.sealer.seal(proof))

                // Retrieve secret from caller
                if (accessor.sealer.open(key) === accessor.secret) {
                    return privates;
                }
            }
        });

        return privates;
    };

    // Define immutable propeties on the export
    Object.defineProperties(Privy, {
        "createAccessor": { value: createAccessor },
        "createPrivates": { value: createPrivates }
    });

    if (typeof module !== "undefined" && typeof require !== "undefined") {
        module.exports = Privy;
    } else {
        window["Privy"] = Privy;
    }
}());