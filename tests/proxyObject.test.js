import { test } from 'vitest';
import assert from 'assert';
import { proxyObject } from '../src/ProxyObject';

test('Proxy object', () => {
    assert.equal(true, true);
    const obj = {
        publicProp: 'This can be accessed and modified.',
        protectedProp: 'This cannot be modified.',
        privateProp: 'This cannot be accessed or modified.',
        mutableProp: 'This can be modified.',
        other: 'Other',
        _protected: ['protectedProp'],
        _private: ['privateProp', 'other'],
        _mutable: ['mutableProp', 'other'],
        hello() {
            this.publicProp = 'Hello';
            this.other = 'Hello';
        },
    };
    const proxyObj = proxyObject(obj);
    console.log(proxyObj.publicProp); // Accessible

    proxyObj.publicProp = 'New value'; // Modifiable
    console.log(proxyObj.publicProp);

    console.log(proxyObj.protectedProp); // Accessible

    console.log(proxyObj.privateProp); // Attempt to access private property: privateProp

    proxyObj.mutableProp = 'Changed'; // Modifiable, even if protected
    console.log(proxyObj.mutableProp);
    proxyObj.hello();
    console.log(proxyObj.other);
    console.log('______other______', proxyObj);
});
