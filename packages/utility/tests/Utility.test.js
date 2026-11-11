/**
 * @vitest-environment jsdom
 */
import { test } from 'vitest';
import assert from 'assert';

import {
    formatPhoneNumber,
    validatePhone,
    validateEmail,
    getDynamicId,
    dateFormat,
    currencyToDecimal,
    decimalToCurrency,
    toDollarString,
    emptyOrValue,
    isNumber,
    convertToBool,
    typeOf,
    instanceOf,
    convertToNumber,
    uuid,
    includes,
    isEmpty,
    extend,
    toCurrency,
} from '../src/utility';
test('includes', () => {
    assert.equal(includes('hello there', 'hello'), true);
    assert.equal(includes('Up there', 'Hello'), false);
    assert.equal(includes('Up there', 'Up'), true);
    assert.equal(includes('Up there', 'up'), true);
    assert.equal(includes('Up there', 'there', 1), true);
    assert.equal(includes('Up there again', 'there', 4), false);
    assert.equal(includes({ hello: 'uno' }, 'uno'), true);
    assert.equal(includes({ hello: 'dos' }, 'uno'), false);
    assert.equal(includes({ hello: 'dos', other: { hello: 'uno' } }, 'uno'), true);
    assert.equal(includes({ hello: 'dos', other: { hello: 'uno' } }, 'tres'), false);
    assert.equal(includes([1, 2, 3], 2), true);
    assert.equal(includes([1, 2, 3], 4), false);
    assert.equal(includes([1, 2, 3], 1), true);
    assert.equal(includes([1, 2, 3, [5]], 5), true);
    assert.equal(includes(15200, 4), false);
    assert.equal(includes(15200, 5), true);
    assert.equal(includes([true], true), true);
});

test('uuid - should return a string', () => {
    const result = uuid(40);
    assert.equal(typeof result, 'string');
});

test('getDynamicId - Generate ID', () => {
    console.log(getDynamicId());
    assert.equal(typeof getDynamicId(), 'string');
});

// convertToNumber
test('convertToNumber - Convert to number', () => {
    assert.equal(convertToNumber('123'), 123);
    assert.equal(convertToNumber(123.4), 123.4);
    assert.equal(convertToNumber('123.4'), 123.4);
    assert.equal(convertToNumber('$123.4'), '$123.4');
    assert.equal(convertToNumber('$abc123.4'), '$abc123.4');
    assert.equal(convertToNumber('0'), 0);
    assert.equal(convertToNumber(0), 0);
});
// formatPhoneNumber
test('formatPhoneNumber - Format 10 digit number', () => {
    assert.equal(formatPhoneNumber('1234567890', '(000) 000-0000'), '(123) 456-7890');
});

// validatePhone
test('validatePhone - Valid phone', () => {
    assert.equal(validatePhone('123-456-7890'), true);
});

test('validatePhone - Invalid phone', () => {
    assert.equal(validatePhone('123-45-67890'), false);
});

// validateEmail
test('validateEmail - Valid email', () => {
    assert.equal(validateEmail('test@example.com'), true);
});

test('validateEmail - Invalid email', () => {
    assert.equal(validateEmail('test.com'), false);
});

// getDynamicId
test('getDynamicId - Generate ID', () => {
    assert.equal(typeof getDynamicId(), 'string');
});

// validateEmail
test('validateEmail - Valid email', () => {
    assert.equal(validateEmail('test@example.com'), true);
});

// dateFormat
test('dateFormat - Format date', () => {
    assert.equal(dateFormat('2023-09-14'), '09/14/2023');
});

// currencyToDecimal
test('currencyToDecimal - Convert to decimal', () => {
    assert.equal(currencyToDecimal('$123.45'), 123.45);
});

// decimalToCurrency
test('decimalToCurrency - Convert to currency', () => {
    assert.equal(decimalToCurrency(1123.45), '1,123.45');
});

// toDollarString
test('toDollarString - Convert to dollar string', () => {
    assert.equal(toDollarString(1000), '1K');
});

