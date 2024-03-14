System.register('ProxyClass', [], (function (exports) {
    'use strict';
    return {
        execute: (function () {

            exports({
                ProxyClass: proxyClass,
                default: proxyClass,
                proxyClass: proxyClass
            });

            /**
             * Enhances a class with proxy functionality to enforce access and mutation rules for its properties.
             * This approach utilizes a higher-order function to wrap the class with a Proxy.
             */

            /**
             * Wraps a class with a Proxy to enforce private, protected, and mutable properties.
             * @param {Function} BaseClass - The class to be wrapped.
             * @returns {Proxy} A proxy-wrapped class enforcing the specified access controls.
             * @usage
             * // Example class to use with proxyClass
                class MyClass {
                    constructor() {
                        this.publicProp = 'This can be accessed and modified.';
                        this.protectedProp = 'This cannot be modified.';
                        this.privateProp = 'This cannot be accessed or modified.';
                        this.mutableProp = 'This can be modified.';
                        this._protected = ['protectedProp'];
                        this._private = ['privateProp'];
                        this._mutable = ['mutableProp'];
                    }
                }

                // Enhanced class with proxyClass
                const ProxyEnhancedMyClass = proxyClass(MyClass);

                // Example usage
                const instance = new ProxyEnhancedMyClass();
                console.log(instance.publicProp); // Accessible
                instance.publicProp = 'New value'; // Modifiable
                console.log(instance.privateProp); // Attempt to access private property: privateProp
                instance.mutableProp = 'Changed'; // Modifiable, even if protected
                console.log(instance.mutableProp);
                delete instance.privateProp;
             */
            function proxyClass(BaseClass) {
                return new Proxy(BaseClass, {
                    construct(target, args) {
                        const instance = new target(...args);
                        const _private = new Set(instance._private || []);
                        const _protected = new Set([..._private, ...(instance._protected || [])]);
                        const _mutable = new Set(instance._mutable || []);

                        const canMutate = (prop) => {
                            if (_protected.has(prop) && !_mutable.has(prop)) {
                                console.error(`Attempt to modify protected property: ${prop}`);
                                return false;
                            }
                            if (_private.has(prop) && !_mutable.has(prop)) {
                                console.error(`Attempt to modify private property: ${prop}`);
                                return false;
                            }
                            return true;
                        };

                        return new Proxy(instance, {
                            get(target, prop, receiver) {
                                if (_private.has(prop)) {
                                    console.error('Attempt to access private property:', prop);
                                    return undefined; // Or throw an Error
                                }
                                return Reflect.get(target, prop, receiver);
                            },
                            set(target, prop, value) {
                                if (!canMutate(prop)) {
                                    return false; // Or throw an Error
                                }
                                return Reflect.set(target, prop, value);
                            },
                            deleteProperty(target, prop) {
                                if (!canMutate(prop)) {
                                    return false; // Or throw an Error
                                }
                                return Reflect.deleteProperty(target, prop);
                            },
                            defineProperty(target, prop, descriptor) {
                                if (!canMutate(prop)) {
                                    return false; // Or throw an Error
                                }
                                return Reflect.defineProperty(target, prop, descriptor);
                            },
                            ownKeys(target) {
                                const keys = Reflect.ownKeys(target);
                                return keys.filter((key) => !_private.has(key));
                            },
                            enumerate(target) {
                                const keys = Reflect.enumerate(target);
                                return keys.filter((key) => !_private.has(key));
                            },
                            has(target, prop) {
                                return !_private.has(prop) && Reflect.has(target, prop);
                            },
                            getOwnPropertyDescriptor(target, prop) {
                                if (_private.has(prop)) {
                                    return undefined;
                                }
                                return Reflect.getOwnPropertyDescriptor(target, prop);
                            },
                        });
                    },
                });
            }

        })
    };
}));
