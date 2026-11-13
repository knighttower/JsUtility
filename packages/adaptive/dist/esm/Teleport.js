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
const _hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

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

// @private
// Does the same as the regex from setLookUpExp, for delimiters that are plain strings, in a single pass
function _getBlocks(str, start, end, all) {
    const blocks = [];
    let from = 0;

    while (from <= str.length) {
        const opens = str.indexOf(start, from);
        // Without an end after this start there is none after any later start either
        const closes = opens === -1 ? -1 : str.indexOf(end, opens + start.length);
        if (closes === -1) {
            break;
        }
        from = closes + end.length;
        blocks.push(str.slice(opens, from));
        if (!all) {
            break;
        }
    }

    return blocks;
}

/**
 * Clean a string from delimeters or just trimmed if no delimeters given
 * A delimeter given as a string is removed once (its first appearance), use a regex with the g flag to remove all
 * @funtion cleanStr
 * @param {String} str - String to use
 * @param {String|Regex} p1 - Delimeter 1
 * @param {String|Regex} p2 - Delimeter 2
 * @return {String|void} - void when the string is empty
 * @example cleanStr('hello world', 'h', 'd') // 'ello worl'
 * @example cleanStr('  hello world  ') // 'hello world'
 * @example cleanStr('hello world', 'hello') // 'world'
 * @example cleanStr('Hello World. Sunshine is here!', /\..*!/) // 'Hello World'
 * @example cleanStr('Hello World. Sunshine is here!', /Hello/g) // 'World. Sunshine is here!'
 * @example cleanStr('Hello World. Sunshine is here!', /Hello/g, /Sunshine/g) // 'World.  is here!'
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
            if (arg === null || arg === undefined) {
                return accStr;
            }
            // A string (or number) is taken literally and removed once
            return accStr.replace(arg instanceof RegExp ? arg : String(arg), '');
        }, str)
        .trim();
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

// Mathes simple directive function style: directive(#idOr.Class)
const matchFunctionString = /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/;
// Matches object-style strings: directive.tablet(...values)
const regexDotObjectString = /([a-zA-Z]+)\.(.*?)\(([\s\S]*?)\)/;
// Matches object-style strings: directive[expression](...values)
const regexExObjectString = /([a-zA-Z]+)\[([\s\S]*?)\]\(([\s\S]*?)\)/;

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
    if (!emptyOrValue(stringDirective)) {
        return null;
    }

    const results = (type = null, results = null) => {
        return {
            type: type,
            directive: results,
        };
    };
    let type = typeof stringDirective;

    // Already an object or array (or anything else that is not a string)
    if (type !== 'string') {
        return results(type, stringDirective);
    }

    const str = stringDirective.trim();
    // The object-style directives need them, checking first avoids searching a long string for nothing
    const hasParentheses = str.includes('(') && str.includes(')');

    switch (true) {
        case startAndEndWith(str, '[', ']'):
            // Matches the Array as string: [value, value] OR ['value','value']
            // Matches a multi-array string like [[value,value]],value]
            type = 'array';
            break;
        case startAndEndWith(str, '{', '}') && str.includes(':'):
            // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
            type = 'object';
            break;
        case matchFunctionString.test(str):
            // Mathes simple directive function style: directive(#idOr.Class)
            const directive = str.split('(')[0].trim();
            return results('idOrClassWithDirective', {
                [directive]: getMatchInBetween(str, '(', ')'),
            });
        case hasParentheses && regexDotObjectString.test(str):
        case hasParentheses && regexExObjectString.test(str):
            // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
            // OR directive.breakdown|breakdown2(...values) OR directive.tablet(...values)&&directive.mobile(...values)
            type = 'dotObject';
            break;
        default:
            return results('string', stringDirective);
    }

    if (type === 'array' || type === 'object') {
        const strQ = fixQuotes(str);

        // Valid JSON is taken as it is, if not then it is tried again with the quotes fixed
        for (const json of [str, strQ]) {
            try {
                return results(type, JSON.parse(json));
            } catch (error) {
                // uncomment to debug
                // console.log('___ parse error ___', error);
            }
        }

        return results(type, getArrObjFromString(strQ));
    }

    const setObject = {};

    getChunks(str, '&&').forEach((command) => {
        let values, breakDownId, directive;

        if (regexExObjectString.test(command)) {
            // Matches object-style strings: directive[expression](...values)
            values = getMatchInBetween(command, '](', ')');
            breakDownId = getMatchInBetween(command, '[', ']');
            directive = command.split('[')[0].trim();
        } else {
            // Matches object-style strings: directive.tablet(...values)
            values = getMatchInBetween(command, '(', ')');
            command = command.replace(getMatchBlock(command, '(', ')') ?? '', '');
            [directive, breakDownId] = getChunks(command, '.');
        }

        // Not a directive (like plain text in between '&&'), or a name that would alter the object itself
        if (!directive || !breakDownId || directive === '__proto__') {
            return;
        }

        values = getArrObjFromString(values);

        // Only its own keys count: 'constructor' or 'toString' are found in every object, and writing
        // into those would change them for the whole page
        if (!_hasOwn(setObject, directive)) {
            setObject[directive] = {};
        }

        getChunks(breakDownId, '|').forEach((id) => {
            if (id && id !== '__proto__') {
                setObject[directive][id] = values;
            }
        });
    });

    return results('dotObject', setObject);
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
    let matches;
    if (typeof p1 === 'string' && typeof p2 === 'string' && p1 && p2) {
        matches = _getBlocks(str, p1, p2, all);
    } else {
        p1 = setExpString(p1);
        p2 = setExpString(p2);
        matches = str.match(new RegExp(setLookUpExp(p1, p2), 'gm'));
    }
    if (matches && matches.length) {
        return all ? matches : matches[0];
    }
    return null;
}
/**
 * Splits a string into chunks by a given splitter and cleans the chunks
 * @param {string} str
 * @param {string} splitter - The string/character to split the string by. Defaults to ','
 * @return {string|array} - The chunks, or the given value untouched when it is not a string
 * @example getChunks('a, b ,c') // ['a', 'b', 'c']
 * @example getChunks('a | b', '|') // ['a', 'b']
 * @example getChunks('a,,b') // ['a', '', 'b']
 * @example getChunks('') // []
 */
