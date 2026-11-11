/**
 * @vitest-environment jsdom
 */
import { test, vi, expect } from 'vitest';
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
    getChunks,
    startAndEndWith,
    getObjectFromPath,
    proxyObject,
    getObjectValue,
} from '../src/powerHelper.js';
// console.log(proxyObject({ a: 1, b: 2, c: 3 }));

vi.setConfig({
    testTimeout: 50000,
});
let results = '';

// getDirectivesFromString

// getDirectivesFromString
test('getDirectivesFromString - quoted single', () => {
    results = getDirectivesFromString("{'hello': 'this', 'world': {'one': 1, 'two': 'two'}}");
    assert.deepEqual(results, {
        type: 'object',
        directive: { hello: 'this', world: { one: 1, two: 'two' } },
    });
});
test('getDirectivesFromString - Get directives from string', () => {
    results = getDirectivesFromString("{hello: 'this', world: {one: 1, two: 'two'}}");
    assert.deepEqual(results, {
        type: 'object',
        directive: { hello: 'this', world: { one: 1, two: 'two' } },
    });
});
test('getDirectivesFromString - quoted double', () => {
    results = getDirectivesFromString('{"hello": "this", "world": {"one": "1", "two": "two"}}');
    assert.deepEqual(results, {
        type: 'object',
        directive: { hello: 'this', world: { one: 1, two: 'two' } },
    });
});

test('getDirectivesFromString - Get directives from string', () => {
    results = getDirectivesFromString('{hello: "this", world: {one: 1, two: "two"}}');
    assert.deepEqual(results, {
        type: 'object',
        directive: { hello: 'this', world: { one: 1, two: 'two' } },
    });
});
test('getDirectivesFromString - Deep nested', () => {
    results = getDirectivesFromString('{hello: "this"}');
    console.log('______ result ______', results);
    results = getDirectivesFromString('{hello: "this", world: {one: 1, two: "two"}}');
    console.log('______ result ______', results);
    results = getDirectivesFromString('{hello: "this", world: {one: 1, two: {three: 3, four: 4}}}');
    console.log('______ result ______', results);
    results = getDirectivesFromString(
        '{hello: "this", world: [[value,value],{inner: "other"}, otherValue]}'
    );
    console.log('______ result ______', results);
    results = getDirectivesFromString(
        '[{hello: "this", world: {one: 1, two: {three: 3, four: [1,2,3]}}}]'
    );
    results = getDirectivesFromString(
        '[{hello: "this", world: [[value,value],{inner: "other"}, otherValue]}]'
    );
    console.log('______ result ______', results);
    // results = getDirectivesFromString('{hello: "this", world: {one: 1, two: {three: 3, four: 4}}}');
    // assert.deepEqual(results, {
    //     type: 'object',
    //     directive: { hello: 'this', world: { one: 1, two: { three: 3, four: 4 } } },
    // });
});

