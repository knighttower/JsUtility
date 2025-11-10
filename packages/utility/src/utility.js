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

/**
 * Convert a value to bool
 * @param {String|Boolean|Int|Number} val
 * @return {Boolean}
 * @usage convertToBool('true') // true
 * @usage convertToBool('false') // false
 * @usage convertToBool('0') // false
 * @usage convertToBool('1') // true
 * @usage convertToBool('') // false
 * @usage convertToBool('true') // true
 * @usage convertToBool('false') // false
 */
export function convertToBool(val) {
    if (typeof val === 'boolean') return val;

    if (typeof val === 'string') {
        const normalized = val.trim().toLowerCase();
        if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
        if (['false', '0', 'no', 'off', ''].includes(normalized)) return false;
        return Boolean(normalized);
    }

    if (typeof val === 'number') return val !== 0;

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
export function convertToNumber(input) {
    const isNum = isNumber(input);

    if (isNum !== null) {
        return isNum;
    }
    // Case: String that cannot be converted to a number
    return input;
}

/**
 * Translate dollar amounts to decimal notation
 * @function currencyToDecimal
 * @memberof utility
 * @param {String|Number} amount
 * @return number
 * @example currencyToDecimal('$123.45') // 123.45
 */
export function currencyToDecimal(amount) {
    return Number(amount.replace(/[^0-9.-]+/g, ''));
}

/**
 * Format dates to standard US, with or w/out time
 * @function dateFormat
 * @memberof utility
 * @param {String} dateTime Raw format 2201-01-01 16:15PM or unix or object
 * @param {Boolean} wTime If set, returns date with time as H:MM A
 * @return string
 * @example dateFormat('2201-01-01 16:15PM') // 01/01/2201
 * @example dateFormat('2201-01-01 16:15PM', true) // 01/01/2201 @ 4:15 PM
 * @example dateFormat('2201-01-01 16:15PM', false) // 01/01/2201
 * @example dateFormat('2201-01-01') // 01/01/2201
 */
export function dateFormat(dateTime, wTime) {
    if (!dateTime || isNaN(new Date(dateTime).getTime())) {
        return null;
    }

    const date = new Date(dateTime);

    // Ensuring that the time zone is taken into account.
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);

    if (wTime) {
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
        const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);
        return `${formattedDate} @ ${formattedTime}`;
    }

    return formattedDate;
}

/**
 * Translate decimal notation to dollar amount
 * @function decimalToCurrency
 * @memberof utility
 * @param {String|Number} amount
 * @return number
 * @example decimalToCurrency(123.45) // 123.45
 * @example decimalToCurrency(2123.46) // 2,123.46
 */
export function decimalToCurrency(amount) {
    amount = convertToNumber(amount);
    if (amount) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(amount);
    }
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
export function emptyOrValue(value, _default = null) {
    /**
     * Test sequence:
     * If it is a number 0> : true
     * If is not undefined: true
     * If it is boolean (true|false) prevents going to empty
     * If it is not Empty, [], null, {}, 0, true, false: true
     */

    if (isNumber(value) !== null || typeof value === 'boolean') {
        return value;
    } else if (!isEmpty(value)) {
        return value;
    }

    return _default;
}

// -----------------------------------------
/**
 * Checks if the value is a plain object.
 *
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 */
export const isPlainObject = (value) =>
    value && typeof value === 'object' && value.constructor === Object;

/**
 * Merges two or more objects into a single new object. Arrays and other types are overwritten.
 *
 * @param {object} target The target object.
 * @param {...object} sources The source objects.
 * @returns {object} A new merged object.
 */
