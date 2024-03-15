// typeOf is used here insteand of the native typeof because it can handle better the identifications of arrays and objects
import { typeOf } from '@knighttower/utility';

export const typesMap = new Map([
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
