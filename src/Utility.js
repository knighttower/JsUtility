// // -----------------------------------------
// /**
//  * @knighttower
//  * @url knighttower.io
//  * @git https://github.com/knighttower/
//  * @license MIT
//  */
// // -----------------------------------------

import { isEmpty, isString, every, forEach, includes, isInteger, isBoolean, isUndefined, toNumber } from 'lodash';
const _ = { isEmpty, isString, every, forEach, includes, isInteger, isBoolean, isUndefined, toNumber };
// @see https://github.com/knighttower/JsObjectProxyHelper
import ProxyHelper from '@knighttower/js-object-proxy-helper';
// @see https://github.com/knighttower/JsUrlHelper
import urlHelper from '@knighttower/js-url-helper';
// @see https://github.com/knighttower/ElementHelper
import ElementHelper from '@knighttower/element-helper';
// @see https://github.com/knighttower/JsPowerHelperFunctions
import { getDirectivesFromString,
    findAndReplaceInArray,
    getMatchInBetween,
    getMatchBlock,
    cleanStr,
    setExpString,
    setLookUpExp,
    removeQuotes,
    fixQuotes,
    addQuotes } from '@knighttower/js-power-helper-functions';

// -----------------------------
// METHODS
// -----------------------------

/**
 * Form a valid Google search address
 * @function getGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} address
 * @return string
 */
const getGoogleMapsAddress = function (address) {
    let search = '';

    if (_.isEmpty(address)) {
        return false;
    }

    if (_.isString(address)) {
        search = address;
    } else {
        let keys = ['address', 'address1', 'city', 'state', 'zip', 'zipcode'];
        let conditions = [
            Boolean(address.address) || Boolean(address.address1),
            Boolean(address.zip) || Boolean(address.zipcode),
            Boolean(address.city),
            Boolean(address.state),
        ];

        let hasFullAddress = _.every(conditions, (i) => {
            return Boolean(i);
        });

        if (hasFullAddress) {
            _.forEach(address, function (x, aKey) {
                keys.forEach((key) => {
                    if (_.includes(aKey, key)) {
                        if (!_.isEmpty(address[aKey])) {
                            search += ' ' + address[aKey];
                        }
                    }
                });
            });
        } else {
            return false;
        }
    }

    search = search.replace(/[\s+|,]/g, '+');
    search = 'https://maps.google.it/maps?q=' + search;

    return search;
};

/**
 * Open a google map
 * @function openGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} object
 * @return void|error
 */
const openGoogleMapsAddress = function (object) {
    let address = getGoogleMapsAddress(object);
    if (address && _.isString(address)) {
        return urlHelper.open(address);
    }
    throw new Error('The address you are trying to open has errors or not valid.');
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
 */
const dateFormat = function (dateTime, wTime) {
    if (!dateTime) {
        return null;
    }

    const date = new Date(dateTime);

    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);

    if (wTime) {
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
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

    if (_.isInteger(value) || _.isBoolean(value)) {
        return value;
    } else if (!_.isUndefined(value) && !_.isEmpty(value)) {
        return value;
    } else if (!_.isUndefined(_default) && !_.isEmpty(_default)) {
        return _default;
    }

    return null;
};

/**
 * Check if is a number or Int, if not return null
 * @function isNumber
 * @memberof Utility
 * @param {String|Number} value
 * @return bool|int
 */
const isNumber = function (value) {
    if (_.isInteger(value) || !Number.isNaN(Number(value))) {
        return _.toNumber(value);
    }

    return false;
};

/**
 * Logging into console in places where console cannot be called directly
 * @function logThis
 * @memberof Utility
 * @param {Object} obj
 * @return void
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

// export default Utility;
const Utility = {
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
    urlHelper,
    // from Lodash used internally but might as well make them available
    isEmpty,
    isString,
    every,
    forEach,
    includes,
    isInteger,
    isBoolean,
    isUndefined,
    toNumber,
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
    addQuotes
};
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
    urlHelper,
    // from Lodash used internally but might as well make them available
    isEmpty,
    isString,
    every,
    forEach,
    includes,
    isInteger,
    isBoolean,
    isUndefined,
    toNumber,
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
    addQuotes
};
export { Utility, Utility as default };
