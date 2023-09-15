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
} from './Utility'; // Adjust the import to your file structure

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
