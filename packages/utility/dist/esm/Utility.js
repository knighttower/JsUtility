// // -----------------------------------------
// /**
//  * @knighttower
//  * @url knighttower.io
//  * @git https://github.com/knighttower/
//  */
// // -----------------------------------------

// -----------------------------
// METHODS
// -----------------------------

const FALSE_STRINGS = ['false', '0', 'no', 'off', ''];

/**
 * Convert a value to bool
 * @param {String|Boolean|Int|Number} val
 * @return {Boolean}
 * @usage convertToBool('true') // true
 * @usage convertToBool('false') // false
 * @usage convertToBool('0') // false
 * @usage convertToBool('1') // true
 * @usage convertToBool('') // false
 * @usage convertToBool('yes') // true
 * @usage convertToBool('off') // false
 */
function convertToBool(val) {
    if (typeof val === 'string') {
        // Every other string, once trimmed, is not empty and therefore true
        return !FALSE_STRINGS.includes(val.trim().toLowerCase());
    }

    return Boolean(val);
}

/**
 * Converts a given variable to a number if possible.
 * @param {string|number} input - The input variable to convert.
 * @returns {string|number} - The converted number or the original variable.
 * @example convertToNumber(123) // Output: 123 (number)
 * @example convertToNumber(123.45) // Output: 123.45 (number)
 * @example convertToNumber("123") // Output: 123 (number)
 * @example convertToNumber("123.45") // Output: 123.45 (number)
 * @example convertToNumber("abc") // Output: "abc" (original string)
 * @example convertToNumber("123abc") // Output: "123abc" (original string)
 * @example convertToNumber(null) // Output: null (original)
 */
function convertToNumber(input) {
    // Anything that cannot be converted to a number is returned untouched
    return isNumber(input) ?? input;
}

/**
 * Translate dollar amounts to decimal notation
 * @function currencyToDecimal
 * @memberof utility
 * @param {String|Number} amount
 * @return number
 * @example currencyToDecimal('$123.45') // 123.45
 * @example currencyToDecimal(123.45) // 123.45
 */
function currencyToDecimal(amount) {
    if (typeof amount === 'number') {
        return amount;
    }
    return Number(amount.replace(/[^0-9.-]+/g, ''));
}

// Intl formatters are expensive to build, so each one is created on first use and then reused
const formatters = {};
const getFormatter = (name, Formatter, options) => {
    if (!formatters[name]) {
        formatters[name] = new Formatter('en-US', options);
    }
    return formatters[name];
};
const DATE_PARTS = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
const TIME_PARTS = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
const CURRENCY_PARTS = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
// '2201-01-01', which JS always parses as UTC
const ISO_DATE_ONLY = /^\d{4}(-\d{2}){0,2}$/;
// A trailing Z, an offset after the time (16:15+02:00), or a named zone (GMT, UTC, EST, PDT...)
const EXPLICIT_ZONE =
    /(Z|\d{2}:\d{2}(:\d{2}([.,]\d+)?)?\s?[+-]\d{2}(:?\d{2})?)$|\b(GMT|UTC?|[ECMP][SD]T)\b/i;

/**
 * Format dates to standard US, with or w/out time
 * Strings without a time zone are returned exactly as written, on any machine.
 * Absolute moments (Date objects, timestamps, strings with a zone such as 'Z' or '+02:00') are shown in UTC.
 * @function dateFormat
 * @memberof utility
 * @param {String|Number|Date} dateTime Raw format 2201-01-01 16:15, timestamp in milliseconds or Date object
 * @param {Boolean} wTime If set, returns date with time as HH:MM A
 * @return {String|null} null when the date is missing or invalid
 * @example dateFormat('2201-01-01 16:15') // 01/01/2201
 * @example dateFormat('2201-01-01 16:15', true) // 01/01/2201 @ 04:15 PM
 * @example dateFormat('2201-01-01 16:15', false) // 01/01/2201
 * @example dateFormat('2201-01-01') // 01/01/2201
 * @example dateFormat('2201-01-01T16:15:00Z', true) // 01/01/2201 @ 04:15 PM
 */
