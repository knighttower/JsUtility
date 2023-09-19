// // -----------------------------------------
// /**
//  * @knighttower
//  * @url knighttower.io
//  * @git https://github.com/knighttower/
//  * @license MIT
//  */
// // -----------------------------------------

import { isEmpty, every, includes, isUndefined } from 'lodash-es';
// @see https://github.com/knighttower/JsObjectProxyHelper
import ProxyHelper from '@knighttower/js-object-proxy-helper';
// @see https://github.com/knighttower/JsUrlHelper
import urlHelper from '@knighttower/js-url-helper';
// @see https://github.com/knighttower/ElementHelper
import ElementHelper from '@knighttower/element-helper';
// @see https://github.com/knighttower/JsPowerHelperFunctions

// -----------------------------
// METHODS
// -----------------------------

const isTruthy = (value) => Boolean(value);

/**
 * Form a valid Google search address
 * @function getGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} address
 * @return string
 * @example getGoogleMapsAddress('New York') // 'https://maps.google.it/maps?q=New+York'
 * @example getGoogleMapsAddress({ address: 'New York', zip: '10001' }) // 'https://maps.google.it/maps?q=New+York+10001'
 * @example getGoogleMapsAddress({ address: 'New York', city: 'New York', state: 'NY' }) // 'https://maps.google.it/maps?q=New+York+New+York+NY'
 */
const getGoogleMapsAddress = (address) => {
    if (!address) return false;

    let search = '';

    if (typeof address === 'string') {
        search = address;
    } else {
        const keys = ['address', 'address1', 'city', 'state', 'zip', 'zipcode'];
        const hasFullAddress = [
            isTruthy(address.address) || isTruthy(address.address1),
            isTruthy(address.zip) || isTruthy(address.zipcode),
            isTruthy(address.city),
            isTruthy(address.state),
        ].every(isTruthy);

        if (!hasFullAddress) return false;

        keys.forEach((key) => {
            Object.keys(address).forEach((aKey) => {
                if (aKey.includes(key) && isTruthy(address[aKey])) {
                    search += ` ${address[aKey]}`;
                }
            });
        });
    }

    search = search.trim().replace(/\s+|,/g, '+');
    return `https://maps.google.it/maps?q=${search}`;
};

/**
 * Open a Google Map using a provided address
 * @function openGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} object - Address information either as a string or as an object
 * @throws {Error} Throws an error if the address is invalid or if it's not a string or object.
 * @return {void}
 * @example openGoogleMapsAddress('New York'); // Opens Google Maps with the address 'New York'
 * @example openGoogleMapsAddress({ address: 'New York', zip: '10001' }); // Opens Google Maps with the address 'New York 10001'
 */
const openGoogleMapsAddress = function (object) {
    if (typeof object !== 'string' && typeof object !== 'object') {
        throw new Error('The input must be a string or an object.');
    }

    const address = getGoogleMapsAddress(object);

    if (!address || typeof address !== 'string') {
        throw new Error('The address you are trying to open is invalid.');
    }

    return urlHelper.open(address);
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
    if (cleaned.length !== 10) {
        throw new Error('Invalid phone number length');
    }

    // Initialize an array to hold the formatted phone number
    let formatted = [];

    // Initialize a pointer for the cleaned phone number
    let cleanedPointer = 0;

    // Loop through the template and replace placeholders with actual numbers
    for (let i = 0; i < template.length; i++) {
        if (template[i] === '0') {
            formatted.push(cleaned[cleanedPointer]);
            cleanedPointer++;
        } else {
            formatted.push(template[i]);
        }
    }

    return formatted.join('');
}

/**
 * Validate a phone number
 * @function validatePhone
 * @memberof Utility
 * @param {String} phone
 * @return void|Toast
 * @example validatePhone('1234567890') // true
 * @example validatePhone('(123) 456-7890') // true
 * @example validatePhone('123-456-7890') // true
 * @example validatePhone('123 456 7890') // false
 * @example validatePhone('123-4567-89') // false
 */
const validatePhone = function (phone) {
    var phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return phoneRegex.test(phone);
};

/**
 * Validate emails
 * @function validateEmail
 * @memberof Utility
 * @param {String} email
 * @return Boolean
 * @example validateEmail('<EMAIL>') // false
 * @example validateEmail('test@test') // false
 * @example validateEmail('test@test.') // false
 * @example validateEmail('test@test.c') // false
 * @example validateEmail('test@test.com') // true
 */
