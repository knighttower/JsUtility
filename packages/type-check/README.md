# typeCheck JS

## A simple type checker for JavaScript

typeCheck JS is a JavaScript library designed for fast and efficient type checking. Inspired by [gkz/type-check](https://github.com/gkz/type-check), this library aims to overcome the limitations and complexities associated with TypeScript. It offers a lightweight, memory-efficient, and easy-to-use solution for both basic and complex type-checking requirements.

[![release version](https://github.com/knighttower/typeCheckJs/actions/workflows/pre-release.yml/badge.svg)](https://github.com/knighttower/typeCheckJs/actions/workflows/pre-release.yml)
[![NPM published](https://github.com/knighttower/typeCheckJs/actions/workflows/to-npm.yml/badge.svg)](https://github.com/knighttower/typeCheckJs/actions/workflows/to-npm.yml)

---

## 📚 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Why typeCheck JS?](#-why-typecheck-js)
- [What does it solve?](#-what-does-it-solve)
- [API Reference](#-api-reference)
  - [typeCheck()](#typecheck)
  - [_typeCheck()](#_typecheck)
  - [validType()](#validtype)
  - [_tc()](#_tc)
  - [_tcx()](#_tcx)
  - [addTypeTest()](#addtypetest)
- [Type Patterns](#-type-patterns)
- [Examples](#-examples)
- [Performance](#-performance)
- [Tests](#-tests)

---

### 🔧 Installation

#### Via npm

```bash
npm i @knighttower/type-check
# or
yarn add @knighttower/type-check
# or
# as part of a monorepo
npm i knighttower 
# then import {typeCheck} from 'knighttower/type-check';
```

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

---

## 🚫 What it doesn't solve

* It doesn't stop bad programming decisions.

---

## 📋 API Reference

### `typeCheck()`

**Basic type validation with strict error throwing**

```javascript
typeCheck(valueToTest, typeExpression, options?)
```

**Parameters:**
- `valueToTest` (any) - The value to validate
- `typeExpression` (string) - The type pattern to match against
- `options` (object|string, optional) - Configuration options

**Returns:** `true` on success, throws error on failure

**Examples:**

```javascript
import { typeCheck } from '@knighttower/type-check';

// Basic types
typeCheck(123, 'number');        // ✅ passes
typeCheck('hello', 'string');    // ✅ passes
typeCheck(true, 'boolean');      // ✅ passes

// Will throw errors
typeCheck('hello', 'number');    // ❌ throws TypeError
typeCheck(123, 'string');       // ❌ throws TypeError

// Optional types
typeCheck(null, 'string?');      // ✅ passes (null/undefined allowed)
typeCheck(undefined, 'number?'); // ✅ passes
typeCheck('hello', 'string?');   // ✅ passes

// Union types
typeCheck(123, 'string|number'); // ✅ passes (either type allowed)
typeCheck('hi', 'string|number'); // ✅ passes

// Arrays
typeCheck([1, 2, 3], '[number]');           // ✅ all elements are numbers
typeCheck([1, 'hi', 3], '[number, string, number]'); // ✅ exact positions match

// Objects
typeCheck({ name: 'John', age: 30 }, '{name: string, age: number}'); // ✅
typeCheck({ x: 1, y: 2 }, '{any: number}');  // ✅ all values are numbers

// Custom error message
typeCheck(123, 'string', { error: 'Value must be a string!' });

// With callback for additional validation
typeCheck({ id: 1 }, '{id: number}', (result) => {
    console.log('Validation result:', result);
});
```

---

### `_typeCheck()`

**Advanced type validation with chainable methods**

```javascript
_typeCheck(valueToTest, typeExpression, options?)
```

**Parameters:**
- Same as `typeCheck()` but returns a chainable object instead of throwing immediately

**Chainable Methods:**
- `.test()` - Returns boolean result
- `.bool` - Direct boolean property access
- `.log()` - Logs validation details to console
- `.fail()` - Throws error if validation fails
- `.return()` - Returns the original value

**Examples:**

```javascript
import { _typeCheck } from '@knighttower/type-check';

// Get boolean result without throwing
const isValid = _typeCheck(123, 'number').test(); // true

// Chain methods for debugging
_typeCheck({ name: 'John' }, '{name: string}')
    .log()      // logs validation details
    .fail()     // throws if invalid
    .return();  // returns original value

// Conditional validation
if (_typeCheck(userInput, 'string').test()) {
    // Safe to use userInput as string
    console.log(userInput.toUpperCase());
}

// Direct boolean access
const isNumber = _typeCheck(value, 'number').bool;

// Custom options
_typeCheck(data, 'object', {
    log: true,           // auto-log results
    fail: true,          // auto-fail on error
    callback: (result) => {
        console.log('Custom validation logic', result);
    }
});
```

---

### `validType()`

**Simple boolean validation without throwing errors**

```javascript
validType(valueToTest, typeExpression)
```

**Parameters:**
- `valueToTest` (any) - The value to validate
- `typeExpression` (string) - The type pattern to match against

**Returns:** `boolean` - true if valid, false if invalid

**Examples:**

```javascript
import { validType } from '@knighttower/type-check';

// Safe validation for conditional logic
if (validType(userInput, 'string')) {
    // userInput is definitely a string
    processString(userInput);
} else {
    console.log('Invalid input type');
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    if (!validType(data.email, 'string')) {
        errors.push('Email must be a string');
    }
    
    if (!validType(data.age, 'number')) {
        errors.push('Age must be a number');
    }
    
    if (!validType(data.preferences, '{theme: string, notifications: boolean}')) {
        errors.push('Invalid preferences object');
    }
    
    return errors;
}

// API response validation
function handleApiResponse(response) {
    if (validType(response, '{data: array, status: number}')) {
        return response.data;
    }
    throw new Error('Invalid API response format');
}
```

---

### `_tc()`

**Function wrapper with input parameter validation**

```javascript
_tc(typeExpressions, functionToWrap, options?)
```

**Parameters:**
- `typeExpressions` (array) - Array of type patterns for each parameter
- `functionToWrap` (function) - The function to wrap with validation
- `options` (object, optional) - Configuration options

**Returns:** Wrapped function that validates inputs before execution

**Examples:**

```javascript
import { _tc } from '@knighttower/type-check';

// Basic function wrapping
const greet = _tc(['string'], function(name) {
    return `Hello, ${name}!`;
});

greet('Alice');  // ✅ returns "Hello, Alice!"
greet(123);      // ❌ throws error

// Multiple parameters
const calculate = _tc(['number', 'number', 'string'], function(a, b, operation) {
    switch(operation) {
        case 'add': return a + b;
        case 'multiply': return a * b;
        default: return 0;
    }
});

calculate(5, 3, 'add');      // ✅ returns 8
calculate('5', 3, 'add');    // ❌ throws error

// With options
const processUser = _tc(
    ['{name: string, age: number}'],
    function(user) {
        return `Processing user: ${user.name}, age: ${user.age}`;
    },
    { 
        log: false,  // don't log by default
        fail: true,  // throw errors (default)
        error: 'Invalid user object provided'
    }
);

// Arrow functions
const multiply = _tc(['number', 'number'], (a, b) => a * b);

// Complex type validation
const createOrder = _tc(
    ['{items: [object], total: number, customer: {id: number, email: string}}'],
    function(orderData) {
        // Function implementation
        return { orderId: Date.now(), ...orderData };
    }
);
```

---

### `_tcx()`

**Function wrapper with input AND output validation**

```javascript
_tcx(typeExpressions, functionToWrap, options?)
```

**Parameters:**
- `typeExpressions` (array) - Array of type patterns for each parameter
- `functionToWrap` (function) - The function to wrap with validation
- `options` (object, optional) - Configuration options including `validOutput`

**Chainable Methods:**
- `.log()` - Log validation details
- `.fail()` - Throw error if validation fails
- `.return()` - Get the return value
- `.test()` - Get boolean validation result

**Examples:**

```javascript
import { _tcx } from '@knighttower/type-check';

// Function with return value validation
const getLength = _tcx(
    ['string'],
    (str) => str.length,
    { validOutput: 'number' }
);

const length = getLength('hello').return();  // 5
getLength(123);  // ❌ throws (invalid input)

// Complex example with chaining
const processData = _tcx(
    ['{data: array}'],
    function(input) {
        return {
            processed: true,
            count: input.data.length,
            summary: 'Data processed successfully'
        };
    },
    { 
        validOutput: '{processed: boolean, count: number, summary: string}',
        log: false
    }
);

const result = processData({ data: [1, 2, 3] })
    .log()      // logs validation details
    .fail()     // throws if validation fails
    .return();  // returns the actual result

// Mathematical operations with validation
const divide = _tcx(
    ['number', 'number'],
    (a, b) => {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    },
    { validOutput: 'number' }
);

const result = divide(10, 2).return();  // 5

// API function wrapper
const fetchUser = _tcx(
    ['number'],
    async function(userId) {
        const response = await fetch(`/api/users/${userId}`);
        return await response.json();
    },
    { 
        validOutput: '{id: number, name: string, email: string}',
        error: 'Invalid user data received from API'
    }
);

// Usage with async
const user = await fetchUser(123).fail().return();
```

---

### `addTypeTest()`

**Register custom type validators**

```javascript
addTypeTest(name, validationFunction)
```

**Parameters:**
- `name` (string) - Name of the custom type
- `validationFunction` (function) - Function that returns boolean for validation

**Returns:** `true` if added successfully, error message if name already exists

**Examples:**

```javascript
import { addTypeTest, typeCheck } from '@knighttower/type-check';

// Custom validator for even numbers
addTypeTest('even', (value) => {
    return typeof value === 'number' && value % 2 === 0;
});

typeCheck(4, 'even');    // ✅ passes
typeCheck(3, 'even');    // ❌ throws
typeCheck([2, 4, 6], '[even]');  // ✅ all even numbers

// Email validation
addTypeTest('email', (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === 'string' && emailRegex.test(value);
});

typeCheck('user@example.com', 'email');  // ✅
typeCheck('invalid-email', 'email');     // ❌

// Non-empty string
addTypeTest('nonEmptyString', (value) => {
    return typeof value === 'string' && value.trim().length > 0;
});

// Positive number
addTypeTest('positive', (value) => {
    return typeof value === 'number' && value > 0;
});

// Use in complex validations
typeCheck({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
}, '{name: nonEmptyString, email: email, age: positive}');

// URL validation
addTypeTest('url', (value) => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
});

// Date string validation
addTypeTest('dateString', (value) => {
    return typeof value === 'string' && !isNaN(Date.parse(value));
});

// Use custom types in arrays and objects
typeCheck(['2023-01-01', '2023-12-31'], '[dateString]');
typeCheck({
    homepage: 'https://example.com',
    created: '2023-01-01'
}, '{homepage: url, created: dateString}');
```

---

## 🔤 Type Patterns

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
## 🔤 Type Patterns

TypeCheck JS supports a rich pattern syntax for expressing complex type requirements:

### Basic Types

```javascript
// Single type
'string'    // must be string
'number'    // must be number  
'boolean'   // must be boolean
'null'      // must be null
'undefined' // must be undefined
'array'     // must be array
'object'    // must be object
'function'  // must be function

// Optional types (allows null/undefined)
'string?'   // string, null, or undefined
'number?'   // number, null, or undefined

// Union types (multiple allowed types)
'string|number'           // string OR number
'boolean|string|number'   // any of the three types
'array|object'            // array OR object

// Combined optional and union
'string|number?'          // string, number, null, or undefined
```

### Array Patterns

```javascript
// Homogeneous arrays (all elements same type)
'[string]'     // array of strings
'[number]'     // array of numbers
'[boolean]'    // array of booleans

// Heterogeneous arrays (specific positions)
'[string, number]'              // first element string, second number
'[string, number, boolean]'     // three elements with specific types
'[object, array, string]'       // mixed types at specific positions

// Union types in arrays
'[string|number]'               // array where all elements are string OR number
'[string, number|boolean]'      // first string, second number OR boolean

// Nested arrays
'[[string]]'                    // array of string arrays
'[string, [number]]'            // first string, second is number array
'[[string, number]]'            // array containing [string, number] pairs

// Optional elements in arrays
'[string, number?]'             // second element optional
```

### Object Patterns

```javascript
// Basic object structure
'{name: string}'                          // object with name property (string)
'{name: string, age: number}'             // object with name and age properties
'{id: number, active: boolean}'           // id (number) and active (boolean)

// Optional properties
'{name: string, age?: number}'            // age property is optional
'{id: number, email?: string}'            // email property is optional

// Union types in properties
'{status: string|number}'                 // status can be string OR number
'{data: string|array|object}'             // data can be multiple types

// Any key validation (all properties same type)
'{any: string}'                           // all property values must be strings
'{any: number}'                           // all property values must be numbers
'{any: string|number}'                    // all values string OR number

// Mixed specific and any
'{id: number, any: string}'               // id must be number, others string
'{name: string, age: number, any: boolean}' // specific props + others boolean

// Ignore extra properties
'{name: string, ...}'                     // name required, ignore other props
'{id: number, email: string, ...}'        // specified props required, others ignored

// Nested objects
'{user: {name: string, age: number}}'     // nested object structure
'{config: {theme: string, debug: boolean}}' // nested configuration object

// Complex nested structures
'{users: [{id: number, name: string}]}'   // array of user objects
'{response: {data: [object], meta: {total: number}}}' // complex API response
```

### Advanced Patterns

```javascript
// Enums (specific values only)
'enum=red/green/blue'                     // only these three values allowed
'enum=small/medium/large'                 // size enum
'enum=admin/user/guest'                   // role enum

// Enums with other types
'string|enum=active/inactive'             // string OR specific enum values
'enum=1/2/3|string'                       // enum values OR any string

// Complex array patterns
'[{name: string, tags: [string]}]'        // array of objects with string arrays
'[string, {count: number}, [boolean]]'    // mixed: string, object, boolean array

// Real-world examples
'{id: number, user: {name: string, email: string}, items: [{id: number, quantity: number}]}'

// API response patterns
'{data: [object], pagination: {page: number, total: number}, meta: {timestamp: string}}'

// Form validation patterns
'{email: string, password: string, confirmPassword?: string, terms: boolean}'

// Configuration object patterns
'{api: {baseUrl: string, timeout: number?}, features: {darkMode: boolean, notifications: boolean}}'
```

### Pattern Examples with Use Cases

```javascript
// User profile validation
const userPattern = `{
    id: number,
    email: string,
    profile: {
        firstName: string,
        lastName: string,
        avatar?: string
    },
    preferences: {
        theme: enum=light/dark,
        notifications: boolean
    },
    roles: [enum=admin/user/moderator]
}`;

// E-commerce order
const orderPattern = `{
    orderId: string,
    customer: {id: number, email: string},
    items: [{
        productId: number,
        name: string,
        price: number,
        quantity: number
    }],
    shipping: {
        address: string,
        method: enum=standard/express/overnight
    },
    total: number
}`;

// API response with pagination
const apiResponsePattern = `{
    data: [object],
    pagination: {
        page: number,
        limit: number,
        total: number,
        hasNext: boolean
    },
    meta?: {
        timestamp: string,
        version: string
    }
}`;
```

---

## 📝 Comprehensive Examples

### Form Validation

```javascript
import { validType, typeCheck } from '@knighttower/type-check';

function validateRegistrationForm(formData) {
    const errors = [];
    
    // Basic field validation
    if (!validType(formData.email, 'string')) {
        errors.push('Email is required');
    }
    
    if (!validType(formData.password, 'string')) {
        errors.push('Password is required');
    }
    
    // Complex object validation
    if (!validType(formData, '{email: string, password: string, age?: number}')) {
        errors.push('Invalid form structure');
    }
    
    // Custom validation with typeCheck for strict enforcement
    try {
        typeCheck(formData.preferences, '{newsletter: boolean, theme: enum=light/dark}');
    } catch (error) {
        errors.push('Invalid preferences');
    }
    
    return errors;
}

// Usage
const formData = {
    email: 'user@example.com',
    password: 'securePassword',
    age: 25,
    preferences: {
        newsletter: true,
        theme: 'dark'
    }
};

const errors = validateRegistrationForm(formData);
```

### API Data Validation

```javascript
import { _typeCheck, addTypeTest } from '@knighttower/type-check';

// Custom validation for ISO date strings
addTypeTest('isoDate', (value) => {
    return typeof value === 'string' && !isNaN(Date.parse(value));
});

// API endpoint with validation
async function fetchUserOrders(userId) {
    // Validate input
    typeCheck(userId, 'number');
    
    const response = await fetch(`/api/users/${userId}/orders`);
    const data = await response.json();
    
    // Validate API response structure
    const isValid = _typeCheck(data, `{
        orders: [{
            id: number,
            status: enum=pending/processing/shipped/delivered,
            items: [{name: string, quantity: number, price: number}],
            createdAt: isoDate,
            total: number
        }],
        pagination: {page: number, totalPages: number}
    }`).test();
    
    if (!isValid) {
        throw new Error('Invalid API response format');
    }
    
    return data;
}
```

### Function Parameter Validation

```javascript
import { _tc, _tcx } from '@knighttower/type-check';

// Database query function with validation
const findUsers = _tc(
    ['{filters?: {name?: string, age?: number, active?: boolean}, limit?: number}'],
    function(options = {}) {
        const { filters = {}, limit = 10 } = options;
        
        // Build and execute query
        console.log('Searching users with filters:', filters);
        return mockDatabaseQuery(filters, limit);
    }
);

// Math function with input and output validation
const calculateCompoundInterest = _tcx(
    ['number', 'number', 'number', 'number'],
    function(principal, rate, time, compound) {
        return principal * Math.pow((1 + rate / compound), compound * time);
    },
    { validOutput: 'number' }
);

// Usage
const users = findUsers({
    filters: { active: true, age: 25 },
    limit: 5
});

const investment = calculateCompoundInterest(1000, 0.05, 10, 12).return();
```

### Configuration Validation

```javascript
import { typeCheck, addTypeTest } from '@knighttower/type-check';

// Custom port number validation
addTypeTest('port', (value) => {
    return typeof value === 'number' && value >= 1 && value <= 65535;
});

// Application configuration
const configPattern = `{
    server: {
        host: string,
        port: port,
        ssl: boolean
    },
    database: {
        url: string,
        pool: {min: number, max: number}
    },
    features: {
        auth: boolean,
        logging: enum=debug/info/warn/error,
        rateLimit?: {
            windowMs: number,
            max: number
        }
    }
}`;

function validateConfig(config) {
    try {
        typeCheck(config, configPattern);
        console.log('Configuration is valid');
        return true;
    } catch (error) {
        console.error('Configuration error:', error.message);
        return false;
    }
}

// Usage
const appConfig = {
    server: {
        host: 'localhost',
        port: 3000,
        ssl: false
    },
    database: {
        url: 'postgresql://localhost:5432/myapp',
        pool: { min: 2, max: 10 }
    },
    features: {
        auth: true,
        logging: 'info',
        rateLimit: {
            windowMs: 900000,
            max: 100
        }
    }
};

validateConfig(appConfig);
```

### Real-time Data Validation

```javascript
import { _typeCheck } from '@knighttower/type-check';

// WebSocket message validation
function handleWebSocketMessage(message) {
    // Log validation details in development
    const validation = _typeCheck(message, `{
        type: enum=user_joined/user_left/message/typing,
        payload: {
            userId: number,
            username: string,
            content?: string,
            timestamp: number
        }
    }`).log();
    
    if (!validation.test()) {
        console.warn('Invalid message format received');
        return;
    }
    
    // Process valid message
    const { type, payload } = message;
    switch (type) {
        case 'message':
            displayMessage(payload);
            break;
        case 'user_joined':
            showUserJoined(payload);
            break;
        // ... other cases
    }
}

// Event handler validation
const handleUserAction = _tc(
    ['{action: enum=click/hover/focus, target: string, data?: object}'],
    function(event) {
        console.log(`User ${event.action} on ${event.target}`);
        if (event.data) {
            console.log('Additional data:', event.data);
        }
    }
);
```

---

## ⚡ Performance
'[{key1: type | type}]' // returns test to test all key with one or more
'[{key1: type, key2: type}]' // returns
'[{key1: type, key2: type}, {key1: type, key2: type}]'
'[{key1: type | type, key2: type | type}, {key1: type | type, key2: type | type}]'
'[{key1: type, any: type}]'
```

## ⚡ Performance

TypeCheck JS is designed for production use with minimal performance overhead:

### Benchmarks

- **Lightweight**: ~6k gzipped, minimal bundle impact
- **Fast Execution**: Micro-optimized for runtime operations
- **Caching**: Built-in caching for type patterns and validations
- **Memory Efficient**: Reuses validation functions and patterns

### Performance Comparison

```javascript
// Benchmark example (1000 iterations)
import { _tc, _tcx, typeCheck } from '@knighttower/type-check';

// _tc: ~3ms for 1000 function calls with validation
const fastFunction = _tc(['[number]'], (arr) => arr.reduce((a, b) => a + b, 0));

// _tcx: ~4ms for 1000 function calls with input/output validation  
const robustFunction = _tcx(['[number]'], (arr) => arr.reduce((a, b) => a + b, 0), {
    validOutput: 'number'
});

// Direct typeCheck: ~2ms for 1000 direct validations
const numbers = [1, 2, 3, 4, 5];
for (let i = 0; i < 1000; i++) {
    typeCheck(numbers, '[number]');
}
```

### Optimization Tips

1. **Reuse wrapped functions**: Create `_tc` and `_tcx` wrapped functions once, use many times
2. **Use `validType()` for boolean checks**: Faster than `_typeCheck().test()`
3. **Cache complex patterns**: The library automatically caches, but avoid recreating patterns
4. **Prefer simpler patterns**: `'string'` is faster than `'string|number|boolean'`

---

## 🧪 Tests

Comprehensive test coverage ensures reliability:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run performance benchmarks  
npm run benchmark
```

### Test Files

- `tests/TypeCheck.test.js` - Core functionality tests
- `tests/TestBuilder.Unit.test.js` - Pattern parsing tests
- `tests/BuildExports.unit.test.js` - Export validation tests
- `type-patterns.txt` - Extended pattern examples

### Example Test Cases

```javascript
// Basic type validation
expect(validType(123, 'number')).toBe(true);
expect(validType('hello', 'number')).toBe(false);

// Complex object validation
expect(validType({
    user: { name: 'John', age: 30 },
    items: [{ id: 1, name: 'Item' }]
}, '{user: {name: string, age: number}, items: [{id: number, name: string}]}')).toBe(true);

// Custom type tests
addTypeTest('even', x => typeof x === 'number' && x % 2 === 0);
expect(validType(4, 'even')).toBe(true);
expect(validType(3, 'even')).toBe(false);

// Function wrapper tests
const fn = _tc(['string'], (str) => str.toUpperCase());
expect(() => fn('hello')).not.toThrow();
expect(() => fn(123)).toThrow();
```

---

## 🔧 Advanced Usage

### TypeScript Integration

TypeCheck JS works alongside TypeScript for runtime validation:

```typescript
import { typeCheck, validType } from '@knighttower/type-check';

interface User {
    id: number;
    name: string;
    email: string;
}

function processUser(data: unknown): User {
    // Runtime validation
    typeCheck(data, '{id: number, name: string, email: string}');
    
    // Now TypeScript knows data is valid
    return data as User;
}

// API response validation
async function fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    if (!validType(data, '{id: number, name: string, email: string}')) {
        throw new Error('Invalid user data from API');
    }
    
    return data;
}
```

### Error Handling

```javascript
import { typeCheck, _typeCheck } from '@knighttower/type-check';

// Custom error messages
try {
    typeCheck(invalidData, 'string', { 
        error: 'User input must be a valid string' 
    });
} catch (error) {
    console.error('Validation failed:', error.message);
}

// Graceful validation
function safeValidation(data, pattern) {
    const result = _typeCheck(data, pattern);
    
    if (!result.test()) {
        console.warn('Data validation failed for pattern:', pattern);
        return null;
    }
    
    return result.return();
}

// Multiple validation attempts
function validateWithFallback(data) {
    const patterns = [
        '{id: number, name: string}',
        '{id: string, name: string}',
        '{name: string}'
    ];
    
    for (const pattern of patterns) {
        if (validType(data, pattern)) {
            console.log('Matched pattern:', pattern);
            return data;
        }
    }
    
    throw new Error('Data does not match any expected pattern');
}
```

### Custom Validation Library

```javascript
import { addTypeTest, typeCheck } from '@knighttower/type-check';

// Build a custom validation library
class CustomValidators {
    static init() {
        // Email validation
        addTypeTest('email', (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return typeof value === 'string' && emailRegex.test(value);
        });
        
        // Phone number validation
        addTypeTest('phone', (value) => {
            const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
            return typeof value === 'string' && phoneRegex.test(value);
        });
        
        // URL validation
        addTypeTest('url', (value) => {
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        });
        
        // Credit card validation (basic)
        addTypeTest('creditCard', (value) => {
            const ccRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
            return typeof value === 'string' && ccRegex.test(value.replace(/\s/g, ''));
        });
        
        // Strong password validation
        addTypeTest('strongPassword', (value) => {
            const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return typeof value === 'string' && strongRegex.test(value);
        });
    }
}

// Initialize custom validators
CustomValidators.init();

// Use custom validators
const userRegistration = {
    email: 'user@example.com',
    phone: '+1-555-123-4567',
    website: 'https://example.com',
    password: 'MyStr0ng!Pass'
};

typeCheck(userRegistration, `{
    email: email,
    phone: phone,
    website: url,
    password: strongPassword
}`);
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with tests
4. Run the test suite: `npm test`
5. Submit a pull request

### Development Setup

```bash
git clone https://github.com/knighttower/typeCheckJs.git
cd typeCheckJs
npm install
npm test
```

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🔗 Related Projects

Check out other tools in the Knight Tower ecosystem:

- [Utility JS](https://knighttower.io) - Additional JavaScript utilities
- [DOM Observer](https://github.com/knighttower/dom-observer) - DOM change detection
- [Proxy Object](https://github.com/knighttower/proxy-object) - Object state management

---

<br /><br />

Check out other cool stuff at https://knighttower.io and help support open source projects.

<br />

## 🙌 Sponsored By

[![Squarefox](https://github.com/knighttower/typeCheckJs/assets/649334/024f2e7d-d3d0-4558-8893-2e6bbea29a6f)](https://squarefox.us/)