test('getDirectivesFromString - should convert string formats into objects', () => {
    //test for const regexIdOrClass = /^(\.|\#)([a-zA-Z]+)/g;
    results = getDirectivesFromString('#hello');
    assert.deepEqual(results, { type: 'string', directive: '#hello' });

    results = getDirectivesFromString('.hello');
    assert.deepEqual(results, { type: 'string', directive: '.hello' });

    // test /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g;
    results = getDirectivesFromString('tablet(#hello)');
    assert.deepEqual(results, { type: 'idOrClassWithDirective', directive: { tablet: '#hello' } });

    // create test for /^\[((.|\n)*?)\]$/gm
    results = getDirectivesFromString('[[value,value],value]');
    // console.log('___ log ___', results);
    assert.deepEqual(results, { type: 'array', directive: [['value', 'value'], 'value'] });

    results = getDirectivesFromString('[["value","value"],"value"]');
    // console.log('___ log ___', results);
    assert.deepEqual(results, { type: 'array', directive: [['value', 'value'], 'value'] });

    results = getDirectivesFromString("[['value','value'],'value']");
    // console.log('___ log ___', results);
    assert.deepEqual(results, { type: 'array', directive: [['value', 'value'], 'value'] });

    // create test for /^\{((.|\n)*?)\:((.|\n)*?)\}/gm
    results = getDirectivesFromString('{ y: hello, x: world, z: [value,value]}');
    assert.deepEqual(results, {
        type: 'object',
        directive: { y: 'hello', x: 'world', z: ['value', 'value'] },
    });

    // create test for /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm
    results = getDirectivesFromString('directive.tablet(values)');
    assert.deepEqual(results, {
        type: 'dotObject',
        directive: { directive: { tablet: 'values' } },
    });

    // create test for directive.breakdown|breakdown2(...values)
    results = getDirectivesFromString('directive.breakdown|breakdown2(values)');
    assert.deepEqual(results, {
        type: 'dotObject',
        directive: { directive: { breakdown: 'values', breakdown2: 'values' } },
    });

    results = getDirectivesFromString(
        "directive.tablet({to: '#hello'})&&directive.mobile({to: '#world'})"
    );
    assert.deepEqual(results, {
        type: 'dotObject',
        directive: { directive: { tablet: { to: '#hello' }, mobile: { to: '#world' } } },
    });
    results = getDirectivesFromString(
        "directive.tablet(#hello .world)&&directive.mobile({to: '#world'})"
    );
    assert.deepEqual(results, {
        type: 'dotObject',
        directive: { directive: { tablet: '#hello .world', mobile: { to: '#world' } } },
    });
});

