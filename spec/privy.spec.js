var Privy = require('../src/privy.js');

describe('Privy', function () {
    // Not so relavent on Node.js but as a reminded when done in the browser 
    it('should take the global name `Privy`', function () {
        expect(Privy).toBeDefined();
    });
});

describe('a Privy', function () {
    var p = new Privy();

    it('should be able to be created', function () {
        expect(p).toBeDefined();
    });

    it('is a function', function () {
        expect(typeof p).toBe('function');
    });

    it('has a default value for property', function () {
        expect(p.property).toBe('_');
    });

    it('has a sealer property', function () {
        expect(p.sealer).toBeDefined();
    });

    describe('sealer', function () {
        it('has an open method', function () {
            expect(p.sealer.open).toBeDefined();
            expect(typeof p.sealer.open).toBe('function');
        });

        it('has an seal method', function () {
            expect(p.sealer.seal).toBeDefined();
            expect(typeof p.sealer.seal).toBe('function');
        });

        it('returns undefined with an invalid key', function () {
            expect(p.sealer.open()).not.toBeDefined();
        });

        it('returns a key when sealing an object', function () {
            expect(p.sealer.seal({})).toBeDefined();
        });

        it('opens object with key', function () {
            var object = {},
                key = p.sealer.seal(object);

            expect(p.sealer.open(key)).toBe(object);
        });

        it('returns undefined to same key twice', function () {
            var key = p.sealer.seal({});

            expect(p.sealer.open(key)).toBeDefined();
            expect(p.sealer.open(key)).not.toBeDefined(); 
        });

        it('returns undefined to wrong key', function () {
            var key = p.sealer.seal({});

            expect(p.sealer.open({})).not.toBeDefined();
        });

        it('sealing two objects only opens second object', function () {
            var first_object  = {}, first_key  = p.sealer.seal(first_object),
                second_object = {}, second_key = p.sealer.seal(second_object);

            expect(p.sealer.open(first_key)).not.toBe(first_object);
            expect(p.sealer.open(second_key)).toBe(second_object);
        });
    });

    it('has a initiate function', function () {
        expect(typeof p.initiate).toBe('function');
    });

    describe('initiate', function () {
        it('throws without an object', function () {
            expect(function () { p.initiate(); }).toThrow();
        });

        it('throws if object already has the default property', function () {
            var object = { _ : true };

            expect(function () { p.initiate(object); }).toThrow();
        });

        it('adds a private function', function () {
            var object = {};

            expect(object[p.property]).not.toBeDefined();
            p.initiate(object);
            expect(typeof object[p.property]).toBe('function');
        });
    });

    describe('function', function () {
        var object = {},
            privates = p.initiate(object);

        it('returns privates for an initiated object', function () {
            expect(p(object)).toBe(privates);
        });

        it('throws with an un-initated object', function () {
            expect(function () { p({}) }).toThrow();
        });

        it('returns undefined if object is pretending', function () {
            var horse = { _ : function () { return {}; } };

            expect(p(horse)).not.toBeDefined();
        });
    });
});

describe('a Privy with custom property', function () {
    var custom = 'custom',
        p = new Privy(custom);

    it('uses the custom property', function () {
        expect(p.property).toBe(custom);
    });

    it('uses the custom property on initated objects', function () {
        var object = {};

        expect(object[p.property]).not.toBeDefined();
        p.initiate(object);
        expect(typeof object[p.property]).toBe('function');
    });
});

describe('Inheritance', function () {
    var p_alpha = new Privy(),
        p_beta  = new Privy();

    var object = {},
        alpha_privates = p_alpha.initiate(object),
        beta_privates  = p_beta.initiate(object);

    it('allows parent Privy function to access members', function () {
        expect(p_alpha(object)).toBe(alpha_privates);
    });

    it('allows child Privy function to access members', function () {
        expect(p_beta(object)).toBe(beta_privates);
    });
});
