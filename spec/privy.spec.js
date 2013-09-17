var Privy = require('../dist/privy-commonjs.min.js');

describe('Privy', function () {
    // Not so relavent on Node.js but as a reminded when done in the browser 
    it('should take the global name `Privy`', function () {
        expect(Privy).toBeDefined();
    });

    it('has a create function', function () {
        expect(typeof Privy.create).toBe('function');
    });
});

describe('a Privy', function () {
    var p = Privy.create();

    it('should be able to be created', function () {
        expect(p).toBeDefined();
    });

    it('is a function', function () {
        expect(typeof p).toBe('function');
    });

    it('has a default value for property', function () {
        expect(p.property).toBe('_');
    });

    it('has a seal function', function () {
        expect(p.seal).toBeDefined();
        expect(typeof p.seal).toBe('function');
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
        p = Privy.create(custom);

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
