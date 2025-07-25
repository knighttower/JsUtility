````markdown
# typeCheck JS

## A simple type checker for JavaScript

typeCheck JS is a JavaScript library designed for fast and efficient type checking. Inspired by [gkz/type-check](https://github.com/gkz/type-check), this library aims to overcome the limitations and complexities associated with TypeScript. It offers a lightweight, memory-efficient, and easy-to-use solution for both basic and complex type-checking requirements.

[![release version](https://github.com/knighttower/typeCheckJs/actions/workflows/pre-release.yml/badge.svg)](https://github.com/knighttower/typeCheckJs/actions/workflows/pre-release.yml)
[![NPM published](https://github.com/knighttower/typeCheckJs/actions/workflows/to-npm.yml/badge.svg)](https://github.com/knighttower/typeCheckJs/actions/workflows/to-npm.yml)

---

### 🔧 Installation

#### Via npm

```bash
npm i @knighttower/type-check
# or
yarn add @knighttower/type-check
````

#### In the Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@knighttower/type-check@latest/dist/browser/typeCheck.min.js"></script>

<!-- OR as ESM -->
<script type="module">
  import { typeCheck } from 'https://esm.run/@knighttower/type-check@latest/index.js';
</script>
```

> Note: by default the library is ESM, but other builds are available in the dist folder (CJS, UMD, IIFE, etc.)

---

### 📦 Files

| File             | Size  |
| ---------------- | ----- |
| /typeCheck.js    | 8 KiB |
| /typeCheck.js.br | 3 KiB |
| /typeCheck.js.gz | 3 KiB |

You can also import from the `/src` folder for ESM + JS `next`, or from `/index.js` and `/index.cjs.js` as needed.

---

## 💡 Why typeCheck JS?

1. **Lightweight**: Adds minimal overhead to your project (\~6k GZip).
2. **Fast Performance**: Micro Optimized for runtime operations.
3. **Ease of Use**: Simple API and pattern syntax.
4. **No Compile Step**: Works directly in vanilla JS.
5. **Complementary**: Works alongside TypeScript for runtime enforcement.
6. **Supports**: callbacks, custom messages, logs, and error throwing.
7. **Flexible**: Supports piped types, optional keys, wildcard matching.
8. **Extensible**: You can register custom test types.
9. **Fully Tested**: Using Vitest for all cases.
10. **Documented**: Full JSDoc for all major methods and patterns.

---

## ❓ What does it solve?

* Enforces runtime type checking in production builds.
* Helps validate user inputs, API data, and 3rd-party sources.
* Avoids unnecessary adoption of TypeScript for small apps.
* Solves the issue of type loss in runtime JS after TS transpilation.
* Works directly in browsers or legacy JS environments.
* Helps library authors enforce expected types at runtime.

---

## 🚫 What it doesn’t solve

* It doesn’t stop bad programming decisions.
* It doesn’t replace TypeScript’s static typing in dev environments.

---

## 🚀 Usage

```javascript
import { typeCheck } from '@knighttower/type-check';

typeCheck(123, 'number'); // ✅
typeCheck('hello', 'number'); // ❌ throws
```

---

### 👉 IMPORTANT

The API for the direct `typeCheck()` function uses the familiar `value, type` order:

```js
typeCheck(valueToTest, typeExpression);
```

---

## ⚡ Quick Start

```javascript
typeCheck('hello', 'string'); // ✅
typeCheck([1, 2], '[number]'); // ✅
typeCheck({ x: 1 }, '{x: number}'); // ✅
```

---

## 🧪 Examples

```javascript
// With optional arguments
typeCheck(null, 'string?'); // true
typeCheck(undefined, 'string?'); // true
typeCheck('str', 'string?'); // true
typeCheck(null, 'string?', options); 
typeCheck(null, 'string?', 'error message'); // throws error with custom message

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
// Basic
_typeCheck(1, 'number').test(); // true and returns a boolean
_typeCheck('1', 'number').fail().test(); // false and throw exception
_typeCheck('str', 'string').log().test(); // true and logs the test results
```

---

## 🧰 Advanced API

### `_typeCheck(valueToTest, testExpression, options?)`

```javascript
/**
 * @param {any} valueToTest
 * @param {string} testExpression (see below for patterns)
 * @param {function} callback optional
 * @return {object} typeCheck Object with chainable methods
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
_typeCheck(..).log().test();
_typeCheck(..).fail().test();
_typeCheck(..).log().fail().return();

// Options
{
    log: true,
    fail: true,
    callback: function,
    error: string
}
```

<br/>

### validType(valueToTest, testExpression, options);

Alias function for \_typeCheck(valueToTest, testExpression, options);
It does not do strict validation, but returns a boolean instead of throwing an exception.

```javascript
function yourExistingFunction(valueToTest) {
    validType(valueToTest, 'string');
    // your code here
}
```

<br/>

---

<br/>

### \_tc(testExpression, \_\_function, options);

-   Wrapper for "typeCheck" (\_tc) to implement functions with type checking.
-   Does not validate the "return value" of the function. (use "\_tcx" instead).
-   lightweight, fast and easy to implement.
-   Does take options.
-   Does return the 'return value' of the function for each instance.
-   Note: all test expressions are passed as 'array' like because args are 1 or more.


```js
const greet = _tc(['string'], function (name) {
  return `Hello, ${name}`;
});

greet('Alice'); // ✅
greet(123);     // ❌ throws
```

```js
const logData = _tc(['number', 'boolean'], (id, active) => {
  return `${id}:${active}`;
});

logData(5, true); // ✅
logData('5', true); // ❌ throws
```
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

---

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

```js
const getLength = _tcx(['string'], (str) => str.length, {
  validOutput: 'number',
});

getLength('hello').log().return(); // ✅ 5
```

```js
const sum = _tcx(['number', 'number'], (a, b) => a + b, {
  validOutput: 'number',
});

sum(10, 5).log().fail().return(); // ✅ 15
```

<br />

---

### `addTypeTest(name, fn)`

Registers a custom type function globally.

```js
addTypeTest('even', (x) => typeof x === 'number' && x % 2 === 0);

typeCheck(2, 'even'); // ✅
typeCheck(3, 'even'); // ❌ throws

typeCheck([2, 4, 6], '[even]'); // ✅
typeCheck({ count: 8 }, '{count: even}'); // ✅
```

```js
addTypeTest('nonEmptyString', (val) =>
  typeof val === 'string' && val.trim().length > 0
);

typeCheck('hello', 'nonEmptyString'); // ✅
typeCheck('', 'nonEmptyString');      // ❌
```

---

## 🔤 Possible Patterns

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

---

## 🧪 Tests

See `test/typeCheck.test.js` for full coverage and usage examples.
More examples are available in `type-patterns.txt`.

---
<br /><br />

Check out other cool stuff at https://knighttower.io and help support open source projects.

<br />

## 🙌 Sponsored By

[![Squarefox](https://github.com/knighttower/typeCheckJs/assets/649334/024f2e7d-d3d0-4558-8893-2e6bbea29a6f)](https://squarefox.us/)


