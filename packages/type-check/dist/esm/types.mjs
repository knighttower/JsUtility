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
const executeOnNodeChanged$1 = {};
/**
 * Observer
 * @private
 * @return {MutationObserver}
 */
(() => {
    if (typeof window !== 'undefined') {
        const callback = (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    for (const id in executeOnNodeChanged$1) {
                        executeOnNodeChanged$1[id]();
                    }
                }
            }
        };
        const config = {
            childList: true,
            subtree: true,
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    }
})();

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
const executeOnNodeChanged = {};
/**
 * Observer
 * @private
 * @return {MutationObserver}
 */
(() => {
    if (typeof window !== 'undefined') {
        const callback = (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    for (const id in executeOnNodeChanged) {
                        executeOnNodeChanged[id]();
                    }
                }
            }
        };
        const config = {
            childList: true,
            subtree: true,
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, config);
    }
})();

// // -----------------------------------------
// /**
//  * @knighttower
//  * @url knighttower.io
//  * @git https://github.com/knighttower/
//  */
// // -----------------------------------------


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

    let inputType;

    switch (typeof input) {
        case 'number':
        case 'string':
        case 'boolean':
        case 'undefined':
        case 'bigint':
        case 'symbol':
        case 'function':
            inputType = typeof input;
            break;
        case 'object':
            inputType = Array.isArray(input) ? 'array' : 'object';

            break;
        default:
            inputType = 'unknown';
    }

    if (test) {
        if (test.includes('|')) {
            for (let type of test.split('|')) {
                if (inputType === type) {
                    return type;
                }
            }
            return false;
        }

        return test === inputType;
    }

    return inputType;
}

// typeOf is used here insteand of the native typeof because it can handle better the identifications of arrays and objects

const typesMap = new Map([
    ['array', (_var_) => typeOf(_var_, 'array')],
    ['bigInt', (_var_) => typeof _var_ === 'bigint'],
    ['boolean', (_var_) => typeof _var_ === 'boolean'],
    ['date', (_var_) => _var_ instanceof Date],
    ['float', (_var_) => typeof _var_ === 'number' && !Number.isInteger(_var_)],
    ['function', (_var_) => typeof _var_ === 'function'],
    ['int', (_var_) => Number.isInteger(_var_)],
    ['map', (_var_) => _var_ instanceof Map],
    ['null', (_var_) => _var_ === null],
    ['number', (_var_) => typeof _var_ === 'number'],
    ['object', (_var_) => typeOf(_var_, 'object')],
    ['promise', (_var_) => _var_ instanceof Promise],
    ['regExp', (_var_) => _var_ instanceof RegExp],
    ['set', (_var_) => _var_ instanceof Set],
    ['string', (_var_) => typeof _var_ === 'string'],
    ['symbol', (_var_) => typeof _var_ === 'symbol'],
    ['undefined', (_var_) => typeof _var_ === 'undefined'],
    ['weakMap', (_var_) => _var_ instanceof WeakMap],
    ['weakSet', (_var_) => _var_ instanceof WeakSet],
]);

export { typesMap };