function dateFormat(dateTime, wTime) {
    // 0 is a valid timestamp, every other falsy value is a missing date
    if (!dateTime && dateTime !== 0) {
        return null;
    }

    let date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    // JS parses a string without a time zone as local time (ISO date-only strings excepted).
    // Moving it by the local offset makes UTC show the same date and time that were written,
    // otherwise the hours, and even the day, would shift with the time zone of the machine.
    if (typeof dateTime === 'string') {
        const raw = dateTime.trim();
        if (!ISO_DATE_ONLY.test(raw) && !EXPLICIT_ZONE.test(raw)) {
            date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        }
    }

    const formattedDate = getFormatter('date', Intl.DateTimeFormat, DATE_PARTS).format(date);

    if (wTime) {
        const formattedTime = getFormatter('time', Intl.DateTimeFormat, TIME_PARTS).format(date);
        return `${formattedDate} @ ${formattedTime}`;
    }

    return formattedDate;
}

/**
 * Translate decimal notation to dollar amount
 * @function decimalToCurrency
 * @memberof utility
 * @param {String|Number} amount
 * @return {String|undefined} undefined when the amount is not a number
 * @example decimalToCurrency(123.45) // 123.45
 * @example decimalToCurrency(2123.46) // 2,123.46
 * @example decimalToCurrency(0) // 0.00
 */
function decimalToCurrency(amount) {
    const number = isNumber(amount);
    if (number === null) {
        return undefined;
    }
    return getFormatter('currency', Intl.NumberFormat, CURRENCY_PARTS).format(number);
}

/**
 * Check if there is a value, if not return null or the default value
 * It can test strings, arrays, objects, numbers, booleans
 * @function emptyOrValue
 * @memberof utility
 * @param {String|Number} value If the value is not empty, returns it
 * @param {String|Number} _default The default value if empty
 * @return mixed
 * @example emptyOrValue('test', 'default') // 'test'
 * @example emptyOrValue('', 'default') // 'default'
 * @example emptyOrValue('test') // 'test'
 * @example emptyOrValue('') // null
 * @example emptyOrValue(0) // 0
 * @example var hello = ''; emptyOrValue(hello) // Null
 * @example var hello = 'test'; emptyOrValue(hello) // 'test'
 * @example var hello = 'test'; emptyOrValue(hello, 'default') // 'test'
 * @example var hello = ''; emptyOrValue(hello, 'default') // 'default'
 * @example var hello = []; emptyOrValue(hello, 'default') // null
 * @example var hello = {}; emptyOrValue(hello, 'default') // null
 * @example var hello = [...]; emptyOrValue(hello') // [...]
 */
function emptyOrValue(value, _default = null) {
    // Numbers (0 included) and booleans are never empty, see isEmpty
    return isEmpty(value) ? _default : value;
}

