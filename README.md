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
        urlHelper, // see url helper
        // from Lodash used internally but might as well make them available
        isEmpty,
        isString,
        every,
        forEach,
        includes,
        isInteger,
        isBoolean,
        isUndefined,
        toNumber,
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
<script src=" https://cdn.jsdelivr.net/npm/@knighttower/js-utility-functions@latest/dist/Utility.min.js "></script>
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

### getGoogleMapsAddress(address: String | Object) -> String

Forms a Google Maps search URL based on the provided address.

**Parameters**

-   `address`: A string or an object containing various address fields like `address`, `address1`, `city`, `state`, `zip`, or `zipcode`.

**Return Value**

-   Returns a Google Maps search URL.

### openGoogleMapsAddress(object: String | Object) -> void | Error

Opens a Google Maps URL based on the provided address.

**Parameters**

-   `object`: A string or an object containing address fields.

**Return Value**

-   None. Opens the Google Maps URL or throws an error if the address is invalid.

### formatPhoneNumber(phoneNumber: String, template: String) -> String

Formats a phone number based on the provided template.

**Parameters**

-   `phoneNumber`: The phone number to format.
-   `template`: The template to use for formatting.

**Return Value**

-   Returns the formatted phone number.

### validatePhone(phone: String) -> Boolean

Validates a phone number.

**Parameters**

-   `phone`: The phone number to validate.

**Return Value**

-   Returns `true` if the phone number is valid, `false` otherwise.

### validateEmail(email: String) -> Boolean

Validates an email address.

**Parameters**

-   `email`: The email address to validate.

**Return Value**

-   Returns `true` if the email is valid, `false` otherwise.

### getDynamicId() -> String

Generates a unique ID in the format `kn__000000__000`.

**Return Value**

-   Returns the generated unique ID.

### getRandomId() -> String

Alias for `getDynamicId`.

### dateFormat(dateTime: String, wTime: Boolean) -> String

Formats a date to standard US format.

**Parameters**

-   `dateTime`: The raw date-time format or Unix timestamp.
-   `wTime`: If set to `true`, returns date with time as `H:MM A`.

**Return Value**

-   Returns the formatted date.

### currencyToDecimal(amount: String | Number) -> Number

Converts a currency string to a decimal number.

**Parameters**

-   `amount`: The currency amount to convert.

**Return Value**

-   Returns the converted decimal number.

### decimalToCurrency(amount: String | Number) -> Number

Converts a decimal number to currency format.

**Parameters**

-   `amount`: The decimal amount to convert.

**Return Value**

-   Returns the formatted currency.

### toCurrency(amount: String | Number) -> Number

Alias for `decimalToCurrency`.

### toDollarString(amount: String | Number) -> Number

Converts an amount to a dollar string.

**Parameters**

-   `amount`: The amount to convert.

**Return Value**

-   Returns the converted dollar string.

### emptyOrValue(value: String | Number, \_default: String | Number) -> Mixed

Checks if a value is empty and returns either the value or a default value.

**Parameters**

-   `value`: The value to check.
-   `default`: The default value to return if `value` is empty.

**Return Value**

-   Returns the value or default value.

### isNumber(value: String | Number) -> Boolean | Int

Checks if a value is a number or integer.

**Parameters**

-   `value`: The value to check.

**Return Value**

-   Returns the number or `false` if it is not a number.

### logThis(obj: Object) -> void

Logs an object to the console.

**Parameters**

-   `obj`: The object to log.

**Return Value**

-   None. Logs the object to the console.

### proxyObject(object: Object) -> Proxy

Creates a proxy object for the given object.

**Parameters**

-   `object`: The object to create a proxy for.

**Return Value**

-   Returns the proxy object.

## Examples

You can find usage examples for each method within the method descriptions.

## Dependencies

-   Lodash: for utility functions
-   JsObjectProxyHelper: for proxying objects
-   JsUrlHelper: for URL handling

## License

This project is licensed under the MIT License.

---

Checkout more cool stuff at https://knighttower.io/
