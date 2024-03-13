System.register('TestBuilder', [], (function (exports) {
    'use strict';
    return {
        execute: (function () {

            exports({
                default: testBuilder,
                testBuilder: testBuilder
            });

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

            const typesMap = exports('typesMap', new Map([
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
            ]));

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
            const addTypeTest = exports('addTypeTest', (name, testUnit) => {
                if (!typesMap.has(name)) {
                    typesMap.set(name, testUnit);
                    return true;
                }

                return `"${name}" already exists!`;
            });

        })
    };
}));