// -----------------------------------------
/**
 * Checks if the value is a plain object.
 *
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 */
const isPlainObject = (value) => {
    if (value === null || typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
};

/**
 * Merges two or more objects into a single new object. Arrays and other types are overwritten.
 * Neither the target nor the sources are modified. Values that are not merged are copied by reference.
 *
 * @param {object} target The target object.
 * @param {...object} sources The source objects.
 * @returns {object} A new merged object.
 */
const extend = (target, ...sources) => {
    return sources.reduce(
        (acc, source) => {
            if (isPlainObject(source)) {
                Object.entries(source).forEach(([key, value]) => {
                    // Assigning '__proto__' (e.g. from parsed JSON) would replace the prototype of the result
                    if (key === '__proto__') {
                        return;
                    }
                    acc[key] =
                        isPlainObject(value) && isPlainObject(acc[key])
                            ? extend(acc[key], value)
                            : value; // If it's not an object, directly assign it
                });
            } else if (typeof source !== 'string') {
                // Other objects (class instances, arrays) are merged directly.
                // Strings are skipped since they would be spread one character per key.
                Object.assign(acc, source);
            }
            return acc;
        },
        { ...target }
    );
};

/**
 * Format a phone number based on a given template.
 * @param {string} phoneNumber - The phone number to format.
 * @param {string} template - The template to use for formatting.
 * @returns {string} - The formatted phone number.
 * @example console.log(formatPhoneNumber('1234567890', '(000) 000-0000')); // Output: (123) 456-7890
 * @example console.log(formatPhoneNumber('1234567890', '000-000-0000')); // Output: 123-456-7890
 * @example console.log(formatPhoneNumber('123-456-7890', '(000) 000-0000')); // Output: (123) 456-7890
 * @example console.log(formatPhoneNumber('(123) 456-7890', '000-0000-0000')); // Output: 123-4567-890
 */
function formatPhoneNumber(phoneNumber, template) {
    // Remove all non-numeric characters from the phone number
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Verify the length of the cleaned phone number
    if (cleaned.length < 10) {
        throw new Error('Invalid phone number length');
    }

    // Initialize a pointer for the cleaned phone number
    let cleanedPointer = 0;

    // Replace placeholders in the template with actual numbers
    const formatted = template.split('').map((char) => {
        if (char === '0' && cleanedPointer < cleaned.length) {
            return cleaned[cleanedPointer++];
        }
        return char;
    });

    return formatted.join('');
}

/**
 * Make sure the the item is an array or convert it to an array
 * @function makeArray
 * @param {String|Array} item
 * @return array
 * @example makeArray('test') // ['test']
 */
const makeArray = (item) => (Array.isArray(item) ? item : [item]);

/**
 * Generate a random alphanumeric string (not an RFC UUID, and not for security purposes)
 * @function uuid
 * @param {Number} max Length of the string. Defaults to 20, and to 40 when 0 or any other falsy value is passed
 * @return string
 * @example uuid() // 20 characters
 * @example uuid(8) // 8 characters
 */
const uuid = (max = 20) => {
    const rnd = () => Math.random().toString(36).substring(2, 15);
    max = max || 40;
    var str = '';
    for (var i = 0; i < max / 3 + 1; i++) {
        str += rnd();
    }
    return str.substring(0, max);
};
const uniqueId = uuid;

/**
 * Generate unique ids
 * @function getDynamicId
 * @memberof utility
 * @return string Format id__00000000__000
 */
function getDynamicId() {
    return 'id__' + uuid(8) + '__' + new Date().getTime();
}

/**
 * Alias to getDynamicId
 * @function getRandomId
 * @memberof utility
 * @return string
 * @example getRandomId() // id__00000000__000
 */
const getRandomId = getDynamicId;
const dynamicId = getDynamicId;
const randomId = getDynamicId;

/**
 * Check recusively if a value is in a collection (array, string, object, map, set)
 * @param {collection} collection - The collection to search in
 * @param {value} value - The value to search for
 * @param {fromIndex} fromIndex - The index to start searching from (strings, numbers and the first level of an array)
 * @return {boolean} - True if the value is in the collection, false otherwise
 * @example includes('hello there', 'hello') // true
 * @example includes({ hello: 'dos', other: { hello: 'uno' } }, 'uno') // true
 * @example includes([1, 2, 3], 1, 1) // false
 * @note This function is case-insensitive and since native includes is not recursive, this function is
 */
function includes(collection, value, fromIndex = 0) {
    if (collection === null || collection === undefined) {
        return false;
    }

    value = typeof value === 'string' ? value.toLowerCase() : value;
    const isIncluded = (item) => includes(item, value);

    switch (typeOf(collection)) {
        case 'array':
            return collection.slice(fromIndex).some(isIncluded);
        case 'string':
            return collection.toLowerCase().includes(value, fromIndex);
        case 'number':
        case 'bigint':
        case 'boolean':
            return collection.toString().includes(String(value), fromIndex);
        case 'object':
            if (collection instanceof Map || collection instanceof Set) {
                return [...collection.values()].some(isIncluded);
            }
            return Object.values(collection).some(isIncluded);
    }
    // any other case (functions, symbols) cannot be searched
    return false;
}

/**
 * Check if a value is empty
 * Numbers, booleans, functions and value objects (Date, RegExp, Error) are never empty
 * @function isEmpty
 * @memberof utility
 * @param {string|array|object|map|set|number|boolean} value
 * @url https://moderndash.io/
 * @return {boolean}
 */
function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
        return value.length === 0;
    }

    if (value instanceof Map || value instanceof Set) {
        return value.size === 0;
    }

    if (ArrayBuffer.isView(value)) {
        return value.byteLength === 0;
    }

    // These hold their content internally, so they have no keys to count
    if (value instanceof Date || value instanceof RegExp || value instanceof Error) {
        return false;
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    return false;
}

