import { test } from 'vitest';
import assert from 'assert';
import { EventBus } from '../src/event-bus/EventBus'; // Replace with your actual path

test('should register an event and trigger it', () => {
    const _eventBus = new EventBus();
    let flag = false;

    _eventBus.on('myEvent', () => {
        flag = true;
    });

    _eventBus.emit('myEvent');

    if (!flag) {
        throw new Error('Event not triggered');
    }
});

test('should trigger an event only once', () => {
    const _eventBus = new EventBus();
    let counter = 0;

    _eventBus.once('myEvent', () => {
        counter++;
    });

    _eventBus.emit('myEvent');
    _eventBus.emit('myEvent');

    if (counter !== 1) {
        throw new Error('Event triggered more than once');
    }
});

test('should trigger an event exactly N times', () => {
    const _eventBus = new EventBus();
    let counter = 0;
    const N = 3;

    _eventBus.exactly(
        'myEvent',
        () => {
            counter++;
        },
        N
    );

    for (let i = 0; i < N + 1; i++) {
        _eventBus.emit('myEvent');
    }

    if (counter !== N) {
        throw new Error(`Event should be triggered exactly ${N} times`);
    }
});

test('should kill an event with all its callbacks', () => {
    const _eventBus = new EventBus();
    let flag = false;

    _eventBus.on('myEvent', () => {
        flag = true;
    });

    _eventBus.off('myEvent');
    _eventBus.emit('myEvent');

    if (flag) {
        throw new Error('Event should not be triggered after off()');
    }
});

test('should detach a specific callback for an event', () => {
    const _eventBus = new EventBus();
    let counter1 = 0;
    let counter2 = 0;

    const callback1 = () => {
        counter1++;
    };
    const callback2 = () => {
        counter2++;
    };

    _eventBus.on('myEvent', callback1);
    _eventBus.on('myEvent', callback2);

    _eventBus.detach('myEvent', callback1);
    _eventBus.emit('myEvent');

    if (counter1 !== 0 || counter2 !== 1) {
        throw new Error('Callback not detached correctly');
    }
});

test('off', async () => {
    const _eventBus = new EventBus();
    let triggered = false;
    _eventBus.on('my-event', () => {
        triggered = true;
    });
    _eventBus.off('my-event');
    _eventBus.emit('my-event');
    assert(triggered === false);
});

test('detach', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    const callback = () => {
        triggered++;
    };
    _eventBus.on('my-event', callback);
    _eventBus.emit('my-event');
    _eventBus.detach('my-event', callback);
    _eventBus.emit('my-event');
    assert(triggered === 1);
});

test('once', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.once('my-event', () => {
        triggered++;
    });
    _eventBus.emit('my-event');
    _eventBus.emit('my-event');
    assert(triggered === 1);
});

test('exactly', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.exactly(
        'my-event',
        () => {
            triggered++;
        },
        3
    );
    _eventBus.emit('my-event');
    _eventBus.emit('my-event');
    _eventBus.emit('my-event');
    _eventBus.emit('my-event');
    assert(triggered === 3);
});

test('greedy wildcard emit', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.on('my-event.a', () => {
        triggered++;
    });
    _eventBus.emit('my-event.*');
    _eventBus.emit('my-event.a.name.b');
    _eventBus.emit('my-event.name.b');
    assert(triggered === 1);
});

test('nested wildcard and emit', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.on('my-event.a.name', () => {
        triggered++;
    });
    _eventBus.emit('my-event.*.name');
    _eventBus.emit('my-event.a.name.b');
    _eventBus.emit('my-event.name.b');
    assert(triggered === 1);
});

test('nested wildcard multi -- and emit', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.on('my-event.a.name-hello', () => {
        triggered++;
    });
    _eventBus.emit('my-event.*.**');
    _eventBus.emit('my-event.a.name.b');
    _eventBus.emit('my-event.name.b');
    assert(triggered === 1);
});

test('nested wildcard and emit double wild', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.on('my-event.x.name.b', () => {
        triggered++;
    });
    _eventBus.emit('my-event.x*name.**');
    _eventBus.emit('my-event.x.name.b');
    _eventBus.emit('my-event.x.other-name.b');
    assert(triggered === 2);
});

