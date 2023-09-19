/**
 * @vitest-environment jsdom
 */
import { test } from 'vitest';
import assert from 'assert';

import {
    getGoogleMapsAddress,
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
    getDirectivesFromString,
    getMatchInBetween,
    getMatchBlock,
    cleanStr,
    setExpString,
    setLookUpExp,
    removeQuotes,
    fixQuotes,
    addQuotes,
    wildCardStringSearch,
    setWildCardString,
    convertKeysToSymbols,
} from './Utility';

test('convertKeysToSymbols - Empty object', () => {
    const obj = {};
    const result = convertKeysToSymbols(obj);
    assert.deepEqual(result, {});
});

test('convertKeysToSymbols - Single key', () => {
    const obj = { a: 1 };
    const result = convertKeysToSymbols(obj);
    const symbolKey = Object.getOwnPropertySymbols(result)[0];
    assert.equal(result[symbolKey], 1);
});

test('convertKeysToSymbols - Multiple keys', () => {
    const obj = { a: 1, b: 2 };
    const result = convertKeysToSymbols(obj);
    const symbolKeys = Object.getOwnPropertySymbols(result);
    assert.equal(symbolKeys.length, 2);
    assert.equal(result[symbolKeys[0]], 1);
    assert.equal(result[symbolKeys[1]], 2);
});

// getGoogleMapsAddress
test('getGoogleMapsAddress - Empty address', () => {
    assert.equal(getGoogleMapsAddress(''), false);
});

