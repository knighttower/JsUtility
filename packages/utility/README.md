# JS utility Library Documentation

## Collection of libraries with classes and functions for JavaScript

### 💡 To see the API of each use the Built-in Github "Symbols" explorer in each source file. All files are fully documented with JSDocs comments to describe the purpose and usage of each function included. (the link will take you to each source file)

Here’s the improved documentation, reorganized and with API usage examples for clarity and readability:

---

# JS Utility Library Documentation

## Overview

This is a collection of modular JavaScript utility functions and classes designed for seamless integration in various projects. It supports **ESM**, **CJS**, **UMD**, and **browser** environments.

### Installation

```bash
npm install @knighttower/utility
```

Or via **CDN**:

```html
<script src="https://cdn.jsdelivr.net/npm/@knighttower/utility@VERSION_NUMBER/dist/browser/LIBRARY_NAME.js"></script>
<script type="module" src="https://esm.run/@knighttower/utility@VERSION_NUMBER/index.js"></script>
```

---

## What's new

- **Removed:** `getGoogleMapsAddress` and `openGoogleMapsAddress`.
- **ESM sub-path imports** (`/powerHelpers`, `/helpers`, `/promises`, `/promiseQueue`, `/EventBus`, `/event-bus`, `/proxyObject`, `/proxyClass`) now load the `src` files directly (the `src` folder is published). `require()` still uses `dist/cjs`.
- **Browser build** of the main library is `dist/browser/Utility.js` (sets `window.utility`).
- **Behavior fixes** (see the docs of each function for details):
  - `convertToBool`: every string other than `'false'`, `'0'`, `'no'`, `'off'` or blank is `true`.
  - `dateFormat`: strings without a time zone are shown exactly as written on any machine, timestamps (`0` included) and `Date` objects are accepted.
  - `decimalToCurrency` / `toCurrency`: always two decimals, `0` gives `'0.00'`, invalid input gives `undefined`.
  - `emptyOrValue` / `isEmpty`: numbers, booleans and `Date`/`RegExp`/`Error` are never empty.
  - `extend`: never modifies the target, ignores `__proto__` keys and string sources.
  - `includes`: supports `Map`/`Set` and `fromIndex` on arrays.
  - `isNumber`: blank strings are `null`.
  - `instanceOf`: custom classes are matched by class name.
  - `toDollarString`: 999,950 and above shows as `M`.
  - `validateEmail` accepts `+` and long TLDs; `validatePhone` accepts spaces and requires matching parentheses.
  - powerHelper: `cleanStr` string delimiters are literal, `getArrObjFromString` / `getDirectivesFromString` parse nested and multi-line strings reliably, `getMatchBlock` matches plain-string delimiters without regex, `getObjectFromPath` defaults to `globalThis`.
  - EventBus, promiseQueue, promisePool and doTimeout: see their docs for the fixes.

---

## Imports

- **Full library:**  
  ```javascript
  import * as utility from '@knighttower/utility';
  ```
- **Individual functions:**  
  ```javascript
  import { convertToBool, dateFormat } from '@knighttower/utility';
  ```

---

## API Reference

### **General Utility Functions**

#### 1. `convertToBool(val)`

Converts a value to a boolean.

- **Params:**  
  `val: String | Boolean | Number` - Input value to convert.
- **Returns:**  
  `Boolean` - Converted boolean value.
- **Usage:**
  ```javascript
  convertToBool('true');  // true
  convertToBool('0');     // false
  convertToBool(1);       // true
  convertToBool('off');   // false ('false', '0', 'no', 'off' and blank strings are false)
  convertToBool('hello'); // true  (any other string is true)
  ```

---

#### 2. `convertToNumber(input)`

Converts a variable to a number, if possible.

- **Params:**  
  `input: String | Number` - Input value to convert.
- **Returns:**  
  `Number | String` - Converted number or original input.
- **Usage:**
  ```javascript
  convertToNumber('123');  // 123
  convertToNumber('abc');  // 'abc'
  ```

---

#### 3. `currencyToDecimal(amount)`

Converts a currency string to a decimal.

- **Params:**  
  `amount: String | Number` - Currency input.
- **Returns:**  
  `Number` - Decimal representation.
