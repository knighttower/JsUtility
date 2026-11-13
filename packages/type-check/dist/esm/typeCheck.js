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
    // Anything that cannot be converted to a number is returned untouched
    return isNumber(input) ?? input;
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

// Author Knighttower
// MIT License
// Copyright (c) [2022] [Knighttower] https://github.com/knighttower


// @private
// Pairs every opening bracket with the one that closes it: Map { index of '{' or '[' => index of '}' or ']' }
// A bracket without a partner is left out, so it ends up being treated as plain text
function _matchBrackets(str) {
    const pairs = new Map();
    const opened = { '{': [], '[': [] };

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '{' || char === '[') {
            opened[char].push(i);
        } else if (char === '}' || char === ']') {
            const sameType = opened[char === '}' ? '{' : '['];
            const otherType = opened[char === '}' ? '[' : '{'];
            if (sameType.length) {
                const start = sameType.pop();
                pairs.set(start, i);
                // The other type of bracket opened inside this pair was never closed
                while (otherType.length && otherType[otherType.length - 1] > start) {
                    otherType.pop();
                }
            }
        }
    }

    return pairs;
}

/**
 * Converts strings formats into objects or arrays
 * - Values are separated by commas and can be nested: [value, [value], {key: value}]
 * - Object entries are 'key: value', an entry without a key gets its position as the key
 * - Values that are numbers are converted to numbers, any other value is a string
 * - Empty values (like the one after a trailing comma) are ignored
 * Note: quoted strings are not supported (the quotes are removed and a comma inside the quotes still separates values),
 * use getDirectiveFromString instead
 * @param {string} strExp
 * @return {object|array|string} - Anything that is not a string wrapped in {} or [] is returned as it is
 * @example getArrObjFromString('[[value,value],value]') // [['value', 'value'], 'value']
 * @example getArrObjFromString('[[value,value],value, { y: hello }, hello]') // [['value', 'value'], 'value', { y: 'hello' }, 'hello']
 * @example getArrObjFromString('{ y: hello, x: world, z: [value,value]}') // { y: 'hello', x: 'world', z: ['value', 'value'] }
 * @example getArrObjFromString('{ y: 1, url: http://site.com, ...}') // { y: 1, url: 'http://site.com', 2: '...' }
 */