export const extend = (target, ...sources) => {
    return sources.reduce(
        (acc, source) => {
            if (isPlainObject(source)) {
                Object.entries(source).forEach(([key, value]) => {
                    acc[key] =
                        isPlainObject(value) && isPlainObject(acc[key])
                            ? extend(acc[key], value)
                            : value; // If it's not an object, directly assign it
                });
            } else {
                // If the source is not an object (like a number), just merge directly
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
export function formatPhoneNumber(phoneNumber, template) {
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
export const makeArray = (item) => (Array.isArray(item) ? item : [item]);

export const uuid = (max = 20) => {
    const rnd = () => Math.random().toString(36).substring(2, 15);
    max = max || 40;
    var str = '';
    for (var i = 0; i < max / 3 + 1; i++) {
        str += rnd();
    }
    return str.substring(0, max);
};
export const uniqueId = uuid;

/**
 * Generate unique ids
 * @function getDynamicId
 * @memberof utility
 * @return string Format kn__000000__000
 */
export function getDynamicId() {
    return 'id__' + uuid(8) + '__' + new Date().getTime();
}

/**
 * Alias to getDynamicId
 * @function getRandomId
 * @memberof utility
 * @return string
 * @example getRandomId() // kn__000000__000
 */
export const getRandomId = getDynamicId;
export const dynamicId = getDynamicId;
export const randomId = getDynamicId;

/**
 * Form a valid Google search address
 * @function getGoogleMapsAddress
 * @memberof utility
 * @param {String|Object} address
 * @return string
 * @example getGoogleMapsAddress('New York') // 'https://maps.google.it/maps?q=New+York'
 * @example getGoogleMapsAddress({ address: 'New York', zip: '10001' }) // 'https://maps.google.it/maps?q=New+York+10001'
 * @example getGoogleMapsAddress({ address: 'New York', city: 'New York', state: 'NY' }) // 'https://maps.google.it/maps?q=New+York+New+York+NY'
 */
export function getGoogleMapsAddress(address) {
    if (!address) {
        return false;
    }

    let search = '';

    if (typeOf(address, 'string')) {
        search = address;
    } else {
        const keys = ['address', 'address1', 'city', 'state', 'zip', 'zipcode'];

        search = keys.reduce((acc, key) => {
            const value = Object.keys(address).find((aKey) => aKey.includes(key) && address[aKey]);
            return value ? `${acc} ${address[value]}` : acc;
        }, '');
    }

    search = search.trim().replace(/\s+|,/g, '+');
    return `https://maps.google.it/maps?q=${search}`;
}

/**
 * Check recusively if a value is in a collection (array, string, object)
 * @param {collection} collection - The collection to search in
 * @param {value} value - The value to search for
 * @param {fromIndex} fromIndex - The index to start searching from
 * @return {boolean} - True if the value is in the collection, false otherwise
 * @example includes('hello there', 'hello') // true
 * @example includes({ hello: 'dos', other: { hello: 'uno' } }, 'uno') // true
 * @note This function is case-insensitive and since native includes is not recursive, this function is
 */
export function includes(collection, value, fromIndex = 0) {
    if (collection === null || collection === undefined) {
        return false;
    }

    const isString = typeof value === 'string';
    value = isString ? value.toLowerCase() : value;
    const collectionType = typeOf(collection);

    switch (collectionType) {
        case 'array':
            return collection.some((item) => includes(item, value));
        case 'string':
            return collection.toLowerCase().includes(value, fromIndex);
        case 'number':
        case 'boolean':
            return collection.toString().includes(value.toString(), fromIndex);
        case 'object':
            return Object.values(collection).some((item) => includes(item, value));
    }
    // any other case
    return collection.includes(value, fromIndex);
}

/**
 * Check if a value is empty
 * @function isEmpty
 * @memberof utility
 * @param {string|array|object|map|set|number|boolean} value
 * @url https://moderndash.io/
 * @return {string}
 */
export function isEmpty(value) {
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
 * @return null|int
 * @example isNumber(123) // true
 * @example isNumber(123.45) // true
 * @example isNumber('123abc') // false
 * @example isNumber('abc') // false
 * @example isNumber('') // false
 * @example isNumber("123") // true
 * @example isNumber("123.45") // true
 */
export function isNumber(value) {
    const isType = typeof value;
    switch (value) {
        case null:
        case undefined:
        case '':
            return null;
        case '0':
        case 0:
            return 0;
        default:
            if (isType === 'number' || isType === 'string') {
                if (typeof value === 'number' || !Number.isNaN(Number(value))) {
                    return +value;
                }
            }

            break;
    }

    return null;
}

/**
 * Check the instance of a variable, and get the correct type for it. It also accepts simple comparisons
 * For more advance type checking see https://github.com/knighttower/JsTypeCheck
 * @param {any} input - The variable to check
 * @param {string|instance} test - The types to check against, piped string
 * @return {string|boolean} - The type of the variable or boolean when test is provided
 */
export function instanceOf(input, test) {
    let inputType = 'unknown';
    const isValid = typeof input === 'function' || typeof input === 'object';
    if (input === null || !isValid) {
        return false;
    }

    const instanceMapping = [
        Date,
        RegExp,
        Promise,
        Map,
        Set,
        WeakMap,
        WeakSet,
        ArrayBuffer,
        DataView,
    ];
    let instTotal = instanceMapping.length;
    while (instTotal--) {
        if (input instanceof instanceMapping[instTotal]) {
            inputType = instanceMapping[instTotal].name;
            break;
        }
    }

    if (test) {
        test = typeof test === 'string' ? test.toLowerCase() : test.name.toLowerCase();
        // In case that the input is a custom instance
        if (inputType === 'unknown') {
            inputType = input.name;
        }
        return test === inputType.toLowerCase();
    }

    return inputType;
}

/**
 * Open a Google Map using a provided address
 * @function openGoogleMapsAddress
 * @memberof utility
 * @param {String|Object} object - Address information either as a string or as an object
 * @throws {Error} Throws an error if the address is invalid or if it's not a string or object.
 * @return {void}
 * @example openGoogleMapsAddress('New York'); // Opens Google Maps with the address 'New York'
 * @example openGoogleMapsAddress({ address: 'New York', zip: '10001' }); // Opens Google Maps with the address 'New York 10001'
 */
export function openGoogleMapsAddress(object) {
    if (!typeOf(object, 'string') || !typeOf(object, 'object')) {
        throw new Error('The input must be a string or an object.');
    }

    const address = getGoogleMapsAddress(object);

    if (!isEmpty(address) || !typeOf(address, 'string')) {
        throw new Error('The address you are trying to open is invalid.');
    }

    return window.open(address, '_blank');
}

/**
 * Alias to getDynamicId
 * @function toCurrency
 * @memberof utility
 * @param {String|Number} amount
 * @return number
 * @example toCurrency(123.45) // 123.45
 * @example toCurrency(2123.46) // 2,123.46
 */
export function toCurrency(amount) {
    return decimalToCurrency(amount);
}

/**
 * Covert to dollar string
 * @function toDollarString
 * @memberof utility
 * @param {String|Number} amount
 * @return number
 * @example toDollarString(2,000) // 2K
 * @example toDollarString(2,000,000) // 2M
 * @example toDollarString(2,500,000) // 2.5M
 */
export function toDollarString(amount) {
    if (typeOf(amount, 'string')) {
        amount = currencyToDecimal(amount);
    }

    if (Math.abs(amount) > 999 && Math.abs(amount) < 999999) {
        return Math.sign(amount) * (Math.abs(amount) / 1000).toFixed(1) + 'K';
    }
    if (Math.abs(amount) > 999999) {
        return Math.sign(amount) * (Math.abs(amount) / 1000000).toFixed(1) + 'M';
    }

    return Math.sign(amount) * Math.abs(amount);
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
 * @example typeOf({}) // returns 'object'
 */
export function typeOf(input, test) {
    // Special case for null since it can be treated as an object
    if (input === null) {
        if (test) {
            return test === null || test === 'null' ? true : false;
        }
        return 'null';
    }

    let inputType;

    switch (typeof input) {
        case 'number':
        case 'string':
        case 'boolean':
        case 'undefined':
        case 'bigint':
        case 'symbol':
        case 'function':
            inputType = typeof input;
            break;
        case 'object':
            inputType = Array.isArray(input) ? 'array' : 'object';

            break;
        default:
            inputType = 'unknown';
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
 */
export function validateEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

/**
 * Validate a phone number
 * @function validatePhone
 * @memberof utility
 * @param {String} phone
 * @return void|Toast
 * @example validatePhone('1234567890') // true
 * @example validatePhone('(123) 456-7890') // true
 * @example validatePhone('123-456-7890') // true
 * @example validatePhone('123 456 7890') // false
 * @example validatePhone('123-4567-89') // false
 */
export function validatePhone(phone) {
    var phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
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
//     getGoogleMapsAddress,
//     getRandomId,
//     includes,
//     isEmpty, // from https://moderndash.io/
//     isNumber,
//     instanceOf,
//     openGoogleMapsAddress,
//     toCurrency,
//     toDollarString,
//     typeOf,
//     validateEmail,
//     validatePhone,
//     makeArray,
//     uuid,
//     uniqueId,
// };