function getChunks(str, splitter = ',') {
    if (typeof str !== 'string') {
        return str;
    }
    str = str.trim();
    if (!str) {
        return [];
    }
    return str.split(splitter).map((chunk) => chunk.trim());
}

/**
 * find a match in between two delimeters, either string or regex given, returns clean matches
 * Note: when there is no match, the string is returned as it is (or an empty array when 'all' is set)
 * @function getMatchInBetween
 * @param {String} str
 * @param {String|Regex} p1
 * @param {String|Regex} p2
 * @param {Boolean} all If it should return all matches or single one (default)
 * @return {String|Array}
 * @example getMatchInBetween('hello world', 'h', 'd') // 'ello worl'
 * @example getMatchInBetween('hello <world/>', '<', '/>', true) // ['world']
 * @example getMatchInBetween('hello <world/>', '<', '/>') // 'world'
 * @example getMatchInBetween('hello world', '<', '/>') // 'hello world'
 * @example getMatchInBetween('hello world', '<', '/>', true) // []
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

/**
 * Scapes a string to create a regex or returns the regex if it already is an expression
 * @function setExpString
 * @param {String|Regex} exp
 * @return {String|Regex}
 * @example setExpString('hello') // 'hello'
 * @example setExpString('hello.world?') // 'hello\.world\?'
 * @example setExpString(/hello/) // /hello/
 * @example setExpString('[hello]') // '\[hello\]' then use like new RegExp(setExpString(StringOrRegex))
 */
function setExpString(exp) {
    if (exp instanceof RegExp) {
        return exp;
    }
    // numbers are valid too
    return (typeof exp === 'number' ? String(exp) : exp).replace(/[$^.*+?()[\]{}|\\]/g, '\\$&');
}

// Anything in between two delimeters, line breaks of any kind included.
// The empty group keeps the number of groups of the former pattern '((.|\n)*?)'
const IN_BETWEEN = '([\\s\\S]*?)()';

/**
 * Regex builder to get a match in between two delimeters
 * Strings are used as they are, use setExpString to scape them first when they are not meant to be a pattern
 * @function setLookUpExp
 * @param {String|Regex} args - minimun two arguments as delimeters
 * @return {String} - Regex
 * @example setLookUpExp('h', 'd') // 'h([\s\S]*?)()d'
 * @example setLookUpExp('h', 'd', 'c') // 'h([\s\S]*?)()d([\s\S]*?)()c'
 * @example setLookUpExp(/a|b/, 'c') // '(?:a|b)([\s\S]*?)()c'
 * @usage:
 * const pattern = setLookUpExp("\\.", "!");
const regex = new RegExp(pattern, 'g');
const text = "Hello World. Sunshine is here! Have fun!";
const matches = text.match(regex);
console.log(matches);  // Output: [". Sunshine is here!"]
 */
function setLookUpExp(...args) {
    if (args.length < 2) {
        throw new Error('You need to pass at least two arguments');
    }
    // loop through args
    return args
        .map((arg) => {
            // if arg is a regex, use the source, grouped so that its alternatives (a|b) stay together
            return arg instanceof RegExp ? `(?:${arg.source})` : arg;
        })
        .join(IN_BETWEEN);
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
        // typeOf, not validType: validType runs JSON.stringify, which throws on React elements
        if (!typeOf(props, 'string|object')) {
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

export { Teleport, TeleportGlobal, Teleport as default, Teleport as teleport };
