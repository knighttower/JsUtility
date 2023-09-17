# JS Utility Library Documentation

## Overview

**Utility** is a utility library that provides a collection of utility functions for various tasks. The library is designed to be easy to use and covers the most common use cases.

Most functions here are extremely handy without the overhead of big libraries. However, for other most advance features it is recomended to also use other libraries, like if you need extensive use of Money, date, numbers functions (ex. money.js, moment.js, jquery, etc)

It also Uses some features from other KnightTower packages:

-   [JsObjectProxyHelper](https://github.com/knighttower/JsObjectProxyHelper)
-   [JsUrlHelper](https://github.com/knighttower/JsUrlHelper)
-   [JsPowerHelperFunctions](https://github.com/knighttower/JsPowerHelperFunctions)

All functions are handy, but the most handy of all is **"emptyOrValue"** which helps to mitigate a lot of headaches when dealing with variables to know whether or not they have a value or even to set a default value when empty.

## List of functions

```javascript
{
    getGoogleMapsAddress, // helps to build a google map address lookup
        openGoogleMapsAddress, // opens the address in google maps
        formatPhoneNumber, // format phone numbers
        validatePhone, // validate phone #
        validateEmail, // validate email
        getDynamicId, // get a quick unique string to use as id
        getRandomId, // alias
        dateFormat, // format from unix or raw into US
        currencyToDecimal,
        decimalToCurrency,
        toCurrency,
        toDollarString,
        emptyOrValue, // checks any variable value, string, number, object, array if it is empty
        isNumber,
        logThis, // get to log from places where the console.log does not log
        proxyObject, // see proxy helper
        convertToBool, // convert any value to boolean
        urlHelper, // see url helper
        // from Lodash used internally but might as well make them available
        every,
        includes,
        isUndefined,
        // from JsPowerHelperFunctions
        getDirectivesFromString,
        findAndReplaceInArray,
        getMatchInBetween,
        getMatchBlock,
        cleanStr,
        setExpString,
        setLookUpExp,
        removeQuotes,
        fixQuotes,
        addQuotes;
}
```

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
<script src="https://cdn.jsdelivr.net/npm/@knighttower/js-utility-functions@latest/dist/Utility.min.js"></script>
```

## Usage

```javascript
import Utility from '@knighttower/js-utility-functions';
// or
import { functionThatYouWantToUse, otherFunction } from '@knighttower/js-utility-functions';
// or
import { Utility as yourCustomName } from '@knighttower/js-utility-functions';
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