- **Usage:**
  ```javascript
  currencyToDecimal('$1,234.56');  // 1234.56
  currencyToDecimal(1234.56);      // 1234.56 (numbers are returned as they are)
  ```

---

#### 4. `dateFormat(dateTime, wTime)`

Formats dates to **MM/DD/YYYY** with optional time.

- **Params:**  
  `dateTime: String | Number | Date` - Date string, timestamp in milliseconds or Date object.  
  `wTime: Boolean` - Whether to include time.
- **Returns:**  
  `String | Null` - Formatted date or null if missing/invalid.
- **Time zones:** strings without a zone are shown exactly as written on any machine; `Date` objects, timestamps and strings with a zone (`Z`, `+02:00`...) are shown in UTC.
- **Usage:**
  ```javascript
  dateFormat('2201-01-01 16:15', true);      // "01/01/2201 @ 04:15 PM"
  dateFormat('2201-01-01T16:15:00Z', true);  // "01/01/2201 @ 04:15 PM"
  dateFormat(0);                             // "01/01/1970"
  ```

---

#### 5. `decimalToCurrency(amount)`

Converts a decimal number to a formatted currency string.

- **Params:**  
  `amount: String | Number`
- **Returns:**  
  `String | undefined` - Formatted currency (always two decimals), or undefined when not a number.
- **Usage:**
  ```javascript
  decimalToCurrency(1234.56);  // "1,234.56"
  decimalToCurrency(0);        // "0.00"
  decimalToCurrency('abc');    // undefined
  ```

---

#### 6. `emptyOrValue(value, _default)`

Returns default if value is empty.

- **Params:**  
  `value: String | Number | Object` - Input value.  
  `_default: Any` - Default value.
- **Returns:**  
  `Mixed` - Original value or default.
- **Usage:**
  ```javascript
  emptyOrValue('', 'default');  // 'default'
  emptyOrValue('hello');        // 'hello'
  emptyOrValue(0, 'default');   // 0 (numbers and booleans are never empty)
  ```

---

#### 7. `formatPhoneNumber(phoneNumber, template)`

Formats a phone number.

- **Params:**  
  `phoneNumber: String` - Unformatted phone number.  
  `template: String` - Template format.
- **Returns:**  
  `String` - Formatted phone number.
- **Usage:**
  ```javascript
  formatPhoneNumber('1234567890', '(000) 000-0000');  // "(123) 456-7890"
  ```

---

#### 8. `isEmpty(value)`

Checks if a value is empty.

- **Params:**  
  `value: Any` - Value to check.
- **Returns:**  
  `Boolean` - `true` if empty, otherwise `false`.
- **Usage:**
  ```javascript
  isEmpty([]);          // true
  isEmpty({});          // true
  isEmpty(new Set());   // true
  isEmpty(0);           // false (numbers, booleans, functions, Date, RegExp and Error are never empty)
  isEmpty(new Date());  // false
  ```

---

### **Identifiers and Randomization**

#### 9. `uuid(max)`

Generates a random alphanumeric string (not an RFC UUID, and not for security purposes). Alias: `uniqueId`.

- **Params:**  
  `max: Number` - Length of the string (default: 20, and 40 when `0` or another falsy value is passed).
- **Returns:**  
  `String` - Unique string.
- **Usage:**
  ```javascript
  uuid(16);  // "ab12cd34ef56gh78"
  ```

---

#### 10. `getDynamicId()`

Generates a unique ID in format `id__XXXX__timestamp`.

- **Usage:**
  ```javascript
  getDynamicId();  // "id__abc123__1672531200000"
  ```

---

### **Validation**

#### 11. `validateEmail(email)`

Validates email format.

- **Params:**  
  `email: String`
- **Returns:**  
  `Boolean`
- **Usage:**
  ```javascript
  validateEmail('test@example.com');      // true
  validateEmail('test+tag@test.online');  // true
  validateEmail('test@com');              // false
  validateEmail('test@test..com');        // false
  ```

---

#### 12. `validatePhone(phone)`

Validates phone number format.

- **Params:**  
  `phone: String`
- **Returns:**  
  `Boolean`
- **Usage:**
  ```javascript
  validatePhone('(123) 456-7890');  // true
  validatePhone('123 456 7890');    // true
  validatePhone('(123 456-7890');   // false (the parentheses must match)
  ```

