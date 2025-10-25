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
<script src="https://cdn.jsdelivr.net/npm/@knighttower/utility@VERSION_NUMBER/dist/browser/LIBRARY_NAME.min.js"></script>
<script type="module" src="https://esm.run/@knighttower/utility@VERSION_NUMBER/index.mjs"></script>
```

---

## Imports

- **Full library:**  
  ```javascript
  import utility from '@knighttower/utility';
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
  ```

---

#### 4. `dateFormat(dateTime, wTime)`

Formats dates to **MM/DD/YYYY** with optional time.

- **Params:**  
  `dateTime: String` - Date string.  
  `wTime: Boolean` - Whether to include time.
- **Returns:**  
  `String | Null` - Formatted date or null if invalid.
- **Usage:**
  ```javascript
  dateFormat('2201-01-01 16:15PM', true);  // "01/01/2201 @ 4:15 PM"
  ```

---

#### 5. `decimalToCurrency(amount)`

Converts a decimal number to a formatted currency string.

- **Params:**  
  `amount: String | Number`
- **Returns:**  
  `String` - Formatted currency.
- **Usage:**
  ```javascript
  decimalToCurrency(1234.56);  // "1,234.56"
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
  isEmpty([]);  // true
  isEmpty({});  // true
  ```

---

### **Identifiers and Randomization**

#### 9. `uuid(max)`

Generates a unique string.

- **Params:**  
  `max: Number` - Maximum length (default: 20).
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
  validateEmail('test@example.com');  // true
  validateEmail('test@com');          // false
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
  ```

---

### **Object Utilities**

#### 13. `extend(target, ...sources)`

Deep merges objects.

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

### **Address Helpers**

#### 15. `getGoogleMapsAddress(address)`

Generates a Google Maps URL from an address.

- **Params:**  
  `address: String | Object`
- **Returns:**  
  `String`
- **Usage:**
  ```javascript
  getGoogleMapsAddress('New York');  // "https://maps.google.it/maps?q=New+York"
  ```

#### 16. `openGoogleMapsAddress(object)`

Opens Google Maps in a new tab.

- **Params:**  
  `object: String | Object` - Address.
- **Usage:**
  ```javascript
  openGoogleMapsAddress('New York');
  ```

---

### **Additional Methods**

- **Type Check:**  
  `typeOf(input, test)` - Returns type of input.  
  `instanceOf(input, test)` - Returns class instance of input.
- **Recursive Check:**  
  `includes(collection, value, fromIndex)` - Recursively checks if a collection includes a value.
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
    powerHelper,
    doAsync,
    doPoll,
    doTimeout,
    promisePool,
    promiseQueue,
    promises,
    proxyClass,
    proxyObject,
    urlHelper,
    convertToBool,
    convertToNumber,
    currencyToDecimal,
    dateFormat,
    decimalToCurrency,
    emptyOrValue,
    formatPhoneNumber,
    getDynamicId,
    getGoogleMapsAddress,
    getRandomId,
    includes,
    instanceOf,
    isEmpty,
    isNumber,
    makeArray,
    openGoogleMapsAddress,
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
- `@knighttower/utility/powerHelpers` (default export)
- `@knighttower/utility/promises` (default export)
- `@knighttower/utility/EventBus` (default export)
- `@knighttower/utility/event-bus` (default export)
```
<br/> 

## In the browser

Each library can be loaded individually or all at once. The library is also available via CDN.

see browser examples here: https://github.com/knighttower/JsUtility/blob/development/packages/utility/tests/index.html


see all available in the CDN here --> https://cdn.jsdelivr.net/npm/@knighttower/utility/dist/browser/  

```html
<script src="https://cdn.jsdelivr.net/npm/@knighttower/utility@VERSION_NUMBER/dist/browser/LIBRARY_NAME.min.js"></script>
//or ESM
<script src="https://esm.run/@knighttower/utility@VERSION_NUMBER/index.mjs"></script>
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
  getGoogleMapsAddress: "gets a formatted address string for a location using the Google Maps API",
  formatPhoneNumber: "formats a phone number string to a standardized format",
  getDynamicId: "generates a unique ID string based on a prefix, timestamp and a random number",
  getRandomId: "generates a random ID string",
  includes: "checks if a collection (object|string|array) includes a given value",
  isNumber: "checks if a given value is a number (that includes string numbers and floats)",
  isEmpty: "checks if a given value is empty, checks arrays, objects, etc",
  logThis: "logs a message to the console with a specified prefix",
  openGoogleMapsAddress: "opens Google Maps in a new tab with a specified address",
  toCurrency: "formats a number to a currency string",
  toDollarString: "formats a number to a dollar string",
  typeOf: "gets the type of a value and can also return simple comparisons. For more advanced type-checking, use the 'typeCheck' library https://github.com/knighttower/JsTypeCheck",
  instanceOf: "gets the instance of a value and can also return simple comparisons",
  validateEmail: "validates an email address string to ensure it is in a valid format",
  validatePhone: "validates a phone number string to ensure it is in a valid format"
  makeArray: "converts a value to an array, if it is not already an array"
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
  wildCardStringSearch: "searches for a string using wildcards"
  getObjectFromPath: "gets an object from a path",
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
import utility from '@knighttower/utility';
//and or
import powerHelper from '@knighttower/utility';
// or
import { functionThatYouWantToUse, otherFunction } from '@knighttower/utility';
// or
import { utility as yourCustomName } from '@knighttower/utility';
import { functionThatYouWantToUse } from 'https://cdn.jsdelivr.net/npm/@knighttower/utility@latest/index.mjs';
```

Or even better, use it along with Vite and [Autoimport](https://github.com/unplugin/unplugin-auto-import) like:

```javascript
// In the vite config
import AutoImport from 'unplugin-auto-import/vite';

... plugins: [
        AutoImport({ imports: [ { '@knighttower/utility': ['utility'] }] }),
    ]

// and then in your code...

let something = utility.theFunctionYouWantToUse();
//ex: utility.emptyOrValue() // Autoimport will only import the 'emptyOrValue' module automatically
```

<br/>


## License

This project is licensed under the MIT License.

---

Checkout more cool stuff at https://knighttower.io/
