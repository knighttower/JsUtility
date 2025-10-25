# PowerHelper

A comprehensive utility module providing advanced string manipulation, object conversion, pattern matching, and data transformation functions.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [String Utilities](#string-utilities)
- [Object and Array Utilities](#object-and-array-utilities)
- [Pattern Matching](#pattern-matching)
- [Wildcard Search](#wildcard-search)
- [Directive Parsing](#directive-parsing)
- [API Reference](#api-reference)

## Installation

```javascript
import {
    addQuotes,
    cleanStr,
    convertKeysToSymbols,
    findAndReplaceInArray,
    findNested,
    fixQuotes,
    getArrObjFromString,
    getChunks,
    getDirectivesFromString,
    getMatchBlock,
    getMatchInBetween,
    getObjectFromPath,
    removeQuotes,
    startAndEndWith,
    setExpString,
    setLookUpExp,
    setWildCardString,
    wildCardStringSearch
} from './powerHelper.js';
```

## Basic Usage

```javascript
// String manipulation
const quoted = addQuotes('hello'); // "hello"
const cleaned = cleanStr('  hello world  '); // 'hello world'

// Object conversion
const obj = getArrObjFromString('{ y: hello, x: world }'); // { y: 'hello', x: 'world' }

// Pattern matching
const match = getMatchInBetween('hello <world/>', '<', '/>'); // 'world'
```

## String Utilities

### addQuotes(str, q = '"')

Adds quotes to a string.

```javascript
addQuotes('hello'); // "hello"
addQuotes('world', "'"); // 'world'
```

**Parameters:**
- `str` (String): The string to quote
- `q` (String): Quote character (default: `"`)

**Returns:** String - The quoted string

### cleanStr(str, ...args)

Cleans a string from delimiters or just trims if no delimiters given.

```javascript
cleanStr('hello world', 'h', 'd'); // 'ello worl'
cleanStr('  hello world  '); // 'hello world'
cleanStr('hello world', 'hello'); // ' world'
cleanStr('Hello World. Sunshine is here!', '\\..*!'); // 'Hello World'
cleanStr('Hello World. Sunshine is here!', /Hello/g); // ' World. Sunshine is here!'
```

**Parameters:**
- `str` (String): String to clean
- `...args` (String|RegExp): Delimiters to remove

**Returns:** String - The cleaned string

### fixQuotes(str, q = '"')

Normalizes all quote types in a string to a specific quote character.

```javascript
fixQuotes("'hello'"); // "hello"
fixQuotes('"hello"'); // "hello"
fixQuotes('`hello`', "'"); // 'hello'
```

**Parameters:**
- `str` (String): The string to fix
- `q` (String): Target quote character (default: `"`)

**Returns:** String - String with normalized quotes

### removeQuotes(str)

Removes all quotes from a string.

```javascript
removeQuotes('"hello"'); // hello
removeQuotes("'hello'"); // hello
removeQuotes('`hello`'); // hello
```

**Parameters:**
- `str` (String): The string to process

**Returns:** String - String without quotes

## Object and Array Utilities

### convertKeysToSymbols(obj)

Converts all keys from an object to symbols.

```javascript
const result = convertKeysToSymbols({a: 1, b: 2});
// Returns: {Symbol(a): 1, Symbol(b): 2, keyToSymbolMap: {a: Symbol(a), b: Symbol(b)}}
```

**Parameters:**
- `obj` (Object): The object to convert

**Returns:** Object - Object with symbol keys and a keyToSymbolMap

### findAndReplaceInArray(arr, find, value)

Recursively loops through an array to find and replace the desired target.

```javascript
findAndReplaceInArray([1,2,3,4,5], 3, 'three'); // [1,2,'three',4,5]
findAndReplaceInArray([[1,2], [3,4]], 3, 'three'); // [[1,2], ['three',4]]
```

**Parameters:**
- `arr` (Array): The array to search
- `find` (Any): The target value to find
- `value` (Any): The replacement value

**Returns:** Array|null - Modified array or null if no replacement made

### getArrObjFromString(strExp)

Converts string formats into objects or arrays. Does not support quoted strings.

```javascript
getArrObjFromString('[[value,value],value]'); // [['value', 'value'], 'value']
getArrObjFromString('{ y: hello, x: world, z: [value,value]}'); 
// { y: 'hello', x: 'world', z: ['value', 'value'] }
```

**Parameters:**
- `strExp` (String): String expression to convert

**Returns:** Object|Array|String - Parsed result

### getObjectFromPath(path, source = window)

Gets an object from a path using dot notation.

```javascript
getObjectFromPath('a.b.c', {a: {b: {c: 'value'}}}); // 'value'
getObjectFromPath('console.log'); // [native function]
```

**Parameters:**
- `path` (String): Dot-separated path
- `source` (Object): Source object to search (default: window)

**Returns:** Any - The value at the path

## Pattern Matching

### findNested(str, start = '[', end = ']')

Finds the last instance of nested pattern with delimiters.

```javascript
findNested('[[]hello [world]]', '[', ']'); // '[world]'
findNested('text {nested {inner}} text', '{', '}'); // '{inner}'
```

**Parameters:**
- `str` (String): String to search
- `start` (String): Opening delimiter (default: '[')
- `end` (String): Closing delimiter (default: ']')

**Returns:** String|null - The nested pattern or null

### getMatchBlock(str, p1, p2, all = false)

Finds matches by delimiters, returns raw matches including delimiters.

```javascript
getMatchBlock('is a hello world today', 'h', 'd'); // 'hello world'
getMatchBlock('is a <hello world/> today', '<', '/>'); // '<hello world/>'
getMatchBlock('text <a/> and <b/>', '<', '/>', true); // ['<a/>', '<b/>']
```

**Parameters:**
- `str` (String): String to search
- `p1` (String|RegExp): First delimiter
- `p2` (String|RegExp): Second delimiter
- `all` (Boolean): Return all matches (default: false)

**Returns:** String|Array|null - Match(es) or null

### getMatchInBetween(str, p1, p2, all = false)

Finds matches between delimiters, returns clean content without delimiters.

```javascript
getMatchInBetween('hello world', 'h', 'd'); // 'ello worl'
getMatchInBetween('hello <world/>', '<', '/>'); // 'world'
getMatchInBetween('text <a/> and <b/>', '<', '/>', true); // ['a', 'b']
```

**Parameters:**
- `str` (String): String to search
- `p1` (String|RegExp): First delimiter
- `p2` (String|RegExp): Second delimiter
- `all` (Boolean): Return all matches (default: false)

**Returns:** String|Array|null - Clean content between delimiters

### getChunks(str, splitter = ',')

Splits a string into chunks by a given splitter and cleans the chunks.

```javascript
getChunks('a, b, c'); // ['a', 'b', 'c']
getChunks('name.value.type', '.'); // ['name', 'value', 'type']
getChunks('  a , b , c  '); // ['a', 'b', 'c']
```

**Parameters:**
- `str` (String): String to split
- `splitter` (String): Character to split by (default: ',')

**Returns:** Array - Array of cleaned chunks

### startAndEndWith(strExp, start = null, end = null)

Checks if a string starts and ends with given strings.

```javascript
startAndEndWith('hello world', 'h', 'd'); // true
startAndEndWith('hello world', 'x', 'd'); // false
startAndEndWith('[array]', '[', ']'); // true
```

**Parameters:**
- `strExp` (String): String to check
- `start` (String): Start pattern (default: null)
- `end` (String): End pattern (default: null)

**Returns:** Boolean - True if matches pattern

## Wildcard Search

### setWildCardString(str, matchStart = false, matchEnd = false)

Sets a string to be used as a wildcard pattern.

```javascript
setWildCardString('name.*', true); // '^name\\.(.*?)'
setWildCardString('name.*', false, true); // 'name\\.(.*?)$'
setWildCardString('name.**'); // 'name\\..*' (greedy)
```

**Parameters:**
- `str` (String): Pattern string with wildcards
- `matchStart` (Boolean): Match start of string (default: false)
- `matchEnd` (Boolean): Match end of string (default: false)

**Returns:** String - Regex pattern string

### wildCardStringSearch(pattern, listOrString, matchStart = false, matchEnd = false)

Searches for a wildcard pattern in a list of strings or vice versa.

```javascript
wildCardStringSearch('name.*', ['name.a', 'name.b', 'other.c']); 
// ['name.a', 'name.b']

wildCardStringSearch('test.*', 'test.value.here'); 
// ['test.value.here']
```

**Parameters:**
- `pattern` (String): Wildcard pattern
- `listOrString` (Array|String): List to search or string to match
- `matchStart` (Boolean): Match start (default: false)
- `matchEnd` (Boolean): Match end (default: false)

**Returns:** Array|null - Matching results or null

## Directive Parsing

### getDirectivesFromString(stringDirective)

Converts string formats into objects, handling various directive patterns.

```javascript
// Object-style
getDirectivesFromString('directive.tablet(...values)'); 
// {type: 'dotObject', directive: {directive: {tablet: 'values'}}}

// Multiple breakdowns
getDirectivesFromString('directive.tablet|mobile(...values)'); 
// {directive: {tablet: 'values', mobile: 'values'}}

// Function style
getDirectivesFromString('show(#myId)'); 
// {type: 'idOrClassWithDirective', directive: {show: '#myId'}}

// Array format
getDirectivesFromString('[value1, value2]'); 
// {type: 'array', directive: ['value1', 'value2']}

// Object format
getDirectivesFromString('{key: value}'); 
// {type: 'object', directive: {key: 'value'}}
```

**Supported Patterns:**
- **Array strings**: `[value, value]` or `['value','value']`
- **Object strings**: `{key:value}` or `{'key':'value'}`
- **Multi-array**: `[[value,value],value]`
- **Dot notation**: `directive.tablet(...values)`
- **Bracket notation**: `directive[expression](...values)`
- **Multiple targets**: `directive.tablet|mobile(...values)`
- **Chained commands**: `directive.tablet(...values)&&directive.mobile(...values)`
- **ID/Class functions**: `directive(#idOr.Class)`

**Parameters:**
- `stringDirective` (String|Array|Object): The directive string to parse

**Returns:** Object|null - Parsed directive with type and directive properties

## Advanced Utilities

### setExpString(exp)

Escapes a string to create a regex or returns the regex if it already is an expression.

```javascript
setExpString('hello'); // '\\h\\e\\l\\l\\o'
setExpString(/hello/); // /hello/
setExpString('[test]'); // '\\[test\\]'
```

**Parameters:**
- `exp` (String|RegExp): Expression to escape

**Returns:** String|RegExp - Escaped string or original regex

### setLookUpExp(...args)

Regex builder to get matches between multiple delimiters.

```javascript
setLookUpExp('h', 'd'); // 'h((.|\n)*?)d'
setLookUpExp('h', 'd', 'c'); // 'h((.|\n)*?)d((.|\n)*?)c'

// Usage example:
const pattern = setLookUpExp(".", "!");
const regex = new RegExp(pattern, 'g');
const text = "Hello World. Sunshine is here! Have fun!";
const matches = text.match(regex); // [". Sunshine is here!"]
```

**Parameters:**
- `...args` (String|RegExp): Minimum two delimiters

**Returns:** String - Regex pattern

## Error Handling

Most functions in powerHelper are designed to handle edge cases gracefully:

- **Type checking**: Functions check input types and return appropriate defaults
- **Empty values**: Handle null, undefined, and empty strings safely  
- **Invalid patterns**: Return null or original input when parsing fails
- **Malformed strings**: Attempt parsing with fallbacks

## Performance Considerations

- **String operations**: Most functions use efficient string methods and regex
- **Object conversion**: Complex parsing may be slower for very large strings
- **Wildcard search**: Performance scales with list size and pattern complexity
- **Nested operations**: Recursive functions may impact performance on deeply nested data

## Common Use Cases

### Configuration Parsing
```javascript
// Parse configuration strings
const config = getDirectivesFromString('responsive.tablet|mobile({width: 768, height: 1024})');
```

### Template Processing
```javascript
// Extract template variables
const vars = getMatchInBetween('Hello {{name}}, welcome to {{site}}!', '{{', '}}', true);
// ['name', 'site']
```

### Data Transformation
```javascript
// Convert string arrays to actual arrays
const data = getArrObjFromString('[user1, user2, {admin: true}]');
// ['user1', 'user2', {admin: true}]
```

### Dynamic Object Access
```javascript
// Safe property access
const value = getObjectFromPath('user.profile.settings.theme', userData);
```