---

### **Object Utilities**

#### 13. `extend(target, ...sources)`

Deep merges objects into a **new** object (the target is not modified). `__proto__` keys and string sources are ignored.

- **Params:**  
  `target: Object` - Base object.  
  `...sources: Object[]` - Objects to merge.
- **Returns:**  
  `Object` - Merged object.
- **Usage:**
  ```javascript
  const a = { x: 1 };
  const b = { y: 2 };
  extend(a, b);  // { x: 1, y: 2 }
  ```

---

#### 14. `makeArray(item)`

Converts an input to an array.

- **Params:**  
  `item: Any`
- **Returns:**  
  `Array`
- **Usage:**
  ```javascript
  makeArray('test');  // ['test']
  ```

---

### **Additional Methods**

- **Type Check:**  
  `typeOf(input, test)` - Returns type of input (`'null'` for null, `'array'` for arrays).  
  `instanceOf(input, test)` - Returns class instance of input; `test` can be a name (`'date'`) or a class (`MyClass`).  
  `isNumber(value)` - Returns the value as a number, or `null` (blank strings included). Note `isNumber(0)` is `0`, compare against `null`.  
  `isPlainObject(value)` - True for plain objects only.
- **Recursive Check:**  
  `includes(collection, value, fromIndex)` - Recursively checks (case-insensitive) if an array, string, object, Map or Set includes a value.
- **String Utilities:**  
  `toDollarString(amount)` - Converts a number to a short dollar string (`2K`, `2.5M`).

---

## Examples

```javascript
import { currencyToDecimal, validateEmail } from '@knighttower/utility';

console.log(currencyToDecimal('$1,234.56'));  // 1234.56
console.log(validateEmail('test@example.com'));  // true
```

## License

MIT License.

---

