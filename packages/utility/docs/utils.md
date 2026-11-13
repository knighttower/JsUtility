#  Utility Library Documentation

This documentation provides a detailed description of the functions available in the  Utility Library, which is designed to facilitate common programming tasks such as data type conversions, formatting, and validation. Below you will find the method signatures, parameter descriptions, return types, and example usage for each function.

## Table of Contents
- [convertToBool](#convertToBool)
- [convertToNumber](#convertToNumber)
- [currencyToDecimal](#currencyToDecimal)
- [dateFormat](#dateFormat)
- [decimalToCurrency](#decimalToCurrency)
- [emptyOrValue](#emptyOrValue)
- [extend](#extend)
- [formatPhoneNumber](#formatPhoneNumber)
- [makeArray](#makeArray)
- [uuid](#uuid)
- [getDynamicId](#getDynamicId)
- [includes](#includes)
- [isEmpty](#isEmpty)
- [isNumber](#isNumber)
- [instanceOf](#instanceOf)
- [toCurrency](#toCurrency)
- [toDollarString](#toDollarString)
- [typeOf](#typeOf)
- [validateEmail](#validateEmail)
- [validatePhone](#validatePhone)

## convertToBool
### Description
Converts various data types (string, boolean, integer, or number) to a boolean value based on predefined rules.

- Strings are trimmed and compared without case: `'false'`, `'0'`, `'no'`, `'off'` and `''` (blank) are `false`, **every other string is `true`**.
- Any other value uses `Boolean(val)` (so `0` is `false`, `1` is `true`).

### Syntax
```javascript
function convertToBool(val)
```

### Parameters
- `val` (`String|Boolean|Int|Number`) - The value to be converted to boolean.

### Return Type
- `Boolean` - The boolean result of the conversion.

### Example
```javascript
console.log(convertToBool('true'));  // true
console.log(convertToBool('0'));     // false
console.log(convertToBool(1));       // true
console.log(convertToBool(''));      // false
console.log(convertToBool('yes'));   // true
console.log(convertToBool(' OFF ')); // false
console.log(convertToBool('hello')); // true
```

## convertToNumber
### Description
Attempts to convert a given variable (string or number) to a number. If conversion is not possible, returns the original variable.

### Syntax
```javascript
function convertToNumber(input)
```

### Parameters
- `input` (`string|number`) - The input variable to convert.

### Return Type
- `string|number` - The converted number or the original variable, if conversion is not possible.

### Example
```javascript
console.log(convertToNumber("123.45"));  // 123.45 (number)
console.log(convertToNumber("abc"));     // "abc" (original string)
```

## currencyToDecimal
### Description
Converts a string representing a dollar amount to a decimal number by removing any non-numeric characters. A number is returned as it is.

### Syntax
```javascript
function currencyToDecimal(amount)
```

### Parameters
- `amount` (`String|Number`) - The dollar amount to convert.

### Return Type
- `number` - The numeric value of the dollar amount.

### Example
```javascript
console.log(currencyToDecimal('$123.45'));  // 123.45
console.log(currencyToDecimal(123.45));     // 123.45
```

## dateFormat
### Description
Formats a date string, timestamp or `Date` object into the standard US date format (`MM/DD/YYYY`), optionally including time (`HH:MM AM/PM`).

Time zones:
- A string **without** a time zone (`'2201-01-01 16:15'`) is shown exactly as written, on any machine.
- Absolute moments (`Date` objects, timestamps, strings with a zone such as `Z`, `+02:00` or `GMT`) are shown in **UTC**.

### Syntax
```javascript
function dateFormat(dateTime, wTime)
```

### Parameters
- `dateTime` (`String|Number|Date`) - The date-time string, timestamp in milliseconds, or `Date` object to format.
- `wTime` (`Boolean`) - If true, includes the time in the output.

### Return Type
- `string|null` - The formatted date, or `null` when the date is missing or invalid. `0` is a valid timestamp.

### Example
```javascript
console.log(dateFormat('2201-01-01 16:15', true));          // 01/01/2201 @ 04:15 PM
console.log(dateFormat('2201-01-01'));                      // 01/01/2201
console.log(dateFormat('2201-01-01T16:15:00Z', true));      // 01/01/2201 @ 04:15 PM
console.log(dateFormat('2201-01-01T16:15:00+02:00', true)); // 01/01/2201 @ 02:15 PM (UTC)
console.log(dateFormat(0));                                 // 01/01/1970
console.log(dateFormat('not a date'));                      // null
```

## decimalToCurrency
### Description
Formats a numeric value into a string representing a dollar amount, always with exactly two decimal places.

### Syntax
```javascript
function decimalToCurrency(amount)
```

### Parameters
- `amount` (`String|Number`) - The numeric amount to format.

### Return Type
- `string|undefined` - The formatted dollar amount, or `undefined` when the amount is not a number.

### Example
```javascript
console.log(decimalToCurrency(2123.46));  // 2,123.46
console.log(decimalToCurrency('1234.5')); // 1,234.50
console.log(decimalToCurrency(0));        // 0.00
console.log(decimalToCurrency('abc'));    // undefined
```

## emptyOrValue
### Description
Checks if a value is "empty" (e.g., an empty string, array, object, or null). Returns the value if not empty, or a default value otherwise. It uses the same rules as [isEmpty](#isEmpty), so numbers (`0` included) and booleans (`false` included) are always returned as values.

### Syntax
```javascript
function emptyOrValue(value, _default)
```

### Parameters
- `value` (`String|Number`) - The value to check.
- `_default` (`String|Number`) - The default value to return if the original value is considered empty. Default is `null`.

### Return Type
- `mixed` - Either the original value if not empty, or the default value.

### Example
```javascript
console.log(emptyOrValue('', 'default'));  // 'default'
console.log(emptyOrValue('test'));         // 'test'
console.log(emptyOrValue([], 'default'));  // 'default'
console.log(emptyOrValue(0, 'default'));   // 0
console.log(emptyOrValue(false, 'default')); // false
```

## extend
### Description
Deep merges two or more objects into a **new** object. Nested plain objects are merged, arrays and other values are overwritten.

- Neither the target nor the sources are modified. Values that are not merged are copied by reference.
- `__proto__` keys are ignored, so merging parsed JSON cannot change the prototype of the result.
- String sources are skipped (they would otherwise be spread one character per key).

### Syntax
```javascript
const extend = (target, ...sources) => {}
```

### Return Type
- `object` - The merged object.

### Example
```javascript
const a = { x: { y: 1 } };
const result = extend(a, { x: { z: 2 } });
console.log(result); // { x: { y: 1, z: 2 } }
console.log(a);      // { x: { y: 1 } } (unchanged)
```

## formatPhoneNumber
### Description
Formats a given phone number string according to a specified template.

### Syntax
```javascript
function formatPhoneNumber(phoneNumber, template)
```

### Parameters
- `phoneNumber` (`string`) - The phone number to format.
- `template` (`string`) - The template to use for formatting, where `0` represents a digit placeholder.

### Return Type
- `string` - The formatted phone number.

### Example
```javascript
console.log(formatPhoneNumber('1234567890', '(000) 000-0000'));  // (123) 456-7890
```

## makeArray
### Description
Ensures that the provided item is an array. If the item is not an array, it is wrapped into an array.

### Syntax
```javascript
const makeArray = (item) => (Array.isArray(item) ? item : [item]);
```

### Parameters
- `item` (`String|Array`) - The item to ensure is an array.

### Return Type
- `array` - The item as an array.

### Example
```javascript
console.log(makeArray('test'));  // ['test']
```

## uuid
### Description
Generates a random alphanumeric string. It is **not** an RFC UUID and must not be used for security purposes. Alias: `uniqueId`.

### Syntax
```javascript
const uuid = (max = 20) => {}
```

### Parameters
- `max` (`Number`) - Length of the string. Defaults to 20, and to 40 when `0` or any other falsy value is passed.

### Return Type
- `string` - The random string.

### Example
```javascript
console.log(uuid().length);   // 20
console.log(uuid(8).length);  // 8
```

## getDynamicId
### Description
Generates a unique identifier from a random 8-character string and the current timestamp, in the format `id__xxxxxxxx__timestamp`. Aliases: `getRandomId`, `dynamicId`, `randomId`.

### Syntax
```javascript
function getDynamicId()
```

### Parameters
- None

### Return Type
- `string` - The generated unique identifier.

### Example
```javascript
console.log(getDynamicId());  // id__k3j9x2ab__1615961863463
```

## includes
### Description
Checks recursively if a value is present in a collection (array, string, object, `Map` or `Set`). String comparisons are case-insensitive.

### Syntax
```javascript
function includes(collection, value, fromIndex)
```

### Parameters
- `collection` (`collection`) - The collection to search within.
- `value` (`value`) - The value to search for.
- `fromIndex` (`fromIndex`) - The index to start searching from. Default is 0. Applies to strings, numbers and the first level of an array.

### Return Type
- `boolean` - True if the value is found in the collection, false otherwise. Values that cannot be searched (functions, symbols) return false.

### Example
```javascript
console.log(includes([1, 2, 3], 2));                          // true
console.log(includes([1, 2, 3], 1, 1));                       // false (search starts at index 1)
console.log(includes({ a: { b: 'Hello' } }, 'hello'));        // true
console.log(includes(new Map([['key', 'Uno']]), 'uno'));      // true
console.log(includes(new Set([[1, 'x']]), 'x'));              // true
```

## isEmpty
### Description
Determines if the provided value is empty. Different types are checked differently, e.g., strings and arrays must be empty, objects must have no keys, maps and sets must have no entries, etc.
Numbers (`0` included), booleans, functions and value objects (`Date`, `RegExp`, `Error`) are **never** empty.

### Syntax
```javascript
function isEmpty(value)
```

### Parameters
- `value` (`string|array|object|map|set|number|boolean`) - The value to check.

### Return Type
- `boolean` - True if the value is considered empty, false otherwise.

### Example
```javascript
console.log(isEmpty([]));          // true
console.log(isEmpty({}));          // true
console.log(isEmpty(new Map()));   // true
console.log(isEmpty(0));           // false
console.log(isEmpty(new Date()));  // false
```

## isNumber
### Description
Checks if a value is a number or a numeric string. Returns the value as a number, or `null` if it is not one. Blank strings and any type other than number/string (booleans, objects...) return `null`.

> **Note:** `isNumber(0)` returns `0`, which is falsy. Compare the result against `null` instead of using it as a boolean.

### Syntax
```javascript
function isNumber(value)
```

### Parameters
- `value` (`String|Number`) - The value to check.

### Return Type
- `null|number` - The numeric value if the input is a number or can be converted to one, otherwise null.

### Example
```javascript
console.log(isNumber("123"));     // 123
console.log(isNumber("123.45"));  // 123.45
console.log(isNumber("abc"));     // null
console.log(isNumber("123abc"));  // null
console.log(isNumber(" "));       // null
console.log(isNumber(true));      // null
console.log(isNumber(0) !== null); // true
```

## instanceOf
### Description
Determines if the provided input is an instance of a specified type or matches a provided type description.

### Syntax
```javascript
function instanceOf(input, test)
```

### Parameters
- `input` (`any`) - The variable to check. Only objects and functions are checked, anything else returns `false`.
- `test` (`string|class`) - The type to compare against, as a name (`'date'`, case-insensitive) or as the class itself (`Date`, `MyClass`).

### Return Type
- `string|boolean` - The built-in type name (`'Date'`, `'RegExp'`, `'Promise'`, `'Map'`, `'Set'`, `'WeakMap'`, `'WeakSet'`, `'ArrayBuffer'`, `'DataView'` or `'unknown'`) if no test is provided, or a boolean indicating if the input matches the test.
- Custom types: instances are matched by their class name, functions and classes by their own name.

### Example
```javascript
console.log(instanceOf(new Date()));                  // 'Date'
console.log(instanceOf(new Date(), 'date'));          // true
console.log(instanceOf(new MyClass(), MyClass));      // true
console.log(instanceOf(new MyClass(), 'myclass'));    // true
console.log(instanceOf(function hello() {}, 'hello')); // true
console.log(instanceOf(123, 'number'));               // false (not an object)
```

## toCurrency
### Description
Alias for `decimalToCurrency`. Formats a numeric value into a string representing a dollar amount.

### Syntax
```javascript
function toCurrency(amount)
```

### Parameters
- `amount` (`String|Number`) - The amount to format.

### Return Type
- `string|undefined` - The formatted dollar amount (see [decimalToCurrency](#decimalToCurrency)).

### Example
```javascript
console.log(toCurrency(123.45));  // '123.45'
```

## toDollarString
### Description
Converts large numeric values into a shorter string representation using "K" for thousands and "M" for millions (one decimal at most). Currency strings like `'$2,000'` are accepted. Anything that rounds up to 1000K (999,950 and above) is shown as millions.

### Syntax
```javascript
function toDollarString(amount)
```

### Parameters
- `amount` (`String|Number`) - The amount to convert.

### Return Type
- `string|number` - The short string (`'2K'`, `'2.5M'`), or the number itself when it is 999 or less.

### Example
```javascript
console.log(toDollarString(2000));          // '2K'
console.log(toDollarString('$2,000,000'));  // '2M'
console.log(toDollarString(2500000));       // '2.5M'
console.log(toDollarString(999950));        // '1M'
console.log(toDollarString(-2500));         // '-2.5K'
console.log(toDollarString(500));           // 500
```

## typeOf
### Description
Determines the type of a given input and optionally checks if it matches a specified type.

### Syntax
```javascript
function typeOf(input, test)
```

### Parameters
- `input` (`any`) - The variable to check.
- `test` (`string`) - An optional type to check against. Several types can be piped (`'number|string'`).

### Return Type
- `string|boolean` - The type of the variable (the native `typeof`, except `'null'` for `null` and `'array'` for arrays), or, when a test is given, a boolean for a single type / the matched type for piped types.

### Example
```javascript
console.log(typeOf('hello'));                 // 'string'
console.log(typeOf('hello', 'string'));       // true
console.log(typeOf([]));                      // 'array'
console.log(typeOf(null));                    // 'null'
console.log(typeOf(null, 'null|string'));     // 'null'
console.log(typeOf(123, 'number|int'));       // 'number'
```

## validateEmail
### Description
Validates an email address based on a specific regular expression pattern: a name (letters, numbers, `.`, `_`, `+`, `-`), `@`, one or more domain labels (no empty label, no leading or trailing hyphen) and a top-level domain of 2 or more letters (`.com`, `.online`...).

### Syntax
```javascript
function validateEmail(email)
```

### Parameters
- `email` (`String`) - The email address to validate.

### Return Type
- `Boolean` - True if the email is valid, false otherwise.

### Example
```javascript
console.log(validateEmail('test@test.com'));  // true
console.log(validateEmail('test@test'));      // false
console.log(validateEmail('test+tag@test.online')); // true
console.log(validateEmail('test@test..com')); // false
```

## validatePhone
### Description
Validates a 10-digit phone number. Groups can be separated by a space or a hyphen, and the area code is either fully wrapped in parentheses or not at all.

### Syntax
```javascript
function validatePhone(phone)
```

### Parameters
- `phone` (`String`) - The phone number to validate.

### Return Type
- `Boolean` - True if the phone number is valid, false otherwise.

### Example
```javascript
console.log(validatePhone('1234567890'));      // true
console.log(validatePhone('123 456 7890'));    // true
console.log(validatePhone('(123) 456-7890'));  // true
console.log(validatePhone('(123 456-7890'));   // false (unmatched parenthesis)
console.log(validatePhone('123-4567-89'));     // false
```

This comprehensive documentation should assist developers in effectively utilizing the  Utility Library to enhance their projects with reliable, commonly needed functionalities.
