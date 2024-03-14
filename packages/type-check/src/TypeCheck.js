import { typeOf, isEmpty } from '@knighttower/js-utility-functions';
import { typesMap, testBuilder, addTypeTest } from './TestBuilder.js';

// Error collectot
const typeErrorLogs = [];
// Setting cache
const cachedSettings = new Map();

const runBasicTest = (inputVal, tests) => {
    return tests.some((test) => {
        const testResult = test(inputVal);

        if (!testResult) {
            pushToErrorLogs(inputVal, tests);
        }
        return testResult;
    });
};

const runArrayTest = (inputVal, tests) => {
    // If the input is not an array, return false
    if (!typeOf(inputVal, 'array') || inputVal.length === 0) {
        return false;
    }
    // Else, test each value in the array
    return tests.every((test, index) => {
        // console.log('is array: ', inputVal[index], test);
        return runRouteTest(inputVal[index], test);
    });
};

class HandleObjects {
    constructor(inputVal, unitTest) {
        // Extract all properties at once
        const { testOnly, testFew, testAllAny, optionalKeys, tests } = [...unitTest.entries()].reduce(
            (acc, [key, value]) => ({ ...acc, [key]: value }),
            {}
        );
        // Use destructured variables
        this.testUnitKeys = [...tests.keys()];
        this.testOnly = testOnly;
        this.testFew = testFew;
        this.testAllAny = testAllAny;
        this.optionalKeys = optionalKeys;
        this.testCollection = tests;
        // the input object to test
        this.inputObject = inputVal;
    }

    handleUnitTest() {
        switch (true) {
            case this.testAllAny:
                // '{any: type}' // any key
                return this.testObjAllAny();
            case !isEmpty(this.testFew):
                // '{key1: type, any: type}'; // specific key, and all other "any"
                // test the testFew fist so that we can remove them from the inputObject
                /* eslint-disable-next-line */
                const testFewResults = this.testObjFew();
                // remove the testFew from the inputObject
                this.filterOutFew();
                return testFewResults && this.testObjAllAny();
            case !isEmpty(this.optionalKeys):
                // '{key1?: type, key2?: type}'; // optional keys
                // test the optionalKeys fist so that we can remove them from the inputObject
                /* eslint-disable-next-line */
                const optionalKeysResults = this.testObjOptionalKeys();
                // remove the optionalKeys from the inputObject
                this.filterOutOptionalKeys();
                return optionalKeysResults && this.defaultTest();
            case !this.testOnly:
                // '{key1: type, key2: type}'; // all keys
                for (const k in this.inputObject) {
                    if (!this.testCollection.has(k)) {
                        pushToErrorLogs(
                            this.inputObject,
                            `Key: "${k}" not found in the test collection, or use the "any" (any:[type]) key test or "..." after the last key in the test collection {key1: type, key2: type, ...} to only test a few keys.`
                        );
                        return false;
                    }
                }
                // when testOnly, it will bypass this and check only those found in the test collection
                // even if the test value has more keys
                break;
        }

        return this.defaultTest();
    }

    filterOutOptionalKeys() {
        this.testUnitKeys = this.testUnitKeys.filter((item) => !this.optionalKeys.includes(item));
    }

    filterOutFew() {
        this.inputObject = Object.fromEntries(
            Object.entries(this.inputObject).filter(([key]) => !this.testFew.includes(key))
        );
    }

    testObjOptionalKeys() {
        return this.optionalKeys.every((key) => {
            const test = this.testCollection.get(key);
            const testValue = this.inputObject[key];
            return !testValue ? true : runRouteTest(testValue, test);
        });
    }

    testObjFew() {
        return this.testFew.every((key) => {
            const test = this.testCollection.get(key);
            const testValue = this.inputObject[key];

            return runRouteTest(testValue, test);
        });
    }

    testObjAllAny() {
        const testValues = Object.values(this.inputObject);
        if (testValues.length === 0) {
            return runRouteTest(null, this.testCollection.get('any'));
        }
        return testValues.every((value) => {
            return runRouteTest(value, this.testCollection.get('any'));
        });
    }

    defaultTest() {
        return this.testUnitKeys.every((key) => {
            const test = this.testCollection.get(key);
            const testValue = this.inputObject[key];
            return runRouteTest(testValue, test);
        });
    }
}

const runObjectTest = (inputVal, unitTest) => {
    if (!typeOf(inputVal, 'object')) {
        return false;
    }
    return new HandleObjects(inputVal, unitTest).handleUnitTest();
};