For detailed usage and testing, visit the [GitHub repository](https://github.com/knighttower/JsUtility).


<br/>
--- 
# Othe Libraries Available in this package

The library is standalone (via browser script tag, loads the whole library) or modular, either the entire object or only a few functions since it is completely modular.

```javascript
npm i @knighttower/utility
```

### @exports included  

```javascript
  Here is a list of the export paths:

- `@knighttower/utility` (DEFAULT entry: exports all libraries)
export {
    DomObserver,
    domObserver,
    elementHelper,
    selectElement,
    ElementHelper,
    EventBus,
    extend,
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
    setExpString,
    setLookUpExp,
    setWildCardString,
    startAndEndWith,
    wildCardStringSearch,
    doAsync,
    doPoll,
    doTimeout,
    promisePool,
    promiseQueue,
    proxyClass,
    proxyObject,
    urlHelper,
    convertToBool,
    convertToNumber,
    currencyToDecimal,
    dateFormat,
    decimalToCurrency,
    dynamicId,
    emptyOrValue,
    formatPhoneNumber,
    getDynamicId,
    getRandomId,
    includes,
    instanceOf,
    isEmpty,
    isNumber,
    isPlainObject,
    makeArray,
    randomId,
    toCurrency,
    toDollarString,
    typeOf,
    uniqueId,
    uuid,
    validateEmail,
    validatePhone,
};
// INDIVIDUALLY
- `@knighttower/utility/dist/*` (all libraries in the dist folder (umd, cjs, esm..))
- `@knighttower/utility/node/*` (all node libraries)
- `@knighttower/utility/nodeUtils/*` (all node utilities)
- `@knighttower/utility/nodeUtils` (default export)
- `@knighttower/utility/proxyObject` (default export)
- `@knighttower/utility/proxyClass` (default export)
- `@knighttower/utility/powerHelpers` (or `/helpers`, named exports)
- `@knighttower/utility/promises` (or `/promiseQueue`, named exports)
- `@knighttower/utility/EventBus` (default export)
- `@knighttower/utility/event-bus` (default export)
// ESM ("import") sub-paths load the files from /src, CJS ("require") sub-paths load /dist/cjs
```
<br/> 

## In the browser

Each library can be loaded individually or all at once. The library is also available via CDN.

see browser examples here: https://github.com/knighttower/JsUtility/blob/development/packages/utility/tests/index.html


see all available in the CDN here --> https://cdn.jsdelivr.net/npm/@knighttower/utility/dist/browser/  

```html
<!-- LIBRARY_NAME: Utility, powerHelper, promises, EventBus, DomObserver, ElementHelper, ProxyObject, proxyClass, UrlHelper -->
<script src="https://cdn.jsdelivr.net/npm/@knighttower/utility@VERSION_NUMBER/dist/browser/LIBRARY_NAME.js"></script>
//or ESM
<script type="module" src="https://esm.run/@knighttower/utility@VERSION_NUMBER/index.js"></script>
```

<br/>

## Node, NPM and Browser ready (esm, cjs, umd...)

- [utility](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/utility.js): A collection of utility functions for common cases  
ℹ  [docs](https://github.com/knighttower/JsUtility/blob/development/packages/utility/docs/utils.md)

  @imports
   * all, or import individual functions from the utility library;

<br/> 

- [EventBus](https://github.com/knighttower/JsUtility/tree/development/packages/utility/src/event-bus): A class for creating event buses  
ℹ [docs](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/event-bus)

  @imports 
  - class EventBus
<br/> 

- [promises](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/promises.js): A class for managing promises in a queue and polling
ℹ  [docs](https://github.com/knighttower/JsUtility/blob/development/packages/utility/docs/promises.md)

  @imports 
  - doAsync,
    doPoll,
    doTimeout,
    promisePool,
    promises,

<br/>  

- [powerHelper](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/powerHelper.js): A collection of powerful functions for regex and string manipulation    
ℹ  [docs](https://github.com/knighttower/JsUtility/blob/development/packages/utility/docs/powerHelper.md)

  @imports 
  - all, or import individual functions from the powerHelper library;  

<br/> 

- [proxyObject](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/proxyObject.js): A class for working with proxy objects  
ℹ  [docs](https://github.com/knighttower/JsUtility/blob/development/packages/utility/docs/proxyObject.md)  

  @imports 
  - proxyObject, proxyObject as default, proxyClass

<br/> 

- [proxyClass](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/proxyObject.js): A class for working with proxy classes    
  
  @imports 
  - proxyObject, proxyObject as default, proxyClass

<br/> 

- [domObserver](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/domObserver.js): A class for observing DOM changes  
ℹ  [docs](https://github.com/knighttower/JsUtility/blob/development/packages/utility/docs/domObserver.md)  

  @imports 
  - domObserver, domObserver as default

<br/> 

- [urlHelper](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/urlHelper.js): A class for working with URLs  
- ℹ  [docs](https://github.com/knighttower/JsUtility/blob/development/packages/utility/docs/urlHelper.md)
  
  @imports 
  - urlHelper, urlHelper as default

<br/> 

- [ElementHelper](https://github.com/knighttower/JsUtility/blob/development/packages/utility/src/ElementHelper.js): extra functionlality for working with elements in DOM  
  
  @imports 
  - ElementHelper as default, ElementHelper, selectElement, elementHelper
  
<br/> 

<br/>

## Node ONLY
- [NodeHelpers](https://github.com/knighttower/JsUtility/blob/development/packages/utility/nodeUtils/NodeHelpers.cjs): A collection of functions for working with NodeJS
- [Minify](https://github.com/knighttower/JsUtility/blob/development/packages/utility/nodeUtils/Minify.js): A class for minifying files
- [Rollup](https://github.com/knighttower/JsUtility/blob/development/packages/utility/nodeUtils/rollup.config.cjs) Config: Advanced Rollup configuration for building libraries
- [Webpack](https://github.com/knighttower/JsUtility/blob/development/packages/utility/nodeUtils/webpack.config.cjs) Config: Advanced Webpack configuration for building libraries






## List of functions included in utility

```javascript
{
  convertToBool: "accurately converts a value to a boolean, accepts int, string and boolean",
  convertToNumber: "accurately converts a value to a number, accepts int, string and boolean",
  currencyToDecimal: "converts a currency string to a decimal number",
  dateFormat: "formats a date object to a specified format string",
  decimalToCurrency: "converts a decimal number to a currency string",
  emptyOrValue: "returns a default value if a given value is empty or undefined, uses isEmpty()",
  extend: "deep merges objects into a new object, without modifying the target",
  formatPhoneNumber: "formats a phone number string to a standardized format",
  getDynamicId: "generates a unique ID string based on a prefix, timestamp and a random number",
  getRandomId: "generates a random ID string",
  includes: "checks if a collection (object|string|array|map|set) includes a given value",
  isNumber: "checks if a given value is a number (that includes string numbers and floats)",
  isEmpty: "checks if a given value is empty, checks arrays, objects, etc",
  isPlainObject: "checks if a given value is a plain object",
  toCurrency: "formats a number to a currency string",
  toDollarString: "formats a number to a dollar string",
  typeOf: "gets the type of a value and can also return simple comparisons. For more advanced type-checking, use the 'typeCheck' library https://github.com/knighttower/JsTypeCheck",
  instanceOf: "gets the instance of a value and can also return simple comparisons",
  validateEmail: "validates an email address string to ensure it is in a valid format",
  validatePhone: "validates a phone number string to ensure it is in a valid format",
  makeArray: "converts a value to an array, if it is not already an array",
  uuid: "generates a random alphanumeric string (alias uniqueId)"
}

```

You can see the src with github and explore the functions by using the "symbols explorer" from Github [here](https://github.com/knighttower/JsUtility/blob/development/src/utility.js)

# List of functions included in powerHelper

```javascript
{
  addQuotes: "adds quotes around a string",
  cleanStr: "removes delimiters from a string",
  convertKeysToSymbols: "converts object keys to symbols",
  findAndReplaceInArray: "finds and replaces a value in an array",
  findNested: "finds arrays or objects in a string",
  fixQuotes: "replaces single quotes with double quotes in a string",
  getArrObjFromString: "extracts an array or objects from a string",
  getDirectivesFromString: "extracts directives from a string",
  getMatchBlock: "extracts a block of text between two delimiters",
  getMatchInBetween: "extracts a substring between two delimiters",
  removeQuotes: "removes quotes from a string",
  setExpString: "sets a regular expression string based on a given pattern",
  setLookUpExp: "sets a regular expression string for looking up a value in an object",
  startAndEndWith: "looks for a string that starts and ends with a given pattern",
  setWildCardString: "sets a wildcard at the beginning, end, or middle of a string",
  wildCardStringSearch: "searches for a string using wildcards",
  getObjectFromPath: "gets an object from a path (defaults to globalThis)",
}

```

You can see the src with github and explore the functions by using the "symbols explorer" from Github [here](https://github.com/knighttower/JsUtility/blob/development/src/powerHelper.js)



<br/>

## Description
Most functions here are extremely handy without the overhead of big libraries.  
However, for other most advance features it is recomended to also use other libraries, like if you need extensive use of Money, date, numbers functions (ex. money.js, moment.js, validate.js, lodash, v8n.js, jquery, moderndash, etc)


All functions are handy, but the most handy of all is **"emptyOrValue"** which helps to mitigate a lot of headaches when dealing with variables to know whether or not they have a value or even to set a default value when empty. From the powerHelper, there are a lot of regex and string functions that are very handy.
All Functions have also been Unit Tested and tests are in the source code if you want to experiment or see more examples.

<br/>
<br/>

## Usage

```javascript
// note: in some cases, you may need to use the full path to the file "/index" in order to import it
// All other modules can also be imported individually from the same path
import * as utility from '@knighttower/utility';
//and or
import * as powerHelper from '@knighttower/utility/powerHelpers';
// or
import { functionThatYouWantToUse, otherFunction } from '@knighttower/utility';
// or
import { emptyOrValue as yourCustomName } from '@knighttower/utility';
import { functionThatYouWantToUse } from 'https://esm.run/@knighttower/utility@latest/index.js';
```

Or even better, use it along with Vite and [Autoimport](https://github.com/unplugin/unplugin-auto-import) like:

```javascript
// In the vite config
import AutoImport from 'unplugin-auto-import/vite';

... plugins: [
        AutoImport({ imports: [ { '@knighttower/utility': [['*', 'utility']] }] }), // import * as utility
    ]

// and then in your code...

let something = utility.theFunctionYouWantToUse();
//ex: utility.emptyOrValue() // the bundler tree-shakes the functions you do not use
```

<br/>


## License

This project is licensed under the MIT License.

---

Checkout more cool stuff at https://knighttower.io/