function getArrObjFromString(strExp) {
    // alredy typeof object or array (or anything else that is not a string) just return it
    if (typeof strExp !== 'string') {
        return strExp;
    }
    const expression = strExp.trim();
    const isObject = startAndEndWith(expression, '{', '}');
    // If it is other type of string, return it
    if (!isObject && !startAndEndWith(expression, '[', ']')) {
        return strExp;
    }

    // The content, without the brackets that wrap it
    const str = expression.slice(1, -1);
    // Where each nested collection starts and ends
    const nestedElements = _matchBrackets(str);

    // A value is either a whole nested collection or plain text
    const buildValue = (start, end) => {
        const untrimmed = str.slice(start, end);
        const value = untrimmed.trim();
        if (!value) {
            return;
        }
        // position of the value once trimmed
        start += untrimmed.length - untrimmed.trimStart().length;
        end = start + value.length;

        if (nestedElements.get(start) === end - 1) {
            return buildNested(start + 1, end - 1, value[0] === '{');
        }
        return convertToNumber(removeQuotes(value));
    };

    const buildNested = (start, end, asObject) => {
        const output = asObject ? {} : [];
        let index = 0;
        // Start of the current chunk and its first colon, the one between key and value
        let chunkStart = start;
        let colon = -1;

        for (let i = start; i <= end; i++) {
            if (i < end) {
                if (nestedElements.has(i)) {
                    // commas and colons of a nested collection belong to it, jump to its end
                    i = nestedElements.get(i);
                    continue;
                }
                if (str[i] === ':' && colon === -1) {
                    colon = i;
                }
                if (str[i] !== ',') {
                    continue;
                }
            }
            // a comma or the end of the collection closes the chunk, empty ones are ignored
            if (str.slice(chunkStart, i).trim()) {
                if (asObject) {
                    const isObjectKey = colon !== -1;
                    const key = isObjectKey ? str.slice(chunkStart, colon).trim() : '';
                    const chunkKey = removeQuotes(emptyOrValue(key, index));
                    // '__proto__' is not a key, it would replace the prototype of the output
                    if (chunkKey !== '__proto__') {
                        output[chunkKey] = buildValue(isObjectKey ? colon + 1 : chunkStart, i);
                    }
                } else {
                    output.push(buildValue(chunkStart, i));
                }
                index++;
            }
            chunkStart = i + 1;
            colon = -1;
        }
        return output;
    };

    return buildNested(0, str.length, isObject);
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
 * @return {boolean} - Always false when the given value is not a string
 * @example startAndEndWith('hello world', 'h', 'd') // true
 * @example startAndEndWith('hello world', 'h', 'x') // false
 * @example startAndEndWith('hello world', 'h') // true
 */
function startAndEndWith(strExp, start = null, end = null) {
    return (
        typeof strExp === 'string' &&
        (!start || strExp.startsWith(start)) &&
        (!end || strExp.endsWith(end))
    );
}

//  const powerHelper = {
//     addQuotes,
//     cleanStr,
//     convertKeysToSymbols,
//     findAndReplaceInArray,
//     findNested,
//     fixQuotes,
//     getArrObjFromString,
//     getChunks,
//     getDirectivesFromString,
//     getMatchBlock,
//     getMatchInBetween,
//     getObjectFromPath,
//     removeQuotes,
//     startAndEndWith,
//     setExpString,
//     setLookUpExp,
//     setWildCardString,
//     wildCardStringSearch,
// };

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
// array and object expressions are cached by reference, a WeakMap lets them go once they are not used
const cachedObjectTests = new WeakMap();
const cachedPipedTypes = new Map();

// =========================================
// --> Utility functions
// --------------------------

/**
 * Create enum test function for enum:val1,val2,val3 pattern
 * @param {string} enumStr
 * @return {function} test function
 */
function createEnumTest(enumStr) {
    // Extract values after 'enum:'
    const enumValues = enumStr
        .substring(5)
        .split('/')
        .map((val) => val.trim());
    return (_var_) => enumValues.includes(_var_);
}

/**
 * If the type is a union type, split it and return the tests for each type
 * @param {string} str
 * @return {array} tests
 */
function getPipedTypes(str) {
    if (cachedPipedTypes.has(str)) {
        return cachedPipedTypes.get(str);
    }
    const pipedTests = str.split('|').reduce((testsForKey, t) => {
        let itCanBeNull = false;
        let type = t.trim();

        if (type.endsWith('?')) {
            type = type.slice(0, -1);
            itCanBeNull = true;
        }

        // Check if it's an enum pattern
        if (type.startsWith('enum=')) {
            const enumTest = createEnumTest(type);
            testsForKey.push(enumTest);
        } else {
            // lookup the test for the type and add it to the testsForKey array
            const typeObj = typesMap.get(type);
            const test = typeObj ?? isNoType(type);
            if (test) {
                testsForKey.push(test);
            }
        }

        // for optional types, add the tests for null and undefined
        if (itCanBeNull) {
            testsForKey.push(typesMap.get('null'), typesMap.get('undefined'));
        }
        return testsForKey;
    }, []);
    // cached once all the types are found (isNoType throws for an unsupported one)
    cachedPipedTypes.set(str, pipedTests);
    return pipedTests;
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
 * @return {object} { tests: array, hasRest: boolean }
 */
const arrayTypes = (strExp) => {
    const testUnit = [];
    const convertedObj = getArrObjFromString(strExp);
    let hasRest = false;

    convertedObj.forEach((test, index) => {
        // '[type, ...]' rest marker: the last declared type applies to all remaining elements
        if (typeof test === 'string' && test.trim() === '...') {
            if (index !== convertedObj.length - 1 || index === 0) {
                throw new Error(
                    `Type Error: "..." must be the last item and follow a type in "${typeOf(strExp, 'string') ? strExp : JSON.stringify(strExp)}", e.g. "[type, ...]"`
                );
            }
            hasRest = true;
            return;
        }
        testUnit.push(testBuilder(test));
    });
    return { tests: testUnit, hasRest };
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
                // the '...' entry is not a key to test, 'any' already tests all the other keys
                const keys = Object.keys(obj).filter((key) => obj[key] !== '...');
                if (keys.length === 1) {
                    this.testUnit.set('testAllAny', true);
                } else {
                    this.testUnit.set(
                        'testFew',
                        keys
                            .filter((key) => key !== 'any')
                            // optional keys ('key?') are stored by their name without the '?'
                            .map((key) => (key.endsWith('?') ? key.slice(0, -1) : key))
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
    // strings are cached by value, arrays and objects by reference
    const cache = typeof strExp === 'string' ? cachedTests : cachedObjectTests;
    if (cache.has(strExp)) {
        return cache.get(strExp);
    }
    let testUnit = new Map([
        ['testMethod', determineMethod(strExp)],
        ['tests', null],
    ]);

    switch (testUnit.get('testMethod')) {
        case 'basic':
            testUnit.set('tests', basicTypes(strExp));
            break;
        case 'array': {
            const { tests, hasRest } = arrayTypes(strExp);
            testUnit.set('tests', tests);
            testUnit.set('hasRest', hasRest);
            break;
        }
        case 'object':
            const objTypes = objectTypes(strExp);
            testUnit = new Map([...testUnit, ...objTypes]);
            break;
        default:
            isNoType(strExp);
    }

    cache.set(strExp, testUnit);
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

// Error collector
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

const runArrayTest = (inputVal, tests, hasRest = false) => {
    // If the input is not an array, return false
    if (!typeOf(inputVal, 'array') || inputVal.length === 0) {
        // log it, else the error message would show the value of an earlier test
        pushToErrorLogs(inputVal, 'Expected an array with at least one item');
        return false;
    }
    // Else, test each declared position in the array
    const positionalResult = tests.every((test, index) => {
        return runRouteTest(inputVal[index], test);
    });
    if (!positionalResult || !hasRest) {
        return positionalResult;
    }
    // '[type, ...]': the remaining elements must match the last declared type
    const restTest = tests[tests.length - 1];
    return inputVal.slice(tests.length).every((value) => runRouteTest(value, restTest));
};

class ObjectTestHandler {
    constructor(inputVal, unitTest) {
        // Extract all properties at once
        /* prettier-ignore */
        const [testOnly, testFew, testAllAny, optionalKeys, tests] = [unitTest.get('testOnly'), unitTest.get('testFew'), unitTest.get('testAllAny'), unitTest.get('optionalKeys'), unitTest.get('tests')];
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

                const testFewResults = this.testObjFew();
                // remove the testFew from the inputObject
                this.filterOutFew();
                return testFewResults && this.testObjAllAny();
            case !isEmpty(this.optionalKeys):
                // '{key1?: type, key2?: type}'; // optional keys
                // test the optionalKeys fist so that we can remove them from the inputObject

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
                            `Key: "${k}" not found in the test collection, or use the "any" (any:[type]) key test or "..." after the last key in the test collection {key1: type, key2: type, ...} to only test a few keys.`
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
            Object.entries(this.inputObject).filter(([key]) => !this.testFew.includes(key))
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
            // '{key?: type, any: type}', an optional key that is not set (null/undefined) is not tested
            if (
                this.optionalKeys.includes(key) &&
                (testValue === undefined || testValue === null)
            ) {
                return true;
            }

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
        // log it, else the error message would show the value of an earlier test
        pushToErrorLogs(inputVal, 'Expected an object');
        return false;
    }
    return new ObjectTestHandler(inputVal, unitTest).handleUnitTest();
};

/**
 * Run the appropriate test based on the test method defined in the unitTest.
 * @param {any} inputVal - The value to test.
 * @param {Map} unitTest - The unit test containing the test method and tests.
 * @return {mixed} - The result of the test.
 */
function runRouteTest(inputVal, unitTest) {
    const testMethod = unitTest.get('testMethod');
    const tests = unitTest.get('tests');

    switch (testMethod) {
        case 'basic':
            return runBasicTest(inputVal, tests);
        case 'array':
            return runArrayTest(inputVal, tests, unitTest.get('hasRest'));
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
                    default:
                        _val = { error: input };
                }
                break;
        }
        // only strings are cached, objects and functions can be new on every call
        if (type === 'string') {
            cachedSettings.set(input, _val);
        }
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
    console.log('---> Test Performed:', errorLog.tests);
    //clean the array of error logs
    typeErrorLogs.length = 0;
    throw new Error(
        `\n\n---------------------\nTypeCheck Error --->\n\n The value must not be of type (Type found) = "${errorLog.found}". \n\n The Type used is invalid for value: "${errorLog.value}". \n\n see logged error for details\n---------------------\n\n`
    );
}

function pushToErrorLogs(inputVal, tests) {
    let value;
    try {
        value = JSON.stringify(inputVal);
    } catch (error) {
        // BigInt and circular values can not be converted to JSON, a failed test must not throw
        value = typeOf(inputVal);
    }
    // typeError() only reads the last log, keep one so the logs do not grow forever
    typeErrorLogs.length = 0;
    typeErrorLogs.push({
        value,
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
                this.settings?.error &&
                    console.log('\n\n-----> Error Message: ', this.settings.error);
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
    // string params ('log' | 'fail' | 'return') become their settings object, a string can not be spread
    if (params && typeOf(params, 'string')) {
        params = getSettings(params);
    }
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
            test() {
                return this.testResults.test();
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
    // same result as _typeCheck(inputVal, typeExp).test(), without building the chainable object
    return runRouteTest(inputVal, testBuilder(typeExp));
};

/**
* typeCheck
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

export { typeCheck as TypeCheck, _tc, _tcx, _typeCheck, addTypeTest, typeCheck as default, typeCheck, typesMap, validType };
