System.register('PowerHelpers', [], (function (exports) {
  'use strict';
  return {
    execute: (function () {

      exports({
        addQuotes: addQuotes,
        cleanStr: cleanStr,
        convertKeysToSymbols: convertKeysToSymbols,
        findAndReplaceInArray: findAndReplaceInArray,
        findNested: findNested,
        fixQuotes: fixQuotes,
        getArrObjFromString: getArrObjFromString,
        getChunks: getChunks,
        getDirectivesFromString: getDirectivesFromString,
        getMatchBlock: getMatchBlock,
        getMatchInBetween: getMatchInBetween,
        removeQuotes: removeQuotes,
        setExpString: setExpString,
        setLookUpExp: setLookUpExp,
        setWildCardString: setWildCardString,
        startAndEndWith: startAndEndWith,
        wildCardStringSearch: wildCardStringSearch
      });

      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e,
            n,
            i,
            u,
            a = [],
            f = !0,
            o = !1;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t) return;
              f = !1;
            } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
          } catch (r) {
            o = !0, n = r;
          } finally {
            try {
              if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
            } finally {
              if (o) throw n;
            }
          }
          return a;
        }
      }
      function _typeof(o) {
        "@babel/helpers - typeof";

        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
          return typeof o;
        } : function (o) {
          return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
        }, _typeof(o);
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _createForOfIteratorHelper(o, allowArrayLike) {
        var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
        if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function () {};
            return {
              s: F,
              n: function () {
                if (i >= o.length) return {
                  done: true
                };
                return {
                  done: false,
                  value: o[i++]
                };
              },
              e: function (e) {
                throw e;
              },
              f: F
            };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var normalCompletion = true,
          didErr = false,
          err;
        return {
          s: function () {
            it = it.call(o);
          },
          n: function () {
            var step = it.next();
            normalCompletion = step.done;
            return step;
          },
          e: function (e) {
            didErr = true;
            err = e;
          },
          f: function () {
            try {
              if (!normalCompletion && it.return != null) it.return();
            } finally {
              if (didErr) throw err;
            }
          }
        };
      }
      function _toPrimitive(input, hint) {
        if (typeof input !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== undefined) {
          var res = prim.call(input, hint || "default");
          if (typeof res !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return typeof key === "symbol" ? key : String(key);
      }

      // Author Knighttower
      // MIT License
      // [2022] [Knighttower] https://github.com/knighttower
      /**
       * @module DomObserver
       * Detect DOM changes
       * @name DomObserver
       * @param {window} selector
       * @param {Function}
       * @return DomObserver
       * @example DomObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })
       * @example DomObserver.removeOnNodeChange('elementIdentifier')
       */
      /**
       * Holds memory of registered functions
       * @private
       */
      var executeOnNodeChanged = {};
      /**
       * Observer
       * @private
       * @return {MutationObserver}
       */
      (function () {
        if (typeof window !== 'undefined') {
          var callback = function callback(mutationList) {
            var _iterator = _createForOfIteratorHelper(mutationList),
              _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var mutation = _step.value;
                if (mutation.type === 'childList') {
                  for (var id in executeOnNodeChanged) {
                    executeOnNodeChanged[id]();
                  }
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          };
          var config = {
            childList: true,
            subtree: true
          };
          var observer = new MutationObserver(callback);
          observer.observe(document.body, config);
        }
      })();

      // -----------------------------
      // METHODS
      // -----------------------------

      /**
       * Convert a value to bool
       * @param {String|Boolean|Int|Number} val
       * @return {Boolean}
       * @usage convertToBool('true') // true
       * @usage convertToBool('false') // false
       * @usage convertToBool('0') // false
       * @usage convertToBool('1') // true
       * @usage convertToBool('') // false
       * @usage convertToBool('true') // true
       * @usage convertToBool('false') // false
       */
      function convertToBool(val) {
        switch (_typeof(val)) {
          case 'boolean':
            return val;
          case 'string':
            return val === 'false' || val === '0' ? false : true;
          case 'number':
            return val !== 0;
          default:
            return Boolean(val);
        }
      }

      /**
       * Converts a given variable to a number if possible.
       * @param {string|number} input - The input variable to convert.
       * @returns {string|number} - The converted number or the original variable.
       * @example convertToNumber(123) // Output: 123 (number)
       * @example convertToNumber(123.45) // Output: 123.45 (number)
       * @example convertToNumber("123") // Output: 123 (number)
       * @example convertToNumber("123.45") // Output: 123.45 (number)
       * @example convertToNumber("abc") // Output: "abc" (original string)
       * @example convertToNumber("123abc") // Output: "123abc" (original string)
       * @example convertToNumber(null) // Output: null (original)
       */
      function convertToNumber(input) {
        var isNum = isNumber(input);
        if (isNum !== null) {
          return isNum;
        }
        // Case: String that cannot be converted to a number
        return input;
      }

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
      function emptyOrValue(value) {
        var _default = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        /**
         * Test sequence:
         * If it is a number 0> : true
         * If is not undefined: true
         * If it is boolean (true|false) prevents going to empty
         * If it is not Empty, [], null, {}, 0, true, false: true
         */

        if (isNumber(value) !== null || typeof value === 'boolean') {
          return value;
        } else if (!isEmpty(value)) {
          return value;
        }
        return _default;
      }

      /**
       * Generate unique ids
       * @function getDynamicId
       * @memberof Utility
       * @return string Format kn__000000__000
       */
      function getDynamicId() {
        return 'kn__' + new Date().getTime() + '__' + Math.floor(Math.random() * (999 - 100));
      }

      /**
       * Alias to getDynamicId
       * @function getRandomId
       * @memberof Utility
       * @return string
       * @example getRandomId() // kn__000000__000
       */
      var getRandomId = getDynamicId;

      /**
       * Check if a value is empty
       * @function isEmpty
       * @memberof Utility
       * @param {string|array|object|map|set|number|boolean} value
       * @url https://moderndash.io/
       * @return {string}
       */
      function isEmpty(value) {
        if (value === null || value === undefined) {
          return true;
        }
        if (typeof value === 'string' || Array.isArray(value)) {
          return value.length === 0;
        }
        if (value instanceof Map || value instanceof Set) {
          return value.size === 0;
        }
        if (ArrayBuffer.isView(value)) {
          return value.byteLength === 0;
        }
        if (_typeof(value) === 'object') {
          return Object.keys(value).length === 0;
        }
        return false;
      }

      /**
       * Check if is a number or Int, if not return null
       * Integrates both Int and Number, or convert a string number to number to test
       * Note: this is not like Lodash isNumber since this one takes into consideration the 'string number'
       * @function isNumber
       * @memberof Utility
       * @param {String|Number} value
       * @return null|int
       * @example isNumber(123) // true
       * @example isNumber(123.45) // true
       * @example isNumber('123abc') // false
       * @example isNumber('abc') // false
       * @example isNumber('') // false
       * @example isNumber("123") // true
       * @example isNumber("123.45") // true
       */
      function isNumber(value) {
        var isType = _typeof(value);
        switch (value) {
          case null:
          case undefined:
          case '':
            return null;
          case '0':
          case 0:
            return 0;
          default:
            if (isType === 'number' || isType === 'string') {
              if (typeof value === 'number' || !Number.isNaN(Number(value))) {
                return +value;
              }
            }
            break;
        }
        return null;
      }

      /**
       * Check the type of a variable, and get the correct type for it. It also accepts simple comparisons
       * For more advance type checking see https://github.com/knighttower/JsTypeCheck
       * @param {any} input - The variable to check
       * @param {string} test - The types to check against, piped string
       * @return {string|boolean} - The type of the variable
       * @example typeOf('hello', 'string') // returns true
       * @example typeOf('hello', 'number') // returns false
       * @example typeOf('hello', 'string') // returns true
       * @example typeOf('hello') // returns 'string'
       * @example typeOf({}) // returns 'object'
       */
      function typeOf(input, test) {
        // Special case for null since it can be treated as an object
        if (input === null) {
          if (test) {
            return test === null || test === 'null' ? true : false;
          }
          return 'null';
        }
        var inputType;
        switch (_typeof(input)) {
          case 'number':
          case 'string':
          case 'boolean':
          case 'undefined':
          case 'bigint':
          case 'symbol':
          case 'function':
            inputType = _typeof(input);
            break;
          case 'object':
            inputType = Array.isArray(input) ? 'array' : 'object';
            break;
          default:
            inputType = 'unknown';
        }
        if (test) {
          return test === inputType;
        }
        return inputType;
      }

      // @private
      function _removeBrackets(strExp) {
        var regex = /^(\[|\{)(.*?)(\]|\})$/; // Match brackets at start and end
        var match = strExp.match(regex);
        if (match) {
          return match[2].trim(); // Extract and trim the content between brackets
        }

        return strExp; // Return the original string if no brackets found at start and end
      }

      /**
       * Add quotes to a string
       * @function addQuotes
       * @param {String} str
       * @return {String}
       * @example addQuotes('hello') // "hello"
       */
      function addQuotes(str) {
        var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '"';
        return "".concat(q).concat(str).concat(q);
      }

      /**
       * Clean a string from delimeters or just trimmed if no delimeters given
       * @funtion cleanStr
       * @param {String} str - String to use
       * @param {String|Regex} p1 - Delimeter 1
       * @param {String|Regex} p2 - Delimeter 2
       * @return {String|void}
       * @example cleanStr('hello world', 'h', 'd') // 'ello worl'
       * @example cleanStr('  hello world  ') // 'hello world'
       * @example cleanStr('hello world', 'hello') // 'world'
       * @example cleanStr('Hello World. Sunshine is here!', '\..*!') // Hello World
       * @example cleanStr('Hello World. Sunshine is here!', /Hello/g) // ' World. Sunshine is here!'
       * @example cleanStr('Hello World. Sunshine is here!', /Hello/g, /Sunshine/g) // ' World.  is here!'
       */
      function cleanStr(str) {
        var arguments$1 = arguments;

        if (!str) {
          return;
        }
        if (typeof str !== 'string') {
          return str;
        }
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments$1[_key];
        }
        return args.reduce(function (accStr, arg) {
          var regex = arg instanceof RegExp ? arg : new RegExp(setExpString(arg));
          return accStr.replace(regex, '');
        }, str).trim();
      }

      /**
       * convert all keys from an object to symbols
       * @function convertKeysToSymbols
       * @param {object} obj - The object to convert
       * @return {object} - The object with all keys converted to symbols
       * @example convertKeysToSymbols({a: 1, b: 2}) // returns {Symbol(a): 1, Symbol(b): 2, keyToSymbolMap: {a: Symbol(a), b: Symbol(b)}
       */
      function convertKeysToSymbols(obj) {
        if (emptyOrValue(obj, null) === null) {
          return {};
        }
        var newObj = {};
        var keyToSymbolMap = {};
        for (var key in obj) {
          var symbolKey = Symbol(key);
          newObj[symbolKey] = obj[key];
          keyToSymbolMap[key] = symbolKey;
        }
        newObj.keyToSymbolMap = keyToSymbolMap;
        return newObj;
      }

      /**
       * Recursively will loop in array to find the desired target
       * @function findAndReplaceInArray
       * @param {Array} arr
       * @param {String} find The target (needle)
       * @param {Array|Object|String} value Replacer
       * @return {Null|Array}
       * @example findAndReplaceInArray([1,2,3,4,5], 3, 'three') // [1,2,'three',4,5]
       */
      function findAndReplaceInArray(arr, find, value) {
        var replaced = false;
        var result = arr.map(function (prop) {
          if (Array.isArray(prop)) {
            var replacedArray = findAndReplaceInArray(prop, find, value);
            if (replacedArray) {
              replaced = true;
              return replacedArray;
            }
            return prop;
          }
          if (prop === find) {
            replaced = true;
            if (Array.isArray(value)) {
              return value.map(function (p) {
                return Array.isArray(p) ? p : p.trim();
              });
            }
            return value;
          }
          return prop;
        });
        return replaced ? result : null;
      }

      /**
       * Find the last instance of nested pattern with delimeters
       * @function findNested
       * @param {string} str
       * @param {string} start - Delimeter 1
       * @param {string} end - Delimeter 2
       * @return {string|null}
       * @example findNested('[[]hello [world]]', '[', ']') // [world]
       */
      function findNested(str) {
        var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '[';
        var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ']';
        if (typeof str !== 'string') {
          return str;
        }
        // Find the last index of '['
        var lastIndex = str.lastIndexOf(start);
        // If '[' is not found, return null or some default value
        if (lastIndex === -1) {
          return null;
        }

        // Extract the substring starting from the last '[' to the end
        var substring = str.substring(lastIndex);
        // Find the index of the first ']' in the substring
        var endIndex = substring.indexOf(end);
        // If ']' is not found, return null or some default value
        if (endIndex === -1) {
          return null;
        }
        // Extract and return the content between the last '[' and the next ']', including them
        return substring.substring(0, endIndex + 1);
      }

      /**
       * Fix quotes from a string
       * @function fixQuotes
       * @param {String} str
       * @return {String} q quote type
       * @return {String}
       * @example fixQuotes("'hello'") // "hello"
       * @example fixQuotes('"hello"') // "hello"
       */
      function fixQuotes(str) {
        var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '"';
        if (typeof str !== 'string') {
          return str;
        }
        return str.replace(/`|'|"/g, q);
      }

      /**
       * Converts strings formats into objects or arrays
       * Note: quoted strings are not supported, use getDirectiveFromString instead
       * @param {string} strExp
       * @return {object|array|string}
       * @example getArrObjFromString('[[value,value],value]') // [['value', 'value'], 'value']
       * @example getArrObjFromString('[[value,value],value, { y: hello }, hello]') // [['value', 'value'], 'value', { y: 'hello' }, 'hello']
       * @example getArrObjFromString('{ y: hello, x: world, z: [value,value]}') // { y: 'hello', x: 'world', z: ['value', 'value'] }
       */
      function getArrObjFromString(strExp) {
        // alredy typeof object or array just return it
        if (typeOf(strExp, 'object') || typeOf(strExp, 'array')) {
          return strExp;
        }
        var isObject = startAndEndWith(strExp, '{', '}');
        var isArray = startAndEndWith(strExp, '[', ']');
        // If it is other type of string, return it
        if (!isObject && !isArray) {
          return strExp;
        }
        var newCollection = isObject ? {} : [];
        var nestedElements = {};

        //remove the brackets
        var newStrExp = _removeBrackets(strExp);
        var loopNested = function loopNested() {
          var objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          // ignore eslint comment
          // eslint-disable-next-line no-constant-condition
          while (true) {
            //find any nested arrays or objects
            var matched = objects ? findNested(newStrExp, '{', '}') : findNested(newStrExp);
            if (!matched) {
              break;
            }

            //replace the nested array or object with a marker so that we can safely split the string
            var marker = "__".concat(getRandomId(), "__");
            nestedElements[marker] = matched;
            newStrExp = newStrExp.replace(matched, marker);
          }
        };
        loopNested();
        loopNested(true);
        getChunks(newStrExp).forEach(function (chunk, index) {
          var isObjectKey = chunk.includes(':') && isObject;
          var chunkParts = isObjectKey ? getChunks(chunk, ':') : [];
          var chunkKey = removeQuotes(emptyOrValue(chunkParts[0], index));
          chunk = isObjectKey ? chunkParts[1] : chunk;
          if (chunk in nestedElements) {
            chunk = getArrObjFromString(nestedElements[chunk]);
          }
          chunk = convertToNumber(removeQuotes(chunk));
          // set back in the collection either as an object or array
          isObject ? newCollection[chunkKey] = chunk : newCollection.push(chunk);
        });
        // uncomment to debug
        // console.log('___ log ___', newCollection);
        return newCollection;
      }

      /**
       * handles the following patterns to get an object from string attributes
       * // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
       * // Matches the Array as string: [value, value] OR ['value','value']
       * // Matches a multi-array string like [[value,value]],value]
       * // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
       * // Matches string ID or class: literals Id(#) or class (.). Note that in Vue it needs to be in quotes attr="'#theId'"
       * // Mathes simple directive function style: directive(#idOr.Class)
       * Note: all the above with the exception of the Id/class will be converted into actual objects
       */
      /**
       * Converts strings formats into objects
       * @function getDirectivesFromString
       * @param {String|Array|Object} stringDirective
       * @return {object|null|void}
       * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
       * @example getDirectivesFromString('[[value,value],value]') // {directive: 'values', directive2: 'values'}
       * @example getDirectivesFromString('directive.tablet|mobile(...values)') // {directive: {tablet: 'values', mobile: 'values'}}
       * @example getDirectivesFromString('directive.tablet(...values)') // {directive: {tablet: 'values'}}
       */
      function getDirectivesFromString(stringDirective) {
        var str = stringDirective;
        if (!emptyOrValue(str)) {
          return null;
        }
        var results = function results() {
          var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var results = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
          return {
            type: type,
            directive: results
          };
        };
        var matchArrayTypes = /^\[((.|\n)*?)\]$/gm;
        // comment eslint to ignore
        // eslint-disable-next-line no-useless-escape
        var matchObjectTypes = /^\{((.|\n)*?)\:((.|\n)*?)\}/gm;
        // eslint-disable-next-line no-useless-escape
        var matchFunctionString = /^([a-zA-Z]+)(\()(\.|\#)(.*)(\))/g;
        var regexDotObjectString = /([a-zA-Z]+)\.(.*?)\(((.|\n)*?)\)/gm;
        var regexExObjectString = /([a-zA-Z]+)\[((.|\n)*?)\]\(((.|\n)*?)\)/gm;
        var type = _typeof(str);
        if (type === 'object' || type === 'array') {
          return results(type, str);
        } else {
          switch (true) {
            case !!str.match(matchArrayTypes):
              // Matches the Array as string: [value, value] OR ['value','value']
              // regexArrayLike = /^\[((.|\n)*?)\]$/gm;
              // Matches a multi-array string like [[value,value]],value]
              // regexMultiArrayString = /\[(\n|)(((.|\[)*)?)\](\,\n|)(((.|\])*)?)(\n|)\]/gm;

              type = 'array';
              break;
            case !!str.match(matchObjectTypes):
              // Matches the JSON objects as string: {'directive':{key:value}} OR {key:value}
              // regexObjectLike = /^\{((.|\n)*?)\:((.|\n)*?)\}/gm;
              type = 'object';
              break;
            case !!str.match(matchFunctionString):
              // Mathes simple directive function style: directive(#idOr.Class)
              // regexFunctionString
              // eslint-disable-next-line
              var directive = str.split('(')[0].trim();
              return results('idOrClassWithDirective', _defineProperty({}, directive, getMatchInBetween(str, '(', ')')));
            case !!str.match(regexDotObjectString):
              // Matches object-style strings: directive.tablet(...values) OR directive[expression](...values)
              // OR directive.breakdown|breakdown2(...values) OR directive.tablet(...values)&&directive.mobile(...values)
              type = 'dotObject';
              break;
            case !!str.match(regexExObjectString):
              type = 'dotObject';
              break;
            default:
              return results('string', str);
          }
        }
        if (type === 'array' || type === 'object') {
          var strQ = fixQuotes(str);
          try {
            return results(type, JSON.parse(strQ));
          } catch (error) {
            // uncomment to debug
            // console.log('___ parse error ___', error);
          }
          return results(type, getArrObjFromString(strQ));
        }
        if (type === 'dotObject') {
          var values, breakDownId, _directive;
          var setObject = {};
          getChunks(str, '&&').forEach(function (command) {
            if (command.match(regexExObjectString)) {
              // Matches object-style strings: directive[expression](...values)
              values = getMatchInBetween(command, '](', ')');
              breakDownId = getMatchInBetween(command, '[', ']');
              _directive = command.split('[')[0].trim();
            } else {
              // Matches object-style strings: directive.tablet(...values)
              values = getMatchInBetween(command, '(', ')');
              command = command.replace(getMatchBlock(command, '(', ')'), '');
              var _getChunks = getChunks(command, '.');
              var _getChunks2 = _slicedToArray(_getChunks, 2);
              _directive = _getChunks2[0];
              breakDownId = _getChunks2[1];
            }
            values = getArrObjFromString(values);
            if (!setObject[_directive]) {
              setObject[_directive] = {};
            }
            getChunks(breakDownId, '|').forEach(function (id) {
              setObject[_directive][id] = values;
            });
          });
          return results('dotObject', setObject);
        }
      }

      /**
       * Find math by delimeters returns raw matches
       * @function getMatchBlock
       * @param {String} str
       * @param {String|Regex} p1
       * @param {String|Regex} p2
       * @param {Boolean} all If it should return all matches or single one (default)
       * @return {String|Array|Null}
       * @example getMatchBlock('is a hello world today', 'h', 'd') // 'hello world'
       * @example getMatchBlock('is a hello world today', 'h', 'd', true) // ['hello world']
       * @example getMatchBlock('is a <hello world/> today', '<', '/>') // '<hello world/>'
       */
      function getMatchBlock(str, p1, p2) {
        var all = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        if (typeof str !== 'string') {
          return str;
        }
        p1 = setExpString(p1);
        p2 = setExpString(p2);
        var regex = new RegExp(setLookUpExp(p1, p2), 'gm');
        var matches = str.match(regex);
        if (matches) {
          return all ? matches : matches[0];
        }
        return null;
      }
      /**
       * Splits a string into chunks by a given splitter and cleans the chunks
       * @param {string} str
       * @param {string} splitter - The string/character to split the string by. Defaults to ','
       * @return {string|array}
       */
      function getChunks(str) {
        var splitter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
        if (typeof str !== 'string') {
          return str;
        }
        if (isEmpty(str)) {
          return [];
        }
        str = cleanStr(str);
        var chunks = str.split(splitter).map(function (t) {
          return cleanStr(t);
        });
        return chunks.length === 1 && chunks[0] === '' ? [str] : chunks;
      }

      /**
       * find a match in between two delimeters, either string or regex given, returns clean matches
       * @function getMatchBlock
       * @param {String} str
       * @param {String|Regex} p1
       * @param {String|Regex} p2
       * @param {Boolean} all If it should return all matches or single one (default)
       * @return {String|Array|Null}
       * @example getMatchInBetween('hello world', 'h', 'd') // 'ello worl'
       * @example getMatchInBetween('hello <world/>', '<', '/>', true) // ['world']
       * @example getMatchInBetween('hello <world/>', '<', '/>') // 'world'
       */
      function getMatchInBetween(str, p1, p2) {
        var _getMatchBlock;
        var all = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        if (typeof str !== 'string') {
          return str;
        }
        var matchBlock = (_getMatchBlock = getMatchBlock(str, p1, p2, all)) !== null && _getMatchBlock !== void 0 ? _getMatchBlock : all ? [] : str;
        return all ? matchBlock.map(function (match) {
          return cleanStr(match, p1, p2);
        }) : cleanStr(matchBlock, p1, p2);
      }

      /**
       * Remove quotes from a string
       * @function removeQuotes
       * @param {String} str
       * @return {String}
       * @example removeQuotes('"hello"') // hello
       * @example removeQuotes("'hello'") // hello
       */
      function removeQuotes(str) {
        if (typeof str !== 'string') {
          return str;
        }
        return str.replace(/`|'|"/g, '');
      }

      /**
       * Checks if a string starts and ends with a given string
       * @param {string} strExp
       * @param {string} start - The string/character to check it starts with
       * @param {string} end - The string/character to check it ends with
       * @return {string}
       * @example startAndEndWith('hello world', 'h', 'd') // false
       * @example startAndEndWith('hello world', 'h', 'd') // true
       */
      function startAndEndWith(strExp) {
        var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        return (!start || strExp.startsWith(start)) && (!end || strExp.endsWith(end));
      }

      /**
       * Scapes a string to create a regex or returns the regex if it already is an expression
       * @function setExpString
       * @param {String|Regex} exp
       * @return {String|Regex}
       * @example setExpString('hello') // '\h\e\l\l\o'
       * @example setExpString(/hello/) // /hello/
       * @example setExpString([hello]) // \\[hello\\/ then use like new new RegExp(setExpString(StringOrRegex))
       */
      function setExpString(exp) {
        if (exp instanceof RegExp) {
          return exp;
        } else {
          return exp.split('').map(function (_char) {
            return ['$', '^', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(_char) ? "\\".concat(_char) : _char;
          }).join('');
        }
      }

      /**
       * Regex builder to get a match in between two delimeters
       * @function setLookUpExp
       * @param {String|Regex} args - minimun two arguments as delimeters
       * @return {String} - Regex
       * @example setLookUpExp('h', 'd') // 'h((.|\n)*?)d'
       * @example setLookUpExp('h', 'd', 'c') // 'h((.|\n)*?)d((.|\n)*?)c'
       * @usage:
       * const pattern = setLookUpExp(".", "!");
      const regex = new RegExp(pattern, 'g');
      const text = "Hello World. Sunshine is here! Have fun!";
      const matches = text.match(regex);
      console.log(matches);  // Output: [". Sunshine is here!"]
       */
      function setLookUpExp() {
        var arguments$1 = arguments;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments$1[_key2];
        }
        if (args.length < 2) {
          throw new Error('You need to pass at least two arguments');
        }
        var expression = '';
        // loop through args
        args.forEach(function (arg, index) {
          // if arg is a regex, return the source
          if (arg instanceof RegExp) {
            arg = arg.source;
          }
          if (index === 0) {
            expression = arg;
          } else {
            expression += "((.|\n)*?)".concat(arg);
          }
        });
        return expression;
      }

      /**
       * Set a string to be used as a wildcard pattern
       * @function setWildCardString
       * @param {string} string - The string to set as a wildcard pattern
       * @param {boolean} matchStart - If the pattern should match the start of the string
       * @param {boolean} matchEnd - If the pattern should match the end of the string
       * @return {string} - The wildcard pattern
       * @example setWildCardString('name.*', true) // returns '^name\.(.*?)'
       * @example setWildCardString('name.*', false, true) // returns 'name\.(.*?)$'
       * @example setWildCardString('name.**') // returns 'name\..*' greedy
       */
      function setWildCardString(str) {
        var matchStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var matchEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (typeof str !== 'string') {
          return str;
        }
        if (!str) {
          return null;
        }
        matchStart = convertToBool(matchStart);
        matchEnd = convertToBool(matchEnd);
        // eslint-disable-next-line no-useless-escape
        var regexStr = str.replace(/([.+?^${}()|\[\]\/\\])/g, '\\$&'); // escape all regex special chars
        var regStart = matchStart ? '^' : '';
        var regEnd = matchEnd ? '$' : '';
        regexStr = regexStr.replace(/\*\*/g, '[_g_]') // Replace wildcard patterns with temporary markers
        .replace(/\*/g, '(.*?)').replace(/\[_g_\]/g, '.*');
        return "".concat(regStart).concat(regexStr).concat(regEnd);
      }

      /**
       * Search for a wildcard pattern in a list of strings or viceversa
       * @method wildCardStringSearch
       * @param {string} pattern - The pattern to search for
       * @param {array|string} list - The list of strings to search in
       * @param {boolean} matchStart - If the pattern should match the start of the string (optional)
       * @param {boolean} matchEnd - If the pattern should match the end of the string optional)
       * @return {string[]|null} - Returns a list of strings that match the pattern, or null if no match is found
       * @example wildCardStringSearch('name.*', ['name.a', 'name.b', 'name.c']) // returns ['name.a', 'name.b', 'name.c']
       */
      function wildCardStringSearch(pattern, listOrString) {
        var matchStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var matchEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        if (!pattern || !listOrString) {
          return null;
        }
        var regex = new RegExp(setWildCardString(pattern, matchStart, matchEnd));
        if (typeof listOrString === 'string') {
          var matches = listOrString.match(regex);
          return emptyOrValue(matches);
        }
        var filteredList = [];
        filteredList = listOrString.filter(function (item) {
          return regex.test(item);
        });
        return emptyOrValue(filteredList);
      }
      var powerHelper = {
        addQuotes: addQuotes,
        cleanStr: cleanStr,
        convertKeysToSymbols: convertKeysToSymbols,
        findAndReplaceInArray: findAndReplaceInArray,
        findNested: findNested,
        fixQuotes: fixQuotes,
        getArrObjFromString: getArrObjFromString,
        getChunks: getChunks,
        getDirectivesFromString: getDirectivesFromString,
        getMatchBlock: getMatchBlock,
        getMatchInBetween: getMatchInBetween,
        removeQuotes: removeQuotes,
        startAndEndWith: startAndEndWith,
        setExpString: setExpString,
        setLookUpExp: setLookUpExp,
        setWildCardString: setWildCardString,
        wildCardStringSearch: wildCardStringSearch
      }; exports({ powerHelper: powerHelper, default: powerHelper, PowerHelper: powerHelper });

    })
  };
}));
