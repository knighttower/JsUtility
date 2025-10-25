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

const uuid = (max = 20) => {
    const rnd = () => Math.random().toString(36).substring(2, 15);
    max = max || 40;
    var str = '';
    for (var i = 0; i < max / 3 + 1; i++) {
        str += rnd();
    }
    return str.substring(0, max);
};

/**
 * Generate unique ids
 * @function getDynamicId
 * @memberof utility
 * @return string Format kn__000000__000
 */
function getDynamicId() {
    return 'id__' + uuid(8) + '__' + new Date().getTime();
}

/**
 * Alias to getDynamicId
 * @function getRandomId
 * @memberof utility
 * @return string
 * @example getRandomId() // kn__000000__000
 */
const getRandomId = getDynamicId;

/**
 * Check if a value is empty
 * @function isEmpty
 * @memberof utility
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
 * @example typeOf(123, 'number|int') // returns 'number'
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

// [2023] [Knighttower] https://github.com/knighttower

/**
 * @module proxyObject
 * Convert to proxy to protect objects
 * Allows to declare _private, _protected and _mutable - all arrays with prop names
 * @example proxyObject({objectProps..., _protected: array(...)})
 * @param {Object} object
 * @return {Proxy}
 * @usage const proxy = proxyObject({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})
 * @usage _protected: array(...) -> Cannot be modified
 * @usage _private: array(...) -> Cannot be accessed
 * @usage _mutable: array(...) -> Can be modified
 */
