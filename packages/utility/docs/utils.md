#  Utility Library Documentation

This documentation provides a detailed description of the functions available in the  Utility Library, which is designed to facilitate common programming tasks such as data type conversions, formatting, and validation. Below you will find the method signatures, parameter descriptions, return types, and example usage for each function.

## Table of Contents
- [convertToBool](#convertToBool)
- [convertToNumber](#convertToNumber)
- [currencyToDecimal](#currencyToDecimal)
- [dateFormat](#dateFormat)
- [decimalToCurrency](#decimalToCurrency)
- [emptyOrValue](#emptyOrValue)
- [formatPhoneNumber](#formatPhoneNumber)
- [makeArray](#makeArray)
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
Converts a string representing a dollar amount to a decimal number by removing any non-numeric characters.

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
```

## dateFormat
### Description
Formats a date string or object into the standard US date format, optionally including time.

### Syntax
```javascript
function dateFormat(dateTime, wTime)
```

### Parameters
- `dateTime` (`String`) - The date-time string or object to format.
- `wTime` (`Boolean`) - If true, includes the time in the output.

### Return Type
- `string` - The formatted date.

### Example
```javascript
console.log(dateFormat('2201-01-01 16:15', true));  // 01/01/2201 @ 04:15 PM
```

## decimalToCurrency
### Description
Formats a numeric value into a string representing a dollar amount, ensuring two decimal places.

### Syntax
```javascript
function decimalToCurrency(amount)
```

### Parameters
- `amount` (`String|Number`) - The numeric amount to format.

### Return Type
- `string` - The formatted dollar amount.

### Example
```javascript
console.log(decimalToCurrency(2123.46));  // 2,123.46
```

## emptyOrValue
### Description
Checks if a value is "empty" (e.g., an empty string, array, object, or null). Returns the value if not empty, or a default value otherwise.

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
console.log(emptyOrValue('', '

default'));  // 'default'
console.log(emptyOrValue('test'));         // 'test'
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

## getDynamicId
### Description
Generates a unique identifier based on the current timestamp and a random number.

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
Checks if a value is present in a collection (array, string, or object).

### Syntax
```javascript
function includes(collection, value, fromIndex)
```

### Parameters
- `collection` (`collection`) - The collection to search within.
- `value` (`value`) - The value to search for.
- `fromIndex` (`fromIndex`) - The index to start searching from. Default is 0.

### Return Type
- `boolean` - True if the value is found in the collection, false otherwise.

### Example
```javascript
console.log(includes([1, 2, 3], 2));  // true
```

## isEmpty
### Description
Determines if the provided value is empty. Different types are checked differently, e.g., strings and arrays must be empty, objects must have no keys, etc.

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
console.log(isEmpty([]));  // true
console.log(isEmpty({}));  // true
```

## isNumber
### Description
Checks if a value is a number or can be converted to one. If not, returns null.

### Syntax
```javascript
function isNumber(value)
```

### Parameters
- `value` (`String|Number`) - The value to check.

### Return Type
- `null|int` - The numeric value if the input is a number or can be converted to one, otherwise null.

### Example
```javascript
console.log(isNumber("123"));  // 123
console.log(isNumber("abc"));  // null
```

## instanceOf
### Description
Determines if the provided input is an instance of a specified type or matches a provided type description.

### Syntax
```javascript
function instanceOf(input, test)
```

### Parameters
- `input` (`any`) - The variable to check.
- `test` (`string|instance`) - The type or instance to compare against.

### Return Type
- `string|boolean` - The type of the variable if no test is provided, or a boolean indicating if the input matches the test.

### Example
```javascript
console.log(instanceOf(new Date(), 'date'));  // true
console.log(instanceOf(new MyClass(), MyClass));  // true
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
- `number` - The formatted dollar amount.

### Example
```javascript
console.log(toCurrency(123.45));  // 123.45
```

## toDollarString
### Description
Converts large numeric values into a shorter string representation using "K" for thousands and "M" for millions.

### Syntax
```javascript
function toDollarString(amount)
```

### Parameters
- `amount` (`String|Number`) - The amount to convert.

### Return Type
- `number` - The converted string representation.

### Example
```javascript
console.log(toDollarString(2500000));  // 2.5M
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
- `test` (`string`) - An optional type to check against.

### Return Type
- `string|boolean` - The type of the variable, or a boolean indicating if the input matches the specified type.

### Example
```javascript
console.log(typeOf('hello'));       // 'string'
console.log(typeOf('hello', 'string'));  // true
```

## validateEmail
### Description
Validates an email address based on a specific regular expression pattern.

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
```

## validatePhone
### Description
Validates a phone number based on a specific format.

### Syntax
```javascript
function validatePhone(phone)
```

### Parameters
- `phone` (`String`) - The phone number to validate.

### Return Type
- `void|Toast` - Returns a toast message indicating validation success or failure.

### Example
```javascript
console.log(validatePhone('1234567890'));  // true
console.log(validatePhone('123 456 7890'));  // true
```

This comprehensive documentation should assist developers in effectively utilizing the  Utility Library to enhance their projects with reliable, commonly needed functionalities.
