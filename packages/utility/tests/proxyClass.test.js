import { test } from 'vitest';
import assert from 'assert';
import { proxyClass } from '../src/proxyClass';

class hello {
    constructor() {
        this.publicProp = 'This can be accessed and modified.';
        this.protectedProp = 'This cannot be modified.';
        this.privateProp = 'This cannot be accessed or modified.';
        this.mutableProp = 'This can be modified.';
        this.other = 'Other';
        this._protected = ['protectedProp'];
        this._private = ['privateProp'];
        this._mutable = ['mutableProp'];
    }
    hello() {
        this.publicProp = 'Hello';
        this.other = 'Hello';
        return 'Hello';
    }
}
test('class', () => {
    assert.equal(true, true);
    class MyClass extends hello {
        constructor() {
            super();
            this.publicProp = 'This can be accessed and modified.';
            this.protectedProp = 'This cannot be modified.';
            this.privateProp = 'This cannot be accessed or modified.';
            this.mutableProp = 'This can be modified.';
            this.other = 'Other';
            this._protected = ['protectedProp'];
            this._private = ['privateProp'];
            this._mutable = ['mutableProp'];
        }
        hello() {
            this.publicProp = 'Hello';
            this.other = 'Hello';
            return 'Hello';
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
    instance.hello();
    console.log('______other______', instance.other);
});