const validateEmail = function (email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

/**
 * Generate unique ids
 * @function getDynamicId
 * @memberof Utility
 * @return string Format kn__000000__000
 */
const getDynamicId = function () {
    return 'kn__' + new Date().getTime() + '__' + Math.floor(Math.random() * (999 - 100));
};

/**
 * Alias to getDynamicId
 * @function getRandomId
 * @memberof Utility
 * @return string
 * @example getRandomId() // kn__000000__000
 */
const getRandomId = function () {
    return getDynamicId();
};

/**
 * Format dates to standard US, with or w/out time
 * @function dateFormat
 * @memberof Utility
 * @param {String} dateTime Raw format 2201-01-01 16:15PM or unix or object
 * @param {Boolean} wTime If set, returns date with time as H:MM A
 * @return string
 * @example dateFormat('2201-01-01 16:15PM') // 01/01/2201
 * @example dateFormat('2201-01-01 16:15PM', true) // 01/01/2201 @ 4:15 PM
 * @example dateFormat('2201-01-01 16:15PM', false) // 01/01/2201
 * @example dateFormat('2201-01-01') // 01/01/2201
 */
const dateFormat = function (dateTime, wTime) {
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
};

/**
 * Translate dollar amounts to decimal notation
 * @function currencyToDecimal
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 * @example currencyToDecimal('$123.45') // 123.45
 */
const currencyToDecimal = function (amount) {
    return Number(amount.replace(/[^0-9.-]+/g, ''));
};

/**
 * Translate decimal notation to dollar amount
 * @function decimalToCurrency
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 * @example decimalToCurrency(123.45) // 123.45
 * @example decimalToCurrency(2123.46) // 2,123.46
 */
const decimalToCurrency = function (amount) {
    const formatConfig = {
        minimumFractionDigits: 2,
    };
    return new Intl.NumberFormat('en-GB', formatConfig).format(amount);
};

/**
 * (alias) decimalToCurrency
 * @function toCurrency
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 * @example toCurrency(123.45) // 123.45
 * @example toCurrency(2123.46) // 2,123.46
 */
const toCurrency = function (amount) {
    return decimalToCurrency(amount);
};

/**
 * Covert to dollar string
 * @function toDollarString
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 * @example toDollarString(2,000) // 2K
 * @example toDollarString(2,000,000) // 2M
 * @example toDollarString(2,500,000) // 2.5M
 */
const toDollarString = function (amount) {
    if (typeof amount === 'string') {
        amount = currencyToDecimal(amount);
    }

    if (Math.abs(amount) > 999 && Math.abs(amount) < 999999) {
        return Math.sign(amount) * (Math.abs(amount) / 1000).toFixed(1) + 'K';
    }
    if (Math.abs(amount) > 999999) {
        return Math.sign(amount) * (Math.abs(amount) / 1000000).toFixed(1) + 'M';
    }

    return Math.sign(amount) * Math.abs(amount);
};

/**
 * Check if there is a value, if not return null or the default value
 * It can test strings, arrays, objects, numbers, booleans
 * @function emptyOrValue
 * @memberof Utility
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
const emptyOrValue = function (value, _default) {
    /**
     * Test sequence:
     * If it is a number 0> : true
     * If is not undefined: true
     * If it is boolean (true|false) prevents going to empty
     * If it is not Empty, [], null, {}, 0, true, false: true
     */

    if (Number.isInteger(value) || typeof value === 'boolean') {
        return value;
    } else if (!isUndefined(value) && !isEmpty(value)) {
        return value;
    } else if (!isUndefined(_default) && !isEmpty(_default)) {
        return _default;
    }

    return null;
};

/**
 * Check if is a number or Int, if not return null
 * Integrates both Int and Number to test
 * @function isNumber
 * @memberof Utility
 * @param {String|Number} value
 * @return bool|int
 * @example isNumber(123) // true
 * @example isNumber('123.45') // true
 */
const isNumber = function (value) {
    if (Number.isInteger(value) || !Number.isNaN(Number(value))) {
        return +value;
    }

    return false;
};

/**
 * Logging into console in places where console cannot be called directly
 * @function logThis
 * @memberof Utility
 * @param {Object} obj
 * @return void
 * @example logThis('test') // 'test'
 */
const logThis = (obj) => {
    console.log(obj);
};

