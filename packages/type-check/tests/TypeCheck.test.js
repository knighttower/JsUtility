// @vitest-environment jsdom
import { test, describe, expect } from 'vitest';
import {
    addTypeTest,
    _typeCheck,
    typeCheck,
    _tc,
    _tcx,
    validType,
    typesMap,
} from '../src/typeCheck.js';
import assert from 'assert';

const benchmark = (name, fn, iterations) => {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        fn();
    }

    const end = performance.now();

    console.log(`${name}: ${(end - start).toFixed(3)}ms`);
};

const recordsTotest = 1000;
// Benchmark the _tc function with 100 records
benchmark(
    '_tc',
    () => {
        const typeExp = ['[number]'];
        const __function = (x) => x;
        const params = {};

        const tc = _tc(typeExp, __function, params);

        const records = [];
        for (let i = 1; i < 10; i++) {
            records.push(i);
        }

        tc(records);
    },
    recordsTotest
);

// Benchmark the _tcx function with 10 records
benchmark(
    '_tcx',
    () => {
        const typeExp = ['[number]'];
        const __function = (x) => x + 1;
        const params = {};

        const tcx = _tcx(typeExp, __function, params);

        const records = [];
        for (let i = 0; i < 10; i++) {
            records.push(i);
        }

        tcx(records);
    },
    recordsTotest
);
addTypeTest('customTypeTest', function (x) {
    return typeof x === 'number';
});
if (_typeCheck([1], '[customTypeTest]').test()) {
    console.log(999);
}
console.log('______log______', typesMap);

_typeCheck(
    [1, { x: 'string', y: 10, z: 20 }, 3],
    '[number, {y: string, x: string}, number]'
).test();
if (_typeCheck([1], '[string]').test()) {
    console.log(3);
}
if (_typeCheck([1], '[number]').test()) {
    console.log(66);
}
console.log(_typeCheck([1], '[number]', { log: true }).return());
console.log(_typeCheck([1], '[number]', 'log').test());
console.log(_typeCheck([1], '[number]').log());

console.log(_typeCheck([1], '[number]', 'fail'));
console.log(_typeCheck([1], '[number]', { fail: true }));

console.log(_typeCheck([1], '[number]', { fail: true, log: true }));
console.log(
    _typeCheck([1], '[number]', { fail: true, log: true, return: true, callback: () => {} })
);
console.log(
    _typeCheck([1], '[number]', {
        fail: true,
        log: true,
        callback: () => {
            console.log('__testLogHere__');
        },
    })
);

console.log(_typeCheck([1], '[number]').return()); // returns [1], the inputValue

let myCoolFunction;
myCoolFunction = _tc(['number', 'string'], function (myVar, hello) {
    //code
    console.log(myVar, hello);
    return 1000;
});

myCoolFunction(44.5, 'hello', {});

myCoolFunction = _tcx(
    ['number', 'string'],
    function (myVar, hello) {
        //code
        return [myVar, hello];
    },
    { validOutput: '[number, string]' }
);
console.log(myCoolFunction(44.5, 'yes!').return()); //gets the return value of the function
myCoolFunction(44.5, 'dude!'); //logs dude! and then triggers failure
myCoolFunction(44.5, 'wow!'); //logs wow! and then triggers log
myCoolFunction(44.5, 'nooo').log(); // logs hello and then does something else

console.log(validType([1], '[number]'));
typeCheck(['rrr'], '[string]');

// Test for array types
test('Array Type', () => {
    assert.equal(_typeCheck([], '[null]').test(), false);
    assert.equal(_typeCheck([null], '[null]').test(), true);
    assert.equal(_typeCheck([1], '[number]').test(), true);
    assert.equal(_typeCheck(['str'], '[number]').test(), false);
    assert.equal(_typeCheck([1, 'str'], '[number, string]').test(), true);
    assert.equal(_typeCheck([1, 3, null], '[number, number, string]').test(), false);
    assert.equal(
        _typeCheck(
            [1, { x: 'string', y: 10, z: 20 }, 3],
            '[number, {any: string, x: string}, number]'
        ).test(),
        false
    );
    assert.equal(
        _typeCheck([1, { x: 'string', y: 10, z: 20 }, 3], '[number, {any: string}, number]').test(),
        false
    );
    assert.equal(
        _typeCheck(
            [1, { x: 'string', y: 10, z: 20 }, 3],
            '[number, {any: number, x: string}, number]'
        ).test(),
        true
    );
});

// test objects
// Test for object types
test('Object Type: {x: string, y: number, z?: number}', () => {
    assert.equal(
        _typeCheck({ x: 'string', y: 10 }, '{x: string, y: number, z?: number}').test(),
        true
    );
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, z?: number}').test(),
        true
    );
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 'str' }, '{x: string, y: number, z: number?}').test(),
        false
    );
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, ...}').test(),
        true
    );
});

// create tests for {key1: type}
test('objects: {key: type}', () => {
    assert.equal(_typeCheck({ x: 'string', y: 10 }, '{x: string, y: number}').test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 'str' }, '{x: string, y: number}').test(), false);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number}').test(), false);
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 'str' }, '{x: string, y: number, ...}').test(),
        true
    );
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, any: number}').test(),
        true
    );
});

