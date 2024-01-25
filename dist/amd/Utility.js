define(['exports'], (function (exports) { 'use strict';

    // [2023] [Knighttower] https://github.com/knighttower

    /**
     * @module ProxyHelper
     * Convert to proxy to protect objects
     * Allows to declare _private, _protected and _mutable - all arrays with prop names
     * @example ProxyHelper({objectProps..., _protected: array(...)})
     * @param {Object} object
     * @return {Proxy}
     * @usage const proxy = ProxyHelper({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})
     * @usage _protected: array(...) -> Cannot be modified
     * @usage _private: array(...) -> Cannot be accessed
     * @usage _mutable: array(...) -> Can be modified
     */
    function ProxyHelper(object) {
        const _private = new Map((object._private || ['_private']).map((prop) => [prop, true]));
        const _protected = new Map([..._private, ...(object._protected || []).map((prop) => [prop, true])]);
        const _mutable = new Map((object._mutable || []).map((prop) => [prop, true]));

        return new Proxy(object, {
            get(target, prop) {
                if (prop in target && !_private.has(String(prop))) {
                    return target[prop];
                } else {
                    console.error('Prop is private, not set, or object is protected', prop);
                    return undefined;
                }
            },
            set(target, prop, value) {
                prop = String(prop);
                if (prop in target) {
                    if (_mutable.has(prop)) {
                        target[prop] = value;
                        return true;
                    }
                    if (!_protected.has(prop) && !_private.has(prop)) {
                        target[prop] = value;
                        return true;
                    } else {
                        console.error('The prop is protected or private and cannot be modified', prop, value);
                        return false;
                    }
                } else {
                    console.error('Protected Object, cannot set new props', prop, value);
                    return false;
                }
            },
        });
    }

    // Author Knighttower
    // MIT License
    // [2022] [Knighttower] https://github.com/knighttower
    /**
     * @module DomObserver
     * Detect DOM changes
     * @name DomObserver
     * @param {window} selector
     * @param {Function}
     * @return DomObserver
     * @example DomObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })
     * @example DomObserver.removeOnNodeChange('elementIdentifier')
     */
    /**
     * Holds memory of registered functions
     * @private
     */
    const executeOnNodeChanged = {};
    /**
     * When node change
     * @param {String} id
     * @param {Function} callback Callback when any node changes/ add/deleted/modified
     * @return {Void}
     */
    const addOnNodeChange = (id, callback) => {
        if (callback) {
            executeOnNodeChanged[id] = callback;
        }
    };
    /**
     * Remove from node change
     * @param {String} id
     * @return {Void}
     */
    const removeOnNodeChange = (id) => {
        if (id) {
            delete executeOnNodeChanged[id];
        }
    };
    /**
     * Deep cleanup
     * @return {Void}
     */
    const cleanup = () => {
        Object.keys(executeOnNodeChanged).forEach((key) => delete executeOnNodeChanged[key]);
    };
    /**
     * Observer
     * @private
     * @return {MutationObserver}
     */
    (() => {
        if (typeof window !== 'undefined') {
            const callback = (mutationList) => {
                for (const mutation of mutationList) {
                    if (mutation.type === 'childList') {
                        for (const id in executeOnNodeChanged) {
                            executeOnNodeChanged[id]();
                        }
                    }
                }
            };
            const config = {
                childList: true,
                subtree: true,
            };
            const observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
    })();
    const DomObserver = {
        executeOnNodeChanged,
        addOnNodeChange,
        removeOnNodeChange,
        cleanup,
    };

    // Author Knighttower
    // MIT License
    // Copyright (c) [2022] [Knighttower] https://github.com/knighttower


    /**
     * @class Adds some extra functionality to interact with a DOM element
     * @param {String|Object} selector Class or ID or DOM element
     * @param {String} scope The scope to search in, window, document, dom element. Defaults to document
     * @return {Object}
     * @example new ElementHelper('elementSelector')
     * @example new ElementHelper('elementSelector', domElement|window|document)
     *
     */
    class ElementHelper {
        /**
         * Constructor
         * @param {String|Object} selector
         * @return {Object}
         */
        constructor(selector, scope = document) {
            this.selector = selector;
            if (typeof selector === 'object') {
                this.domElement = selector;
            } else if (String(selector).includes('//')) {
                this.domElement = this.getElementByXpath(selector);
            } else {
                this.domElement = scope.querySelector(selector);
            }
        }

        // =========================================
        // --> Public
        // --------------------------

        /**
         * Check if the element exists or is visible. It will keep querying
         * @return {Boolean}
         */
        isInDom() {
            return Boolean(this.domElement?.outerHTML);
        }

        /**
         * Wait for element exists or is visible. It will keep querying
         * @function whenInDom
         * @return {Promise}
         */
        whenInDom() {
            let $this = this;
            let callbackId = Date.now() + Math.floor(Math.random() * 1000);

            return new Promise(function (resolveThis) {
                if (!$this.isInDom()) {
                    DomObserver.addOnNodeChange(callbackId, () => {
                        let element = new ElementHelper($this.selector);
                        if (element.isInDom()) {
                            $this = element;
                            resolveThis($this);
                            DomObserver.removeOnNodeChange(callbackId);
                        }
                    });
                } else {
                    resolveThis($this);
                }
            });
        }

        /**
         * Find element by Xpath string
         * @param {String} xpath
         * @example getElementByXpath("//html[1]/body[1]/div[1]")
         * @return {Object} DOM element
         */
        getElementByXpath(xpath) {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        /**
         * Get the element xpath string
         * @author Based on https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reload-to-the-same-place-even-if/2631931#2631931
         * @return {String}
         */
        getXpathTo() {
            let element = this.domElement;

            if (element.id) {
                return `//*[@id='${element.id}']`;
            }
            if (element === document.body) {
                return '//' + element.tagName;
            }

            let ix = 0;
            let siblings = element.parentNode.childNodes;
            for (let i = 0; i < siblings.length; i++) {
                let sibling = siblings[i];
                if (sibling === element) {
                    return (
                        new ElementHelper(element.parentNode).getXpathTo() + '/' + element.tagName + '[' + (ix + 1) + ']'
                    );
                }
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                    ix++;
                }
            }
        }

        /**
         * Get the element attribute, but parse it if it is an object or array
         * @param {String} attr Atrribute name
         * @return {String|Array|Object|Null}
         */
        getAttribute(attr) {
            return this.domElement.getAttribute(attr) || null;
        }

        /**
         * Create a unique has for the element derived from its xpath
         * @author Based on https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
         * @return {String}
         */
        getHash() {
            let string = String(this.getXpathTo());
            let hash = 0;

            if (string.length === 0) {
                return hash;
            }

            for (let i = 0; i < string.length; i++) {
                let char = string.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash = hash & hash;
            }

            return hash;
        }
    }

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
    function convertToBool(val) {
        switch (typeof val) {
            case 'boolean':
                return val;
            case 'string':
                return val === 'false' || val === '0' ? false : true;
            case 'number':
                return val !== 0;
            default:
                return Boolean(val);
        }
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
     * @memberof Utility
     * @param {String|Number} amount
     * @return number
     * @example currencyToDecimal('$123.45') // 123.45
     */
    function currencyToDecimal(amount) {
        return Number(amount.replace(/[^0-9.-]+/g, ''));
    }

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
    function dateFormat(dateTime, wTime) {
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
     * @memberof Utility
     * @param {String|Number} amount
     * @return number
     * @example decimalToCurrency(123.45) // 123.45
     * @example decimalToCurrency(2123.46) // 2,123.46
     */
    function decimalToCurrency(amount) {
        const formatConfig = {
            minimumFractionDigits: 2,
        };
        return new Intl.NumberFormat('en-GB', formatConfig).format(amount);
    }

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
    function emptyOrValue(value, _default = null) {
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
     * Generate unique ids
     * @function getDynamicId
     * @memberof Utility
     * @return string Format kn__000000__000
     */
    function getDynamicId() {
        return 'kn__' + new Date().getTime() + '__' + Math.floor(Math.random() * (999 - 100));
    }

    /**
     * Alias to getDynamicId
     * @function getRandomId
     * @memberof Utility
     * @return string
     * @example getRandomId() // kn__000000__000
     */
    const getRandomId = getDynamicId;

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
    function getGoogleMapsAddress(address) {
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
     * Check if a value is in a collection (array, string, object)
     * @param {collection} collection - The collection to search in
     * @param {value} value - The value to search for
     * @param {fromIndex} fromIndex - The index to start searching from
     * @return {boolean} - True if the value is in the collection, false otherwise
     */
    function includes(collection, value, fromIndex = 0) {
        if (Array.isArray(collection) || typeof collection === 'string') {
            // Use native includes for arrays and strings
            return collection.includes(value, fromIndex);
        }

        if (typeof collection === 'object') {
            // Search in object values
            for (let key in collection) {
                if (collection[key] === value) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if a value is empty
     * @function isEmpty
     * @memberof Utility
     * @param {string|array|object|map|set|number|boolean} value
     * @url https://moderndash.io/
     * @return {string}
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
     * @memberof Utility
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
    function isNumber(value) {
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
    function instanceOf(input, test) {
        let inputType = 'unknown';
        const isValid = typeof input === 'function' || typeof input === 'object';
        if (input === null || !isValid) {
            return false;
        }

        const instanceMapping = [Date, RegExp, Promise, Map, Set, WeakMap, WeakSet, ArrayBuffer, DataView];
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
     * @memberof Utility
     * @param {String|Object} object - Address information either as a string or as an object
     * @throws {Error} Throws an error if the address is invalid or if it's not a string or object.
     * @return {void}
     * @example openGoogleMapsAddress('New York'); // Opens Google Maps with the address 'New York'
     * @example openGoogleMapsAddress({ address: 'New York', zip: '10001' }); // Opens Google Maps with the address 'New York 10001'
     */
    function openGoogleMapsAddress(object) {
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
     * @example ProxyHelper({objectProps..., _protected: array(...)})
     * @param {Object} object
     * @return {Proxy}
     * @usage const proxy = ProxyHelper({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})
     * @usage _protected: array(...) -> Cannot be modified
     * @usage _private: array(...) -> Cannot be accessed
     * @usage _mutable: array(...) -> Can be modified
     */
    function proxyObject(obj) {
        return ProxyHelper(obj);
    }

    /**
     * Dom Element selector
     * @function selectElement
     * @param {String} selector - The selector to search for
     * @param {Object} scope - The scope to search in
     * @return {String} - The first element that matches the selector
     * @uses ElementHelper @knighttower/element-helper (https://github.com/knighttower/ElementHelper)
     * @example selectElement('#test') // <div id="test"></div>
     */
    function selectElement(selector, scope = document) {
        return new ElementHelper(selector, scope);
    }

    /**
     * Alias to getDynamicId
     * @function toCurrency
     * @memberof Utility
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
     * @memberof Utility
     * @param {String|Number} amount
     * @return number
     * @example toDollarString(2,000) // 2K
     * @example toDollarString(2,000,000) // 2M
     * @example toDollarString(2,500,000) // 2.5M
     */
    function toDollarString(amount) {
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
     * @example typeOf({}) // returns 'object'
     */
    function typeOf(input, test) {
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
     * @memberof Utility
     * @param {String} email
     * @return Boolean
     * @example validateEmail('<EMAIL>') // false
     * @example validateEmail('test@test') // false
     * @example validateEmail('test@test.') // false
     * @example validateEmail('test@test.c') // false
     * @example validateEmail('test@test.com') // true
     */
    function validateEmail(email) {
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
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
    function validatePhone(phone) {
        var phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return phoneRegex.test(phone);
    }

    // export default Utility;
    const Utility = {
        convertToBool,
        currencyToDecimal,
        convertToNumber,
        dateFormat,
        decimalToCurrency,
        emptyOrValue,
        formatPhoneNumber,
        getDynamicId,
        getGoogleMapsAddress,
        getRandomId,
        includes,
        isEmpty, // from https://moderndash.io/
        isNumber,
        instanceOf,
        openGoogleMapsAddress,
        proxyObject,
        selectElement,
        toCurrency,
        toDollarString,
        typeOf,
        validateEmail,
        validatePhone,
    };

    exports.Utility = Utility;
    exports.convertToBool = convertToBool;
    exports.convertToNumber = convertToNumber;
    exports.currencyToDecimal = currencyToDecimal;
    exports.dateFormat = dateFormat;
    exports.decimalToCurrency = decimalToCurrency;
    exports.default = Utility;
    exports.emptyOrValue = emptyOrValue;
    exports.formatPhoneNumber = formatPhoneNumber;
    exports.getDynamicId = getDynamicId;
    exports.getGoogleMapsAddress = getGoogleMapsAddress;
    exports.getRandomId = getRandomId;
    exports.includes = includes;
    exports.instanceOf = instanceOf;
    exports.isEmpty = isEmpty;
    exports.isNumber = isNumber;
    exports.openGoogleMapsAddress = openGoogleMapsAddress;
    exports.proxyObject = proxyObject;
    exports.selectElement = selectElement;
    exports.toCurrency = toCurrency;
    exports.toDollarString = toDollarString;
    exports.typeOf = typeOf;
    exports.utility = Utility;
    exports.utils = Utility;
    exports.validateEmail = validateEmail;
    exports.validatePhone = validatePhone;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
