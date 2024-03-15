// @vitest-environment jsdom
import { test } from 'vitest';
import { addTypeTest, _typeCheck, typeCheck, _tc, _tcx, validType, typesMap } from '../src/TypeCheck.js';
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

_typeCheck([1, { x: 'string', y: 10, z: 20 }, 3], '[number, {y: string, x: string}, number]').test();
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
console.log(_typeCheck([1], '[number]', { fail: true, log: true, return: true, callback: () => {} }));
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
        _typeCheck([1, { x: 'string', y: 10, z: 20 }, 3], '[number, {any: string, x: string}, number]').test(),
        false
    );
    assert.equal(_typeCheck([1, { x: 'string', y: 10, z: 20 }, 3], '[number, {any: string}, number]').test(), false);
    assert.equal(
        _typeCheck([1, { x: 'string', y: 10, z: 20 }, 3], '[number, {any: number, x: string}, number]').test(),
        true
    );
});

// test objects
// Test for object types
test('Object Type: {x: string, y: number, z?: number}', () => {
    assert.equal(_typeCheck({ x: 'string', y: 10 }, '{x: string, y: number, z?: number}').test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, z?: number}').test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 'str' }, '{x: string, y: number, z: number?}').test(), false);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, ...}').test(), true);
});

// create tests for {key1: type}
test('objects: {key: type}', () => {
    assert.equal(_typeCheck({ x: 'string', y: 10 }, '{x: string, y: number}').test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 'str' }, '{x: string, y: number}').test(), false);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number}').test(), false);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 'str' }, '{x: string, y: number, ...}').test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, any: number}').test(), true);
});

// create tests for {key1: type, key2: type}
test('objects: {key: type, key: type}', () => {
    assert.equal(_typeCheck({ x: 2, y: 10 }, '{x: string|number, y: number}').test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 'str' }, '{x: string, y: number|null}').test(), false);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, z?: number}').test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 'str' }, '{x: string, y: number}').test(), false);
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
    assert.equal(_typeCheck({ y: 33, x: null }, '{y: number, any: number|null}').log().test(), true);
    assert.equal(_typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, any: number}').test(), true);
});

test('array with objects: [{key: type, key: type}]', () => {
    // console.log(typeCheck([{ x: 2, y: 10 }], '[{x: number}]').log());
    assert.equal(_typeCheck([{ x: 2, y: 10 }], '[{x: number, ...}]').test(), true);
    assert.equal(_typeCheck([{ x: 2, y: 10 }], '[{x: number, any: number}]').test(), true);
});