// create tests for {key1: type, key2: type}
test('objects: {key: type, key: type}', () => {
    assert.equal(_typeCheck({ x: 2, y: 10 }, '{x: string|number, y: number}').test(), true);
    assert.equal(
        _typeCheck({ x: 'string', y: 'str' }, '{x: string, y: number|null}').test(),
        false
    );
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, z?: number}').test(),
        true
    );
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 'str' }, '{x: string, y: number}').test(),
        false
    );
});

// create tests for {key1: type}
test('objects: {key: any}', () => {
    assert.equal(_typeCheck({}, '{any: null}').log().test(), true);
    assert.equal(_typeCheck({}, '{any: number}').log().test(), false);
    assert.equal(_typeCheck({}, '{any: number|string}').log().test(), false);
    assert.equal(_typeCheck({}, '{any: number|string|null}').log().test(), true);
    assert.equal(_typeCheck({}, '{any: array}').log().test(), false);
    assert.equal(_typeCheck({ x: null }, '{any: null}').log().test(), true);
    assert.equal(_typeCheck({ x: null }, '{any: number}').log().test(), false);
    assert.equal(_typeCheck({ x: null }, '{any: number|string}').log().test(), false);
    assert.equal(_typeCheck({ x: null }, '{any: number|string|null}').log().test(), true);
    assert.equal(_typeCheck({ y: 33, x: null }, '{any: array}').log().test(), false);
    assert.equal(_typeCheck({ y: 33, x: null }, '{any: number}').log().test(), false);
    assert.equal(_typeCheck({ y: 33, x: null }, '{any: number|string}').log().test(), false);
    assert.equal(
        _typeCheck({ y: 33, x: null }, '{y: number, any: number|null}').log().test(),
        true
    );
    assert.equal(
        _typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, any: number}').test(),
        true
    );
});

test('array with objects: [{key: type, key: type}]', () => {
    // console.log(typeCheck([{ x: 2, y: 10 }], '[{x: number}]').log());
    assert.equal(_typeCheck([{ x: 2, y: 10 }], '[{x: number, ...}]').test(), true);
    assert.equal(_typeCheck([{ x: 2, y: 10 }], '[{x: number, any: number}]').test(), true);
});

describe('Enum Type Tests', () => {
    test('Basic enum validation', () => {
        expect(validType('red', 'enum=red/green/blue')).toBe(true);
        expect(validType('yellow', 'enum=red/green/blue')).toBe(false);
        expect(validType('green', 'enum=red/green/blue')).toBe(true);
        expect(validType('blue', 'enum=red/green/blue')).toBe(true);
    });

    test('Enum with union types', () => {
        expect(validType('red', 'string|enum=red/green/blue')).toBe(true);
        expect(validType('yellow', 'string|enum=red/green/blue')).toBe(true); // valid string
        expect(validType(123, 'number|enum=red/green/blue')).toBe(true); // valid number
        expect(validType(true, 'boolean|enum=red/green/blue')).toBe(true); // valid boolean
    });

    test('Optional enum types', () => {
        expect(validType('red', 'enum=red/green/blue?')).toBe(true);
        expect(validType(null, 'enum=red/green/blue?')).toBe(true);
        expect(validType(undefined, 'enum=red/green/blue?')).toBe(true);
        expect(validType('yellow', 'enum=red/green/blue?')).toBe(false);
    });

    test('Enum with numbers as strings', () => {
        expect(validType('1', 'enum=1/2/3')).toBe(true);
        expect(validType('2', 'enum=1/2/3')).toBe(true);
        expect(validType('4', 'enum=1/2/3')).toBe(false);
    });

    test('Enum with spaces in values', () => {
        expect(validType('option A', 'enum=option A/option B/option C')).toBe(true);
        expect(validType('option B', 'enum=option A/option B/option C')).toBe(true);
        expect(validType('option D', 'enum=option A/option B/option C')).toBe(false);
    });

    test('Enum in function wrappers', () => {
        const enumFunction = _tc('[enum=admin/user/guest]', (role) => {
            return `Role: ${role}`;
        });

        expect(() => enumFunction('admin')).not.toThrow();
        expect(() => enumFunction('invalid')).toThrow();
    });

    test('Enum with array validation', () => {
        expect(validType(['red', 'blue'], '[enum=red/green/blue]')).toBe(true);
        expect(validType(['reds', 'yellow'], '[enum=red/green/blue]')).toBe(false);
    });

    test('Enum in object validation', () => {
        const testObj = { status: 'active', priority: 'high' };
        expect(
            validType(
                testObj,
                '{status: enum=active/inactive/pending, priority: enum=low/medium/high}'
            )
        ).toBe(true);

        const invalidObj = { status: 'unknown', priority: 'high' };
        expect(
            validType(
                invalidObj,
                '{status: enum=active/inactive/pending, priority: enum=low/medium/high}'
            )
        ).toBe(false);
    });
});