/**
 * Dom Element selector
 * @function select
 * @param {String} selector - The selector to search for
 * @param {Object} scope - The scope to search in
 * @return {String} - The first element that matches the selector
 * @uses ElementHelper @knighttower/element-helper (https://github.com/knighttower/ElementHelper)
 * @example select('#test') // <div id="test"></div>
 */
const select = (selector, scope = document) => {
    return new ElementHelper(selector, scope);
};

/**
 * @example ProxyHelper({objectProps..., _protected: array(...)})
 * @param {Object} object
 * @return {Proxy}
 * @usage const proxy = ProxyHelper({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})
 * @usage _protected: array(...) -> Cannot be modified
 * @usage _private: array(...) -> Cannot be accessed
 * @usage _mutable: array(...) -> Can be modified
 */
const proxyObject = (obj) => {
    return new ProxyHelper(obj);
};

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
const convertToBool = (val) => {
    let type = typeof val;

    switch (type) {
        case 'boolean':
            return val;
        case 'string':
            return val === 'false' || val === '0' ? false : true;
        case 'number':
            return val !== 0;
        default:
            return Boolean(val);
    }
};

/**
 * handles the following patterns to get an object from string attributes
 * // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
 * // Matches the Array as string: [value, value] OR ['value','value']
 * // Matches a multi-array string like [[value,value]],value]
 * // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
 * // Matches string ID or class: literals Id(#) or class (.). Note that in Vue it needs to be in quotes attr="'#theId'"
 * // Mathes simple directive function style: directive(#idOr.Class)
 * Note: all the above with the exception of the Id/class will be converted into actual objects
 */
/**
 * Converts strings formats into objects
 * @function getDirectivesFromString
 * @param {String|Array|Object} settings
 * @return {Object|void|null}
 * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
 * @example getDirectivesFromString('[[value,value]],value]') // {directive: 'values', directive2: 'values'}
 * @example getDirectivesFromString('directive.tablet|mobile(...values)') // {directive: {tablet: 'values', mobile: 'values'}}
 * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
 */
const getDirectivesFromString = function (settings) {
    if (!settings) {
        return null;
    }
    let values, breakDownId, directive, properties;
    const type = typeof settings;
    // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
    const regexObjectLike = /^\{((.|\n)*?)\:((.|\n)*?)\}/gm;

    // Matches the Array as string: [value, value] OR ['value','value']
    const regexArrayLike = /^\[((.|\n)*?)\]$/gm;
    // Matches a multi-array string like [[value,value]],value]
    const regexMultiArrayString = /\[(\n|)(((.|\[)*)?)\](\,\n|)(((.|\])*)?)(\n|)\]/gm;
    // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
    // OR directive.breakdown|breakdown2(...values) OR directive.tablet(...values)&&directive.mobile(...values)
    const regexDotObjectString = /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm;
    const regexExObjectString = /([a-zA-Z]+)\[((.|\n)*?)\]\(((.|\n)*?)\)/gm;
    // Matches string ID or class: literals #... or ....
    const regexIdOrClass = /^(\.|\#)([a-zA-Z]+)/g;
    // Mathes simple directive function style: directive(#idOr.Class)
    const regexFunctionString = /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g;

    if (type === 'object' || type === 'array') {
        return settings;
    }
    // Else if String

    if (settings.match(regexIdOrClass)) {
        return settings;
    }

    if (settings.match(regexFunctionString)) {
        directive = settings.split('(')[0].trim();
        values = getMatchInBetween(settings, '(', ')');
        settings = {};
        settings[directive] = values;
        return settings;
    }

    if (settings.match(regexArrayLike)) {
        let start = /^\[/;
        let end = /\]$/;
        let keyProps = getMatchInBetween(settings, start, end);
        keyProps = keyProps.split(',');

        // test if multi-array
        if (settings.match(regexMultiArrayString)) {
            keyProps = getMultiArray(settings);
        }

        keyProps.forEach((str) => {
            let cleanStr = addQuotes(removeQuotes(str));
            settings = settings.replace(str, cleanStr);
        });
        return JSON.parse(fixQuotes(settings));
    }

    if (settings.match(regexObjectLike)) {
        let keyProps = getMatchInBetween(settings, '{', ':', true);
        keyProps = keyProps.concat(getMatchInBetween(settings, ',', ':', true));

        keyProps.forEach((str) => {
            let cleanStr = addQuotes(removeQuotes(str));
            settings = settings.replace(str, cleanStr);
        });
        return JSON.parse(fixQuotes(settings));
    }

    if (settings.match(regexDotObjectString) || settings.match(regexExObjectString)) {
        let setObject = {};

        settings = settings.split('&&');

        settings.forEach((command) => {
            command = command.trim();

            if (command.match(regexExObjectString)) {
                values = getMatchInBetween(command, '](', ')');
                breakDownId = getMatchInBetween(command, '[', ']');
                directive = command.split('[')[0].trim();
            } else {
                values = getMatchInBetween(command, '(', ')');
                command = command.replace(getMatchBlock(command, '(', ')'), '');
                properties = command.split('.');
                directive = properties[0];
                breakDownId = properties[1];
                properties[2] = properties[2] ?? null;
            }

            values = values
                .split(',')
                .map((cl) => cl.trim())
                .join(' ');

            if (!setObject[directive]) {
                setObject[directive] = {};
            }

            if (properties && properties[2]) {
                setObject[directive][breakDownId] = {};
                setObject[directive][breakDownId][properties[2]] = values;
            } else {
                setObject[directive][breakDownId] = values;
            }
        });

        return setObject;
    }
};