test('getArrObjFromString - should convert string formats into objects', () => {
    let results;
    results = getArrObjFromString('{ y: hello, x: world, z: [value,value]}');
    assert.deepEqual(results, { y: 'hello', x: 'world', z: ['value', 'value'] });
    results = getArrObjFromString('{ y: hello, x: world, z: [value,value]}');
    assert.deepEqual(results, { y: 'hello', x: 'world', z: ['value', 'value'] });
    results = getArrObjFromString('[[value,value], { y: hello, x: world }, hello]');
    assert.deepEqual(results, [['value', 'value'], { y: 'hello', x: 'world' }, 'hello']);
    results = getArrObjFromString('[[value,value],value, { y: hello }, hello]');
    assert.deepEqual(results, [['value', 'value'], 'value', { y: 'hello' }, 'hello']);
    results = getArrObjFromString('[[value,value],value]');
    assert.deepEqual(results, [['value', 'value'], 'value']);

    results = getArrObjFromString('{{y:hello}, {x: world}, z: tomorrow}');
    assert.deepEqual(results, { 0: { y: 'hello' }, 1: { x: 'world' }, z: 'tomorrow' });
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

// =========================================
// --> Edge cases
// --------------------------
test('getDirectivesFromString - never writes into built-in objects', () => {
    const originalKeys = Object.keys;
    let keysAfter, results2, results3;
    try {
        results = getDirectivesFromString('constructor.keys(1)');
        keysAfter = Object.keys;
        results2 = getDirectivesFromString('__proto__.polluted.x(1)');
        results3 = getDirectivesFromString('toString.polluted(1)');
        assert.strictEqual(keysAfter, originalKeys);
        assert.strictEqual({}.polluted, undefined);
        assert.strictEqual({}.toString.polluted, undefined);
    } finally {
        Object.keys = originalKeys;
        delete Object.prototype.polluted;
        delete Object.prototype.toString.polluted;
    }
    // the names are still usable as directives, they just stay inside the result
    assert.ok(Object.prototype.hasOwnProperty.call(results.directive, 'constructor'));
    assert.deepStrictEqual(results.directive.constructor, { keys: '1' });
    assert.deepStrictEqual(results2, { type: 'dotObject', directive: {} });
    assert.deepStrictEqual(results3.directive.toString, { polluted: '1' });
});

test('getDirectivesFromString - parts that are not a directive are skipped', () => {
    const expected = { type: 'dotObject', directive: { a: { b: '1' } } };
    assert.deepStrictEqual(getDirectivesFromString('a.b(1) && foo'), expected);
    assert.deepStrictEqual(getDirectivesFromString('a.b(1)&&'), expected);
    assert.deepStrictEqual(getDirectivesFromString('a.b|(1)'), expected);
});

test('getDirectivesFromString - input that is not a string is returned with its type', () => {
    const list = ['a'];
    assert.deepStrictEqual(getDirectivesFromString(5), { type: 'number', directive: 5 });
    assert.deepStrictEqual(getDirectivesFromString(true), { type: 'boolean', directive: true });
    assert.deepStrictEqual(getDirectivesFromString(list), { type: 'object', directive: list });
    assert.deepStrictEqual(getDirectivesFromString({ a: 1 }), {
        type: 'object',
        directive: { a: 1 },
    });
    assert.strictEqual(getDirectivesFromString(''), null);
    assert.strictEqual(getDirectivesFromString(null), null);
    assert.strictEqual(getDirectivesFromString([]), null);
});

test('getDirectivesFromString - valid JSON is kept as it is', () => {
    assert.deepStrictEqual(getDirectivesFromString('{"a": "it\'s", "b": [1, "x,y"]}'), {
        type: 'object',
        directive: { a: "it's", b: [1, 'x,y'] },
    });
    assert.deepStrictEqual(getDirectivesFromString('["a,b", "c"]'), {
        type: 'array',
        directive: ['a,b', 'c'],
    });
});

test('getDirectivesFromString - surrounding spaces and line breaks', () => {
    assert.deepStrictEqual(getDirectivesFromString('  {a: hello}  '), {
        type: 'object',
        directive: { a: 'hello' },
    });
    assert.deepStrictEqual(getDirectivesFromString('{\r\n  a: hello,\r\n  b: [1, 2]\r\n}'), {
        type: 'object',
        directive: { a: 'hello', b: [1, 2] },
    });
    assert.deepStrictEqual(getDirectivesFromString('\n[a, b]\n'), {
        type: 'array',
        directive: ['a', 'b'],
    });
    assert.deepStrictEqual(getDirectivesFromString('directive.tablet(\r\n{to: here}\r\n)'), {
        type: 'dotObject',
        directive: { directive: { tablet: { to: 'here' } } },
    });
    // plain strings are returned untouched
    assert.deepStrictEqual(getDirectivesFromString(' #hello '), {
        type: 'string',
        directive: ' #hello ',
    });
});

test('getDirectivesFromString - a long string that never closes is still fast', () => {
    const start = performance.now();
    results = getDirectivesFromString('{' + 'a:'.repeat(20000));
    assert.strictEqual(results.type, 'string');
    assert.ok(performance.now() - start < 300, 'took too long');
});

test('getArrObjFromString - the word null, and colons inside values', () => {
    assert.deepStrictEqual(getArrObjFromString('{y: {a: 1}, x: null}'), {
        y: { a: 1 },
        x: 'null',
    });
    assert.deepStrictEqual(getArrObjFromString('{x: null, y: {a: 1}}'), {
        x: 'null',
        y: { a: 1 },
    });
    assert.deepStrictEqual(getArrObjFromString('[{a: 1}, null]'), [{ a: 1 }, 'null']);
    assert.deepStrictEqual(getArrObjFromString('{url: http://x.com/a, t: 10:30}'), {
        url: 'http://x.com/a',
        t: '10:30',
    });
    assert.deepStrictEqual(getArrObjFromString('[a:b, 10:30]'), ['a:b', '10:30']);
});

test('getArrObjFromString - extra commas are ignored', () => {
    assert.deepStrictEqual(getArrObjFromString('[a,b,]'), ['a', 'b']);
    assert.deepStrictEqual(getArrObjFromString('[a,,b]'), ['a', 'b']);
    assert.deepStrictEqual(getArrObjFromString('[ , ]'), []);
    assert.deepStrictEqual(getArrObjFromString('{a: 1,}'), { a: 1 });
    assert.deepStrictEqual(getArrObjFromString('{a: 1,, b: [2,],}'), { a: 1, b: [2] });
});

test('getArrObjFromString - surrounding spaces and line breaks', () => {
    assert.deepStrictEqual(getArrObjFromString(' [a, b] '), ['a', 'b']);
    assert.deepStrictEqual(getArrObjFromString('[\n a,\n b\n]'), ['a', 'b']);
    assert.deepStrictEqual(
        getArrObjFromString('{\r\n a: 1,\r\n b: [2, 3],\r\n c: {\r\n  d: x\r\n }\r\n}'),
        {
            a: 1,
            b: [2, 3],
            c: { d: 'x' },
        }
    );
});

test('getArrObjFromString - anything that is not a collection is returned untouched', () => {
    const object = { a: 1 };
    const list = [1];
    assert.strictEqual(getArrObjFromString(object), object);
    assert.strictEqual(getArrObjFromString(list), list);
    assert.strictEqual(getArrObjFromString(5), 5);
    assert.strictEqual(getArrObjFromString(true), true);
    assert.strictEqual(getArrObjFromString(null), null);
    assert.strictEqual(getArrObjFromString(undefined), undefined);
    assert.strictEqual(getArrObjFromString(''), '');
    assert.strictEqual(getArrObjFromString('hello'), 'hello');
    assert.strictEqual(getArrObjFromString(' hello '), ' hello ');
    assert.strictEqual(getArrObjFromString('[hello'), '[hello');
    assert.strictEqual(getArrObjFromString('{a: 1]'), '{a: 1]');
});

test('getArrObjFromString - keys, values and nesting', () => {
    // values: numbers are converted, quotes are removed
    assert.deepStrictEqual(getArrObjFromString('[1, 2.5, "7", abc, \'x y\', -3]'), [
        1,
        2.5,
        7,
        'abc',
        'x y',
        -3,
    ]);
    // entries without a key get their position as the key
    assert.deepStrictEqual(getArrObjFromString('{a: string, ...}'), { a: 'string', 1: '...' });
    assert.deepStrictEqual(getArrObjFromString('{"a": 1, \'b\': 2, 3: c}'), { a: 1, b: 2, 3: 'c' });
    assert.deepStrictEqual(getArrObjFromString('{a: }'), { a: undefined });
    assert.deepStrictEqual(getArrObjFromString('[]'), []);
    assert.deepStrictEqual(getArrObjFromString('{}'), {});
    assert.deepStrictEqual(getArrObjFromString('[ [ ], { } ]'), [[], {}]);
    assert.deepStrictEqual(getArrObjFromString('[[a],[a]]'), [['a'], ['a']]);
    assert.deepStrictEqual(getArrObjFromString('{a: [1, {b: [2, 3]}], c: {d: {e: 5}}}'), {
        a: [1, { b: [2, 3] }],
        c: { d: { e: 5 } },
    });
});

test('getArrObjFromString - brackets without a partner are plain text', () => {
    assert.deepStrictEqual(getArrObjFromString('[a, [b]'), ['a', '[b']);
    assert.deepStrictEqual(getArrObjFromString('[a], b]'), ['a]', 'b']);
    assert.deepStrictEqual(getArrObjFromString('[a, {b, c]'), ['a', '{b', 'c']);
    // text around a nested collection stays as written
    assert.deepStrictEqual(getArrObjFromString('[foo[1,2]bar, x]'), ['foo[1,2]bar', 'x']);
    assert.deepStrictEqual(getArrObjFromString('{a: string|[number], b: x}'), {
        a: 'string|[number]',
        b: 'x',
    });
});

test('getArrObjFromString - a __proto__ key does not change the result prototype', () => {
    results = getArrObjFromString('{__proto__: {polluted: 1}, ok: 1}');
    assert.strictEqual(results.polluted, undefined);
    assert.strictEqual(Object.getPrototypeOf(results), Object.prototype);
    assert.deepStrictEqual(results, { ok: 1 });
    assert.strictEqual({}.polluted, undefined);
});

test('getArrObjFromString - large and deeply nested input', () => {
    const big = getArrObjFromString('[' + 'a,'.repeat(100000) + '[b, {c: d}]]');
    assert.strictEqual(big.length, 100001);
    assert.deepStrictEqual(big[100000], ['b', { c: 'd' }]);
    const deep = getArrObjFromString('['.repeat(500) + 'x' + ']'.repeat(500));
    let level = deep;
    for (let i = 1; i < 500; i++) {
        level = level[0];
    }
    assert.deepStrictEqual(level, ['x']);
});

test('getChunks - should split and clean the chunks', () => {
    assert.deepStrictEqual(getChunks('a, b ,c'), ['a', 'b', 'c']);
    assert.deepStrictEqual(getChunks('a | b', '|'), ['a', 'b']);
    assert.deepStrictEqual(getChunks('a&&b && c', '&&'), ['a', 'b', 'c']);
    assert.deepStrictEqual(getChunks('abc'), ['abc']);
    // empty chunks are empty strings
    assert.deepStrictEqual(getChunks('a,,b'), ['a', '', 'b']);
    assert.deepStrictEqual(getChunks('a,b,'), ['a', 'b', '']);
    assert.deepStrictEqual(getChunks(''), []);
    assert.deepStrictEqual(getChunks('   '), []);
    assert.strictEqual(getChunks(5), 5);
    assert.strictEqual(getChunks(undefined), undefined);
});

test('startAndEndWith - should check both ends', () => {
    assert.strictEqual(startAndEndWith('hello world', 'h', 'd'), true);
    assert.strictEqual(startAndEndWith('hello world', 'h', 'x'), false);
    assert.strictEqual(startAndEndWith('hello world', 'x', 'd'), false);
    assert.strictEqual(startAndEndWith('hello world', 'h'), true);
    assert.strictEqual(startAndEndWith('hello world', null, 'd'), true);
    assert.strictEqual(startAndEndWith('[a]', '[', ']'), true);
    assert.strictEqual(startAndEndWith('[', '[', ']'), false);
    assert.strictEqual(startAndEndWith(5, '[', ']'), false);
    assert.strictEqual(startAndEndWith(null, '[', ']'), false);
});

test('setLookUpExp - should build a pattern that matches in between delimiters', () => {
    let match = new RegExp(setLookUpExp('h', 'd')).exec('say hello world today');
    assert.strictEqual(match[0], 'hello world');
    assert.strictEqual(match[1], 'ello worl');
    // two groups for each in between, as it always had
    assert.strictEqual(match.length, 3);

    match = new RegExp(setLookUpExp('<', '-', '>')).exec('a <one-two> b');
    assert.strictEqual(match[0], '<one-two>');
    assert.strictEqual(match[1], 'one');
    assert.strictEqual(match[3], 'two');

    // line breaks of any kind
    assert.strictEqual(new RegExp(setLookUpExp('<', '>')).exec('<a\r\nb>')[1], 'a\r\nb');
    assert.strictEqual(new RegExp(setLookUpExp('<', '>')).exec('<a\nb>')[1], 'a\nb');

    // a regex with alternatives stays in one piece
    assert.strictEqual(new RegExp(setLookUpExp(/a|b/, 'c')).exec('xa..c')[0], 'a..c');
    assert.strictEqual(new RegExp(setLookUpExp('x', /c|d/)).exec('x..d')[0], 'x..d');

    assert.throws(() => setLookUpExp('a'));
});

test('getMatchBlock - line breaks, alternatives and all matches', () => {
    assert.strictEqual(getMatchBlock('<a\r\nb>', '<', '>'), '<a\r\nb>');
    assert.strictEqual(getMatchBlock('<a\nb>', '<', '>'), '<a\nb>');
    assert.strictEqual(getMatchBlock('xa..c', /a|b/, 'c'), 'a..c');
    assert.strictEqual(getMatchBlock('x <a\r\nb/> y', /<\w/, '/>'), '<a\r\nb/>');
    assert.deepStrictEqual(getMatchBlock('<a> x <b> <c', '<', '>', true), ['<a>', '<b>']);
    assert.deepStrictEqual(getMatchBlock('{{a}} {{b}}', '{{', '}}', true), ['{{a}}', '{{b}}']);
    assert.strictEqual(getMatchBlock('a () b', '(', ')'), '()');
    assert.strictEqual(getMatchBlock('no match', '<', '>'), null);
    assert.strictEqual(getMatchBlock('no match', '<', '>', true), null);
    assert.strictEqual(getMatchBlock('<5>', '<', 5), '<5');
    assert.strictEqual(getMatchBlock(5, '<', '>'), 5);
});

test('getMatchBlock - large input', () => {
    // a block that never closes
    let start = performance.now();
    assert.strictEqual(getMatchBlock('<'.repeat(100000), '<', '>'), null);
    assert.ok(performance.now() - start < 300, 'took too long');

    // a very long block
    const long = '<' + 'x'.repeat(5000000) + '>';
    assert.strictEqual(getMatchBlock(long, '<', '>').length, long.length);
    assert.strictEqual(getMatchBlock(long, /</, />/).length, long.length);
});

test('getMatchInBetween - no match returns the string as it is', () => {
    assert.strictEqual(getMatchInBetween('hello', '<', '>'), 'hello');
    assert.deepStrictEqual(getMatchInBetween('hello', '<', '>', true), []);
    assert.deepStrictEqual(getMatchInBetween('<a> <b>', '<', '>', true), ['a', 'b']);
    assert.strictEqual(getMatchInBetween('x <a\r\nb> y', '<', '>'), 'a\r\nb');
});

test('findNested - delimiters with more than one character', () => {
    assert.strictEqual(findNested('a <b/> c', '<', '/>'), '<b/>');
    assert.strictEqual(findNested('{{a}} {{b}}', '{{', '}}'), '{{b}}');
    assert.strictEqual(findNested('[[]hello [world]]'), '[world]');
    assert.strictEqual(findNested('no brackets'), null);
});

test('findAndReplaceInArray - the replacement can be an array of anything', () => {
    assert.deepStrictEqual(findAndReplaceInArray([1, 2, 3], 2, [4, 5]), [1, [4, 5], 3]);
    assert.deepStrictEqual(findAndReplaceInArray([1, 2, 3], 2, [' a ', 'b', [' c ']]), [
        1,
        ['a', 'b', [' c ']],
        3,
    ]);
});

test('getObjectFromPath - should return the value found at the path', () => {
    const source = { a: { b: { c: 'value' } } };
    assert.strictEqual(getObjectFromPath('a.b.c', source), 'value');
    assert.strictEqual(getObjectFromPath('a.b', source), source.a.b);
    assert.strictEqual(getObjectFromPath('a.x.c', source), undefined);
    globalThis.__powerHelperTest = { a: 1 };
    assert.strictEqual(getObjectFromPath('__powerHelperTest.a'), 1);
    delete globalThis.__powerHelperTest;
});

test('cleanStr - delimiters of other types', () => {
    assert.strictEqual(cleanStr('abc5', 5), 'abc');
    assert.strictEqual(cleanStr(' abc ', undefined, null), 'abc');
    assert.strictEqual(cleanStr('a.b.c', '.'), 'ab.c');
    assert.strictEqual(cleanStr('a.b.c', /\./g), 'abc');
    assert.strictEqual(cleanStr('(a)', '(', ')'), 'a');
    assert.strictEqual(cleanStr(''), undefined);
    assert.strictEqual(cleanStr(5), 5);
});

test('setExpString - escapes every special character', () => {
    assert.strictEqual(
        setExpString('$^.*+?()[]{}|\\'),
        '\\$\\^\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\'
    );
    assert.strictEqual(setExpString('a-b/c'), 'a-b/c');
    assert.strictEqual(setExpString(5), '5');
    const regex = /a.b/;
    assert.strictEqual(setExpString(regex), regex);
});