test('getGoogleMapsAddress - String address', () => {
    assert.equal(getGoogleMapsAddress('New York'), 'https://maps.google.it/maps?q=New+York');
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

// isNumber
test('isNumber - Validate number', () => {
    assert.equal(isNumber('123'), 123);
});

// isNumber
test('convertToBool - Convert to bool', () => {
    assert.equal(convertToBool('true'), true);
});

// Testing getDirectivesFromString
test('getDirectivesFromString - should return null for empty settings', () => {
    const result = getDirectivesFromString(null);
    assert.equal(result, null);
});

test('getDirectivesFromString - should return settings for object type', () => {
    const result = getDirectivesFromString({ key: 'value' });
    assert.deepEqual(result, { key: 'value' });
});

test('getDirectivesFromString - should handle string ID or class', () => {
    const result = getDirectivesFromString('#id');
    assert.equal(result, '#id');
});

// Add more tests for getDirectivesFromString as per your scenarios

// Testing getMatchInBetween
test('getMatchInBetween - should return correct substring', () => {
    const result = getMatchInBetween('hello world', 'h', 'd');
    assert.equal(result, 'ello worl');
});

// Add more tests for getMatchInBetween

// Testing getMatchBlock
test('getMatchBlock - should return correct match block', () => {
    const result = getMatchBlock('is a <hello world> today', '<', 'w');
    assert.equal(result, '<hello w');
});

// Add more tests for getMatchBlock

// Testing cleanStr
test('cleanStr - should return string without delimiters', () => {
    const result = cleanStr('hello world', 'h', 'd');
    assert.equal(result, 'ello worl');
});

// Add more tests for cleanStr

// Testing setExpString
test('setExpString - should escape string for regex', () => {
    const result = setExpString('<hello');
    assert.equal(result, '<hello');
});

// Add more tests for setExpString

// Testing setLookUpExp
test('setLookUpExp - should return regex pattern string', () => {
    const result = setLookUpExp('h', 'd');
    assert.equal(result, 'h((.|\n)*?)d');
});

test('setLookUpExp - Two delimiters', () => {
    const result = setLookUpExp('h', 'd');
    assert.equal(result, 'h((.|\n)*?)d');
});

test('setLookUpExp - Three delimiters', () => {
    const result = setLookUpExp('h', 'd', 'c');
    assert.equal(result, 'h((.|\n)*?)d((.|\n)*?)c');
});

test('setLookUpExp - Delimiters with special characters', () => {
    const result = setLookUpExp('.', '!', '?');
    assert.equal(result, '.((.|\n)*?)!((.|\n)*?)?');
});

test('setLookUpExp - Delimiters with regex', () => {
    const result = setLookUpExp(/h/g, 'd');
    assert.equal(result, 'h((.|\n)*?)d');
});

test('setLookUpExp - Less than two arguments', () => {
    assert.throws(() => setLookUpExp('h'), Error);
});

test('setLookUpExp - No arguments', () => {
    assert.throws(() => setLookUpExp(), Error);
});

// Add more tests for setLookUpExp

// Testing removeQuotes
test('removeQuotes - should remove quotes from string', () => {
    const result = removeQuotes('"hello"');
    assert.equal(result, 'hello');
});

// Testing fixQuotes
test('fixQuotes - should replace single quotes with double quotes', () => {
    const result = fixQuotes("'hello'");
    assert.equal(result, '"hello"');
});

// Testing addQuotes
test('addQuotes - should add double quotes around the string', () => {
    const result = addQuotes('hello');
    assert.equal(result, '"hello"');
});

test('wildCardStringSearch - Empty pattern and list', () => {
    const pattern = '';
    const list = [];
    const result = wildCardStringSearch(pattern, list);
    assert.equal(result, null);
});

test('wildCardStringSearch - Empty pattern', () => {
    const pattern = '';
    const list = ['apple', 'banana', 'cherry'];
    const result = wildCardStringSearch(pattern, list);
    assert.deepEqual(result, null);
});

test('wildCardStringSearch - Empty list', () => {
    const pattern = 'a*';
    const list = [];
    const result = wildCardStringSearch(pattern, list);
    assert.equal(result, null);
});

test('wildCardStringSearch - Match single item, string start', () => {
    const pattern = 'a*';
    const list = ['apple', 'banana', 'cherry'];
    const result = wildCardStringSearch(pattern, list, true);
    assert.deepEqual(result, ['apple']);
});

test('wildCardStringSearch - Match multiple items', () => {
    const pattern = '*a*';
    const list = ['apple', 'banana', 'cherry'];
    const result = wildCardStringSearch(pattern, list);
    assert.deepEqual(result, ['apple', 'banana']);
});

test('wildCardStringSearch - No match', () => {
    const pattern = 'x*';
    const list = ['apple', 'banana', 'cherry'];
    const result = wildCardStringSearch(pattern, list);
    assert.equal(result, null);
});

test('setWildCardString - Empty string', () => {
    const string = '';
    const result = setWildCardString(string);
    assert.equal(result, null);
});

test('setWildCardString - Single character, string end', () => {
    const string = 'a';
    const result = setWildCardString(string, null, true);
    assert.equal(result, 'a$');
});

test('setWildCardString - Multiple characters, string start', () => {
    const string = 'abc';
    const result = setWildCardString(string, true);
    assert.equal(result, '^abc');
});

test('setWildCardString - Wildcard at beginning', () => {
    const string = '*abc';
    const result = setWildCardString(string);
    assert.equal(result, '(.*?)abc');
});

test('setWildCardString - Wildcard at end', () => {
    const string = 'abc*';
    const result = setWildCardString(string);
    assert.equal(result, 'abc(.*?)');
});

test('setWildCardString - Wildcard in middle', () => {
    const string = 'a*c';
    const result = setWildCardString(string);
    assert.equal(result, 'a(.*?)c');
});

test('setWildCardString - Multiple wildcards', () => {
    const string = 'a*b*c';
    const result = setWildCardString(string);
    assert.equal(result, 'a(.*?)b(.*?)c');
});

test('setWildCardString - Escape special characters', () => {
    const string = 'a.+?^${}()|[]/\\b*c';
    const result = setWildCardString(string);
    assert.equal(result, 'a\\.\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\/\\\\b(.*?)c');
});
