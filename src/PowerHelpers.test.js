/**
 * @vitest-environment jsdom
 */
import { test } from 'vitest';
import assert from 'assert';
import {
    getDirectivesFromString,
    findAndReplaceInArray,
    getMatchInBetween,
    getMatchBlock,
    cleanStr,
    setExpString,
    setLookUpExp,
    removeQuotes,
    fixQuotes,
    addQuotes,
    findNested,
    convertKeysToSymbols,
    wildCardStringSearch,
    setWildCardString,
    getArrObjFromString,
} from '../index';

test('getDirectivesFromString - should convert string formats into objects', () => {
    //test for const regexIdOrClass = /^(\.|\#)([a-zA-Z]+)/g;
    let results = getDirectivesFromString('#hello');
    assert.deepEqual(results, { type: 'idOrClass', value: '#hello' });

    results = getDirectivesFromString('.hello');
    assert.deepEqual(results, { type: 'idOrClass', value: '.hello' });

    // test /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g;
    results = getDirectivesFromString('tablet(#hello)');
    assert.deepEqual(results, { type: 'idOrClassWithDirective', value: { tablet: '#hello' } });

    // create test for /^\[((.|\n)*?)\]$/gm
    results = getDirectivesFromString('[[value,value],value]');
    assert.deepEqual(results, { type: 'array', value: [['value', 'value'], 'value'] });

    // create test for /^\{((.|\n)*?)\:((.|\n)*?)\}/gm
    results = getDirectivesFromString('{ y: hello, x: world, z: [value,value]}');
    assert.deepEqual(results, {
        type: 'object',
        value: { y: 'hello', x: 'world', z: ['value', 'value'] },
    });

    // create test for /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm
    results = getDirectivesFromString('directive.tablet(values)');
    assert.deepEqual(results, { type: 'dotObject', value: { directive: { tablet: 'values' } } });

    // create test for directive.breakdown|breakdown2(...values)
    results = getDirectivesFromString('directive.breakdown|breakdown2(values)');
    assert.deepEqual(results, {
        type: 'dotObject',
        value: { directive: { breakdown: 'values', breakdown2: 'values' } },
    });
});
test('getArrObjFromString - should convert string formats into objects', () => {
    const result2 = getArrObjFromString('[[value,value],value]');
    assert.deepEqual(result2, [['value', 'value'], 'value']);
});

test('getArrObjFromString - should convert string formats into objects', () => {
    const result2 = getArrObjFromString('[[value,value],value, { y: hello }, hello]');
    assert.deepEqual(result2, [['value', 'value'], 'value', { y: 'hello' }, 'hello']);
});

test('getArrObjFromString - should convert string formats into objects', () => {
    const result2 = getArrObjFromString('[[value,value], { y: hello, x: world }, hello]');
    assert.deepEqual(result2, [['value', 'value'], { y: 'hello', x: 'world' }, 'hello']);
});

test('getArrObjFromString - should convert string formats into objects', () => {
    const result2 = getArrObjFromString('{ y: hello, x: world, z: [value,value]}');
    assert.deepEqual(result2, { y: 'hello', x: 'world', z: ['value', 'value'] });
});

test('findAndReplaceInArray - should replace all occurrences of a value in an array', () => {
    const arr = [1, 2, 3, 4, 5];
    const find = 3;
    const value = 'three';
    const result = findAndReplaceInArray(arr, find, value);
    assert.deepEqual(result, [1, 2, 'three', 4, 5]);

    const arr2 = [1, 2, 3, 4, 5];
    const find2 = 6;
    const value2 = 'six';
    const result2 = findAndReplaceInArray(arr2, find2, value2);
    assert.deepEqual(result2, null);

    const arr3 = [
        [1, 2],
        [3, 4],
        [5, 6],
    ];
    const find3 = 4;
    const value3 = 'four';
    const result3 = findAndReplaceInArray(arr3, find3, value3);
    assert.deepEqual(result3, [
        [1, 2],
        [3, 'four'],
        [5, 6],
    ]);
});

test('getMatchInBetween - should return the string between two delimiters', () => {
    let str = 'hello world';
    let p1 = 'h';
    let p2 = 'd';
    let result = getMatchInBetween(str, p1, p2);
    assert.equal(result, 'ello worl');

    const str2 = 'hello <world/>';
    const p12 = '<';
    const p22 = '/>';
    const result2 = getMatchInBetween(str2, p12, p22, true);
    assert.deepEqual(result2, ['world']);

    const str3 = 'hello <world/>';
    const p13 = '<';
    const p23 = '/>';
    const result3 = getMatchInBetween(str3, p13, p23);
    assert.equal(result3, 'world');

    str = '[[hello world]';
    p1 = '[';
    p2 = ']';
    result = getMatchInBetween(str, p1, p2);
    assert.equal(result, '[hello world');
});