test('nested wildcard and emit with "on"', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.on('my-event.x.*', () => {
        triggered++;
    });
    _eventBus.emit('my-event.x.name');
    _eventBus.emit('my-event.x.name.b');
    _eventBus.emit('my-event.name.b');
    assert(triggered === 2);
});

test('nested wildcard and emit with "on" multi card', async () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.on('my-event.y*b', () => {
        triggered++;
    });
    _eventBus.emit('my-event.y');
    _eventBus.emit('my-event.yz');
    _eventBus.emit('my-event.y.z');
    _eventBus.emit('my-event.y.name');
    _eventBus.emit('my-event.y.name.b'); // this should be the match
    _eventBus.emit('my-event.y.other-name.c');
    assert(triggered === 1);
});

test('passing data', async () => {
    const _eventBus = new EventBus();
    let content = null;
    _eventBus.on('my-event', (data) => {
        content = data;
    });
    _eventBus.emit('my-event', 'hello', 'world');
    assert.equal(content, 'hello');
});
test('passing data multi args', async () => {
    const _eventBus = new EventBus();
    let content = null;
    _eventBus.on('my-event', (data, other) => {
        content = other;
    });
    _eventBus.emit('my-event', 'hello', 'world', 'other');
    assert.equal(content, 'world');
});

test('passing data object', async () => {
    const _eventBus = new EventBus();
    let content = null;
    _eventBus.on('my-event', (data) => {
        content = data;
    });
    _eventBus.emit('my-event', { key: 'value' });
    assert.deepEqual(content, { key: 'value' });
});

test('passing the context', () => {
    const _eventBus = new EventBus();
    const context = { name: 'the context' };
    let receivedContext = null;
    let receivedArgs = null;
    _eventBus.on('my-event', function (...args) {
        receivedContext = this;
        receivedArgs = args;
    });
    _eventBus.emit('my-event', 'hello', { __context: context }, 'world');
    assert.equal(receivedContext, context);
    assert.deepEqual(receivedArgs, ['hello', 'world']);
});

// =========================================
// --> Wildcards and listeners with a limited number of triggers
// --------------------------

test('wildcard emit reaches every matching listener', () => {
    const _eventBus = new EventBus();
    const called = [];
    _eventBus.on('user.a', () => called.push('a'));
    _eventBus.on('user.b', () => called.push('b'));
    _eventBus.on('user.c', () => called.push('c'));
    _eventBus.on('other.a', () => called.push('other'));

    _eventBus.emit('user.*');

    assert.deepEqual(called, ['a', 'b', 'c']);
});

test('wildcard emit without a matching listener does nothing', () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.on('my-event', () => {
        triggered++;
    });

    assert.doesNotThrow(() => _eventBus.emit('other-event.*'));
    assert.doesNotThrow(() => new EventBus().emit('other-event.*'));
    assert.equal(triggered, 0);
});

test('all the "once" listeners of an event are triggered', () => {
    const _eventBus = new EventBus();
    const called = [];
    _eventBus.once('my-event', () => called.push('once 1'));
    _eventBus.once('my-event', () => called.push('once 2'));
    _eventBus.on('my-event', () => called.push('on'));

    _eventBus.emit('my-event');
    assert.deepEqual(called, ['once 1', 'once 2', 'on']);

    // Only the "on" listener is left
    _eventBus.emit('my-event');
    assert.deepEqual(called, ['once 1', 'once 2', 'on', 'on']);
});

test('"once" listener reached by a wildcard emit is triggered only once', () => {
    const _eventBus = new EventBus();
    let triggered = 0;
    _eventBus.once('user.a', () => {
        triggered++;
    });

    _eventBus.emit('user.*');
    _eventBus.emit('user.*');
    _eventBus.emit('user.a');

    assert.equal(triggered, 1);
});

