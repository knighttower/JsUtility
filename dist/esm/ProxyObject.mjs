// [2023] [Knighttower] https://github.com/knighttower

/**
 * @module proxyObject
 * Convert to proxy to protect objects
 * Allows to declare _private, _protected and _mutable - all arrays with prop names
 * @example proxyObject({objectProps..., _protected: array(...)})
 * @param {Object} object
 * @return {Proxy}
 * @usage const proxy = proxyObject({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})
 * @usage _protected: array(...) -> Cannot be modified
 * @usage _private: array(...) -> Cannot be accessed
 * @usage _mutable: array(...) -> Can be modified
 */
function proxyObject(object) {

    // Initialize property access control sets
    const _private = new Set(object._private || ['_private']);
    const _protected = new Set([..._private, ...(object._protected || [])]);
    const _mutable = new Set(object._mutable || []);

    return new Proxy(object, {
        get(target, prop, receiver) {
            if (_private.has(prop)) {
                console.error(`Attempt to access private property: ${prop}`);
                return undefined;
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            if (_protected.has(prop) && !_mutable.has(prop)) {
                console.error(`Attempt to modify protected property: ${prop}`);
                return false;
            }
            if (_private.has(prop)) {
                console.error(`Attempt to modify private property: ${prop}`);
                return false;
            }
            return Reflect.set(target, prop, value, receiver);
        },
        deleteProperty(target, prop) {
            if (_protected.has(prop) || _private.has(prop)) {
                console.error(`Attempt to delete protected/private property: ${prop}`);
                return false;
            }
            return Reflect.deleteProperty(target, prop);
        },
        defineProperty(target, prop, descriptor) {
            if (_protected.has(prop) || _private.has(prop)) {
                console.error(`Attempt to define protected/private property: ${prop}`);
                return false;
            }
            return Reflect.defineProperty(target, prop, descriptor);
        },
        ownKeys(target) {
            return Reflect.ownKeys(target).filter((key) => !_private.has(key));
        },
    });
}

export { proxyObject as ProxyObject, proxyObject as default, proxyObject };
