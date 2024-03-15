//  type definitions
import { typesMap } from './types.js';
import { startAndEndWith, getArrObjFromString, typeOf } from '@knighttower/utility';

('use strict');

// =========================================
// --> STORAGE
// --------------------------
// Cache storage for tests
const cachedTests = new Map();
const cachedPipedTypes = new Map();

// =========================================
// --> Utility functions
// --------------------------

/**
 * If the type is a union type, split it and return the tests for each type
 * @param {string} str
 * @return {array} tests
 */
function getPipedTypes(str) {
    if (cachedPipedTypes.has(str)) {
        return cachedPipedTypes.get(str);
    }
    return str.split('|').reduce((testsForKey, t) => {
        let itCanBeNull = false;
        let type = t.trim();

        if (type.endsWith('?')) {
            type = type.slice(0, -1);
            itCanBeNull = true;
        }
        // lookup the test for the type and add it to the testsForKey array
        const typeObj = typesMap.get(type);
        const test = typeObj ?? isNoType(type);
        if (test) {
            testsForKey.push(test);
        }
        // for optional types, add the tests for null and undefined
        if (itCanBeNull) {
            testsForKey.push(typesMap.get('null'), typesMap.get('undefined'));
        }
        cachedPipedTypes.set(str, testsForKey);
        return testsForKey;
    }, []);
}

/**
 * Get the tests for a type
 * @param {string} type
 * @return {function[]} tests
 * @throws {Error} if type is not supported
 */
function isNoType(type) {
    throw new Error(`Type Error: "${type}" is not supported`);
}

/**
 * Determine the type of the expression
 * @param {any} strExp
 * @return {string}
 */
function determineMethod(strExp) {
    if (typeOf(strExp, 'array') || typeOf(strExp, 'object')) {
        return typeOf(strExp);
    }
    const __str = strExp.trim();
    if (startAndEndWith(__str, '[', ']')) {
        return 'array';
    }
    if (startAndEndWith(__str, '{', '}')) {
        return 'object';
    }
    return 'basic';
}

// =========================================
// --> Handlers for different types
// --------------------------

/**
 * Basic single types
 * @param {string} typeStr
 * @return {object} tests
 */
const basicTypes = (typeStr) => {
    return getPipedTypes(typeStr);
};

/**
 * Handle array types
 * @param {string} strExp
 * @return {array} tests
 */
const arrayTypes = (strExp) => {
    const testUnit = [];
    const convertedObj = getArrObjFromString(strExp);

    convertedObj.forEach((test) => {
        testUnit.push(testBuilder(test));
    });
    return testUnit;
};

/**
 * Handle object types
 * @param {string} strExp
 * @return {object} tests
 */
const objectTypes = (strExp) => {
    return new (class handleObjects {
        constructor() {
            this.testUnit = new Map([
                ['tests', new Map()],
                ['optionalKeys', []],
                ['testFew', []],
                ['testAllAny', false],
                ['testOnly', false],
            ]);

            return this.handleObject();
        }

        checkOptionalKey(key) {
            if (key.endsWith('?')) {
                key = key.slice(0, -1);
                this.testUnit.get('optionalKeys').push(key);
            }
            return key;
        }

        checkTheAnyKey(obj) {
            if ('any' in obj) {
                const keys = Object.keys(obj);
                if (keys.length === 1) {
                    this.testUnit.set('testAllAny', true);
                } else {
                    this.testUnit.set(
                        'testFew',
                        keys.filter((key) => key !== 'any')
                    );
                }
            }
        }

        handleObject() {
            const convertedObj = getArrObjFromString(strExp);
            this.checkTheAnyKey(convertedObj);
            for (const key in convertedObj) {
                const cleanKey = this.checkOptionalKey(key);
                const value = convertedObj[key];

                if (value === '...') {
                    delete convertedObj[key];
                    this.testUnit.set('testOnly', true);
                    continue;
                }

                this.testUnit.get('tests').set(cleanKey, testBuilder(value));
            }

            return this.testUnit;
        }
    })();
};

/**
 * Build the test unit
 * @param {any} strExp String expression
 * @return {object} testUnit
 * @throws {Error} if type is not supported
 * @example testBuilder('number') // returns {testMethod: 'basic', tests: [function]}
 * @example testBuilder('[number]') // returns {testMethod: 'array', tests: [[function]]}
 * @example testBuilder('{any: number}') // returns {testMethod: 'object', tests: {any: [function]}}
 * @usage See more cases in the 'type-pattern.txt' file
 */
function testBuilder(strExp) {
    if (cachedTests.has(strExp)) {
        return cachedTests.get(strExp);
    }
    let testUnit = new Map([
        ['testMethod', determineMethod(strExp)],
        ['tests', null],
    ]);

    switch (testUnit.get('testMethod')) {
        case 'basic':
            testUnit.set('tests', basicTypes(strExp));
            break;
        case 'array':
            testUnit.set('tests', arrayTypes(strExp));
            break;
        case 'object':
            /* eslint-disable-next-line */
            const objTypes = objectTypes(strExp);
            testUnit = new Map([...testUnit, ...objTypes]);
            break;
        default:
            isNoType(strExp);
    }

    cachedTests.set(strExp, testUnit);
    return testUnit;
}

/**
 * Add a new type test
 * @param {string} name The name of the test to add
 * @param {function} testUnit The test function
 * @return {boolean} true if the test was added
 * @throws {Error} if the test already exists
 */
const addTypeTest = (name, testUnit) => {
    if (!typesMap.has(name)) {
        typesMap.set(name, testUnit);
        return true;
    }

    return `"${name}" already exists!`;
};

export { testBuilder, addTypeTest, testBuilder as default, typesMap };
