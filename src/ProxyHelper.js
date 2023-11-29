// [2023] [Knighttower] https://github.com/knighttower

/**
 * @module ProxyHelper
 * Convert to proxy to protect objects
 * Allows to declare _private, _protected and _mutable - all arrays with prop names
 * @example ProxyHelper({objectProps..., _protected: array(...)})
 * @param {Object} object
 * @return {Proxy}
 * @usage const proxy = ProxyHelper({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})
 * @usage _protected: array(...) -> Cannot be modified
 * @usage _private: array(...) -> Cannot be accessed
 * @usage _mutable: array(...) -> Can be modified
 */
function ProxyHelper(object) {
    'use strict';
    const _private = new Map((object._private || ['_private']).map((prop) => [prop, true]));
    const _protected = new Map([..._private, ...(object._protected || []).map((prop) => [prop, true])]);
    const _mutable = new Map((object._mutable || []).map((prop) => [prop, true]));

    return new Proxy(object, {
        get(target, prop) {
            if (prop in target && !_private.has(String(prop))) {
                return target[prop];
            } else {
                console.error('Prop is private, not set, or object is protected', prop);
                return undefined;
            }
        },
        set(target, prop, value) {
            prop = String(prop);
            if (prop in target) {
                if (_mutable.has(prop)) {
                    target[prop] = value;
                    return true;
                }
                if (!_protected.has(prop) && !_private.has(prop)) {
                    target[prop] = value;
                    return true;
                } else {
                    console.error('The prop is protected or private and cannot be modified', prop, value);
                    return false;
                }
            } else {
                console.error('Protected Object, cannot set new props', prop, value);
                return false;
            }
        },
    });
}

export { ProxyHelper as proxyHelper, ProxyHelper as default, ProxyHelper };