// emptyOrValue
test('emptyOrValue - Return value if not empty', () => {
    assert.equal(emptyOrValue('test'), 'test');
});
test('emptyOrValue - Return value if not empty', () => {
    assert.equal(emptyOrValue('', 'test'), 'test');
});
test('emptyOrValue - Return value if not empty', () => {
    assert.equal(emptyOrValue(null, 1), 1);
});

// isNumber
test('isNumber - Validate number string', () => {
    assert.equal(isNumber('123'), 123);
    assert.equal(isNumber(''), null);
    assert.equal(isNumber([]), null);
    assert.equal(isNumber({}), null);
    assert.equal(isNumber(null), null);
    assert.equal(isNumber(undefined), null);
    assert.equal(isNumber('undefined'), null);
    assert.equal(isNumber('[]'), null);
});
test('isNumber - Validate number int', () => {
    assert.equal(isNumber(123), 123);
});
test('isNumber - Validate number float', () => {
    assert.equal(isNumber(123.5), 123.5);
});

// isNumber
test('convertToBool - Convert to bool', () => {
    assert.equal(convertToBool('true'), true);
});

test('emptyOrValue - should return the value if it is a number greater than 0', () => {
    const value = 42;
    const result = emptyOrValue(value);
    assert.equal(result, value);

    const value2 = 0.5;
    const result2 = emptyOrValue(value2);
    assert.equal(result2, value2);
});

test('emptyOrValue - should return the value if it is a boolean', () => {
    const value = true;
    const result = emptyOrValue(value);
    assert.equal(result, value);

    const value2 = false;
    const result2 = emptyOrValue(value2);
    assert.equal(result2, value2);
});

test('emptyOrValue - should return the value if it is not empty', () => {
    const value = 'hello';
    const result = emptyOrValue(value);
    assert.equal(result, value);

    const value2 = [1, 2, 3];
    const result2 = emptyOrValue(value2);
    assert.deepEqual(result2, value2);

    const value3 = { foo: 'bar' };
    const result3 = emptyOrValue(value3);
    assert.deepEqual(result3, value3);
});

test('emptyOrValue - should return the default value if the input is empty', () => {
    const value = '';
    const defaultValue = 'default';
    const result = emptyOrValue(value, defaultValue);
    assert.equal(result, defaultValue);

    const value2 = [];
    const defaultValue2 = [1, 2, 3];
    const result2 = emptyOrValue(value2, defaultValue2);
    assert.deepEqual(result2, defaultValue2);

    const value3 = null;
    const defaultValue3 = { foo: 'bar' };
    const result3 = emptyOrValue(value3, defaultValue3);
    assert.deepEqual(result3, defaultValue3);
});

test('emptyOrValue - should return the default value if the input is undefined', () => {
    const value = undefined;
    const defaultValue = 'default';
    const result = emptyOrValue(value, defaultValue);
    assert.equal(result, defaultValue);
});

test('emptyOrValue - should return the value if it is a non-empty string with only whitespace characters', () => {
    const value = '   ';
    const result = emptyOrValue(value);
    assert.equal(result, value);
});

test('emptyOrValue - should return the value if it is a non-empty string with only whitespace characters', () => {
    const value = null;
    const result = emptyOrValue(null);
    assert.equal(result, value);
});

test('typeof - ', () => {
    let results = typeOf(null);

    assert.equal(results, 'null');
    // create test for null, null
    results = typeOf(null, 'null');
    assert.equal(results, true);
    // create test for undefined
    results = typeOf(undefined);
    assert.equal(results, 'undefined');

    //create test for 1000 = number
    results = typeOf(1000, 'number');
    // console.log(typeOf(1000));
    assert.equal(results, true);

    results = typeOf(1000, 'string');
    assert.equal(results, false);

    // create test for 10.5 = number
    results = typeOf(10.5, 'number');
    assert.equal(results, true);

    // create test for '1000' = string
    results = typeOf('1000', 'string');
    assert.equal(results, true);

    // create test for [1,2,3] = array
    results = typeOf([1, 2, 3], 'array');
    assert.equal(results, true);

    // create test for {foo: 'bar'} = object
    results = typeOf({ foo: 'bar' }, 'object');
    assert.equal(results, true);

    // create test for true = boolean
    results = typeOf(true, 'boolean');
    assert.equal(results, true);

    // create test for false = boolean
    results = typeOf(false, 'boolean');
    assert.equal(results, true);
});