test('"once" and "exactly" listeners registered with a wildcard', () => {
    const _eventBus = new EventBus();
    let once = 0;
    let twice = 0;
    _eventBus.once('user.*', () => {
        once++;
    });
    _eventBus.exactly(
        'user.*',
        () => {
            twice++;
        },
        2
    );

    _eventBus.emit('user.a');
    _eventBus.emit('user.b');
    _eventBus.emit('user.c');

    assert.equal(once, 1);
    assert.equal(twice, 2);
});

test('the listener that runs out of triggers is the one removed', () => {
    const _eventBus = new EventBus();
    const called = [];
    // The list of listeners changes while the event is being emitted
    const detachesItself = () => {
        called.push('detached');
        _eventBus.detach('my-event', detachesItself);
    };
    _eventBus.on('my-event', detachesItself);
    _eventBus.once('my-event', () => called.push('once'));
    _eventBus.on('my-event', () => called.push('on'));

    _eventBus.emit('my-event');
    _eventBus.emit('my-event');

    assert.deepEqual(called, ['detached', 'once', 'on', 'on']);
});

// =========================================
// --> Event names and data that used to break it
// --------------------------

test('event names that every object already has, like "constructor"', () => {
    const _eventBus = new EventBus();
    const called = [];
    const names = ['constructor', 'toString', 'hasOwnProperty', '__proto__'];

    names.forEach((name) => _eventBus.on(name, () => called.push(name)));
    names.forEach((name) => _eventBus.emit(name));
    assert.deepEqual(called, names);

    // Without a listener they are events like any other
    assert.doesNotThrow(() => _eventBus.emit('valueOf'));
    assert.equal(
        _eventBus.detach('valueOf', () => {}),
        false
    );
    _eventBus.off('constructor');
    _eventBus.emit('constructor');
    assert.deepEqual(called, names);
});

test('passing data that has no prototype', () => {
    const _eventBus = new EventBus();
    const data = Object.create(null);
    data.key = 'value';
    const dataWithItsOwn = { hasOwnProperty: 'not the usual function' };
    const received = [];
    _eventBus.on('my-event', (content) => received.push(content));

    _eventBus.emit('my-event', data);
    _eventBus.emit('my-event', dataWithItsOwn);

    assert.equal(received[0], data);
    assert.equal(received[1], dataWithItsOwn);
});

// =========================================
// --> A listener for the exact name and wildcard listeners, together
// --------------------------

test('names that are not strings match exactly', () => {
    const _eventBus = new EventBus();
    const symbol = Symbol('my-event');
    const called = [];
    _eventBus.on(symbol, () => called.push('symbol'));
    _eventBus.on(7, () => called.push('number'));

    _eventBus.emit(symbol);
    _eventBus.emit(7);

    assert.deepEqual(called, ['symbol', 'number']);
});

test('a listener for the exact name does not hide the wildcard listeners', () => {
    const _eventBus = new EventBus();
    const called = [];
    _eventBus.on('user.*', () => called.push('user.*'));
    _eventBus.on('user.a', () => called.push('user.a'));
    _eventBus.on('user.b', () => called.push('user.b'));

    _eventBus.emit('user.a');

    // In the order the names were registered
    assert.deepEqual(called, ['user.*', 'user.a']);
});

test('wildcard listeners keep getting an event after its own listeners are gone', () => {
    const _eventBus = new EventBus();
    let wildcard = 0;
    const callback = () => {};
    _eventBus.once('user.a', callback);
    _eventBus.on('user.b', callback);
    _eventBus.detach('user.b', callback);
    _eventBus.on('user.*', () => {
        wildcard++;
    });

    // The "once" listener is used up by the first one, and "user.b" has none left
    _eventBus.emit('user.a');
    _eventBus.emit('user.a');
    _eventBus.emit('user.b');

    assert.equal(wildcard, 3);
});

test('wildcard emit also reaches the listeners registered under that same name', () => {
    const _eventBus = new EventBus();
    const called = [];
    _eventBus.on('user.a', () => called.push('user.a'));
    _eventBus.on('user.*', () => called.push('user.*'));
    _eventBus.on('user.b', () => called.push('user.b'));
    _eventBus.on('other', () => called.push('other'));

    _eventBus.emit('user.*');

    assert.deepEqual(called, ['user.a', 'user.*', 'user.b']);
});
