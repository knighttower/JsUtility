// Memory the module keeps between calls (fixed in November 2026): each test failed before its fix
import { describe, test, expect } from 'vitest';
import v8 from 'node:v8';
import vm from 'node:vm';
import { typeCheck, _typeCheck, _tc, validType } from '../src/typeCheck.js';

// A full garbage collection, to measure what the module keeps in memory
v8.setFlagsFromString('--expose_gc');
const gc = vm.runInNewContext('gc');
const heapGrowthMB = (fn) => {
    gc();
    const before = process.memoryUsage().heapUsed;
    fn();
    gc();
    return (process.memoryUsage().heapUsed - before) / 1048576;
};
// A WeakRef keeps its value until the current job ends
const nextJob = () => new Promise((resolve) => setTimeout(resolve, 0));
// About 770 bytes of JSON
const mediumObject = () => {
    const obj = {};
    for (let i = 0; i < 12; i++) {
        obj['key' + i] = { id: i, name: 'name-' + i, tags: ['a', 'b'], active: i % 2 === 0 };
    }
    return obj;
};

describe('error logs', () => {
    test('100k checks with a failing union branch keep no memory', () => {
        const obj = mediumObject();
        const grown = heapGrowthMB(() => {
            for (let i = 0; i < 100000; i++) {
                validType(obj, 'string|object');
            }
        });
        // about 85 MB before the fix
        expect(grown).toBeLessThan(10);
    }, 30000);
});

describe('settings cache', () => {
    test('options objects and callbacks can be garbage collected', async () => {
        let options = { error: 'Value must be a number!' };
        let callback = () => {};
        const optionsRef = new WeakRef(options);
        const callbackRef = new WeakRef(callback);
        typeCheck(1, 'number', options);
        _typeCheck(1, 'number', callback);
        options = callback = null;
        await nextJob();
        gc();
        expect(optionsRef.deref()).toBeUndefined();
        expect(callbackRef.deref()).toBeUndefined();
    });

    test('a _tc wrapper called 200k times keeps no memory', () => {
        const double = _tc(['number'], (x) => x * 2);
        const grown = heapGrowthMB(() => {
            for (let i = 0; i < 200000; i++) {
                double(i);
            }
        });
        // about 14 MB before the fix
        expect(grown).toBeLessThan(4);
    }, 30000);
});

describe('expression cache', () => {
    test('an array expression can be garbage collected', async () => {
        let expression = ['number', 'string'];
        const expressionRef = new WeakRef(expression);
        validType([1, 'x'], expression);
        expression = null;
        await nextJob();
        gc();
        expect(expressionRef.deref()).toBeUndefined();
    });

    test('100k checks with an inline array expression keep no memory', () => {
        const grown = heapGrowthMB(() => {
            for (let i = 0; i < 100000; i++) {
                validType([1, 'x'], ['number', 'string']);
            }
        });
        // about 42 MB before the fix
        expect(grown).toBeLessThan(10);
    }, 30000);
});