/**
 * Check if is a number or Int, if not return null
 * Integrates both Int and Number, or convert a string number to number to test
 * Note: this is not like Lodash isNumber since this one takes into consideration the 'string number'
 * @function isNumber
 * @memberof utility
 * @param {String|Number} value
 * @return {null|number} The value as a number, or null when it is not a number
 * @example isNumber(123) // 123
 * @example isNumber(123.45) // 123.45
 * @example isNumber('123abc') // null
 * @example isNumber('abc') // null
 * @example isNumber('') // null
 * @example isNumber(' ') // null
 * @example isNumber("123") // 123
 * @example isNumber("123.45") // 123.45
 * @example isNumber(0) // 0, so compare the result against null instead of using it as a boolean
 */
function isNumber(value) {
    const type = typeof value;
    if (type !== 'number' && type !== 'string') {
        return null;
    }
    // Number('') and Number('  ') are both 0, so blank strings have to be ruled out first
    if (type === 'string' && value.trim() === '') {
        return null;
    }

    const number = Number(value);
    return Number.isNaN(number) ? null : number;
}

// Built-in types that instanceOf can identify by name
const INSTANCE_TYPES = [DataView, ArrayBuffer, WeakSet, WeakMap, Set, Map, Promise, RegExp, Date];

/**
 * Check the instance of a variable, and get the correct type for it. It also accepts simple comparisons
 * For more advance type checking see https://github.com/knighttower/JsTypeCheck
 * @param {any} input - The variable to check
 * @param {string|instance} test - The type to check against, as a name ('date') or as the class itself (Date)
 * @return {string|boolean} - The type of the variable or boolean when test is provided
 * @example instanceOf(new Date()) // 'Date'
 * @example instanceOf(new Date(), 'date') // true
 * @example instanceOf(new MyClass(), MyClass) // true
 * @example instanceOf(function hello() {}, 'hello') // true
 */
function instanceOf(input, test) {
    const isValid = typeof input === 'function' || typeof input === 'object';
    if (input === null || !isValid) {
        return false;
    }

    let inputType = INSTANCE_TYPES.find((type) => input instanceof type)?.name ?? 'unknown';

    if (test) {
        // Custom types: functions and classes go by their own name, instances by their class name
        if (inputType === 'unknown') {
            inputType = (typeof input === 'function' ? input.name : input.constructor?.name) ?? '';
        }
        const testType = typeof test === 'string' ? test : test.name;
        return testType.toLowerCase() === inputType.toLowerCase();
    }

    return inputType;
}

/**
 * Alias to decimalToCurrency
 * @function toCurrency
 * @memberof utility
 * @param {String|Number} amount
 * @return number
 * @example toCurrency(123.45) // 123.45
 * @example toCurrency(2123.46) // 2,123.46
 */
function toCurrency(amount) {
    return decimalToCurrency(amount);
}

/**
 * Covert to dollar string
 * @function toDollarString
 * @memberof utility
 * @param {String|Number} amount
 * @return number
 * @example toDollarString(2000) // 2K
 * @example toDollarString('$2,000,000') // 2M
 * @example toDollarString(2500000) // 2.5M
 * @example toDollarString(500) // 500
 */
