// @vitest-environment jsdom
import { test } from 'vitest';
import testBuilder from '../src/TestBuilder.js';
import assert from 'assert';

// console.table(testBuilder('{any: number, z: {x: number}, {any: number}}'));
const mapToObject = (map) => Object.fromEntries(map);

// Test testBuilder function
test('testBuilder with basic type', (t) => {
    const basicTypeTest = mapToObject(testBuilder('number'));
    assert(basicTypeTest.testMethod === 'basic');
});

test('basic Type: string', () => {
    const { testMethod, tests } = mapToObject(testBuilder('string'));
    assert(testMethod === 'basic');

    assert(tests[0]('str') === true);
    assert(tests[0](1) === false);
});

// Test for union types
test('Union Type: number | string', () => {
    const { testMethod, tests } = mapToObject(testBuilder('number | string'));
    assert(testMethod === 'basic');

    assert.equal(tests.length, 2);

    assert(tests[0](1) === true);
    assert(tests[1]('str') === true);
    assert(!tests.every((test) => test(null)));
});

// Test for optional types
test('Optional Type: number?', () => {
    const { testMethod, tests } = mapToObject(testBuilder('number?'));
    assert(testMethod === 'basic');
    // console.log(tests);
    assert(tests.length === 3); // number, null, undefined
    assert(tests.some((test) => test(null)));
    assert(tests.some((test) => test(undefined)));
    assert(!tests.every((test) => test('str')));
    // console.log('__testLogHere__', tests);
});

// =========================================
// --> ARRAY TESTS
// --------------------------

// Test for array types
test('Array Type: [number]', () => {
    const { testMethod, tests } = mapToObject(testBuilder('[number]'));
    assert(testMethod === 'array');

    // console.log(tests);
    assert(tests[0].get('tests')[0](1) === true);
    assert(tests[0].get('tests')[0]('str') === false);
});

test('Array Type: [number?]', () => {
    const { testMethod, tests } = mapToObject(testBuilder('[number?]'));
    assert(testMethod === 'array');
    assert(tests[0].get('tests')[0](1) === true);
    assert(tests[0].get('tests')[0]('str') === false);
    assert(tests[0].get('tests')[1](null) === true);
});

test('Array Type: [number | string]', () => {
    const { testMethod, tests } = mapToObject(testBuilder('[number | string]'));
    assert(testMethod === 'array');
    assert(tests[0].get('tests').some((test) => test(1)));
    assert(tests[0].get('tests').some((test) => test('str')));
    assert(!tests[0].get('tests').every((test) => test(null)));
});

test('Array Type: [number | string, null]', () => {
    const { testMethod, tests } = mapToObject(testBuilder('[number | string, null]'));
    assert(testMethod === 'array');
    assert(tests[0].get('tests').some((test) => test(1)));
    assert(tests[0].get('tests').some((test) => test('str')));
    assert(!tests[0].get('tests').every((test) => test(null)));
    assert(tests[1].get('tests').every((test) => test(null)));
});

test('Nester Array Type: [[number], [null]]', () => {
    const { testMethod, tests } = mapToObject(testBuilder('[[number], [null | string]]'));
    assert(testMethod === 'array');
    // console.log(tests.get('get('0')').get('tests'));
    assert(
        tests[0]
            .get('tests')[0]
            .get('tests')
            .some((test) => test(1))
    );
    assert(
        tests[1]
            .get('tests')[0]
            .get('tests')
            .some((test) => test('str'))
    );
    assert(
        !tests[1]
            .get('tests')[0]
            .get('tests')
            .every((test) => test(1))
    );
    assert(
        !tests[0]
            .get('tests')[0]
            .get('tests')
            .every((test) => test(null))
    );
});

// =========================================
// --> OBJECTS
// --------------------------

test('Object Type: {any: number}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{any: number}'));
    // console.log('__testLogHere__', tests.any);
    assert(testMethod === 'object');
    assert(tests.has('any'));
    assert(tests.get('any').get('tests')[0](1) === true);
    assert(tests.get('any').get('tests')[0]('str') === false);
});

test('Object Type: {x: number}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{x: number}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');
    assert(tests.has('x'));
    assert(tests.get('x').get('tests')[0](1) === true);
    assert(tests.get('x').get('tests')[0]('str') === false);
});
// create test for {x: number?}
test('Object Type: {x: number?}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{x: number?}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');
    assert(tests.has('x'));
    assert(tests.get('x').get('tests')[0](1) === true);
    assert(tests.get('x').get('tests')[0]('str') === false);
    assert(tests.get('x').get('tests')[1](null) === true);
});

