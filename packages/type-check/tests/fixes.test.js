// Bugs fixed in November 2026: each test failed before its fix
import { describe, test, expect, vi, afterEach } from 'vitest';
import { typeCheck, _typeCheck, _tc, _tcx, validType } from '../src/typeCheck.js';

// The library logs before it throws, keep the test output clean
const silent = () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'table').mockImplementation(() => {});
};
afterEach(() => {
    vi.restoreAllMocks();
});

describe('values that JSON cannot convert (BigInt, circular)', () => {
    test('validType returns a boolean instead of throwing', () => {
        const circular = { a: 1 };
        circular.self = circular;
        expect(validType(10n, 'number|bigInt')).toBe(true);
        expect(validType(10n, 'number')).toBe(false);
        expect(validType([10n], '[number]')).toBe(false);
        expect(validType(10n, '[number]')).toBe(false);
        expect(validType({ id: 10n }, '{id: number|bigInt}')).toBe(true);
        expect(validType(circular, 'string|object')).toBe(true);
        expect(validType(circular, 'string')).toBe(false);
    });

    test('typeCheck throws its own TypeCheck error', () => {
        silent();
        expect(() => typeCheck(10n, 'number')).toThrow('TypeCheck Error');
    });
});

describe('error message when the value is not an array or not an object', () => {
    test('with no earlier failure, typeCheck throws the TypeCheck error', async () => {
        vi.resetModules();
        const fresh = await import('../src/typeCheck.js');
        silent();
        expect(() => fresh.typeCheck('x', '[number]')).toThrow('TypeCheck Error');
        expect(() => fresh.typeCheck([], '[number]')).toThrow('TypeCheck Error');
        expect(() => fresh.typeCheck(5, '{a: number}')).toThrow('TypeCheck Error');
    });

    test('after an unrelated failed check, the message names the value tested', () => {
        silent();
        validType(5, 'string');
        expect(() => typeCheck('x', '[number]')).toThrow('invalid for value: ""x""');
        validType(5, 'string');
        expect(() => typeCheck(true, '{a: number}')).toThrow('invalid for value: "true"');
    });
});

describe('"any" together with an optional key', () => {
    test('the optional key is tested only when it is set', () => {
        expect(validType({ a: 1 }, '{any: number, b?: string}')).toBe(true);
        expect(validType({ a: 1, b: 'x' }, '{any: number, b?: string}')).toBe(true);
        expect(validType({ a: 1, b: null }, '{any: number, b?: string}')).toBe(true);
        expect(validType({ a: 1, b: 2 }, '{any: number, b?: string}')).toBe(false);
        expect(validType({ a: 'x', b: 'y' }, '{any: number, b?: string}')).toBe(false);
        expect(validType({ u: { a: 1 } }, '{u: {any: number, b?: string}}')).toBe(true);
    });
});

describe('"any" together with "..."', () => {
    test('does not throw, "any" tests all the other keys', () => {
        expect(validType({ a: 1, b: 2 }, '{any: number, ...}')).toBe(true);
        expect(validType({ a: 1, b: 'x' }, '{any: number, ...}')).toBe(false);
        expect(validType({ k: 1, a: 'x' }, '{k: number, any: string, ...}')).toBe(true);
        expect(validType({ k: 1, a: 2 }, '{k: number, any: string, ...}')).toBe(false);
    });
});

describe('an unsupported type after a pipe', () => {
    test('throws every time, not only the first time', () => {
        expect(() => validType(1, 'number|nubmer')).toThrow('"nubmer" is not supported');
        expect(() => validType(1, 'number|nubmer')).toThrow('"nubmer" is not supported');
    });
});

describe('_tc string options', () => {
    test('"log" logs the test data', () => {
        silent();
        _tc(['number'], (x) => x, 'log')(1);
        expect(console.table).toHaveBeenCalled();
    });

    test('an error message is shown when the check fails', () => {
        silent();
        expect(() => _tc(['number'], (x) => x, 'Id must be a number!')('abc')).toThrow(
            'TypeCheck Error'
        );
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('Error Message'),
            'Id must be a number!'
        );
    });
});

describe('_tcx results', () => {
    test('.test() returns the result of the input test', () => {
        expect(_tcx(['number'], (x) => x, { validOutput: 'number' })(1).test()).toBe(true);
        expect(_tcx(['number'], (x) => x, { fail: false })('abc').test()).toBe(false);
    });
});

// validType skips the result object that _typeCheck builds, so it must give the same answers
describe('validType gives the same result as _typeCheck().test()', () => {
    const circular = { a: 1 };
    circular.self = circular;
    const values = [
        undefined,
        null,
        true,
        0,
        1.5,
        NaN,
        '',
        'x',
        10n,
        Symbol('s'),
        () => {},
        [],
        [1],
        [1, 'x'],
        [1, 2, 3],
        {},
        { a: 1 },
        { a: 1, b: 'x' },
        { a: 1, b: 2, c: 3 },
        { a: { b: 1 } },
        circular,
        new Date(),
        new Map(),
        new Set(),
        /x/,
        Promise.resolve(),
    ];
    const expressions = [
        'string',
        'number|string',
        'number?',
        'int',
        'float',
        'boolean',
        'null',
        'undefined',
        'bigInt',
        'symbol',
        'function',
        'object',
        'array',
        'date',
        'map',
        'set',
        'regExp',
        'promise',
        'enum=x/y',
        '[number]',
        '[number, string]',
        '[number, ...]',
        '{a: number}',
        '{a: number, b: string}',
        '{a: number, ...}',
        '{any: number}',
        '{a: number, b?: string}',
        '{a: {b: number}}',
        '{any: number, b?: string}',
    ];
    test.each(expressions)('%s', (expression) => {
        for (const value of values) {
            expect(validType(value, expression)).toBe(_typeCheck(value, expression).test());
        }
    });
});
