# JS Utility Library Documentation

## Overview

**Utility** Tiny collection of mighty utility functions with extended functionality for common cases (only 4k gzip and ESM). It was created to address the need of repetive need of some very common functions without the need of loading entire libraries for just a few functions while providing extra functionality:  
Ex: emptyOrValue(value) or emptyOrValue(value, default) checks if the value is empty or undefined and returns the value or a default value if empty. Very helpful when dealing with variables that may or may not have a value.  
Ex: typeOf(value) or typeOf(value, 'string') or typeOf(value, 'string|number') checks the type of a value and can also return comparisons (can take piped).
Ex: convertToBool(value) converts a value to a boolean, accepts int, string and boolean. Typical Js Boolean() only accepts strings and booleans but not 'true', 'false' as string
<br/>

**PowerHelper** was designed to work for other specific libraries, but the fucntions for regex and string manipulation were actually so good to use in other projects that it was decided to share as well here.  
<br/>

Most functions here are extremely handy without the overhead of big libraries.  
However, for other most advance features it is recomended to also use other libraries, like if you need extensive use of Money, date, numbers functions (ex. money.js, moment.js, validate.js, lodash, v8n.js, jquery, moderndash, etc)

It also Uses some features from other KnightTower packages:

-   [JsObjectProxyHelper](https://github.com/knighttower/JsObjectProxyHelper)
-   [JsUrlHelper](https://github.com/knighttower/JsUrlHelper)
-   [JsDomObserver](https://github.com/knighttower/JsDomObserver)
-   <strike>[JsPowerHelperFunctions](https://github.com/knighttower/JsPowerHelperFunctions)</strike> (deprecated) (it has now been merged into this library but still will be available as a standalone library)

All functions are handy, but the most handy of all is **"emptyOrValue"** which helps to mitigate a lot of headaches when dealing with variables to know whether or not they have a value or even to set a default value when empty. From the PowerHelpers, there are a lot of regex and string functions that are very handy.
All Functions have also been Unit Tested and tests are in the source code if you want to experiment or see more examples.

[![release version](https://github.com/knighttower/JsUtility/actions/workflows/pre-release.yml/badge.svg)](https://github.com/knighttower/JsUtility/actions/workflows/pre-release.yml)
[![NPM published](https://github.com/knighttower/JsUtility/actions/workflows/to-npm.yml/badge.svg)](https://github.com/knighttower/JsUtility/actions/workflows/to-npm.yml)

## List of functions included in Utility

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
  proxyObject: "creates a proxy object that allows for intercepting and modifying property access, set private and protected properties",
  selectElement: "selects a DOM element by ID or class name, or Xpath. Return xpath, if in DOM or promise if not found",
  toCurrency: "formats a number to a currency string",
  toDollarString: "formats a number to a dollar string",
  typeOf: "gets the type of a value and can also return simple comparisons. For more advanced type-checking, use the 'typeCheck' library https://github.com/knighttower/JsTypeCheck",
  instanceOf: "gets the instance of a value and can also return simple comparisons",
  validateEmail: "validates an email address string to ensure it is in a valid format",
  validatePhone: "validates a phone number string to ensure it is in a valid format"
}

```

You can see the src with github and explore the functions by using the "symbols explorer" from Github [here](https://github.com/knighttower/JsUtility/blob/development/src/Utility.js)

# List of functions included in PowerHelpers

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
}

```

You can see the src with github and explore the functions by using the "symbols explorer" from Github [here](https://github.com/knighttower/JsUtility/blob/development/src/PowerHelpers.js)

## Installation

The library is standalone (via browser script tag, loads the whole library) or modular, either the entire object or only a few functions since it is completely modular.

```javascript
npm i @knighttower/js-utility-functions
```

```javascript
yarn add @knighttower/js-utility-functions
```

## In the browser

It loads as a 'window' object --> window.Utility

```html
<script src="https://cdn.jsdelivr.net/npm/@knighttower/js-utility-functions@latest/dist/browser/Utility.min.js"></script>
// in addition, you can also load other libraries
<script src="https://cdn.jsdelivr.net/npm/@knighttower/js-utility-functions@latest/dist/browser/PowerHelpers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@knighttower/js-utility-functions@latest/dist/browser/DomObserver.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@knighttower/js-utility-functions@latest/dist/browser/UrlHelper.min.js"></script>
//or ESM
<script src="https://esm.run/@knighttower/js-utility-functions@latest/index.mjs"></script>
```

| File                | Size     |
| ------------------- | -------- |
| /PowerHelpers.js    | 10.5 KiB |
| /PowerHelpers.js.br | 3.49 KiB |
| /PowerHelpers.js.gz | 3.78 KiB |
| /Utility.js         | 8.54 KiB |
| /Utility.js.br      | 3.13 KiB |
| /Utility.js.gz      | 3.46 KiB |

<br/>

## Usage

```javascript
// note: in some cases, you may need to use the full path to the file "/index" in order to import it
// All other modules can also be imported individually from the same path
import Utility from '@knighttower/js-utility-functions';
//and or
import PowerHelpers from '@knighttower/js-utility-functions';
// or
import { functionThatYouWantToUse, otherFunction } from '@knighttower/js-utility-functions';
// or
import { Utility as yourCustomName } from '@knighttower/js-utility-functions';
import { functionThatYouWantToUse } from 'https://cdn.jsdelivr.net/npm/@knighttower/js-utility-functions@latest/index.mjs';
```

Or even better, use it along with Vite and [Autoimport](https://github.com/unplugin/unplugin-auto-import) like:

```javascript
// In the vite config
import AutoImport from 'unplugin-auto-import/vite';

... plugins: [
        AutoImport({ imports: [ { '@knighttower/js-utility-functions': ['Utility'] }] }),
    ]

// and then in your code...

let something = Utility.theFunctionYouWantToUse();
//ex: Utility.emptyOrValue() // Autoimport will only import the 'emptyOrValue' module automatically
```

<br/>

## Methods

### Note:

Some of these docs are outdated. Please look via the built in Github Symbol explorer for a better experience and understanding of the functions.

[PowerHelpers](https://github.com/knighttower/JsUtility/blob/development/src/PowerHelpers.js)  
[Utility](https://github.com/knighttower/JsUtility/blob/development/src/Utility.js)
[DomObserver](https://github.com/knighttower/JsUtility/blob/development/src/DomObserver.js)
[UrlHelper](https://github.com/knighttower/JsUtility/blob/development/src/UrlHelper.js)
[ProxyHelper](https://github.com/knighttower/JsUtility/blob/development/src/ProxyHelper.js)
[ElementHelper](https://github.com/knighttower/JsUtility/blob/development/src/ElementHelper.js)
// NodeHelpers are not yet documented nor included with the above pkg cause it is node only files, but it can be imported from @knighttower/js-utility-functions/node/index.mjs (NodeHelpers)
[NodeHelpers](https://github.com/knighttower/JsUtility/blob/development/node/NodeHelpers.js)

<br/>

## getGoogleMapsAddress

### Parameters

-   `address` (String|Object): The address information either as a string or as an object with properties like `address`, `zip`, `city`, `state`, etc.

### Return value

-   `string`: A string containing the Google Maps URL generated from the given address.

### Example or Usage

```javascript
/**
 * Form a valid Google search address
 * @function getGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} address
 * @return string
 * @example getGoogleMapsAddress('New York') // 'https://maps.google.it/maps?q=New+York'
 * @example getGoogleMapsAddress({ address: 'New York', zip: '10001' }) // 'https://maps.google.it/maps?q=New+York+10001'
 * @example getGoogleMapsAddress({ address: 'New York', city: 'New York', state: 'NY' }) // 'https://maps.google.it/maps?q=New+York+New+York+NY'
 */
getGoogleMapsAddress('New York'); // 'https://maps.google.it/maps?q=New+York'
getGoogleMapsAddress({ address: 'New York', zip: '10001' }); // 'https://maps.google.it/maps?q=New+York+10001'
getGoogleMapsAddress({ address: 'New York', city: 'NY', state: 'New York' }); // 'https://maps.google.it/maps?q=New+York+NY+New+York'
```

---

## openGoogleMapsAddress

### Parameters

-   `object` (String|Object): The address information either as a string or as an object.

### Return value

-   `void`

### Throws

-   Error: If the address is invalid or not a string/object.

### Example or Usage

```javascript
/**
 * Open a Google Map using a provided address
 * @function openGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} object - Address information either as a string or as an object
 * @throws {Error} Throws an error if the address is invalid or if it's not a string or object.
 * @return {void}
 * @example openGoogleMapsAddress('New York'); // Opens Google Maps with the address 'New York'
 * @example openGoogleMapsAddress({ address: 'New York', zip: '10001' }); // Opens Google Maps with the address 'New York 10001'
 */
openGoogleMapsAddress('New York'); // Opens Google Maps with the address 'New York'
openGoogleMapsAddress({ address: 'New York', zip: '10001' }); // Opens Google Maps with the address 'New York 10001'
```

---

## formatPhoneNumber

### Parameters

-   `phoneNumber` (string): The phone number to format.
-   `template` (string): The template to use for formatting.

### Return value

-   `string`: The formatted phone number.

### Example or Usage

```javascript
/**
 * Format a phone number based on a given template.
 * @param {string} phoneNumber - The phone number to format.
 * @param {string} template - The template to use for formatting.
 * @returns {string} - The formatted phone number.
 * @example console.log(formatPhoneNumber('1234567890', '(000) 000-0000')); // Output: (123) 456-7890
 * @example console.log(formatPhoneNumber('1234567890', '000-000-0000')); // Output: 123-456-7890
 * @example console.log(formatPhoneNumber('123-456-7890', '(000) 000-0000')); // Output: (123) 456-7890
 * @example console.log(formatPhoneNumber('(123) 456-7890', '000-0000-0000')); // Output: 123-4567-890
 */
formatPhoneNumber('1234567890', '(000) 000-0000'); // Output: (123) 456-7890
formatPhoneNumber('9876543210', '000-000-0000'); // Output: 987-654-3210
```

---

## validatePhone

### Parameters

-   `phone` (string): The phone number to validate.

### Return value

-   `boolean`: Returns `true` if phone number is valid, otherwise `false`.

### Example or Usage

```javascript
/**
 * Validate a phone number
 * @function validatePhone
 * @memberof Utility
 * @param {String} phone
 * @return void|Toast
 * @example validatePhone('1234567890') // true
 * @example validatePhone('(123) 456-7890') // true
 * @example validatePhone('123-456-7890') // true
 * @example validatePhone('123 456 7890') // false
 * @example validatePhone('123-4567-89') // false
 */
validatePhone('1234567890'); // true
validatePhone('(123) 456-7890'); // true
```

---

## validateEmail

### Parameters

-   `email` (string): The email to validate.

### Return value

-   `boolean`: Returns `true` if email is valid, otherwise `false`.

### Example or Usage

```javascript
/**
 * Validate emails
 * @function validateEmail
 * @memberof Utility
 * @param {String} email
 * @return Boolean
 * @example validateEmail('<EMAIL>') // false
 * @example validateEmail('test@test') // false
 * @example validateEmail('test@test.') // false
 * @example validateEmail('test@test.c') // false
 * @example validateEmail('test@test.com') // true
 */
validateEmail('test@test.com'); // true
validateEmail('invalid-email'); // false
```

---

## getDynamicId

### Parameters

-   None

### Return value

-   `string`: A unique id in the format `kn__000000__000`.

### Example or Usage

```javascript
getDynamicId(); // kn__000000__000
```

---

## getRandomId

### Parameters

-   None

### Return value

-   `string`: A unique id.

### Example or Usage

```javascript
getRandomId(); // kn__000000__000
```

---

## dateFormat

### Parameters

-   `dateTime` (string): Raw date-time format.
-   `wTime` (boolean): If set, returns date with time as H:MM A.

### Return value

-   `string`: Formatted date.

### Example or Usage

```javascript
/**
 * Format dates to standard US, with or w/out time
 * @function dateFormat
 * @memberof Utility
 * @param {String} dateTime Raw format 2201-01-01 16:15PM or unix or object
 * @param {Boolean} wTime If set, returns date with time as H:MM A
 * @return string
 * @example dateFormat('2201-01-01 16:15PM') // 01/01/2201
 * @example dateFormat('2201-01-01 16:15PM', true) // 01/01/2201 @ 4:15 PM
 * @example dateFormat('2201-01-01 16:15PM', false) // 01/01/2201
 * @example dateFormat('2201-01-01') // 01/01/2201
 */
dateFormat('2201-01-01 16:15PM', true); // 01/01/2201 @ 4:15 PM
dateFormat('2201-01-01 16:15PM', false); // 01/01/2201
```

---

## currencyToDecimal

### Parameters

-   `amount` (String|Number): The amount in currency format.

### Return value

-   `number`: The amount in decimal format.

### Example or Usage

```javascript
currencyToDecimal('$123.45'); // 123.45
currencyToDecimal('€100.00'); // 100
```

---

## decimalToCurrency

### Parameters

-   `amount` (String|Number): The amount in decimal format.

### Return value

-   `number`: The amount in currency format.

### Example or Usage

```javascript
decimalToCurrency(123.45); // 123.45
decimalToCurrency(100); // 100.00
```

---

## toCurrency

### Parameters

-   `amount` (String|Number): The amount to format.

### Return value

-   `number`: The formatted amount.

### Example or Usage

```javascript
toCurrency(123.45); // 123.45
toCurrency(100); // 100.00
```

---

## toDollarString

### Parameters

-   `amount` (String|Number): The amount to format.

### Return value

-   `number`: The formatted amount as a string.

### Example or Usage

```javascript
toDollarString(2000); // 2K
toDollarString(2000000); // 2M
```

---

## emptyOrValue

### Parameters

-   `value` (String|Number|Array|Object|Boolean): The value to test.
-   `_default` (String|Number|Array|Object|Boolean): The default value to return if `value` is empty.

### Return value

-   `mixed`: Returns the value if not empty, otherwise returns null or the default value.

### Example or Usage

```javascript
/**
 * Check if there is a value, if not return null or the default value
 * It can test strings, arrays, objects, numbers, booleans
 * @function emptyOrValue
 * @memberof Utility
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
emptyOrValue('test', 'default'); // 'test'
emptyOrValue('', 'default'); // 'default'
```

---

## isNumber

### Parameters

-   `value` (String|Number): The value to test.

### Return value

-   `bool|int`: Returns `true` if value is a number, otherwise returns `false`.

### Example or Usage

```javascript
isNumber(123); // true
isNumber('abc'); // false
```

---

## logThis

### Parameters

-   `obj` (Object): The object to log.

### Return value

-   `void`

### Example or Usage

```javascript
logThis('test'); // Logs 'test' to the console
logThis({ key: 'value' }); // Logs { key: 'value' } to the console
```

-   `number`: The amount in decimal format.

---

### see the full docs in the docs folder or https://github.com/knighttower/JsUtility/tree/development/docs/Utility.js.html

## Dependencies

-   Lodash: for utility functions
-   JsObjectProxyHelper: for proxying objects
-   JsUrlHelper: for URL handling

## License

This project is licensed under the MIT License.

---

Checkout more cool stuff at https://knighttower.io/
