# TypeCheck JS

## A simple type checker for JavaScript

TypeCheck JS is a JavaScript library designed for fast and efficient type checking. Inspired by [gkz/type-check](https://github.com/gkz/type-check), this library aims to overcome the limitations and complexities associated with TypeScript. It offers a lightweight, memory-efficient, and easy-to-use solution for both basic and complex type-checking requirements.  
[![release version](https://github.com/knighttower/typeCheckJs/actions/workflows/pre-release.yml/badge.svg)](https://github.com/knighttower/typeCheckJs/actions/workflows/pre-release.yml)
[![NPM published](https://github.com/knighttower/typeCheckJs/actions/workflows/to-npm.yml/badge.svg)](https://github.com/knighttower/typeCheckJs/actions/workflows/to-npm.yml)

#### Updates:
----- 2024 -----
- fixed _tc and _tcx to return the value of the function
- added _tc and _tcx to the documentation
- fixed isValidType to better validate and return bool
- added custom error message to options
- custom types

### Installation

#### Via npm

```javascript
npm i @knighttower/type-check-js
```

```javascript
yarn add @knighttower/type-check-js
```

#### In the Browser

Include the following script tag in your HTML:
Note: by default the library is ESM, but other builds are available in the dist folder (cjs, umd and iife)

```html
<script src="https://cdn.jsdelivr.net/npm/@knighttower/type-check-js@latest/dist/browser/TypeCheck.min.js"></script>
// or as ESM
<script type="module">
    import { typeCheck } from 'https://esm.run/@knighttower/type-check-js@latest/index.js';
</script>
```

<br/>

## Files

| File             | Size  |
| ---------------- | ----- |
| /TypeCheck.js    | 8 KiB |
| /TypeCheck.js.br | 3 KiB |
| /TypeCheck.js.gz | 3 KiB |

By default the "import" or "require", will load the indexes automatically. But, in case of wanting to use individual files or other specific formats, all Files are available in the dist folder as ESM, CJS, AMD, IIFE, Browser, UMD and System formats. For ESM + JS 'next', use the files in the src folder or import directly from the index.js (index.cjs.js for commonJS) file.

<br/>

## Why TypeCheck JS?

1. **Lightweight**: Adds minimal overhead to your project (only 6k GZip).
2. **Fast Performance**: Micro Optimized for quick type-checking operations.
3. **Ease of Use**: Simple API and intuitive pattern syntax.
4. **Quick implementation**: Can be implemented in any existing projects with minimal effort.
5. **No Compile Step**: Works directly in vanilla JavaScript projects without the need for a compilation step.
6. **Complementary**: Can be used alongside TypeScript to check front-end and back-end data types.
7. **Functionality**: Supports callbacks, log and fail functions.
8. **Flexibility**: Supports piped comparisons, optional arguments and keys.
9. **Extensibility**: Supports custom type definitions.
10. **Tested**: All code used has been fully tested with Vitest Unit tests
11. **Well Commented**: JSDocs comments for all methods and functions.

## What aims to solve?

TypeCheck JS aims to solve the following problems:

-   Drop-in solution for existing projects. Most projects are already in production and it is not always possible to add a build step to compile TypeScript.
-   Overkill. Typescript can be too much for just small projects or quick projects.
-   All TypeScript type definitions are lost at runtime. Once a library is in production, it is impossible to check the types of the data being passed around.
-   Does not require Build Step. Most TypeScript solution requires a build step to compile the code into JavaScript. This is not always possible in some projects or it adds complexity to the project.
-   Most library authors know what types should work with their code, but is hard to enforce once it goes to distribution. TypeCheck JS allows library authors to enforce the types when others use their libraries at runtime.
-   Be able to be used directly in browser or with Js that does not support TypeScript.
-   Complexity. TypeScript is a complex language and it is not always easy to understand the type definitions. TypeCheck JS aims to be simple and easy to understand.
-   Syntax. Projects are becaming too complex and heavily using 'defensive programming' to avoid errors. TypeCheck JS aims to be simple and easy to understand by all developers regardless of their experience while helping to focus on what really matters.

## What does no solve?

-   Bad programming.
-   Replacing TypeScript at build time.

<br/>

## 🚀 Usage

```javascript
// note: in some cases, you may need to use the full path to the file "/index" in order to import it
// All other modules can also be imported individually from the same path
import { typeCheck } from '@knighttower/type-check-js';
```

### 👉 IMPORTANT

the API for the direct typeCheck function has changed to favor familiarity with Typed Methods where "Value:Type" order is used. That means that the old "typeCheck(Type, Value)" is now deprecated and from now on will be "typeCheck(Value, Type)".

## Basic:

### typeCheck(valueToTest, testExpression);

-   Does not take any options
-   Strict validation, throws exception if the test fails;
-   Less options, but faster to implement. (for more options, use "\_typeCheck" instead. see \_typeCheck section)

```javascript
/**
 * @param {any} valueToTest
 * @param {string} testExpression (see below for patterns)
 * @see testUnit for more examples and test cases
 */
typeCheck(valueToTest, testExpression);
```

see possible patterns [here](#patterns)

<br/><br/>

# ⚡ Utility functions and advance usage:

Note: notice the "\_" (underscore). This gives you more control for different cases.

### \_typeCheck(valueToTest, testExpression, options);

```javascript
/**
 * @param {any} valueToTest
 * @param {string} testExpression (see below for patterns)
 * @param {function} callback optional
 * @return {object} TypeCheck Object with chainable methods
 * @see testUnit for more examples and test cases
 */
_typeCheck(valueToTest, testExpression, options);

// Methods:
_typeCheck(..).test(); // returns true or false, helpful for if statements or other logic
_typeCheck(..).bool; // same as 'test()', returns true or false, but more direct in the intent
_typeCheck(..).log(); // logs the results, helpful for debugging
_typeCheck(..).fail(); // throws exception if the test fails. Strict validation enforcement
_typeCheck(..).return(); // returns the valueToTest (non chainable with 'test' method)

//Chain methods
_typeCheck(..).log().test(); // logs the results and returns true or false
_typeCheck(..).fail().test(); // throws exception if the test fails and returns true or false
_typeCheck(..).log().fail().return(); // returns the valueToTest and logs the results and throws exception if the test fails


// Options
{
    log: true, // default false. Same as method log()
    fail: true, // default false. Same as method fail()
    callback: function, // default null. Only available in 'options'
    error: string, // custom error message
}
```

<br/><br/><br/>

### validType(valueToTest, testExpression, options);

Alias function for \_typeCheck(valueToTest, testExpression, options);

```javascript
function yourExistingFunction(valueToTest) {
    validType(valueToTest, 'string');
    // your code here
}
```

<br/>

### \_tc(testExpression, \_\_function, options);

-   Wrapper for "typeCheck" (\_tc) to implement functions with type checking.
-   Does not validate the "return value" of the function. (use "\_tcx" instead).
-   lightweight, fast and easy to implement.
-   Does take options.
-   Does return the 'return value' of the function for each instance.
-   Note: all test expressions are passed as 'array' like because args are 1 or more.

```javascript
const yourCoolFunction = _tc(['number', 'string'], function (myVar, theOtherVar) {
    // .. your code here
});

yourCoolFunction(44.5, 'hello'); // validates that both are numbers

// Options
{
    log: false, // default false. Same as method log()
    fail: false, // default true. Same as method fail()
    error: string, // custom error message
}
```

<br/>

### \_tcx(testExpression, \_\_function, options);

-   Wrapper for "typeCheck" with 'return X' (\_tcx) to implement functions with type checking
-   Validates the "return value" of the function.
-   Offers more options.
-   Has built in features for all its instances.
-   Does take options.
-   slighty slower than "\_tc", but more robust for full type checking.
-   Does not return the 'return value' as '\_tc', instead it has to be explicitly called with '.return()'.
-   Note: all test expressions are passed as 'array' like because args are 1 or more.

```javascript
const yourCoolFunction = _tcx(['number', 'string'], function (myVar, theOtherVar) {
    // .. your code here
    return 'hello';
}, {validOutput: 'string'});

yourCoolFunction(44.5, 'hello'); // validates that arg1 is 'number' and arg2 is 'string' and that the return value is a string

// Options
{
    validOutput: 'testExpression', // default null. Same as method log()
    log: false, // default false. Same as method log()
    fail: false, // default true. Same as method fail()
    error: string, // custom error message
}

// Built in features
yourCoolFunction(...).log(); // logs the results, helpful for debugging individual functions
yourCoolFunction(...).fail(); // throws exception if the test fails. Strict validation enforcement
yourCoolFunction(...).return(); // returns the 'return value' (non chainable with 'test' method)
yourCoolFunction(...).test(); // returns true or false, helpful for if statements or other logic
yourCoolFunction(...).fail().return(); // if the test fails, it will throw exception and if passes returns the 'return value'
```

<br />

### -- addTypeTest(name, testUnitFunction);

-   Add custom type test to the library.
-   Can be used with 'typeCheck' or '\_tc' and '\_tcx' functions.

```javascript
/**
 * Add a new type test
 * @param {string} name The name of the test to add
 * @param {function} testUnit The test function
 * @return {boolean} true if the test was added
 * @throws {Error} if the test already exists
 */
addTypeTest('customTypeTest', function (x) {
    return typeof x === 'number';
});
if (typeCheck([1], '[customTypeTest]').test()) {
    console.log(999); // logs 999 when validates to true
}
```

<br /><br />

## Examples

You can perform type checks like this:

```javascript
// Basic
_typeCheck(1, 'number').test(); // true and returns a boolean
_typeCheck('1', 'number').fail().test(); // false and throw exception
_typeCheck('str', 'string').log().test(); // true and logs the test results
// With optional arguments
typeCheck(null, 'string?'); // true
typeCheck(undefined, 'string?'); // true
typeCheck('str', 'string?'); // true

// Piped
typeCheck(1, 'string | number'); // true
typeCheck('str', 'string | int'); // true

// Array
typeCheck([1], '[number]'); // true
typeCheck([1, 2, 3], '[number]'); // true
typeCheck([1, 3, null], '[number, number, string]'); // Matches the index of the array

// Object
typeCheck({ x: 'string', y: 10 }, '{x: string, y: number}'); // true
typeCheck({ x: 'string', y: 'str' }, '{x: string, y: number}'); // false
typeCheck({ x: 'string', y: 10, z: 10 }, '{x: string, y: number}'); // false
typeCheck({ x: 2, y: 10 }, '{x: string|number, y: number}'); // true

// Object with optional keys
typeCheck({ x: 'string', y: 10 }, '{x: string, y: number, z?: number}'); // true

// Object with specific keys to test all other ignore
typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, ...}'); // true

// Object with specific keys to test all test a common test method
typeCheck({ x: 'string', y: 10, z: 20 }, '{x: string, y: number, any: number}'); // true

// Nested arrays or objects
typeCheck([1, { x: 'string', y: 10, z: 20 }, 3], '[number, {any: number, x: string}, number]'); // true

// With callback functions
_typeCheck({ x: 'string', y: 10 }, '{y: number, x: string}', ($this) => {
    console.log('__testLogHere__', $this);
}).log();

//with log function to see the results in the console
_typeCheck({ x: 'string', y: 10 }, '{y: number, x: string}').log();

//with fail function to stop execution if the type is not correct
_typeCheck({ x: 'string', y: 10 }, '{y: number, x: string}').fail();
```

<br/>
<a name="patterns"></a>

## Possible patterns

```
Possible type patterns:

// basic string
'type' // only one test
'type | type' // returns to test one or more types
'type?' // is type or null/undefined
'type | type?' // the second type would be type or null/undefined


// basic array
'[type]' // returns test to test all the keys
'[type | type]' // returns test to test all key with one or more
'[[type],[type]]'

// basic object
'{key1: type}'
'{key1: type | type}'
'{key1: type, key2: type}'
'{key1: type, key2?: type}' // if key2 is not present or null/undefined, it will not be tested
'{key1: type, key2: type?}' // if key2 is not set or null/undefined, it will not be tested
'{key1: type | type, key2: type | type}'
'{any: type}' // any key
'{any: type | type}' // any key
'{key1: type, any: type}' // specific key, and all other "any"
'{key1: type | type, ...}' // specific key, and all other no test


// ADVANCE
// array of objects
'[{key1: type}]' // returns test to test all the keys
'[{key1: type | type}]' // returns test to test all key with one or more
'[{key1: type, key2: type}]' // returns
'[{key1: type, key2: type}, {key1: type, key2: type}]'
'[{key1: type | type, key2: type | type}, {key1: type | type, key2: type | type}]'
'[{key1: type, any: type}]'

```

<br />

### ---> For more examples and usage patterns, further information and advanced use-cases, please refer to the `patterns` [here](/type-patterns.txt/) and `test` [here](/test/TypeCheck.test.js) files.

---

<br /><br />

Check out other cool stuff at https://knighttower.io and help support open source projects.

<br />

---

Sponsored By:

[![image](https://github.com/knighttower/typeCheckJs/assets/649334/024f2e7d-d3d0-4558-8893-2e6bbea29a6f)](https://squarefox.us/)