test('getMatchBlock - should return the string between two matching delimiters', () => {
    const str = 'hello {world}';
    const p1 = '{';
    const p2 = '}';
    const result = getMatchBlock(str, p1, p2);
    assert.equal(result, '{world}');

    const str2 = 'hello {world {nested} }';
    const p12 = '{';
    const p22 = new RegExp('}$', 'g');
    const result2 = getMatchBlock(str2, p12, p22);
    assert.equal(result2, '{world {nested} }');

    const str3 = 'hello {world';
    const p13 = '{';
    const p23 = '}';
    const result3 = getMatchBlock(str3, p13, p23);
    assert.equal(result3, null);
});

test('cleanStr - should remove the delimiters from a string', () => {
    const str = '<world/>';
    const p1 = '<';
    const p2 = '/>';
    const result = cleanStr(str, p1, p2);
    assert.equal(result, 'world');

    const str2 = '<hello>';
    const p12 = '<';
    const p22 = '>';
    const result2 = cleanStr(str2, p12, p22);
    assert.equal(result2, 'hello');

    const str3 = '<world/>';
    const p13 = '<';
    const p23 = '>';
    const result3 = cleanStr(str3, p13, p23);
    assert.equal(result3, 'world/');

    const str4 = '<world/>';
    const p14 = '<';
    const p24 = '>';
    const result4 = cleanStr(str4, p14, p24, '/');
    assert.equal(result4, 'world');
});

test('setExpString - should set a string as a regular expression', () => {
    const string = 'hello world';
    const result = setExpString(string);
    assert.deepEqual(result, 'hello world');

    const string2 = 'a*b*c';
    const result2 = setExpString(string2);
    assert.deepEqual(result2, 'a\\*b\\*c');

    const string3 = new RegExp('a+b+c', 'g');
    const result3 = setExpString(string3);
    assert.deepEqual(result3, /a+b+c/g);
});

test('removeQuotes - should remove quotes from a string', () => {
    const result = removeQuotes('"hello"');
    assert.equal(result, 'hello');

    const result2 = removeQuotes("'world'");
    assert.equal(result2, 'world');

    const result3 = removeQuotes('`foo`');
    assert.equal(result3, 'foo');
});

test('fixQuotes - should replace single quotes with double quotes in a string', () => {
    const result = fixQuotes("'hello'");
    assert.equal(result, '"hello"');

    const result2 = fixQuotes('`world`');
    assert.equal(result2, '"world"');

    const result3 = fixQuotes("foo's bar");
    assert.equal(result3, 'foo"s bar');
});

test('addQuotes - should add double quotes around a string', () => {
    const result = addQuotes('hello');
    assert.equal(result, '"hello"');

    const result2 = addQuotes('world');
    assert.equal(result2, '"world"');

    const result3 = addQuotes('foo bar');
    assert.equal(result3, '"foo bar"');
});

test('findNested - should return the nested object value', () => {
    const result = findNested('[[holw]hello, [world]]', '[', ']');
    assert.equal(result, '[world]');
    const result2 = findNested('[[holw]hello {world}]', '{', '}');
    assert.equal(result2, '{world}');
});

test('convertKeysToSymbols - should convert object keys to symbols', () => {
    const obj = { a: 1, b: 2 };
    const result = convertKeysToSymbols(obj);
    const symbolKeys = Object.getOwnPropertySymbols(result);
    assert.equal(symbolKeys.length, 2);
    assert.equal(result[symbolKeys[0]], 1);
    assert.equal(result[symbolKeys[1]], 2);

    const obj2 = { foo: 'bar', baz: 'qux' };
    const result2 = convertKeysToSymbols(obj2);
    const symbolKeys2 = Object.getOwnPropertySymbols(result2);
    assert.equal(symbolKeys2.length, 2);
    assert.equal(result2[symbolKeys2[0]], 'bar');
    assert.equal(result2[symbolKeys2[1]], 'qux');

    const obj3 = { a: 1, b: 2, c: 3 };
    const result3 = convertKeysToSymbols(obj3);
    const symbolKeys3 = Object.getOwnPropertySymbols(result3);
    assert.equal(symbolKeys3.length, 3);
    assert.equal(result3[symbolKeys3[0]], 1);
    assert.equal(result3[symbolKeys3[1]], 2);
    assert.equal(result3[symbolKeys3[2]], 3);
});

test('wildCardStringSearch - should return an array of matches', () => {
    const list = ['hello world', 'hello', 'hello world tomorrow', 'there is a hello world'];
    const string = 'hello*tomorrow';

    const result = wildCardStringSearch(string, list, true, true);
    assert.deepEqual(result, ['hello world tomorrow']);
});

test('setWildCardString - should set a wildcard at the end of a string', () => {
    const string = 'a';
    const result = setWildCardString(string, null, true);
    assert.equal(result, 'a$');

    const string2 = 'abc';
    const result2 = setWildCardString(string2, null, true);
    assert.equal(result2, 'abc$');

    const string3 = 'a*b*c';
    const result3 = setWildCardString(string3, null, true);
    assert.equal(result3, 'a(.*?)b(.*?)c$');
});