function runRouteTest(inputVal, unitTest) {
    const testMethod = unitTest.get('testMethod');
    const tests = unitTest.get('tests');

    switch (testMethod) {
        case 'basic':
            return runBasicTest(inputVal, tests);
        case 'array':
            return runArrayTest(inputVal, tests);
        case 'object':
            return runObjectTest(inputVal, unitTest); // No change here as the entire Map is passed
        default:
            return false;
    }
}

/**
 * Get settings either from an object or a string keyword.
 * @param {Object | string} input - The settings object or keyword for predefined settings.
 * @return {object | null} - The settings object.
 */
function getSettings(input) {
    if (input) {
        if (cachedSettings.has(input)) {
            return cachedSettings.get(input);
        }
        // Check if input is an object
        const type = typeof input;
        let _val = null;
        switch (type) {
            case 'function':
                _val = { callback: input };
                break;
            case 'object':
                _val = input;
                break;
            case 'string':
                switch (input) {
                    case 'log':
                        _val = { log: true };
                        break;
                    case 'fail':
                        _val = { fail: true };
                        break;
                    case 'return':
                        _val = { return: true };
                        break;
                    case 'validOutput':
                        _val = { validOutput: input };
                        break;
                }
                break;
        }
        cachedSettings.set(input, _val);
        return _val;
    }

    return {
        log: false,
        fail: false,
        return: false,
        validOutput: false,
        callback: null,
    };
}

/**
 * Throw an error with the last typeErrorLogs
 */
function typeError(inputVal) {
    const errorLog = typeErrorLogs[typeErrorLogs.length - 1];

    console.log('\n::::::::::::: Type error or not valid ::::::::::::::');
    console.log('Input Value used: ', inputVal);
    console.log('---> Value Found:', errorLog.found);
    console.log('---> Test Permormed:', errorLog.tests);
    //clean the array of error logs
    typeErrorLogs.length = 0;
    throw new Error(
        `\n\n---------------------\nTypeCheck Error --->\n\n The value must not be of type (Type found) = "${errorLog.found}". \n\n The Type used is invalid for value: "${errorLog.value}". \n\n see logged error for details\n---------------------\n\n`
    );
}

function pushToErrorLogs(inputVal, tests) {
    typeErrorLogs.push({
        value: JSON.stringify(inputVal),
        tests: JSON.stringify(tests),
        found: typeOf(inputVal),
    });
}

/**
* _TypeCheck
* @param {any} inputVal
* @param {string} typeExp
* @param {object | string} params Parameters for the typeCheck function. 
* @return {bool | any} TypeChecker By default it returns boolean, but if '.return()' is used it will return the inputVal
* @example typeCheck(1, 'number') // true
* @example typeCheck([1], '[number]') // true
* @example typeCheck({x: 1, y: 2}, '{any: number}') // true
* @example typeCheck({ x: 'string', y: 10 }, '{y: number, x: string}', ($this) => {
        console.log('__testLogHere__', $this);
    }) // using call back function
* @usage (anyInputValue, stringTypeExpression, params: object | string)
* @usage params: object = { log: boolean, fail: boolean, callback: function }
* @usage params: string = 'log' | 'fail' | callback: function
* @usage chain Methods: log(), fail(), return() // returns the input value, test() returns the boolean
* @notes This function cannot validate the return value of a function when the validOutput is provided, use _tcx instead
* Params: log = true ; // logs the testData
* Params: fail = true ; // throws an error when the test fails
* Params: return = true ; // returns the inputVal
* Params: callback = function ; // callback function
* @see testUnit for more examples and test cases   
*/
const _typeCheck = (inputVal, typeExp, params) => {
    return new (class {
        constructor() {
            this.unitTest = testBuilder(typeExp);
            this.testResult = runRouteTest(inputVal, this.unitTest);
            this.bool = this.testResult;
            this.settings = getSettings(params);
            this.callback = this.settings.callback ?? null;
            this.testData = {
                typeExp,
                inputVal,
                inputType: typeOf(inputVal),
                callback: this.callback,
                unitTest: this.unitTest,
                testResult: this.testResult,
            };
            if (this.settings.log) {
                this.log();
            }

            if (this.settings.fail) {
                this.fail();
            }

            if (this.callback) {
                this.callback(this.testData);
            }
        }
        test() {
            return this.testResult;
        }
        log() {
            console.log('-------------------------- \n ::: Test Data Info :::');
            console.table(this.testData);
            return this;
        }
        fail() {
            if (!this.testResult) {
                this.log();
                this.settings?.error && console.log('\n\n-----> Error Message: ', this.settings.error);
                return typeError(inputVal);
            }
            return this;
        }
        return() {
            return inputVal;
        }
    })();
};