/**
 * Build the multi-array from a string like
 * @private
 * @param {String} str - find The target (needle)
 * @return {Array}
 */
function getMultiArray(str) {
    let arrays = {};
    let innerArrayRegex = /(\[([^[]*?))\]/gm;
    let start = /^\[/;
    let end = /\]$/;
    str = getMatchInBetween(str, start, end);
    let innerArrays = str.match(innerArrayRegex);

    if (innerArrays) {
        let i = 1;
        while (str.match(innerArrayRegex)) {
            str.match(innerArrayRegex).forEach((record, index) => {
                let $index = `@${i}@${index}`;
                arrays[$index] = record;
                str = str.replace(record, $index);
            });

            i++;
        }
    }

    str = str.split(',');

    const total = (Object.keys(arrays).length ?? 1) * str.length;
    let loops = 0;
    while (Object.keys(arrays).length > 0) {
        let keys = Object.keys(arrays);
        let tmpStr = str;
        Object.keys(arrays).forEach((key) => {
            let strArray = getMatchInBetween(arrays[key], start, end).split(',');
            let replaced = findAndReplaceInArray(str, key, strArray);

            if (replaced) {
                str = replaced;
                delete arrays[key];
            }
        });

        if (loops > total) {
            throw new Error('Too many loops, the string passed is malformed' + str);
        }
        loops++;
    }

    return str;
}

/**
 * Recursively will loop in array to find the desired target
 * @function findAndReplaceInArray
 * @param {Array} arr
 * @param {String} find The target (needle)
 * @param {Array|Object|String} value Replacer
 * @return {Null|Array}
 * @example findAndReplaceInArray([1,2,3,4,5], 3, 'three') // [1,2,'three',4,5]
 */
function findAndReplaceInArray(arr, find, value) {
    let results = null;
    let tmpArray = arr;

    arr.forEach((prop, index) => {
        if (Array.isArray(prop)) {
            let replaced = findAndReplaceInArray(prop, find, value);
            if (replaced) {
                tmpArray[index] = replaced;
                results = tmpArray;
            }
        }
        if (prop === find) {
            if (Array.isArray(value)) {
                value = value.map((p) => {
                    if (!Array.isArray(p)) {
                        return p.trim();
                    }
                    return p;
                });
            }
            tmpArray[index] = value;
            results = tmpArray;
        }
    });

    return results;
}

/**
 * find a match in between two delimeters, either string or regex given, returns clean matches
 * @function getMatchBlock
 * @param {String} str
 * @param {String|Regex} p1
 * @param {String|Regex} p2
 * @param {Boolean} all If it should return all matches or single one (default)
 * @return {String|Array|Null}
 * @example getMatchInBetween('hello world', 'h', 'd') // 'ello worl'
 * @example getMatchInBetween('hello <world/>', '<', '/>', true) // ['world']
 * @example getMatchInBetween('hello <world/>', '<', '/>') // 'world'
 */
function getMatchInBetween(str, p1, p2, all = false) {
    if (all) {
        let matches = [];
        let group = getMatchBlock(str, p1, p2, all) ?? [];

        group.forEach((match) => {
            matches.push(cleanStr(match, p1, p2));
        });
        return matches;
    } else {
        str = getMatchBlock(str, p1, p2) ?? str;
        return cleanStr(str, p1, p2);
    }
}

/**
 * Find math by delimeters returns raw matches
 * @function getMatchBlock
 * @param {String} str
 * @param {String|Regex} p1
 * @param {String|Regex} p2
 * @param {Boolean} all If it should return all matches or single one (default)
 * @return {String|Array|Null}
 * @example getMatchBlock('is a hello world today', 'h', 'd') // 'hello world'
 * @example getMatchBlock('is a hello world today', 'h', 'd', true) // ['hello world']
 * @example getMatchBlock('is a <hello world/> today', '<', '/>') // '<hello world/>'
 */
function getMatchBlock(str, p1, p2, all = false) {
    p1 = setExpString(p1);
    p2 = setExpString(p2);
    let regex = new RegExp(setLookUpExp(p1, p2), 'gm');
    const matches = str.match(regex);
    if (matches) {
        return all ? matches : matches[0];
    }
    return null;
}

/**
 * Clean a string from delimeters or just trimmed if no delimeters given
 * @funtion cleanStr
 * @param {String} str - String to use
 * @param {String|Regex} p1 - Delimeter 1
 * @param {String|Regex} p2 - Delimeter 2
 * @return {String}
 * @example cleanStr('hello world', 'h', 'd') // 'ello worl'
 * @example cleanStr('  hello world  ') // 'hello world'
 * @example cleanStr('hello world', 'hello') // 'world'
 * @example cleanStr('Hello World. Sunshine is here!', '\..*!') // Hello World
 * @example cleanStr('Hello World. Sunshine is here!', /Hello/g) // ' World. Sunshine is here!'
 * @example cleanStr('Hello World. Sunshine is here!', /Hello/g, /Sunshine/g) // ' World.  is here!'
 */
function cleanStr(str, p1, p2) {
    return str
        .replace(new RegExp(setExpString(p1)), '')
        .replace(new RegExp(setExpString(p2)), '')
        .trim();
}

/**
 * Scapes a string to create a regex or returns the regex if it already is an expression
 * @function setExpString
 * @param {String|Regex} exp
 * @return {String|Regex}
 * @example setExpString('hello') // '\h\e\l\l\o'
 * @example setExpString(/hello/) // /hello/
 * @example setExpString([hello]) // \\[hello\\/ then use like new new RegExp(setExpString(StringOrRegex))
 */
function setExpString(exp) {
    if (exp instanceof RegExp) {
        return exp;
    } else {
        return exp
            .split('')
            .map((char) =>
                ['$', '^', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(char)
                    ? `\\${char}`
                    : char,
            )
            .join('');
    }
}

/**
 * Regex builder to get a match in between two delimeters
 * @function setLookUpExp
 * @param {String|Regex} args - minimun two arguments as delimeters
 * @return {String} - Regex
 * @example setLookUpExp('h', 'd') // 'h((.|\n)*?)d'
 * @example setLookUpExp('h', 'd', 'c') // 'h((.|\n)*?)d((.|\n)*?)c'
 * @usage:
 * const pattern = setLookUpExp(".", "!");
const regex = new RegExp(pattern, 'g');
const text = "Hello World. Sunshine is here! Have fun!";
const matches = text.match(regex);
console.log(matches);  // Output: [". Sunshine is here!"]
 */
function setLookUpExp(...args) {
    if (args.length < 2) {
        throw new Error('You need to pass at least two arguments');
    }
    let expression = '';
    // loop through args
    args.forEach((arg, index) => {
        // if arg is a regex, return the source
        if (arg instanceof RegExp) {
            arg = arg.source;
        }
        if (index === 0) {
            expression = arg;
        } else {
            expression += `((.|\n)*?)${arg}`;
        }
    });

    return expression;
}

/**
 * Remove quotes from a string
 * @function removeQuotes
 * @param {String} str
 * @return {String}
 * @example removeQuotes('"hello"') // hello
 * @example removeQuotes("'hello'") // hello
 */
function removeQuotes(str) {
    return str.replace(/'|"/g, '');
}

/**
 * Fix quotes from a string
 * @function fixQuotes
 * @param {String} str
 * @return {String}
 * @example fixQuotes("'hello'") // "hello"
 * @example fixQuotes('"hello"') // "hello"
 */
function fixQuotes(str) {
    return str.replace(/'/g, '"');
}

/**
 * Add quotes to a string
 * @function addQuotes
 * @param {String} str
 * @return {String}
 * @example addQuotes('hello') // "hello"
 */
function addQuotes(str) {
    return `"${str}"`;
}

/**
 * Search for a wildcard pattern in a list of strings or vicevers
 * @method wildCardStringSearch
 * @param {string} pattern - The pattern to search for
 * @param {array|string} list - The list of strings to search in
 * @param {boolean} matchStart - If the pattern should match the start of the string (optional)
 * @param {boolean} matchEnd - If the pattern should match the end of the string optional)
 * @return {string[]|null} - Returns a list of strings that match the pattern, or null if no match is found
 * @example wildCardStringSearch('name.*', ['name.a', 'name.b', 'name.c']) // returns ['name.a', 'name.b', 'name.c']
 */
function wildCardStringSearch(pattern, listOrString, matchStart = false, matchEnd = false) {
    if (!pattern || !listOrString) {
        return null;
    }
    const regex = new RegExp(this.setWildCardString(pattern, matchStart, matchEnd));

    if (typeof listOrString === 'string') {
        const matches = listOrString.match(regex);
        return emptyOrValue(matches, null);
    }

    let filteredList = [];
    filteredList = listOrString.filter((item) => regex.test(item));

    return emptyOrValue(filteredList, null);
}

/**
 * Set a string to be used as a wildcard pattern
 * @function setWildCardString
 * @param {string} string - The string to set as a wildcard pattern
 * @param {boolean} matchStart - If the pattern should match the start of the string
 * @param {boolean} matchEnd - If the pattern should match the end of the string
 * @return {string} - The wildcard pattern
 * @example setWildCardString('name.*', true) // returns '^name\.(.*?)'
 * @example setWildCardString('name.*', false, true) // returns 'name\.(.*?)$'
 * @example setWildCardString('name.**') // returns 'name\..*' greedy
 */
function setWildCardString(string, matchStart = false, matchEnd = false) {
    if (!string) {
        return null;
    }
    let regexStr = string.replace(/([.+?^${}()|\[\]\/\\])/g, '\\$&'); // escape all regex special chars
    let regStart = matchStart ? '^' : '';
    let regEnd = matchEnd ? '$' : '';

    regexStr = regexStr
        .replace(/\*\*/g, '[_g_]') // Replace wildcard patterns with temporary markers
        .replace(/\*/g, '(.*?)')
        .replace(/\[_g_\]/g, '.*');

    return `${regStart}${regexStr}${regEnd}`;
}

/**
 * convert all keys from an object to symbols
 * @function convertKeysToSymbols
 * @param {object} obj - The object to convert
 * @return {object} - The object with all keys converted to symbols
 * @example convertKeysToSymbols({a: 1, b: 2}) // returns {Symbol(a): 1, Symbol(b): 2}
 */
function convertKeysToSymbols(obj) {
    const newObj = {};
    for (const key in obj) {
        const symbolKey = Symbol(key);
        newObj[symbolKey] = obj[key];
    }
    return newObj;
}

const powerHelper = {
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
    wildCardStringSearch,
    setWildCardString,
    convertKeysToSymbols,
};

// export default Utility;
const Utility = Object.assign(
    {
        getGoogleMapsAddress,
        openGoogleMapsAddress,
        formatPhoneNumber,
        validatePhone,
        validateEmail,
        getDynamicId,
        getRandomId,
        dateFormat,
        currencyToDecimal,
        decimalToCurrency,
        toCurrency,
        toDollarString,
        emptyOrValue,
        isNumber,
        logThis,
        select,
        proxyObject,
        convertToBool,
        urlHelper,
        // from Lodash used internally but might as well make them available
        every,
        includes,
        isUndefined,
    },
    powerHelper,
);
export {
    getGoogleMapsAddress,
    openGoogleMapsAddress,
    formatPhoneNumber,
    validatePhone,
    validateEmail,
    getDynamicId,
    getRandomId,
    dateFormat,
    currencyToDecimal,
    decimalToCurrency,
    toCurrency,
    toDollarString,
    emptyOrValue,
    isNumber,
    logThis,
    select,
    proxyObject,
    convertToBool,
    urlHelper,
    // from Lodash used internally but might as well make them available
    every,
    includes,
    isUndefined,
    // from JsPowerHelperFunctions
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
    wildCardStringSearch,
    setWildCardString,
    convertKeysToSymbols,
};
export { Utility, Utility as default, Utility as utils, powerHelper };