test('instanceOf - ', () => {
    // create test for new Date() = date
    let results = instanceOf(new Date(), 'Date');
    assert.equal(results, true);

    results = instanceOf(new Date(), 'date');
    assert.equal(results, true);

    // create test for new RegExp() = regexp
    results = instanceOf(new RegExp(), RegExp);
    assert.equal(results, true);
    var a = function hello() {};
    results = instanceOf(a, 'hello');
    assert.equal(results, true);
});

// =========================================
// --> Edge cases
// --------------------------
test('convertToBool - edge cases', () => {
    assert.strictEqual(convertToBool(NaN), false);
    assert.strictEqual(convertToBool(0), false);
    assert.strictEqual(convertToBool(2), true);
    assert.strictEqual(convertToBool(' YES '), true);
    assert.strictEqual(convertToBool('On'), true);
    assert.strictEqual(convertToBool('off'), false);
    assert.strictEqual(convertToBool('0'), false);
    assert.strictEqual(convertToBool(''), false);
    assert.strictEqual(convertToBool('anything else'), true);
    assert.strictEqual(convertToBool(false), false);
    assert.strictEqual(convertToBool(null), false);
    assert.strictEqual(convertToBool({}), true);
});

test('isNumber - blank strings and NaN are not numbers', () => {
    assert.strictEqual(isNumber(' '), null);
    assert.strictEqual(isNumber('\t\n'), null);
    assert.strictEqual(isNumber(NaN), null);
    assert.strictEqual(isNumber(true), null);
    assert.strictEqual(isNumber(' 12 '), 12);
    assert.strictEqual(isNumber('0'), 0);
    assert.strictEqual(isNumber(0), 0);
    assert.strictEqual(isNumber('-1.5'), -1.5);
    assert.strictEqual(isNumber('123abc'), null);
});

test('convertToNumber - leaves non numeric input untouched', () => {
    assert.strictEqual(convertToNumber('  '), '  ');
    assert.strictEqual(convertToNumber(null), null);
    assert.strictEqual(convertToNumber('123abc'), '123abc');
    assert.strictEqual(convertToNumber(' 7 '), 7);
    assert.ok(Number.isNaN(convertToNumber(NaN)));
});

test('typeOf - null with piped types and every primitive', () => {
    assert.strictEqual(typeOf(null, 'null|string'), 'null');
    assert.strictEqual(typeOf(null, 'string|number'), false);
    assert.strictEqual(typeOf(null, 'object'), false);
    assert.strictEqual(typeOf(1, 'string|number'), 'number');
    assert.strictEqual(typeOf([], 'object'), false);
    assert.strictEqual(typeOf([]), 'array');
    assert.strictEqual(typeOf({}), 'object');
    assert.strictEqual(typeOf(10n), 'bigint');
    assert.strictEqual(typeOf(Symbol('s')), 'symbol');
    assert.strictEqual(
        typeOf(() => {}),
        'function'
    );
});

test('instanceOf - custom classes', () => {
    class Foo {}
    class Named {
        constructor() {
            this.name = 'bob';
        }
    }
    assert.strictEqual(instanceOf(new Foo(), Foo), true);
    assert.strictEqual(instanceOf(new Foo(), 'foo'), true);
    assert.strictEqual(instanceOf(new Foo(), Date), false);
    assert.strictEqual(instanceOf(new Named(), Named), true);
    assert.strictEqual(instanceOf(new Map(), 'map'), true);
    assert.strictEqual(instanceOf(new Map()), 'Map');
    assert.strictEqual(instanceOf({}), 'unknown');
    assert.strictEqual(instanceOf(Object.create(null), 'foo'), false);
    assert.strictEqual(instanceOf(null, 'null'), false);
    assert.strictEqual(instanceOf('str', 'string'), false);
});

