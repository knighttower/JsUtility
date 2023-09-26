// Author Knighttower
// MIT License
// Copyright (c) [2022] [Knighttower] https://github.com/knighttower

import { emptyOrValue, convertToBool, getRandomId } from './Utility';
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
export const getDirectivesFromString = function (stringDirective) {
    const str = stringDirective;
    if (!emptyOrValue(str)) return null;

    const results = (type = null, value = null) => {
        return {
            type: type,
            value: value,
        };
    };
    let directive;
    const type = typeof str;

    if (type === 'object' || type === 'array') {
        return results(type, str);
    }
    // Matches string ID or class: literals #... or ....
    // regex IdOrClass
    if (str.match(/^(\.|\#)([a-zA-Z]+)/g)) {
        return results('idOrClass', str);
    }

    // Mathes simple directive function style: directive(#idOr.Class)
    // regexFunctionString
    if (str.match(/^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g)) {
        const directive = str.split('(')[0].trim();
        return results('idOrClassWithDirective', { [directive]: getMatchInBetween(str, '(', ')') });
    }

    // Matches the Array as string: [value, value] OR ['value','value']
    // regexArrayLike = /^\[((.|\n)*?)\]$/gm;
    // Matches a multi-array string like [[value,value]],value]
    // regexMultiArrayString = /\[(\n|)(((.|\[)*)?)\](\,\n|)(((.|\])*)?)(\n|)\]/gm;
    if (str.match(/^\[((.|\n)*?)\]$/gm)) {
        return results('array', getArrObjFromString(str));
    }

    // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
    // regexObjectLike = /^\{((.|\n)*?)\:((.|\n)*?)\}/gm;
    if (str.match(/^\{((.|\n)*?)\:((.|\n)*?)\}/gm)) {
        return results('object', getArrObjFromString(str));
    }

    // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
    // OR directive.breakdown|breakdown2(...values) OR directive.tablet(...values)&&directive.mobile(...values)
    const regexDotObjectString = /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm;
    const regexExObjectString = /([a-zA-Z]+)\[((.|\n)*?)\]\(((.|\n)*?)\)/gm;
    if (str.match(regexDotObjectString) || str.match(regexExObjectString)) {
        let values, breakDownId, directive;
        const setObject = {};

        getChunks(str, '&&').forEach((command) => {
            if (command.match(regexExObjectString)) {
                values = getMatchInBetween(command, '](', ')');
                breakDownId = getMatchInBetween(command, '[', ']');
                directive = command.split('[')[0].trim();
            } else {
                values = getMatchInBetween(command, '(', ')');
                command = command.replace(getMatchBlock(command, '(', ')'), '');
                [directive, breakDownId] = getChunks(command, '.');
            }

            values = getChunks(values, ',').join(' ');

            if (!setObject[directive]) setObject[directive] = {};

            getChunks(breakDownId, '|').forEach((id) => {
                setObject[directive][id] = values;
            });
        });

        return results('dotObject', getArrObjFromString(setObject));
    }
};

/**
 * Removes brackets from a string
 * @private
 * @param {string} strExp
 * @return {string}
 */
export function removeBrackets(strExp) {
    const regex = /^(\[|\{)(.*?)(\]|\})$/; // Match brackets at start and end
    const match = strExp.match(regex);

    if (match) {
        return match[2].trim(); // Extract and trim the content between brackets
    }

    return strExp; // Return the original string if no brackets found at start and end
}

/**
 * Converts strings formats into objects or arrays
 * @param {string} strExp
 * @return {object|array|string}
 * @example getArrObjFromString('[[value,value],value]') // [['value', 'value'], 'value']
 * @example getArrObjFromString('[[value,value],value, { y: hello }, hello]') // [['value', 'value'], 'value', { y: 'hello' }, 'hello']
 * @example getArrObjFromString('{ y: hello, x: world, z: [value,value]}') // { y: 'hello', x: 'world', z: ['value', 'value'] }
 */
export function getArrObjFromString(strExp) {
    const type = typeof strExp;
    // alredy typeof object or array just return it
    if (type === 'object' || type === 'array') return strExp;
    const isObject = startAndEndWith(strExp, '{', '}');
    const isArray = startAndEndWith(strExp, '[', ']');
    // If it is other type of string, return it
    if (!isObject && !isArray) return strExp;

    const newCollection = isObject ? {} : [];
    const nestedElements = {};

    //remove the brackets
    let newStrExp = removeBrackets(strExp);

    const loopNested = (objects = false) => {
        while (true) {
            //find any nested arrays or objects
            let matched = objects ? findNested(newStrExp, '{', '}') : findNested(newStrExp);

            if (!matched) break;

            //replace the nested array or object with a marker so that we can safely split the string
            let marker = `__${getRandomId()}__`;
            nestedElements[marker] = matched;
            newStrExp = newStrExp.replace(matched, marker);
        }
    };

    loopNested();
    loopNested(true);

    getChunks(newStrExp).forEach((chunk, index) => {
        const chunkParts = isObject ? getChunks(chunk, ':') : chunk;
        const chunkKey = isObject ? chunkParts[0] : index;
        // double check the chunk as it can be an object prop value that got split
        chunk = isObject ? emptyOrValue(chunkParts[1], chunk) : chunk;

        for (const markerKey in nestedElements) {
            if (chunk.includes(markerKey)) {
                chunk = getArrObjFromString(nestedElements[markerKey]);
                break;
            }
        }

        // set back in the collection either as an object or array
        isObject ? (newCollection[chunkKey] = chunk) : newCollection.push(chunk);
    });

    return newCollection;
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
export function findAndReplaceInArray(arr, find, value) {
    let replaced = false;

    const result = arr.map((prop) => {
        if (Array.isArray(prop)) {
            const replacedArray = findAndReplaceInArray(prop, find, value);
            if (replacedArray) {
                replaced = true;
                return replacedArray;
            }
            return prop;
        }
        if (prop === find) {
            replaced = true;
            if (Array.isArray(value)) {
                return value.map((p) => (Array.isArray(p) ? p : p.trim()));
            }
            return value;
        }
        return prop;
    });

    return replaced ? result : null;
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
export function startAndEndWith(strExp, start = null, end = null) {
    return (!start || strExp.startsWith(start)) && (!end || strExp.endsWith(end));
}

/**
 * Splits a string into chunks by a given splitter and cleans the chunks
 * @param {string} str
 * @param {string} splitter - The string/character to split the string by. Defaults to ','
 * @return {string|array}
 */
export function getChunks(str, splitter = ',') {
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
export function getMatchInBetween(str, p1, p2, all = false) {
    const matchBlock = getMatchBlock(str, p1, p2, all) ?? (all ? [] : str);
    return all ? matchBlock.map((match) => cleanStr(match, p1, p2)) : cleanStr(matchBlock, p1, p2);
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
export function getMatchBlock(str, p1, p2, all = false) {
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
export function cleanStr(str, p1 = null, p2 = null) {
    return str
        .replace(p1 ? new RegExp(setExpString(p1)) : '', '')
        .replace(p2 ? new RegExp(setExpString(p2)) : '', '')
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
export function setExpString(exp) {
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
export function setLookUpExp(...args) {
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
export function removeQuotes(str) {
    return str.replace(/\`|'|"/g, '');
}

/**
 * Fix quotes from a string
 * @function fixQuotes
 * @param {String} str
 * @return {String}
 * @example fixQuotes("'hello'") // "hello"
 * @example fixQuotes('"hello"') // "hello"
 */
export function fixQuotes(str) {
    return str.replace(/\`|'/g, '"');
}

/**
 * Add quotes to a string
 * @function addQuotes
 * @param {String} str
 * @return {String}
 * @example addQuotes('hello') // "hello"
 */
export function addQuotes(str) {
    return `"${str}"`;
}

/**
 * Search for a wildcard pattern in a list of strings or viceversa
 * @method wildCardStringSearch
 * @param {string} pattern - The pattern to search for
 * @param {array|string} list - The list of strings to search in
 * @param {boolean} matchStart - If the pattern should match the start of the string (optional)
 * @param {boolean} matchEnd - If the pattern should match the end of the string optional)
 * @return {string[]|null} - Returns a list of strings that match the pattern, or null if no match is found
 * @example wildCardStringSearch('name.*', ['name.a', 'name.b', 'name.c']) // returns ['name.a', 'name.b', 'name.c']
 */
export function wildCardStringSearch(pattern, listOrString, matchStart = false, matchEnd = false) {
    if (!pattern || !listOrString) {
        return null;
    }

    const regex = new RegExp(setWildCardString(pattern, matchStart, matchEnd));

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
export function setWildCardString(string, matchStart = false, matchEnd = false) {
    if (!string) {
        return null;
    }
    matchStart = convertToBool(matchStart);
    matchEnd = convertToBool(matchEnd);
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
 * @example convertKeysToSymbols({a: 1, b: 2}) // returns {Symbol(a): 1, Symbol(b): 2, keyToSymbolMap: {a: Symbol(a), b: Symbol(b)}
 */
export function convertKeysToSymbols(obj) {
    if (emptyOrValue(obj, null) === null) {
        return {};
    }
    const newObj = {};
    const keyToSymbolMap = {};
    for (const key in obj) {
        const symbolKey = Symbol(key);
        newObj[symbolKey] = obj[key];
        keyToSymbolMap[key] = symbolKey;
    }
    newObj.keyToSymbolMap = keyToSymbolMap;
    return newObj;
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
export function findNested(str, start = '[', end = ']') {
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

export const powerHelper = {
    getDirectivesFromString,
    findAndReplaceInArray,
    getArrObjFromString,
    getMatchInBetween,
    getMatchBlock,
    cleanStr,
    setExpString,
    setLookUpExp,
    removeQuotes,
    fixQuotes,
    addQuotes,
    findNested,
    convertKeysToSymbols,
    wildCardStringSearch,
    setWildCardString,
};

// Export ES6 modules
export { powerHelper as default, powerHelper as PowerHelper };