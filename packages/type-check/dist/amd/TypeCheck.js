define(['exports'], (function (exports) { 'use strict';

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

    // // -----------------------------------------
    // /**
    //  * @knighttower
    //  * @url knighttower.io
    //  * @git https://github.com/knighttower/
    //  */
    // // -----------------------------------------


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

    // Author Knighttower
    // MIT License
    // Copyright (c) [2022] [Knighttower] https://github.com/knighttower


    // @private
    function _removeBrackets(strExp) {
        const regex = /^(\[|\{)(.*?)(\]|\})$/; // Match brackets at start and end
        const match = strExp.match(regex);

        if (match) {
            return match[2].trim(); // Extract and trim the content between brackets
        }

        return strExp; // Return the original string if no brackets found at start and end
    }

    /**
     * Clean a string from delimeters or just trimmed if no delimeters given
     * @funtion cleanStr
     * @param {String} str - String to use
     * @param {String|Regex} p1 - Delimeter 1
     * @param {String|Regex} p2 - Delimeter 2
     * @return {String|void}
     * @example cleanStr('hello world', 'h', 'd') // 'ello worl'
     * @example cleanStr('  hello world  ') // 'hello world'
     * @example cleanStr('hello world', 'hello') // 'world'
     * @example cleanStr('Hello World. Sunshine is here!', '\..*!') // Hello World
     * @example cleanStr('Hello World. Sunshine is here!', /Hello/g) // ' World. Sunshine is here!'
     * @example cleanStr('Hello World. Sunshine is here!', /Hello/g, /Sunshine/g) // ' World.  is here!'
     */
    function cleanStr(str, ...args) {
        if (!str) {
            return;
        }
        if (typeof str !== 'string') {
            return str;
        }

        return args
            .reduce((accStr, arg) => {
                const regex = arg instanceof RegExp ? arg : new RegExp(setExpString(arg));
                return accStr.replace(regex, '');
            }, str)
            .trim();
    }

    /**
     * Find the last instance of nested pattern with delimeters
     * @function findNested
     * @param {string} str
     * @param {string} start - Delimeter 1
     * @param {string} end - Delimeter 2
     * @return {string|null}
     * @example findNested('[[]hello [world]]', '[', ']') // [world]
     */
    function findNested(str, start = '[', end = ']') {
        if (typeof str !== 'string') {
            return str;
        }
        // Find the last index of '['
        const lastIndex = str.lastIndexOf(start);
        // If '[' is not found, return null or some default value
        if (lastIndex === -1) {
            return null;
        }

        // Extract the substring starting from the last '[' to the end
        const substring = str.substring(lastIndex);
        // Find the index of the first ']' in the substring
        const endIndex = substring.indexOf(end);
        // If ']' is not found, return null or some default value
        if (endIndex === -1) {
            return null;
        }
        // Extract and return the content between the last '[' and the next ']', including them
        return substring.substring(0, endIndex + 1);
    }

    /**
     * Converts strings formats into objects or arrays
     * Note: quoted strings are not supported, use getDirectiveFromString instead
     * @param {string} strExp
     * @return {object|array|string}
     * @example getArrObjFromString('[[value,value],value]') // [['value', 'value'], 'value']
     * @example getArrObjFromString('[[value,value],value, { y: hello }, hello]') // [['value', 'value'], 'value', { y: 'hello' }, 'hello']
     * @example getArrObjFromString('{ y: hello, x: world, z: [value,value]}') // { y: 'hello', x: 'world', z: ['value', 'value'] }
     */
    function getArrObjFromString(strExp) {
        // alredy typeof object or array just return it
        if (typeOf(strExp, 'object') || typeOf(strExp, 'array')) {
            return strExp;
        }
        const isObject = startAndEndWith(strExp, '{', '}');
        const isArray = startAndEndWith(strExp, '[', ']');
        // If it is other type of string, return it
        if (!isObject && !isArray) {
            return strExp;
        }

        const newCollection = isObject ? {} : [];
        const nestedElements = {};

        //remove the brackets
        let newStrExp = _removeBrackets(strExp);

        const loopNested = (objects = false) => {
            // ignore eslint comment
            // eslint-disable-next-line no-constant-condition
            while (true) {
                //find any nested arrays or objects
                let matched = objects ? findNested(newStrExp, '{', '}') : findNested(newStrExp);

                if (!matched) {
                    break;
                }

                //replace the nested array or object with a marker so that we can safely split the string
                let marker = `__${getRandomId()}__`;
                nestedElements[marker] = matched;

                newStrExp = newStrExp.replace(matched, marker);
            }
        };

        loopNested();
        loopNested(true);

        getChunks(newStrExp).forEach((chunk, index) => {
            const isObjectKey = chunk.includes(':') && isObject;
            const chunkParts = isObjectKey ? getChunks(chunk, ':') : [];
            const chunkKey = removeQuotes(emptyOrValue(chunkParts[0], index));
            chunk = isObjectKey ? chunkParts[1] : chunk;
            if (chunk in nestedElements) {
                chunk = getArrObjFromString(nestedElements[chunk]);
            }
            chunk = convertToNumber(removeQuotes(chunk));
            // set back in the collection either as an object or array
            isObject ? (newCollection[chunkKey] = chunk) : newCollection.push(chunk);
        });
        // uncomment to debug
        // console.log('___ log ___', newCollection);
        return newCollection;
    }
    /**
     * Splits a string into chunks by a given splitter and cleans the chunks
     * @param {string} str
     * @param {string} splitter - The string/character to split the string by. Defaults to ','
     * @return {string|array}
     */
    function getChunks(str, splitter = ',') {
        if (typeof str !== 'string') {
            return str;
        }
        if (isEmpty(str)) {
            return [];
        }
        str = cleanStr(str);
        let chunks = str.split(splitter).map((t) => cleanStr(t));
        return chunks.length === 1 && chunks[0] === '' ? [str] : chunks;
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
        if (typeof str !== 'string') {
            return str;
        }
        return str.replace(/`|'|"/g, '');
    }

    /**
     * Checks if a string starts and ends with a given string
     * @param {string} strExp
     * @param {string} start - The string/character to check it starts with
     * @param {string} end - The string/character to check it ends with
     * @return {string}
     * @example startAndEndWith('hello world', 'h', 'd') // false
     * @example startAndEndWith('hello world', 'h', 'd') // true
     */
    function startAndEndWith(strExp, start = null, end = null) {
        return (!start || strExp.startsWith(start)) && (!end || strExp.endsWith(end));
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

    // typeOf is used here insteand of the native typeof because it can handle better the identifications of arrays and objects

    const typesMap = new Map([
        ['array', (_var_) => typeOf(_var_, 'array')],
        ['bigInt', (_var_) => typeof _var_ === 'bigint'],
        ['boolean', (_var_) => typeof _var_ === 'boolean'],
        ['date', (_var_) => _var_ instanceof Date],
        ['float', (_var_) => typeof _var_ === 'number' && !Number.isInteger(_var_)],
        ['function', (_var_) => typeof _var_ === 'function'],
        ['int', (_var_) => Number.isInteger(_var_)],
        ['map', (_var_) => _var_ instanceof Map],
        ['null', (_var_) => _var_ === null],
        ['number', (_var_) => typeof _var_ === 'number'],
        ['object', (_var_) => typeOf(_var_, 'object')],
        ['promise', (_var_) => _var_ instanceof Promise],
        ['regExp', (_var_) => _var_ instanceof RegExp],
        ['set', (_var_) => _var_ instanceof Set],
        ['string', (_var_) => typeof _var_ === 'string'],
        ['symbol', (_var_) => typeof _var_ === 'symbol'],
        ['undefined', (_var_) => typeof _var_ === 'undefined'],
        ['weakMap', (_var_) => _var_ instanceof WeakMap],
        ['weakSet', (_var_) => _var_ instanceof WeakSet],
    ]);

    //  type definitions

    // =========================================
    // --> STORAGE
    // --------------------------
    // Cache storage for tests
    const cachedTests = new Map();
    const cachedPipedTypes = new Map();

    // =========================================
    // --> Utility functions
    // --------------------------

    /**
     * If the type is a union type, split it and return the tests for each type
     * @param {string} str
     * @return {array} tests
     */
    function getPipedTypes(str) {
        if (cachedPipedTypes.has(str)) {
            return cachedPipedTypes.get(str);
        }
        return str.split('|').reduce((testsForKey, t) => {
            let itCanBeNull = false;
            let type = t.trim();

            if (type.endsWith('?')) {
                type = type.slice(0, -1);
                itCanBeNull = true;
            }
            // lookup the test for the type and add it to the testsForKey array
            const typeObj = typesMap.get(type);
            const test = typeObj ?? isNoType(type);
            if (test) {
                testsForKey.push(test);
            }
            // for optional types, add the tests for null and undefined
            if (itCanBeNull) {
                testsForKey.push(typesMap.get('null'), typesMap.get('undefined'));
            }
            cachedPipedTypes.set(str, testsForKey);
            return testsForKey;
        }, []);
    }

    /**
     * Get the tests for a type
     * @param {string} type
     * @return {function[]} tests
     * @throws {Error} if type is not supported
     */
    function isNoType(type) {
        throw new Error(`Type Error: "${type}" is not supported`);
    }

    /**
     * Determine the type of the expression
     * @param {any} strExp
     * @return {string}
     */
    function determineMethod(strExp) {
        if (typeOf(strExp, 'array') || typeOf(strExp, 'object')) {
            return typeOf(strExp);
        }
        const __str = strExp.trim();
        if (startAndEndWith(__str, '[', ']')) {
            return 'array';
        }
        if (startAndEndWith(__str, '{', '}')) {
            return 'object';
        }
        return 'basic';
    }

    // =========================================
    // --> Handlers for different types
    // --------------------------

    /**
     * Basic single types
     * @param {string} typeStr
     * @return {object} tests
     */
    const basicTypes = (typeStr) => {
        return getPipedTypes(typeStr);
    };

    /**
     * Handle array types
     * @param {string} strExp
     * @return {array} tests
     */
    const arrayTypes = (strExp) => {
        const testUnit = [];
        const convertedObj = getArrObjFromString(strExp);

        convertedObj.forEach((test) => {
            testUnit.push(testBuilder(test));
        });
        return testUnit;
    };

    /**
     * Handle object types
     * @param {string} strExp
     * @return {object} tests
     */
    const objectTypes = (strExp) => {
        return new (class handleObjects {
            constructor() {
                this.testUnit = new Map([
                    ['tests', new Map()],
                    ['optionalKeys', []],
                    ['testFew', []],
                    ['testAllAny', false],
                    ['testOnly', false],
                ]);

                return this.handleObject();
            }

            checkOptionalKey(key) {
                if (key.endsWith('?')) {
                    key = key.slice(0, -1);
                    this.testUnit.get('optionalKeys').push(key);
                }
                return key;
            }

            checkTheAnyKey(obj) {
                if ('any' in obj) {
                    const keys = Object.keys(obj);
                    if (keys.length === 1) {
                        this.testUnit.set('testAllAny', true);
                    } else {
                        this.testUnit.set(
                            'testFew',
                            keys.filter((key) => key !== 'any'),
                        );
                    }
                }
            }

            handleObject() {
                const convertedObj = getArrObjFromString(strExp);
                this.checkTheAnyKey(convertedObj);
                for (const key in convertedObj) {
                    const cleanKey = this.checkOptionalKey(key);
                    const value = convertedObj[key];

                    if (value === '...') {
                        delete convertedObj[key];
                        this.testUnit.set('testOnly', true);
                        continue;
                    }

                    this.testUnit.get('tests').set(cleanKey, testBuilder(value));
                }

                return this.testUnit;
            }
        })();
    };

    /**
     * Build the test unit
     * @param {any} strExp String expression
     * @return {object} testUnit
     * @throws {Error} if type is not supported
     * @example testBuilder('number') // returns {testMethod: 'basic', tests: [function]}
     * @example testBuilder('[number]') // returns {testMethod: 'array', tests: [[function]]}
     * @example testBuilder('{any: number}') // returns {testMethod: 'object', tests: {any: [function]}}
     * @usage See more cases in the 'type-pattern.txt' file
     */
    function testBuilder(strExp) {
        if (cachedTests.has(strExp)) {
            return cachedTests.get(strExp);
        }
        let testUnit = new Map([
            ['testMethod', determineMethod(strExp)],
            ['tests', null],
        ]);

        switch (testUnit.get('testMethod')) {
            case 'basic':
                testUnit.set('tests', basicTypes(strExp));
                break;
            case 'array':
                testUnit.set('tests', arrayTypes(strExp));
                break;
            case 'object':
                /* eslint-disable-next-line */
                const objTypes = objectTypes(strExp);
                testUnit = new Map([...testUnit, ...objTypes]);
                break;
            default:
                isNoType(strExp);
        }

        cachedTests.set(strExp, testUnit);
        return testUnit;
    }

    /**
     * Add a new type test
     * @param {string} name The name of the test to add
     * @param {function} testUnit The test function
     * @return {boolean} true if the test was added
     * @throws {Error} if the test already exists
     */
    const addTypeTest = (name, testUnit) => {
        if (!typesMap.has(name)) {
            typesMap.set(name, testUnit);
            return true;
        }

        return `"${name}" already exists!`;
    };

    // Error collectot
    const typeErrorLogs = [];
    // Setting cache
    const cachedSettings = new Map();

    const runBasicTest = (inputVal, tests) => {
        return tests.some((test) => {
            const testResult = test(inputVal);

            if (!testResult) {
                pushToErrorLogs(inputVal, tests);
            }
            return testResult;
        });
    };

    const runArrayTest = (inputVal, tests) => {
        // If the input is not an array, return false
        if (!typeOf(inputVal, 'array') || inputVal.length === 0) {
            return false;
        }
        // Else, test each value in the array
        return tests.every((test, index) => {
            // console.log('is array: ', inputVal[index], test);
            return runRouteTest(inputVal[index], test);
        });
    };

    class HandleObjects {
        constructor(inputVal, unitTest) {
            // Extract all properties at once
            const { testOnly, testFew, testAllAny, optionalKeys, tests } = [...unitTest.entries()].reduce(
                (acc, [key, value]) => ({ ...acc, [key]: value }),
                {},
            );
            // Use destructured variables
            this.testUnitKeys = [...tests.keys()];
            this.testOnly = testOnly;
            this.testFew = testFew;
            this.testAllAny = testAllAny;
            this.optionalKeys = optionalKeys;
            this.testCollection = tests;
            // the input object to test
            this.inputObject = inputVal;
        }

        handleUnitTest() {
            switch (true) {
                case this.testAllAny:
                    // '{any: type}' // any key
                    return this.testObjAllAny();
                case !isEmpty(this.testFew):
                    // '{key1: type, any: type}'; // specific key, and all other "any"
                    // test the testFew fist so that we can remove them from the inputObject
                    /* eslint-disable-next-line */
                    const testFewResults = this.testObjFew();
                    // remove the testFew from the inputObject
                    this.filterOutFew();
                    return testFewResults && this.testObjAllAny();
                case !isEmpty(this.optionalKeys):
                    // '{key1?: type, key2?: type}'; // optional keys
                    // test the optionalKeys fist so that we can remove them from the inputObject
                    /* eslint-disable-next-line */
                    const optionalKeysResults = this.testObjOptionalKeys();
                    // remove the optionalKeys from the inputObject
                    this.filterOutOptionalKeys();
                    return optionalKeysResults && this.defaultTest();
                case !this.testOnly:
                    // '{key1: type, key2: type}'; // all keys
                    for (const k in this.inputObject) {
                        if (!this.testCollection.has(k)) {
                            pushToErrorLogs(
                                this.inputObject,
                                `Key: "${k}" not found in the test collection, or use the "any" (any:[type]) key test or "..." after the last key in the test collection {key1: type, key2: type, ...} to only test a few keys.`,
                            );
                            return false;
                        }
                    }
                    // when testOnly, it will bypass this and check only those found in the test collection
                    // even if the test value has more keys
                    break;
            }

            return this.defaultTest();
        }

        filterOutOptionalKeys() {
            this.testUnitKeys = this.testUnitKeys.filter((item) => !this.optionalKeys.includes(item));
        }

        filterOutFew() {
            this.inputObject = Object.fromEntries(
                Object.entries(this.inputObject).filter(([key]) => !this.testFew.includes(key)),
            );
        }

        testObjOptionalKeys() {
            return this.optionalKeys.every((key) => {
                const test = this.testCollection.get(key);
                const testValue = this.inputObject[key];
                return !testValue ? true : runRouteTest(testValue, test);
            });
        }

        testObjFew() {
            return this.testFew.every((key) => {
                const test = this.testCollection.get(key);
                const testValue = this.inputObject[key];

                return runRouteTest(testValue, test);
            });
        }

        testObjAllAny() {
            const testValues = Object.values(this.inputObject);
            if (testValues.length === 0) {
                return runRouteTest(null, this.testCollection.get('any'));
            }
            return testValues.every((value) => {
                return runRouteTest(value, this.testCollection.get('any'));
            });
        }

        defaultTest() {
            return this.testUnitKeys.every((key) => {
                const test = this.testCollection.get(key);
                const testValue = this.inputObject[key];
                return runRouteTest(testValue, test);
            });
        }
    }

    const runObjectTest = (inputVal, unitTest) => {
        if (!typeOf(inputVal, 'object')) {
            return false;
        }
        return new HandleObjects(inputVal, unitTest).handleUnitTest();
    };

    function runRouteTest(inputVal, unitTest) {
        const testMethod = unitTest.get('testMethod');
        const tests = unitTest.get('tests');

        switch (testMethod) {
            case 'basic':
                return runBasicTest(inputVal, tests);
            case 'array':
                return runArrayTest(inputVal, tests);
            case 'object':
                return runObjectTest(inputVal, unitTest); // No change here as the entire Map is passed
            default:
                return false;
        }
    }

    /**
     * Get settings either from an object or a string keyword.
     * @param {Object | string} input - The settings object or keyword for predefined settings.
     * @return {object | null} - The settings object.
     */
    function getSettings(input) {
        if (input) {
            if (cachedSettings.has(input)) {
                return cachedSettings.get(input);
            }
            // Check if input is an object
            const type = typeof input;
            let _val = null;
            switch (type) {
                case 'function':
                    _val = { callback: input };
                    break;
                case 'object':
                    _val = input;
                    break;
                case 'string':
                    switch (input) {
                        case 'log':
                            _val = { log: true };
                            break;
                        case 'fail':
                            _val = { fail: true };
                            break;
                        case 'return':
                            _val = { return: true };
                            break;
                        case 'validOutput':
                            _val = { validOutput: input };
                            break;
                    }
                    break;
            }
            cachedSettings.set(input, _val);
            return _val;
        }

        return {
            log: false,
            fail: false,
            return: false,
            validOutput: false,
            callback: null,
        };
    }

    /**
     * Throw an error with the last typeErrorLogs
     */
    function typeError(inputVal) {
        const errorLog = typeErrorLogs[typeErrorLogs.length - 1];

        console.log('\n::::::::::::: Type error or not valid ::::::::::::::');
        console.log('Input Value used: ', inputVal);
        console.log('---> Value Found:', errorLog.found);
        console.log('---> Test Permormed:', errorLog.tests);
        //clean the array of error logs
        typeErrorLogs.length = 0;
        throw new Error(
            `\n\n---------------------\nTypeCheck Error --->\n\n The value must not be of type (Type found) = "${errorLog.found}". \n\n The Type used is invalid for value: "${errorLog.value}". \n\n see logged error for details\n---------------------\n\n`,
        );
    }

    function pushToErrorLogs(inputVal, tests) {
        typeErrorLogs.push({
            value: JSON.stringify(inputVal),
            tests: JSON.stringify(tests),
            found: typeOf(inputVal),
        });
    }

    /**
    * _TypeCheck
    * @param {any} inputVal
    * @param {string} typeExp
    * @param {object | string} params Parameters for the typeCheck function. 
    * @return {bool | any} TypeChecker By default it returns boolean, but if '.return()' is used it will return the inputVal
    * @example typeCheck(1, 'number') // true
    * @example typeCheck([1], '[number]') // true
    * @example typeCheck({x: 1, y: 2}, '{any: number}') // true
    * @example typeCheck({ x: 'string', y: 10 }, '{y: number, x: string}', ($this) => {
            console.log('__testLogHere__', $this);
        }) // using call back function
    * @usage (anyInputValue, stringTypeExpression, params: object | string)
    * @usage params: object = { log: boolean, fail: boolean, callback: function }
    * @usage params: string = 'log' | 'fail' | callback: function
    * @usage chain Methods: log(), fail(), return() // returns the input value, test() returns the boolean
    * @notes This function cannot validate the return value of a function when the validOutput is provided, use _tcx instead
    * Params: log = true ; // logs the testData
    * Params: fail = true ; // throws an error when the test fails
    * Params: return = true ; // returns the inputVal
    * Params: callback = function ; // callback function
    * @see testUnit for more examples and test cases   
    */
    const _typeCheck = (inputVal, typeExp, params) => {
        return new (class {
            constructor() {
                this.unitTest = testBuilder(typeExp);
                this.testResult = runRouteTest(inputVal, this.unitTest);
                this.bool = this.testResult;
                this.settings = getSettings(params);
                this.callback = this.settings.callback ?? null;
                this.testData = {
                    typeExp,
                    inputVal,
                    inputType: typeOf(inputVal),
                    callback: this.callback,
                    unitTest: this.unitTest,
                    testResult: this.testResult,
                };
                if (this.settings.log) {
                    this.log();
                }

                if (this.settings.fail) {
                    this.fail();
                }

                if (this.callback) {
                    this.callback(this.testData);
                }
            }
            test() {
                return this.testResult;
            }
            log() {
                console.log('-------------------------- \n ::: Test Data Info :::');
                console.table(this.testData);
                return this;
            }
            fail() {
                if (!this.testResult) {
                    this.log();
                    this.settings?.error && console.log('\n\n-----> Error Message: ', this.settings.error);
                    return typeError(inputVal);
                }
                return this;
            }
            return() {
                return inputVal;
            }
        })();
    };

    /**
    * _tc is a helper function to wrap a function with typeCheck
    * It is basic but faster the _tcx (neglible but if micro-optimization is needed)
    * @param {array} typeExp array of types to test
    * @param {function} __function Function to wrap
    * @param {object | string} params Parameters for the typeCheck function.
    * @return {function} Wrapped function
    * @example _tc('[number]', function (myVar) {
            //code
            console.log(myVar);
        });
    * @usage (stringTypeExpression, Function(), params: object | string)
    * @usage params: object = { log: boolean, fail: boolean, return: boolean, validOutput: string }
    * @usage params: string = 'log' | 'fail' | 'return' 
    * @usage defaults: log = false, fail = true, return = false
    * @notes this function does not accept callback arguments and when using shorthand arguments (string) it does not accept validOutput
    * Params: log = true ; // logs the testData
    * Params: fail = true ; // throws an error when the test fails
    * Params: return = true ; // returns the inputVal
    * Params: callback = function ; // callback function
    * @see directory test for more information and examples
    */
    const _tc = (typeExp, __function, params = {}) => {
        return (...args) => {
            params = { ...{ fail: true }, ...params };
            _typeCheck(args, typeExp, params);
            return __function(...args);
        };
    };

    /**
    * _tcx is a helper function to wrap a function with typeCheck
    * It is as performant as the _tc but it has a lot more features to offer
    * @param {string} typeExp Expression to test
    * @param {function} __function Function to wrap
    * @param {object | string} params Parameters for the typeCheck function. 
    * @return {function} Wrapped function
    * @example _tcx('[number]', function (myVar) {
            //code
            console.log(myVar);
        });
    * @usage (stringTypeExpression, Function(), params: object | string)
    * @usage params: object = { log: boolean, fail: boolean, return: boolean, validOutput: stringTypeExpression }
    * @usage params: string = 'log' | 'fail' | 'return'
    * @notes This function can validate the return value of a function when the validOutput is provided
    * @feature Return value validation
    * @feature all instances accept individual fail, log, and return
    * @feature all instances accept chaining parameters: myCoolFunction(44.5, 'yes!').log().fail().return()
    * Params: log = true ; // logs the testData
    * Params: fail = true ; // throws an error when the test fails
    * Params: return = true ; // returns the inputVal
    * Params: callback = function ; // callback function
    * Params: validOutput = stringTypeExpression ; // validate the return value of the function
    * @see directory test for more information and examples
    */
    const _tcx = (typeExp, __function, params) => {
        let $settings = getSettings(params);
        //set default as true
        $settings = { ...{ fail: true }, ...$settings };
        return (...args) => {
            return new (class {
                constructor() {
                    this.args = args;
                    this.testResults = _typeCheck(args, typeExp, $settings);
                    return this.default();
                }
                default() {
                    this.returns = __function(...args);

                    const validOutput = $settings.validOutput ?? false;
                    if (validOutput) {
                        _typeCheck(this.returns, validOutput, 'fail');
                    }
                    return this;
                }
                log() {
                    this.testResults.log();
                    return this;
                }
                fail() {
                    this.testResults.fail();
                    return this;
                }
                return() {
                    return this.returns;
                }
            })();
        };
    };

    /**
     * Test the type but does not throw an error, althought it can use the rest of the chain methods
     * @param {any} inputVal
     * @param {string} typeExp
     */
    const validType = (inputVal, typeExp) => {
        return _typeCheck(inputVal, typeExp).test();
    };

    /**
    * TypeCheck
    * @param {any} inputVal
    * @param {string} typeExp
    * @example typeCheck(1, 'number') // true
    * @example typeCheck([1], '[number]') // true
    * @example typeCheck({x: 1, y: 2}, '{any: number}') // true
    * @example typeCheck({ x: 'string', y: 10 }, '{y: number, x: string}', ($this) => {
            console.log('__testLogHere__', $this);
        }) // using call back function
    * @see testUnit for more examples and test cases   
    */
    const typeCheck = (inputVal, typeExp, params = null) => {
        return _typeCheck(inputVal, typeExp, params).fail();
    };

    exports.TypeCheck = typeCheck;
    exports._tc = _tc;
    exports._tcx = _tcx;
    exports._typeCheck = _typeCheck;
    exports.addTypeTest = addTypeTest;
    exports.default = typeCheck;
    exports.testBuilder = testBuilder;
    exports.typeCheck = typeCheck;
    exports.typesMap = typesMap;
    exports.validType = validType;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