test('dateFormat - strings without a time zone read back exactly as written', () => {
    assert.strictEqual(dateFormat('2201-01-01 16:15', true), '01/01/2201 @ 04:15 PM');
    assert.strictEqual(dateFormat('2201-01-01 23:15'), '01/01/2201');
    assert.strictEqual(dateFormat('2201-01-01T00:30', true), '01/01/2201 @ 12:30 AM');
    assert.strictEqual(dateFormat('2023-09-14', true), '09/14/2023 @ 12:00 AM');
    assert.strictEqual(dateFormat('09/14/2023'), '09/14/2023');
});

test('dateFormat - absolute instants are shown in UTC', () => {
    assert.strictEqual(dateFormat('2023-09-14T23:30:00Z', true), '09/14/2023 @ 11:30 PM');
    assert.strictEqual(dateFormat('2023-09-14T23:30:00+02:00', true), '09/14/2023 @ 09:30 PM');
    assert.strictEqual(
        dateFormat(new Date(Date.UTC(2023, 8, 14, 23, 30)), true),
        '09/14/2023 @ 11:30 PM'
    );
    assert.strictEqual(dateFormat(Date.UTC(2023, 8, 14)), '09/14/2023');
    assert.strictEqual(dateFormat(0), '01/01/1970');
});

test('dateFormat - invalid input', () => {
    assert.strictEqual(dateFormat(''), null);
    assert.strictEqual(dateFormat(null), null);
    assert.strictEqual(dateFormat(undefined), null);
    assert.strictEqual(dateFormat('not a date'), null);
});

test('currencyToDecimal - accepts numbers', () => {
    assert.strictEqual(currencyToDecimal(123.45), 123.45);
    assert.strictEqual(currencyToDecimal('$1,234.50'), 1234.5);
    assert.strictEqual(currencyToDecimal('-$5.25'), -5.25);
});

test('decimalToCurrency - zero, rounding and invalid input', () => {
    assert.strictEqual(decimalToCurrency(0), '0.00');
    assert.strictEqual(decimalToCurrency('0'), '0.00');
    assert.strictEqual(decimalToCurrency(1.23456), '1.23');
    assert.strictEqual(decimalToCurrency(2123.4), '2,123.40');
    assert.strictEqual(decimalToCurrency('2123.46'), '2,123.46');
    assert.strictEqual(decimalToCurrency(-5), '-5.00');
    assert.strictEqual(decimalToCurrency('abc'), undefined);
    assert.strictEqual(decimalToCurrency(''), undefined);
    assert.strictEqual(decimalToCurrency(null), undefined);
    assert.strictEqual(toCurrency(0), '0.00');
});

test('toDollarString - boundaries between plain, K and M', () => {
    assert.strictEqual(toDollarString(500), 500);
    assert.strictEqual(toDollarString(0), 0);
    assert.strictEqual(toDollarString(1500), '1.5K');
    assert.strictEqual(toDollarString(-2500), '-2.5K');
    assert.strictEqual(toDollarString(999949), '999.9K');
    assert.strictEqual(toDollarString(999950), '1M');
    assert.strictEqual(toDollarString(999999), '1M');
    assert.strictEqual(toDollarString(1000000), '1M');
    assert.strictEqual(toDollarString(2500000), '2.5M');
    assert.strictEqual(toDollarString('$2,000'), '2K');
});

test('validateEmail - plus tags, long TLDs and malformed domains', () => {
    assert.strictEqual(validateEmail('john+tag@gmail.com'), true);
    assert.strictEqual(validateEmail('me@site.online'), true);
    assert.strictEqual(validateEmail('first.last@sub.example.co.uk'), true);
    assert.strictEqual(validateEmail('a@b..com'), false);
    assert.strictEqual(validateEmail('a@-b.com'), false);
    assert.strictEqual(validateEmail('@b.com'), false);
    assert.strictEqual(validateEmail('a b@c.com'), false);
    assert.strictEqual(validateEmail('test@test'), false);
    assert.strictEqual(validateEmail('test@test.'), false);
    assert.strictEqual(validateEmail('test@test.c'), false);
});