function toDollarString(amount) {
    if (typeOf(amount, 'string')) {
        amount = currencyToDecimal(amount);
    }

    const sign = Math.sign(amount);
    const absolute = Math.abs(amount);

    if (absolute > 999) {
        const thousands = Number((absolute / 1000).toFixed(1));
        // Anything that rounds up to 1000K (999,950 and above) is a million
        if (thousands < 1000) {
            return sign * thousands + 'K';
        }
        return sign * Number((absolute / 1000000).toFixed(1)) + 'M';
    }

    return sign * absolute;
}

/**
 * Check the type of a variable, and get the correct type for it. It also accepts simple comparisons
 * For more advance type checking see https://github.com/knighttower/JsTypeCheck
 * @param {any} input - The variable to check
 * @param {string} test - The types to check against, piped string
 * @return {string|boolean} - The type of the variable
 * @example typeOf('hello', 'string') // returns true
 * @example typeOf('hello', 'number') // returns false
 * @example typeOf('hello', 'string') // returns true
 * @example typeOf('hello') // returns 'string'
 * @example typeOf(123, 'number|int') // returns 'number'
 * @example typeOf(null, 'null|string') // returns 'null'
 * @example typeOf({}) // returns 'object'
 * @example typeOf([]) // returns 'array'
 */
function typeOf(input, test) {
    // null and arrays are both 'object' for the native typeof
    let inputType = typeof input;
    if (input === null) {
        inputType = 'null';
    } else if (Array.isArray(input)) {
        inputType = 'array';
    }

    if (test) {
        if (test.includes('|')) {
            for (let type of test.split('|')) {
                if (inputType === type) {
                    return type;
                }
            }
            return false;
        }

        return test === inputType;
    }

    return inputType;
}

/**
 * Validate emails
 * @function validateEmail
 * @memberof utility
 * @param {String} email
 * @return Boolean
 * @example validateEmail('<EMAIL>') // false
 * @example validateEmail('test@test') // false
 * @example validateEmail('test@test.') // false
 * @example validateEmail('test@test.c') // false
 * @example validateEmail('test@test.com') // true
 * @example validateEmail('test+tag@test.online') // true
 * @example validateEmail('test@test..com') // false
 */
function validateEmail(email) {
    // name @ one or more domain labels (no empty label, no leading or trailing hyphen) . TLD of 2+ letters
    var emailRegex = /^[a-zA-Z0-9._+-]+@([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Validate a phone number
 * @function validatePhone
 * @memberof utility
 * @param {String} phone
 * @return Boolean
 * @example validatePhone('1234567890') // true
 * @example validatePhone('(123) 456-7890') // true
 * @example validatePhone('123-456-7890') // true
 * @example validatePhone('123 456 7890') // true
 * @example validatePhone('123-4567-89') // false
 * @example validatePhone('(123 456-7890') // false
 */
function validatePhone(phone) {
    // The area code is either fully wrapped in parentheses or not at all
    var phoneRegex = /^(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
    return phoneRegex.test(phone);
}

// //   utility; {
//     convertToBool,
//     currencyToDecimal,
//     convertToNumber,
//     dateFormat,
//     decimalToCurrency,
//     emptyOrValue,
//    extend,
//     formatPhoneNumber,
//     getDynamicId,
//     getRandomId,
//     includes,
//     isEmpty, // from https://moderndash.io/
//     isNumber,
//     instanceOf,
//     toCurrency,
//     toDollarString,
//     typeOf,
//     validateEmail,
//     validatePhone,
//     makeArray,
//     uuid,
//     uniqueId,
// };

export { convertToBool, convertToNumber, currencyToDecimal, dateFormat, decimalToCurrency, dynamicId, emptyOrValue, extend, formatPhoneNumber, getDynamicId, getRandomId, includes, instanceOf, isEmpty, isNumber, isPlainObject, makeArray, randomId, toCurrency, toDollarString, typeOf, uniqueId, uuid, validateEmail, validatePhone };