function proxyObject(object) {

    // Initialize property access control sets
    const _private = new Set(['_private', ...(object._private || [])]);
    const _protected = new Set(['_protected', ..._private, ...(object._protected || [])]);
    const _mutable = new Set(object._mutable || []);

    const canMutate = (prop) => {
        if (_protected.has(prop) && !_mutable.has(prop)) {
            console.error(`Attempt to modify protected property: ${prop}`);
            return false;
        }
        if (_private.has(prop) && !_mutable.has(prop)) {
            console.error(`Attempt to modify private property: ${prop}`);
            return false;
        }
        return true;
    };

    return new Proxy(object, {
        get(target, prop, receiver) {
            if (_private.has(prop)) {
                console.error(`Attempt to access private property: ${prop}`);
                return undefined;
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            if (!canMutate(prop)) {
                return false;
            }
            return Reflect.set(target, prop, value, receiver);
        },
        deleteProperty(target, prop) {
            if (!canMutate(prop)) {
                return false;
            }
            return Reflect.deleteProperty(target, prop);
        },
        defineProperty(target, prop, descriptor) {
            if (!canMutate(prop)) {
                return false;
            }
            return Reflect.defineProperty(target, prop, descriptor);
        },
        ownKeys(target) {
            return Reflect.ownKeys(target).filter((key) => !_private.has(key));
        },
        enumerate(target) {
            const keys = Reflect.enumerate(target);
            return keys.filter((key) => !_private.has(key));
        },
        has(target, prop) {
            return !_private.has(prop) && Reflect.has(target, prop);
        },
        getOwnPropertyDescriptor(target, prop) {
            if (_private.has(prop)) {
                return undefined;
            }
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
    });
}

// Author Knighttower
// MIT License
// Copyright (c) [2022] [Knighttower] https://github.com/knighttower


// @private
function _removeBrackets(strExp) {
    const regex = /^(\{.*\}|\[.*\])$/; // Match only if both brackets are the same type
    const match = strExp.match(regex);

    if (match) {
        return match[0].slice(1, -1).trim(); // Extract and trim the content between brackets
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
    // return lastMatch;
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
 * Fix quotes from a string
 * @function fixQuotes
 * @param {String} str
 * @return {String} q quote type
 * @return {String}
 * @example fixQuotes("'hello'") // "hello"
 * @example fixQuotes('"hello"') // "hello"
 */
function fixQuotes(str, q = '"') {
    if (typeof str !== 'string') {
        return str;
    }
    return str.replace(/`|'|"/g, q);
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
    if (typeOf(strExp, 'object') || typeOf(strExp, 'array') || !strExp) {
        return strExp;
    }
    const isObject = (str) => startAndEndWith(str, '{', '}');
    const isArray = (str) => startAndEndWith(str, '[', ']');

    const collectionType =
        (isObject(strExp) ? 'object' : null) || (isArray(strExp) ? 'array' : null);
    // If it is other type of string, return it
    if (!collectionType) {
        return strExp;
    }

    const nestedElements = {};

    const getNested = (str) => {
        const match1 = findNested(str, '{', '}');
        const match2 = findNested(str, '[', ']');

        if (str.indexOf(match1) > str.indexOf(match2)) {
            return match1 || null;
        }
        return match2 || null;
    };

    const loopNested = (str) => {
        if (!str) {
            return;
        }

        let matched = getNested(_removeBrackets(str));

        if (!matched) {
            return;
        }
        const addMarker = (_str, matched) => {
            let marker = `__${getRandomId()}__`;
            let type =
                (isObject(matched) ? 'object' : null) ||
                (isArray(matched) ? 'array' : null) ||
                'string';
            _str = _str.replace(matched, marker);
            nestedElements[marker] = {
                type,
                matched,
            };
            return _str;
        };

        str = addMarker(str, matched);

        return loopNested(str) || str;
    };

    const buildNested = (str, type) => {
        str = _removeBrackets(str);
        let output = type === 'object' ? {} : [];

        getChunks(str).forEach((chunk, index) => {
            const isObjectKey = chunk.includes(':') && type === 'object';
            const chunkParts = isObjectKey ? getChunks(chunk, ':') : [];
            const chunkKey = removeQuotes(emptyOrValue(chunkParts[0], index));
            chunk = isObjectKey ? chunkParts[1] : chunk;

            if (chunk in nestedElements) {
                const nested = nestedElements[chunk];
                chunk = buildNested(nested.matched, nested.type);
            }
            chunk = convertToNumber(removeQuotes(chunk));
            // set back in the collection either as an object or array
            type === 'object' ? (output[chunkKey] = chunk) : output.push(chunk);
        });
        return output;
    };

    return buildNested(loopNested(strExp) || strExp, collectionType);
}

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
 * @param {String|Array|Object} stringDirective
 * @return {object|null|void}
 * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
 * @example getDirectivesFromString('[[value,value],value]') // {directive: 'values', directive2: 'values'}
 * @example getDirectivesFromString('directive.tablet|mobile(...values)') // {directive: {tablet: 'values', mobile: 'values'}}
 * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
 */
function getDirectivesFromString(stringDirective) {
    const str = stringDirective;

    if (!emptyOrValue(str)) {
        return null;
    }

    const results = (type = null, results = null) => {
        return {
            type: type,
            directive: results,
        };
    };
    const matchArrayTypes = /^\[((.|\n)*?)\]$/gm;
    // comment eslint to ignore

    const matchObjectTypes = /^\{((.|\n)*?)\:((.|\n)*?)\}$/gm;

    const matchFunctionString = /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g;
    const regexDotObjectString = /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm;
    const regexExObjectString = /([a-zA-Z]+)\[((.|\n)*?)\]\(((.|\n)*?)\)/gm;
    let type = typeof str;

    if (type === 'object' || type === 'array') {
        return results(type, str);
    } else {
        switch (true) {
            case !!str.match(matchArrayTypes):
                // Matches the Array as string: [value, value] OR ['value','value']
                // regexArrayLike = /^\[((.|\n)*?)\]$/gm;
                // Matches a multi-array string like [[value,value]],value]
                // regexMultiArrayString = /\[(\n|)(((.|\[)*)?)\](\,\n|)(((.|\])*)?)(\n|)\]/gm;

                type = 'array';
                break;
            case !!str.match(matchObjectTypes):
                // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
                // regexObjectLike = /^\{((.|\n)*?)\:((.|\n)*?)\}/gm;
                type = 'object';
                break;
            case !!str.match(matchFunctionString):
                // Mathes simple directive function style: directive(#idOr.Class)
                // regexFunctionString

                const directive = str.split('(')[0].trim();
                return results('idOrClassWithDirective', {
                    [directive]: getMatchInBetween(str, '(', ')'),
                });
            case !!str.match(regexDotObjectString):
                // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
                // OR directive.breakdown|breakdown2(...values) OR directive.tablet(...values)&&directive.mobile(...values)
                type = 'dotObject';
                break;
            case !!str.match(regexExObjectString):
                type = 'dotObject';
                break;

            default:
                return results('string', str);
        }
    }
    if (type === 'array' || type === 'object') {
        let strQ = fixQuotes(str);

        try {
            return results(type, JSON.parse(strQ));
        } catch (error) {
            // uncomment to debug
            // console.log('___ parse error ___', error);
        }

        return results(type, getArrObjFromString(strQ));
    }

    if (type === 'dotObject') {
        let values, breakDownId, directive;
        const setObject = {};

        getChunks(str, '&&').forEach((command) => {
            if (command.match(regexExObjectString)) {
                // Matches object-style strings: directive[expression](...values)
                values = getMatchInBetween(command, '](', ')');
                breakDownId = getMatchInBetween(command, '[', ']');
                directive = command.split('[')[0].trim();
            } else {
                // Matches object-style strings: directive.tablet(...values)
                values = getMatchInBetween(command, '(', ')');
                command = command.replace(getMatchBlock(command, '(', ')'), '');
                [directive, breakDownId] = getChunks(command, '.');
            }

            values = getArrObjFromString(values);

            if (!setObject[directive]) {
                setObject[directive] = {};
            }

            getChunks(breakDownId, '|').forEach((id) => {
                setObject[directive][id] = values;
            });
        });

        return results('dotObject', setObject);
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
    if (typeof str !== 'string') {
        return str;
    }
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
    if (typeof str !== 'string') {
        return str;
    }
    const matchBlock = getMatchBlock(str, p1, p2, all) ?? (all ? [] : str);
    return all ? matchBlock.map((match) => cleanStr(match, p1, p2)) : cleanStr(matchBlock, p1, p2);
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
                ['$', '^', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(
                    char
                )
                    ? `\\${char}`
                    : char
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
let observer;
/**
 * When node change
 * @param {String} id
 * @param {Function} callback Callback when any node changes/ add/deleted/modified
 * @memberof DomObserver
 * @usage domObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })
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
 * @memberof DomObserver
 * @usage domObserver.removeOnNodeChange('elementIdentifier')
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
const start = () => {
    if (typeof window !== 'undefined' && !observer) {
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

        observer = new MutationObserver(callback);
        if (document.body) {
            return observer.observe(document.body, config);
        }
        document.addEventListener('DOMContentLoaded', (event) => {
            return observer.observe(document.body, config);
        });
    }
};
/**
 * @exports domObserver
 * @type {Object}
 * @usage domObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })
 * @usage domObserver.removeOnNodeChange('elementIdentifier')
 * @usage domObserver.cleanup()
 */
const domObserver = {
    start,
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
        domObserver.start();
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
                domObserver.addOnNodeChange(callbackId, () => {
                    let element = new ElementHelper($this.selector);
                    if (element.isInDom()) {
                        $this = element;
                        resolveThis($this);
                        domObserver.removeOnNodeChange(callbackId);
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
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue;
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
                    new ElementHelper(element.parentNode).getXpathTo() +
                    '/' +
                    element.tagName +
                    '[' +
                    (ix + 1) +
                    ']'
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

// =========================================
// --> Utilities
// --------------------------
const selectElement = (selector, scope = document) => new ElementHelper(selector, scope);

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
    return str.split('|').reduce((testsForKey, t) => {
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
                        keys.filter((key) => key !== 'any')
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
            const objTypes = objectTypes(strExp);
            testUnit = new Map([...testUnit, ...objTypes]);
            break;
        default:
            isNoType(strExp);
    }

    cachedTests.set(strExp, testUnit);
    return testUnit;
}

// Error collector
const typeErrorLogs = [];

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

class ObjectTestHandler {
    constructor(inputVal, unitTest) {
        // Extract all properties at once
        /* prettier-ignore */
        const { testOnly, testFew, testAllAny, optionalKeys, tests } = [...unitTest.entries()].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
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
            this.settings = getSettings();
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
 * Test the type but does not throw an error, althought it can use the rest of the chain methods
 * @param {any} inputVal
 * @param {string} typeExp
 */
const validType = (inputVal, typeExp) => {
    return _typeCheck(inputVal, typeExp).test();
};

// author Knighttower
//  MIT License
//  Copyright (c) [2022] [Knighttower] https://github.com/knighttower

/**
 * @module Teleport
 * Teleport an element to another place in the DOM before, inside or after a target
 * @param {Object|String} props || selector - props object (domElement: element, adaptiveId: null|uniqueId})
 * @example new Teleport({domElement: element, adaptiveId: uniqueId}).beam({to: selector})
 * @example new Teleport(domElement).beam({after: selector})
 * @example new Teleport(domElement).beam({before: selector})
 * @example new Teleport(domElement).beam(selector) // defaults to "to" which is inside the selector
 * @example const eleTeleport = new Teleport(domElement) // returns the object with eleTeleport{beam(String|Object), back(), cancel()}
 * @example Make it global so that is available in the browser and works as a 'window' library
 *   TeleportGlobal()
 *      - <div data-teleport="selector"></div>
 *      - <div data-teleport="{before: 'selector'}"></div>
 *     - <div data-teleport="{after: 'selector'}"></div>
 * @feature If the target (element where it will be sent to) is not in the DOM it will wait until it is and then it will beam the element
 * @return {Object} Teleport object
 */
class Teleport {
    /**
     * Constructor
     * @param {String|Object} selector || props object (see AdaptiveElement)
     * @return {Object}
     */
    constructor(props) {
        domObserver.start();
        // Early exit if no props are provided
        if (!validType(props, 'string|object')) {
            return;
        }

        this.props = props;
        if (!this.props.adaptiveId) {
            const element = selectElement(this.props);
            const attrId = element.getAttribute('data-adaptive-id') ?? null;
            // If adaptiveId is not present, create or retrieve it
            const uniqueId = attrId || element.getHash();
            if (!attrId) {
                element.domElement.setAttribute('data-adaptive-id', uniqueId);
            }

            // Update props with additional properties
            this.props = Object.assign({}, this.props, {
                adaptiveId: uniqueId,
                helper: element,
                domElement: element.domElement,
                xpath: element.getXpathTo(),
            });
        }

        let placeholder = selectElement(`[name="adaptive"][value="${this.props.adaptiveId}"`);
        if (!placeholder.isInDom()) {
            placeholder = document.createElement('param');
            placeholder.name = 'adaptive';
            placeholder.value = this.props.adaptiveId;
            this.props.domElement.insertAdjacentElement('beforebegin', placeholder);
        }
    }

    /**
     * Beam the element to another place in the DOM
     * This method will look for the "tagert" element if it is in the DOM and it will querying the DOM until it finds it
     * if the target is not found call the cancel() method to stop the observer
     * @param {String|Object} target (selector) directive defaults to "to" || {to|after|before: target}
     * @example new Teleport(domElement).beam({after: selector})
     * @example domElement.beam({after: selector})
     */
    beam(settings) {
        settings = getDirectivesFromString(settings).directive;

        if (typeOf(settings, 'object') && settings.teleport) {
            // to make it responsive
            this.props.domElement.removeAttribute('data-adaptive-id');
            $adaptive.registerElement(this.props.domElement, settings);
            return;
        }
        // Transform settings to an array format
        switch (typeOf(settings)) {
            case 'string':
                settings = ['default', settings];
                break;
            case 'object':
                const key = Object.keys(settings)[0];
                settings = [key, settings[key]];
                break;
            case 'array':
                if (settings.length === 1) {
                    settings = ['default', settings[0]];
                }
                break;
        }

        const [direction, selector] = settings;
        const target = selectElement(selector);
        let position = 'beforeend';

        switch (direction) {
            case 'before':
                position = 'beforebegin';
                break;
            case 'after':
                position = 'afterend';
                break;
        }

        if (target.isInDom()) {
            target.domElement.insertAdjacentElement(position, this.props.domElement);
            return;
        }

        // Add observer if the target is not in the DOM
        domObserver.addOnNodeChange(this.props.adaptiveId, () => {
            const observedTarget = selectElement(selector);
            if (observedTarget.isInDom()) {
                observedTarget.domElement.insertAdjacentElement(position, this.props.domElement);
                domObserver.removeOnNodeChange(this.props.adaptiveId);
            }
        });
    }

    /**
     * Return to its original place
     * @example new Teleport(domElement).back()
     * @example domElement.back()
     */
    back() {
        let target = selectElement(`[name="adaptive"][value="${this.props.adaptiveId}"`);
        if (target.isInDom()) {
            target.domElement.insertAdjacentElement('afterend', this.props.domElement);
            // target.domElement.remove();
        }
    }

    /**
     * If element target is no it the DOM and needs to cancel the observer
     * @example new Teleport(domElement).cancel()
     * @example domElement.cancel()
     */
    cancel() {
        domObserver.removeOnNodeChange(this.props.adaptiveId);
    }
}

// Storage
let TeleportIsGlobal = false;

/**
 * Warning, this will make it global and would work with data attr like data-teleport
 * @example new Teleport().global()
 */
function TeleportGlobal() {
    // Exit if already initialized
    if (TeleportIsGlobal) {
        return;
    }

    // Use forEach directly on NodeList
    document.querySelectorAll('[data-teleport]').forEach((element) => {
        new Teleport(element).beam(element.getAttribute('data-teleport'));
    });

    // Mark as initialized
    TeleportIsGlobal = true;
}

// Author Knighttower
// MIT License
// Copyright (c) [2022] [Knighttower] https://github.com/knighttower

/**
 * @class CSS Query Handler
 * @return QueryHandler
 */
const QH = (function QueryHandler() {
    const $window = typeof window !== 'undefined' ? window : {};
    /**
     * Query Handler Class Object
     * @private
     * @return {Object}
     */
    const $this = {};
    const QueryHandler = new Proxy($this, {
        get(target, prop) {
            if (prop in target) {
                return target[prop];
            }
        },
    });

    /**
     * Holds memory of registered queries expressions
     * @private
     */
    const registeredQueries = {};

    /**
     * Holds memory of registered queries to match
     * @private
     */
    const domQueriesMatch = {};

    /**
     * Holds memory of registered queries to Unmatch
     * @private
     */
    const domQueriesUnMatch = {};

    /**
     * Flag
     * @private
     */
    let loaded = false;

    // =========================================
    // --> PUBLIC
    // --------------------------

    /**
     * Register a query
     * @param {Object} queries Media queries with breakdowns and directives
     * @param {Function} matchCallback Callback
     * @param {Function|Null} unMatchCallback Callback
     * @param {Object|Null} Adaptive When in use with Adaptive.js object
     * @return {Void}
     */
    $this.add = (queries, matchCallback, unMatchCallback = null, Adaptive = null) => {
        for (let query in queries) {
            // Values are the classes, styles, functions
            let values = queries[query];

            // Set a preset if found or just the query in case is custom
            let queryExpression = getPreset(query, Adaptive) ?? query;

            // If it does not exists, add it as an array
            if (!domQueriesMatch[queryExpression]) {
                domQueriesMatch[queryExpression] = [];
                domQueriesUnMatch[queryExpression] = [];
            }

            domQueriesMatch[queryExpression].push([matchCallback, values]);
            if (unMatchCallback) {
                domQueriesUnMatch[queryExpression].push([unMatchCallback, values]);
            }

            registerQueryListener(queryExpression);
        }
    };

    /**
     * Remove items from domQueriesMatch based on value and prop.
     *
     * @param {any} value - The value to be removed.
     * @param {string} prop - The property to look up in the object.
     */
    $this.remove = (value, prop) => {
        for (const [expression, collection] of Object.entries(domQueriesMatch)) {
            for (const reg of collection) {
                let type = typeof reg[1];
                // LookUp by the prop value when the second array element is an object
                if (prop && type === 'object') {
                    if (prop in reg[1] && reg[1][prop] === value) {
                        // console.log(domQueriesMatch[expression]);
                        domQueriesMatch[expression] = domQueriesMatch[expression].filter(
                            function (o) {
                                return o[1][prop] !== value;
                            }
                        );
                    }
                    // LookUp by the value (function) and prop when the second array element is a string
                } else if (type === 'string' && reg[1] === prop) {
                    domQueriesMatch[expression] = domQueriesMatch[expression].filter(function (o) {
                        return o[0] !== value;
                    });
                }
            }
        }
    };

    /**
     * Initialization of the class functionality
     * @return {Void}
     */
    $this.init = () => {
        loaded = true;
        Object.keys(domQueriesMatch).forEach((queryExpression) => {
            // Listener for after initial load
            registerQueryListener(queryExpression);
            // Run the queries on load once
            singleRun(queryExpression);
        });
    };

    /**
     * Reset the whole object | warning
     * @return {Void}
     */
    $this.reset = () => {
        Object.keys(registeredQueries).forEach((queryExpression) => {
            $window
                .matchMedia(queryExpression)
                .removeEventListener('change', registeredQueries[queryExpression]);
            delete registeredQueries[queryExpression];
        });
        Object.keys(domQueriesMatch).forEach((key) => delete domQueriesMatch[key]);
        Object.keys(domQueriesUnMatch).forEach((key) => delete domQueriesUnMatch[key]);
    };

    // =========================================
    // --> PRIVATE
    // --------------------------

    function singleRun(queryExpression) {
        let mq = $window.matchMedia(queryExpression);
        if (mq.matches) {
            domQueriesMatch[mq.media].forEach(function (callback) {
                return callback[0](callback[1]);
            });
        }
    }

    /**
     * Get the preset query values present in Adaptive object
     * @private
     */
    function getPreset(queryId, Adaptive = null) {
        let presets = {
            q: null, // query min-max values preset
            e: null, // custom expression preset
        };

        // -----------------------------------------
        // when working with Adaptive.Js
        if (Adaptive) {
            let presetQs = Adaptive.getMinMaxQueries();
            let presetEs = Adaptive.getExpQueries();
            presets.q = presetQs[queryId] ?? null;
            presets.e = presetEs[queryId] ?? null;

            if (!presets.q && !presets.e) {
                if (queryId.includes('|')) {
                    let qs = queryId.split('|');
                    let qs1 = qs[0];
                    let qs2 = qs[1];

                    if (presetQs[qs1] && presetQs[qs2]) {
                        return buildExpression(presetQs[qs1], presetQs[qs2], true);
                    }

                    if (presetEs[qs1] && presetEs[qs2]) {
                        return buildExpression(presetEs[qs1], presetEs[qs2], true, true);
                    }
                }
            } else {
                // Write the correct expression for the preset min-max
                if (presets.q) {
                    return buildExpression(presets.q[0], presets.q[1]);
                }
                // No need to build the expression as it already is
                if (presets.e) {
                    return presets.e;
                }
            }
        }

        return null;
    }

    /**
     * @private
     */
    function buildExpression(q1, q2, isCompound = false, isExpression = false) {
        let templateQuery = '(min-width: $1px) and (max-width: $2px)';

        if (isCompound) {
            if (!isExpression) {
                q1 = templateQuery.replace('$1', q1[0]).replace('$2', q1[1]);
                q2 = templateQuery.replace('$1', q2[0]).replace('$2', q2[1]);
            }
            return `${q1}, ${q2}`;
        }

        return templateQuery.replace('$1', q1).replace('$2', q2);
    }

    function registerQueryListener(queryExpression) {
        // If not already registered
        // This helps to avoid too many Listeners created
        if (!registeredQueries[queryExpression]) {
            let matchQuery = $window.matchMedia(queryExpression);
            let callback = (mq) => {
                if (!mq.matches) {
                    domQueriesUnMatch[mq.media].forEach(function (callback) {
                        return callback[0](callback[1]);
                    });
                } else {
                    domQueriesMatch[mq.media].forEach(function (callback) {
                        return callback[0](callback[1]);
                    });
                }
            };

            registeredQueries[queryExpression] = callback;
            return matchQuery.addEventListener('change', callback);
        }
        // For those added after the loaded event
        if (loaded) {
            singleRun(queryExpression);
        }
    }
    $window.QueryHandler = QueryHandler;

    return $window.QueryHandler;
})();

// Author Knighttower
//  MIT License
//  Copyright (c) [2022] [Knighttower] https://github.com/knighttower


/**
 * @class Adds some extra functionality to interact with a DOM element
 * @param {Object} props
 * @param {Object} Adaptive Instance of
 * @return {Object}
 */
class AdaptiveElement {
    /**
     * Constructor
     * @param {String|Object} selector
     * @return {Object}
     */
    constructor(props, Adaptive) {
        this.props = props;
        this.Adaptive = Adaptive;

        for (let directive in props.settings) {
            // Matches the method name and passes the directives
            // ex: addClass, removeClass, addStyle, teleport, execute
            this[directive](props.settings[directive]);
        }
    }

    _addClass = ($classes) => {
        $classes = $classes.split(' ');
        $classes.forEach(($class) => {
            this.props.domElement.classList.add($class);
        });
        return;
    };

    _removeClass = ($classes) => {
        $classes = $classes.split(' ');
        $classes.forEach(($class) => {
            this.props.domElement.classList.remove($class);
        });
        return;
    };

    addClass(queries) {
        return QH.add(queries, this._addClass, this._removeClass, this.Adaptive);
    }

    removeClass(queries) {
        return QH.add(queries, this._removeClass, this._addClass, this.Adaptive);
    }

    addStyle(queries) {
        // Save the original style in memory to not discard them
        this.props.originalStyle = this.props.domElement.getAttribute('style');

        return QH.add(
            queries,
            ($styles) => {
                return (this.props.domElement.style.cssText += $styles);
            },
            () => {
                return (this.props.domElement.style.cssText = this.props.originalStyle);
            },
            this.Adaptive
        );
    }

    teleport(queries) {
        let $element = new Teleport(this.props);

        return QH.add(
            queries,
            ($directive) => {
                return $element.beam($directive);
            },
            () => {
                $element.back();
                return $element.cancel();
            },
            this.Adaptive
        );
    }

    execute(queries) {
        let $element = this;
        let attrs = {
            adaptiveId: $element.props.uniqueId,
            helper: $element.props.helper,
            domElement: $element.props.domElement,
            xpath: $element.props.xpath,
        };
        return QH.add(
            queries,
            ($callback) => {
                if ($callback && typeof $callback === 'function') {
                    return $callback(attrs);
                }
            },
            ($callback) => {
                if ($callback && typeof $callback === 'function') {
                    return $callback(attrs);
                }
            },
            this.Adaptive
        );
    }
}

/**
 * Adaptive Teleport
 * @module
 * @example <teleport-to target="" position=""></teleport-to>
 * @property {String|Object} target
 * @property {String} target
 */
var TeleportTo$1 = {
    name: 'TeleportTo',
    inheritAttrs: false,
    props: {
        target: {
            type: [String, Object],
            require: true,
        },
        position: {
            type: String,
            default: 'to',
            require: false,
        },
    },
    setup(props) {
        const directive = `${props.position}(${props.target})`;
        return {
            directive,
        };
    },
    template: `
        <div>
            <div v-teleport-to="directive">
                <slot></slot>
            </div>
        </div>
    `,
};

class TeleportTo extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let target = this.getAttribute('target');
        let position = this.getAttribute('position') ?? 'to';
        let dId = this.getAttribute('data-adaptive-id');

        if (target && !dId) {
            return new Teleport(this).beam(`${position}(${target})`);
        }
    }
}
function componentTeleportTo() {
    customElements.define('teleport-to', TeleportTo);
}

// Author Knighttower
// MIT License
// Copyright (c) [2022] [knighttower] https://github.com/knighttower


// =========================================
// --> ADAPTIVE JS
// --------------------------

/**
 * @module Adaptive
 * Add/remove classes/styles or teleport an element
 * @return {Object}
 * @example Adaptive(window, Adaptive)
 * @example Adaptive(this, Adaptive)
 * @example Adaptive.registerElement(element)
 * @see "example" folder for more
 */
const _adaptive = (function () {

    domObserver.start();
    const $window = typeof window !== 'undefined' ? window : {};

    // -----------------------------------------
    // This will make it reuse the same instance if already imported without overwrites
    if ($window.$adaptive) {
        return $window.$adaptive;
    }
    // -----------------------------------------

    /**
     * Register this library into the $window
     * @private
     * @return {Object}
     */
    const $this = { _mutable: ['registerElement', 'addQueryMinMax', 'addQueryExpression'] };

    const Adaptive = proxyObject($this);

    /**
     * All the elements that will be part of the grid
     * @private
     */
    const domElements = {};

    /**
     * Flag for isMounted
     * @private
     */
    let isMounted = false;

    /**
     * Flag for using Vue
     * @private
     */
    let useVue = false;

    /**
     * Flag for using React
     * @private
     */
    let useReact = false;

    /**
     * Flag for using React
     * @private
     */
    let useWeb = false;

    /**
     * Flag for using Hybrid
     * @private
     */
    let isHybrid = false;

    /**
     * queries possible sizes
     * @private
     */
    const screens = {
        320: [1, 379],
        480: [380, 519],
        520: [520, 599] /* up to : mobiles */,
        600: [600, 699] /* up to : mid-size-tables */,
        700: [700, 799] /* up to : tablets / ipad */,
        800: [800, 919] /* transition in between tablets and desktop */,
        920: [920, 999] /* from here on for desktops */,
        1000: [1000, 1199],
        1200: [1200, 1439],
        1440: [1440, 1599],
        1600: [1600, 1700],
    };

    /**
     * break the 3 major device types
     * @private
     */
    const devices = {
        mobile: [1, 599] /* Actual phones */,
        tablet: [600, 799] /* tablets in portrait or below */,
        odd: [800, 1023] /* small Laptops and Ipads in landscape */,
        desktop: [1024, 1920] /* Most common resolutions below 1920 */,
    };

    /**
     * break the 3 major device types
     * @private
     */
    const broadMediaQueries = {
        'non-desktop': [100, 1023],
        nondesktop: [100, 1023],
        fullscreen: [1920, 6000] /* Large monitos and fullscreen in 1920 res */,
    };

    /**
     * To register additional custom queries add the key:[min, max]
     * @private
     */
    const customMinMaxQueries = {};

    /**
     * To register additional custom queries add the key:'Query Expression'
     * @private
     */
    const customExpressionQueries = {};

    // =========================================
    // --> utility
    // --------------------------

    /**
     * Get all the available queries
     * @private
     * @return {Object}
     */
    $this.getAllQueries = () => {
        return Object.assign(
            {},
            screens,
            devices,
            broadMediaQueries,
            customMinMaxQueries,
            customExpressionQueries
        );
    };

    /**
     * @memberof Adaptive
     * @inner
     * Get all the available min max queries
     * @return {Object}
     */
    $this.getMinMaxQueries = () => {
        return Object.assign({}, screens, devices, broadMediaQueries, customMinMaxQueries);
    };

    /**
     * @memberof Adaptive
     * @inner
     * Get all the available "expression" queries
     * @return {Object}
     */
    $this.getExpQueries = () => {
        return Object.assign({}, customExpressionQueries);
    };

    /**
     * @memberof Adaptive
     * @inner
     * Register an element
     * @param {String|Object} elementOrSelector
     * @param {Object} data Optional used directly to add the directives, but is mostly for VUe
     * @return {Void}
     */
    $this.registerElement = (elementOrSelector, data) => {
        const helper = selectElement(elementOrSelector);

        if (helper.isInDom()) {
            return registerThis(helper, data);
        } else {
            helper.whenInDom().then(function (element) {
                return registerThis(element, data);
            });
        }
    };

    /**
     * Register an element
     * @private
     * @param {String|Object} elementOrSelector
     * @param {Object} data Optional used directly to add the directives, but is mostly for VUe
     * @return {Void}
     */
    function registerThis(element, data) {
        // Register only unique non indexed elements
        if (!element.getAttribute('data-adaptive-id')) {
            let uniqueId = element.getHash();

            let settings = getDirectivesFromString(data || element.getAttribute('data-adaptive')).directive;

            //set the unique id to the element for later use
            element.domElement.setAttribute('data-adaptive-id', uniqueId);

            domElements[uniqueId] = new AdaptiveElement(
                {
                    adaptiveId: uniqueId,
                    helper: element,
                    domElement: element.domElement,
                    xpath: element.getXpathTo(),
                    settings: settings,
                    useVue: useVue,
                    useReact: useReact,
                },
                $this
            );

            return uniqueId;
        }
    }

    /**
     * @memberof Adaptive
     * @inner
     * Register A custom Query Min, Max
     * @param {String} id Identifier
     * @param {Number} min Number only, no units attached as it only handles pixels here
     * @param {Number} max Number only, no units attached as it only handles pixels here
     * @return {Void}
     */
    $this.addQueryMinMax = function (id, min, max) {
        if (!customMinMaxQueries[id]) {
            if (!min || !max) {
                throw new Error('Min or Max must be passed (id, min, max)', 1);
            }
            customMinMaxQueries[id] = [min, max];
        }
    };

    /**
     * @memberof Adaptive
     * @inner
     * Register A custom Query Expression
     * @param {String} id Identifier
     * @param {String} query Media query, example "screen and (max-width: 500em) and (orientation: landscape)"
     * @param {Number} max Number only, no units attached as it only handles pixels here
     * @return {Void}
     */
    $this.addQueryExpression = function (id, query) {
        if (!customExpressionQueries[id]) {
            customExpressionQueries[id] = query;
        }
    };

    /**
     * @memberof Adaptive
     * @inner
     * Register A custom Query Expression
     * @param {String} breakdownId Identifier like "tablet" or "mobile", etc
     * @param {Fucntion|Array} callback Function/Method or Array with object and property to set
     * @example Adaptive.if('mobile', [object, propertyId]) || Adaptive.if('mobile', () => {})
     * @return {Object} Proxy
     */
    $this.if = function (breakdownId, callback = null) {
        let isFunction = callback && typeof callback === 'function';
        let isArray = callback && Array.isArray(callback);
        let observer = {};

        observer[breakdownId] = {
            _private: ['breakdownId', 'match', 'ifElse', 'do', 'removeAfterExec'],
            _mutable: ['ifElse', 'match', 'removeAfterExec'],
            uid: getDynamicId(),
            breakdownId: breakdownId,
            match: false,
            executed: false,
            removeAfterExec: false,
            ifElse: null,
            else(ifElse) {
                if (ifElse && typeof ifElse === 'function') {
                    this.ifElse = ifElse;
                }
            },
            onlyOnce() {
                this.removeAfterExec = true;
                if (this.executed) {
                    QH.remove(this.uid, 'uid');
                }
            },
            do() {
                if (this.match) {
                    if (isFunction) {
                        callback();
                    }
                    if (isArray) {
                        callback[0][callback[1]] = true;
                    }

                    if (this.removeAfterExec) {
                        QH.remove(this.uid, 'uid');
                    }
                    this.executed = true;
                    return true;
                }

                if (isArray) {
                    callback[0][callback[1]] = false;
                }

                if (this.ifElse) {
                    this.ifElse();
                }

                return false;
            },
        };

        QH.add(
            observer,
            (o) => {
                o.match = true;
                o.do();
            },
            (o) => {
                o.match = false;
                o.do();
            },
            $this
        );

        return proxyObject(observer[breakdownId]);
    };

    /**
     * Full reset, handle with care
     * @private
     * @return {Void}
     */
    $this.reset = () => {
        Object.keys(domElements).forEach((key) => delete domElements[key]);
        domObserver.cleanup();
        QH.reset();
        isMounted = false;
    };

    // =========================================
    // --> DomReady and INIT
    // --------------------------

    /**
     * Real init for the app
     * @private
     */
    function _init() {
        isMounted = true;
        document
            .querySelectorAll('[data-adaptive]:not([data-adaptive-id])')
            .forEach(function (element) {
                $this.registerElement(element);
            });
        addHtmlCoreClasses();
        QH.init();
        if (useVue || useReact) {
            // hybrid mode
            // support for static and dynamic elements
            if (isHybrid) {
                TeleportGlobal();
            }
        } else {
            // vanilla js
            TeleportGlobal();
        }
    }

    /**
     * Add helper classes to the body element
     * @private
     * @return {Void}
     */
    function addHtmlCoreClasses() {
        const html = document.querySelector('body');
        const classes = {};
        for (let key in screens) {
            classes[key] = 'screen-' + key;
        }
        for (let key in devices) {
            classes[key] = 'is-' + key;
        }
        for (let key in broadMediaQueries) {
            classes[key] = 'type-' + key;
        }

        $this.registerElement(html, { addClass: classes });
    }

    /**
     * @memberof Adaptive
     * @inner
     * Initialization, cam be called externally to reinitialized after dom loaded
     * @return {Void}
     */
    $this.init = () => {
        if (isMounted) {
            return false;
        }

        if (
            document.readyState === 'complete' ||
            (document.readyState !== 'loading' && !document.documentElement.doScroll)
        ) {
            return domIsReady();
        } else {
            // Use the handy event callback
            document.addEventListener('DOMContentLoaded', domIsReady);
            // A fallback to $window.onload, that will always work
            $window.addEventListener('load', domIsReady);
        }

        return;
    };

    /**
     * When ready trigger the initialization
     * @private
     */
    function domIsReady() {
        document.removeEventListener('DOMContentLoaded', domIsReady);
        $window.removeEventListener('load', domIsReady);
        _init();

        return;
    }

    /**
     * @memberof Adaptive
     * @inner
     * For use with Vue
     * @param {Vue} Vue Vue instance
     * @param {Boolean} hybrid Allow support when using static and dynamic
     * @return {Vue}
     */
    $this.useVue = (Vue, hybrid = false) => {
        if (hybrid) {
            isHybrid = true;
        }
        if (typeof Vue === 'object' && typeof Vue.mixin === 'function') {
            useVue = true;
            let installer = {
                install: (app) => {
                    // For Options API
                    app.config.globalProperties.Adaptive = Adaptive;
                    // For composition API
                    app.provide('Adaptive', Adaptive);
                },
            };

            /**
             * Adaptive used as vue.$Adaptive
             * @private
             */
            Vue.use(installer);
            /**
             * Adaptive used as v-adaptive
             * @private
             */
            Vue.directive('adaptive', {
                mounted: (element, binding) => {
                    Adaptive.registerElement(element, binding.value);
                },
            });

            /**
             * Adaptive used as v-teleport-to
             * @private
             */
            Vue.directive('teleport-to', {
                mounted: (element, binding) => {
                    return new Teleport(element).beam(binding.value);
                },
            });

            Vue.component('TeleportTo', TeleportTo$1);

            /**
             * Adaptive used for non Vue elements register with data-adaptive attr
             * Hybrid mode
             * @private
             */
            Vue.mixin({
                mounted: () => {
                    return Adaptive.init();
                },
            });
        }

        return Vue;
    };

    //docs
    /**
     * For use with Web Components
     * @private
     * @return {Void}
     */
    $this.useWebComponent = () => {
        if (!useWeb && !useVue) {
            componentTeleportTo();
            useWeb = true;
        }
    };

    /**
     * @memberof Adaptive
     * @inner
     * For use with React
     * @param {React} React React instance
     * @param {Boolean} hybrid Allow support when using static and dynamic
     * @return {Void}
     */
    $this.useReact = (React, hybrid = false) => {
        if (hybrid) {
            isHybrid = true;
        }
        if (typeof React === 'object') {
            $this.useWebComponent();
            useReact = true;
        }
    };

    $window.$adaptive = Adaptive;

    return $window.$adaptive;
})();

export { _adaptive as Adaptive, _adaptive as adaptive, _adaptive as default };