/**
* _tc is a helper function to wrap a function with typeCheck
* It is basic but faster the _tcx (neglible but if micro-optimization is needed)
* @param {array} typeExp array of types to test
* @param {function} __function Function to wrap
* @param {object | string} params Parameters for the typeCheck function.
* @return {function} Wrapped function
* @example _tc('[number]', function (myVar) {
        //code
        console.log(myVar);
    });
* @usage (stringTypeExpression, Function(), params: object | string)
* @usage params: object = { log: boolean, fail: boolean, return: boolean, validOutput: string }
* @usage params: string = 'log' | 'fail' | 'return' 
* @usage defaults: log = false, fail = true, return = false
* @notes this function does not accept callback arguments and when using shorthand arguments (string) it does not accept validOutput
* Params: log = true ; // logs the testData
* Params: fail = true ; // throws an error when the test fails
* Params: return = true ; // returns the inputVal
* Params: callback = function ; // callback function
* @see directory test for more information and examples
*/
const _tc = (typeExp, __function, params = {}) => {
    return (...args) => {
        params = { ...{ fail: true }, ...params };
        _typeCheck(args, typeExp, params);
        return __function(...args);
    };
};

/**
* _tcx is a helper function to wrap a function with typeCheck
* It is as performant as the _tc but it has a lot more features to offer
* @param {string} typeExp Expression to test
* @param {function} __function Function to wrap
* @param {object | string} params Parameters for the typeCheck function. 
* @return {function} Wrapped function
* @example _tcx('[number]', function (myVar) {
        //code
        console.log(myVar);
    });
* @usage (stringTypeExpression, Function(), params: object | string)
* @usage params: object = { log: boolean, fail: boolean, return: boolean, validOutput: stringTypeExpression }
* @usage params: string = 'log' | 'fail' | 'return'
* @notes This function can validate the return value of a function when the validOutput is provided
* @feature Return value validation
* @feature all instances accept individual fail, log, and return
* @feature all instances accept chaining parameters: myCoolFunction(44.5, 'yes!').log().fail().return()
* Params: log = true ; // logs the testData
* Params: fail = true ; // throws an error when the test fails
* Params: return = true ; // returns the inputVal
* Params: callback = function ; // callback function
* Params: validOutput = stringTypeExpression ; // validate the return value of the function
* @see directory test for more information and examples
*/
const _tcx = (typeExp, __function, params) => {
    let $settings = getSettings(params);
    //set default as true
    $settings = { ...{ fail: true }, ...$settings };
    return (...args) => {
        return new (class {
            constructor() {
                this.args = args;
                this.testResults = _typeCheck(args, typeExp, $settings);
                return this.default();
            }
            default() {
                this.returns = __function(...args);

                const validOutput = $settings.validOutput ?? false;
                if (validOutput) {
                    _typeCheck(this.returns, validOutput, 'fail');
                }
                return this;
            }
            log() {
                this.testResults.log();
                return this;
            }
            fail() {
                this.testResults.fail();
                return this;
            }
            return() {
                return this.returns;
            }
        })();
    };
};

/**
 * Test the type but does not throw an error, althought it can use the rest of the chain methods
 * @param {any} inputVal
 * @param {string} typeExp
 */
const validType = (inputVal, typeExp) => {
    return _typeCheck(inputVal, typeExp).test();
};

/**
* TypeCheck
* @param {any} inputVal
* @param {string} typeExp
* @example typeCheck(1, 'number') // true
* @example typeCheck([1], '[number]') // true
* @example typeCheck({x: 1, y: 2}, '{any: number}') // true
* @example typeCheck({ x: 'string', y: 10 }, '{y: number, x: string}', ($this) => {
        console.log('__testLogHere__', $this);
    }) // using call back function
* @see testUnit for more examples and test cases   
*/
const typeCheck = (inputVal, typeExp, params = null) => {
    return _typeCheck(inputVal, typeExp, params).fail();
};

export {
    _tc,
    _tcx,
    validType,
    typeCheck as default,
    typeCheck,
    typeCheck as TypeCheck,
    _typeCheck,
    typesMap,
    testBuilder,
    addTypeTest,
};