test('validatePhone - parentheses must be balanced', () => {
    assert.strictEqual(validatePhone('(123 456-7890'), false);
    assert.strictEqual(validatePhone('123) 456-7890'), false);
    assert.strictEqual(validatePhone('(123) 456-7890'), true);
    assert.strictEqual(validatePhone('(123)456-7890'), true);
    assert.strictEqual(validatePhone('1234567890'), true);
    assert.strictEqual(validatePhone('123 456 7890'), true);
    assert.strictEqual(validatePhone('123-4567-89'), false);
});

test('includes - fromIndex, Map/Set and unsearchable input', () => {
    assert.strictEqual(includes([1, 2, 3], 1, 1), false);
    assert.strictEqual(includes([1, 2, 3], 2, 1), true);
    assert.strictEqual(includes(['a', 'b'], 'b', -1), true);
    assert.strictEqual(includes(new Set([1]), 1), true);
    assert.strictEqual(includes(new Set([1]), 2), false);
    assert.strictEqual(includes(new Map([['k', 'Hello']]), 'hello'), true);
    assert.strictEqual(includes(5, undefined), false);
    assert.strictEqual(
        includes(() => {}, 'x'),
        false
    );
    assert.strictEqual(includes(null, 'x'), false);
});

test('isEmpty - value objects are never empty', () => {
    assert.strictEqual(isEmpty(new Date()), false);
    assert.strictEqual(isEmpty(/x/), false);
    assert.strictEqual(isEmpty(new Error('x')), false);
    assert.strictEqual(isEmpty({}), true);
    assert.strictEqual(isEmpty({ a: 1 }), false);
    assert.strictEqual(isEmpty([]), true);
    assert.strictEqual(isEmpty(''), true);
    assert.strictEqual(isEmpty(new Map()), true);
    assert.strictEqual(isEmpty(new Set([1])), false);
    assert.strictEqual(isEmpty(new Uint8Array(0)), true);
    assert.strictEqual(isEmpty(null), true);
    assert.strictEqual(isEmpty(0), false);
    assert.strictEqual(isEmpty(false), false);
});

test('emptyOrValue - keeps dates, zero and false', () => {
    const date = new Date();
    assert.strictEqual(emptyOrValue(date, 'default'), date);
    assert.strictEqual(emptyOrValue(0, 'default'), 0);
    assert.strictEqual(emptyOrValue('0', 'default'), '0');
    assert.strictEqual(emptyOrValue(false, 'default'), false);
    assert.strictEqual(emptyOrValue({}, 'default'), 'default');
    assert.strictEqual(emptyOrValue(undefined), null);
});

test('extend - deep merge without touching the inputs', () => {
    const target = { a: 1, nested: { x: 1 } };
    const source = { nested: { y: 2 }, list: [1] };
    const result = extend(target, source, { b: 2 });
    assert.deepStrictEqual(result, { a: 1, nested: { x: 1, y: 2 }, list: [1], b: 2 });
    assert.deepStrictEqual(target, { a: 1, nested: { x: 1 } });
    assert.deepStrictEqual(source, { nested: { y: 2 }, list: [1] });
});

test('extend - ignores __proto__ keys and primitive sources', () => {
    const parsed = JSON.parse('{"__proto__":{"polluted":true},"ok":1}');
    const result = extend({}, parsed);
    assert.strictEqual(result.polluted, undefined);
    assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
    assert.strictEqual(result.ok, 1);
    assert.deepStrictEqual(extend({ a: 1 }, 'ab'), { a: 1 });
    assert.deepStrictEqual(extend({ a: 1 }, null, undefined, 5), { a: 1 });
});

test('uuid - length', () => {
    assert.strictEqual(uuid().length, 20);
    assert.strictEqual(uuid(8).length, 8);
    assert.strictEqual(uuid(55).length, 55);
});
