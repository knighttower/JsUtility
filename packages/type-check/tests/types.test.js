// @vitest-environment jsdom
import { test } from 'vitest';
import { typesMap } from '../src/types.js';
import assert from 'assert';

function testTypes() {
    for (const [typeName, typeValidator] of typesMap.entries()) {
        test(`type ${typeName} should validate correctly`, (t) => {
            const validInput = getValidInput(typeName);
            const invalidInput = getInvalidInput(typeName);
            assert(typeValidator(validInput));
            assert(!typeValidator(invalidInput));
        });
    }
}

function getValidInput(type) {
    switch (type) {
        case 'number':
            return 1;
        case 'int':
            return 1;
        case 'float':
            return 1.5;
        case 'date':
            return new Date();
        case 'object':
            return { a: 1 };
        case 'string':
            return 'test';
        case 'boolean':
            return true;
        case 'function':
            return () => {};
        case 'null':
            return null;
        case 'undefined':
            return undefined;
        case 'regExp':
            return /test/;
        case 'symbol':
            return Symbol('test');
        case 'bigInt':
            return BigInt(1);
        case 'set':
            return new Set([1, 2, 3]);
        case 'map':
            return new Map([
                ['a', 1],
                ['b', 2],
            ]);
        case 'array':
            return [1, 2, 3];
        case 'promise':
            return new Promise((resolve) => resolve());
        case 'weakMap':
            return new WeakMap();
        case 'weakSet':
            return new WeakSet();
        default:
            return null;
    }
}

function getInvalidInput(type) {
    switch (type) {
        case 'number':
            return 'test';
        case 'int':
            return 1.5;
        case 'float':
            return 1;
        case 'date':
            return 'test';
        case 'object':
            return [1, 2, 3];
        case 'string':
            return 1;
        case 'boolean':
            return 'test';
        case 'function':
            return {};
        case 'null':
            return undefined;
        case 'undefined':
            return null;
        case 'regExp':
            return 'test';
        case 'symbol':
            return 'test';
        case 'bigInt':
            return 1;
        case 'set':
            return [1, 2, 3];
        case 'map':
            return { a: 1, b: 2 };
        case 'array':
            return { a: 1 };
        case 'promise':
            return {};
        case 'weakMap':
            return {};
        case 'weakSet':
            return {};
        default:
            return null;
    }
}

testTypes();