// create test for {x?: number?}
test('Object Type: {x?: number?}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{x?: number?}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');
    assert(tests.has('x'));
    assert(tests.get('x').get('tests')[0](1) === true);
    assert(tests.get('x').get('tests')[0]('str') === false);
    assert(tests.get('x').get('tests')[1](null) === true);
});

// create test for {x: number, y: string}
test('Object Type: {x: number, y: string}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{x: number, y: string}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');
    assert(tests.has('x'));
    assert(tests.has('y'));
    assert(tests.get('x').get('tests')[0](1) === true);
    assert(tests.get('x').get('tests')[0]('str') === false);
    assert(tests.get('y').get('tests')[0]('str') === true);
    assert(tests.get('y').get('tests')[0](1) === false);
});

// create test for {x: number, y: string | number}
test('Object Type: {x: number, y: string | number}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{x: number, y: string | number}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');
    assert(tests.has('x'));
    assert(tests.has('y'));
    assert(tests.get('x').get('tests')[0](1) === true);
    assert(tests.get('x').get('tests')[0]('str') === false);
    assert(
        tests
            .get('y')
            .get('tests')
            .some((test) => test('str'))
    );
    assert(
        tests
            .get('y')
            .get('tests')
            .some((test) => test(1))
    );
});

// create test for {x: number, y: string | number, z: null}
test('Object Type: {x: number, y: string | number, z: null}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{x: number, y: string | number, z: null}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');
    assert(tests.has('x'));
    assert(tests.has('y'));
    assert(tests.has('z'));
    assert(tests.get('x').get('tests')[0](1) === true);
    assert(tests.get('x').get('tests')[0]('str') === false);
    assert(
        tests
            .get('y')
            .get('tests')
            .some((test) => test('str'))
    );
    assert(
        tests
            .get('y')
            .get('tests')
            .some((test) => test(1))
    );
    assert(
        tests
            .get('z')
            .get('tests')
            .some((test) => test(null))
    );
});

test('Nested Object in object: {{x: number}, {y: number}}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{{x: number}, {y: number}}'));
    assert(testMethod === 'object');
    // console.log(tests.get('0').get('tests'));
    assert(tests.get('0').get('tests').get('x').get('testMethod') === 'basic');
    assert(tests.get('1').get('tests').has('y'));
    assert(tests.get('1').get('tests').get('y').get('tests')[0](1) === true);
    assert(tests.get('1').get('tests').get('y').get('tests')[0]('str') === false);
});

// create test for {z: [number], x: string}
test('Object Type: {z: [number], x: string}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{z: [number], x: string}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');
    assert(tests.has('x'));
    assert(tests.get('z').get('testMethod') === 'array');
    assert(tests.get('x').get('tests')[0]('str') === true);
});

// create test for [{x: number}]
test('Array with objects Type: [{x: number}]', () => {
    const { testMethod, tests } = mapToObject(testBuilder('[{x: number}]'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'array');
    assert(tests[0].get('testMethod') === 'object');
    assert(tests[0].get('tests').has('x'));
    assert(tests[0].get('tests').get('x').get('tests')[0](1) === true);
    assert(tests[0].get('tests').get('x').get('tests')[0]('str') === false);
});
// create a test for [{x: number}, {y: number}]
test('Array Type: [{x: number}, {y: number}]', () => {
    const { testMethod, tests } = mapToObject(testBuilder('[{x: number}, {y: number}]'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'array');
    assert(tests[0].get('testMethod') === 'object');
    assert(tests[0].get('tests').has('x'));
    assert(tests[0].get('tests').get('x').get('tests')[0](1) === true);
    assert(tests[0].get('tests').get('x').get('tests')[0]('str') === false);
    assert(tests[1].get('testMethod') === 'object');
    assert(tests[1].get('tests').has('y'));
    assert(tests[1].get('tests').get('y').get('tests')[0](1) === true);
    assert(tests[1].get('tests').get('y').get('tests')[0]('str') === false);
});

test('Object Type: {key1: number | string, ...}', () => {
    const { testMethod, tests } = mapToObject(testBuilder('{key1: number | string, ...}'));
    // console.log('__testLogHere__', tests);
    assert(testMethod === 'object');

    assert(tests.has('key1'));
    assert(tests.get('key1').get('tests')[0](1) === true);
    assert(tests.get('key1').get('tests')[1]('str') === true);
});
