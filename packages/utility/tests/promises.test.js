import { test, expect, vi, afterEach } from 'vitest';
import { promiseQueue, promisePool, doPoll, doTimeout, doAsync } from '../src/promises';

// These tests do not use the network, and the ones about timers use fake timers, so they run in no time

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

// Helper: a promise that settles after some time
const delay = (ms, value, reject = false) =>
    new Promise((res, rej) => setTimeout(() => (reject ? rej(value) : res(value)), ms));

// Helper: resolves with the stats when 'done' is emitted, and fails instead of hanging when it never is
const whenDone = (emitter, ms = 2000) =>
    new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`'done' was not emitted in ${ms}ms`)), ms);
        emitter.on('done', (stats) => {
            clearTimeout(timer);
            resolve(stats);
        });
    });

// Helper: returns the rejections that nobody handled while the callback was running.
// In Node an unhandled rejection stops the process, so there should never be any
const getUnhandledRejections = async (callback) => {
    const unhandled = [];
    const onUnhandled = (reason) => unhandled.push(reason);
    process.on('unhandledRejection', onUnhandled);
    try {
        await callback();
        // They are reported after the code that was running is done
        await delay(20);
    } finally {
        process.off('unhandledRejection', onUnhandled);
    }
    return unhandled;
};

// Helper: a function to add to a pool, that keeps track of how many of them run at the same time
const getCounter = (ms = 10) => {
    const counter = {
        running: 0,
        peak: 0,
        task: () => {
            counter.running++;
            counter.peak = Math.max(counter.peak, counter.running);
            return delay(ms).then(() => {
                counter.running--;
            });
        },
    };
    return counter;
};

// =========================================
// --> promiseQueue
// --------------------------

test('promiseQueue: "completed" and "done" are emitted once everything has settled', async () => {
    const queue = promiseQueue();
    const events = [];
    queue.on('completed', (stats) => events.push(['completed', stats.pending]));
    queue.on('done', (stats) => events.push(['done', stats.pending]));

    queue.add(delay(20, 'promise'));
    queue.add(() => delay(5, 'function'));
    expect(queue.status()).toBe('in-progress');
    expect(events).toEqual([]);

    await whenDone(queue);
    // Nothing else is emitted afterwards
    await delay(30);

    expect(events).toEqual([
        ['completed', 0],
        ['done', 0],
    ]);
    expect(queue.status()).toBe('done');
    expect(queue.stats()).toMatchObject({
        completed: 2,
        rejected: 0,
        pending: 0,
        total: 2,
        errors: '',
    });
    expect(queue.stats().promises.map((item) => item.response)).toEqual(['promise', 'function']);
});

test('promiseQueue: what is added the moment the queue empties is part of the same run', async () => {
    const queue = promiseQueue();
    let done = 0;
    queue.on('done', () => done++);

    const first = delay(10, 'first');
    queue.add(first);
    // The queue has just emptied when this one is added
    first.then(() => queue.add(() => delay(10, 'second')));

    const stats = await whenDone(queue);
    await delay(40);

    // Announced once, at the very end
    expect(done).toBe(1);
    expect(stats).toMatchObject({ completed: 2, rejected: 0, pending: 0, total: 2 });
});

test('promiseQueue: a listener added just after quick work is done still gets the events', async () => {
    vi.useFakeTimers();
    const queue = promiseQueue();
    const events = [];

    queue.add(() => 'quick');
    await vi.advanceTimersByTimeAsync(5);
    // The work is done by now, the events are held back for a moment
    expect(queue.status()).toBe('done');
    queue.on('completed', () => events.push('completed'));
    queue.on('done', () => events.push('done'));
    expect(events).toEqual([]);

    await vi.advanceTimersByTimeAsync(10);

    expect(events).toEqual(['completed', 'done']);
    // Nothing is left of the timer once it has done its job
    expect(vi.getTimerCount()).toBe(0);
    expect(queue._timer).toBe(null);
});

test('promiseQueue: clear() cancels the events that were about to be emitted', async () => {
    vi.useFakeTimers();
    const queue = promiseQueue();
    const events = [];
    queue.on('completed', () => events.push('completed'));
    queue.on('done', () => events.push('done'));

    queue.add(() => 'quick');
    await vi.advanceTimersByTimeAsync(5);
    // The work is done and the events are about to be emitted
    expect(vi.getTimerCount()).toBe(1);

    queue.clear();
    // Nothing is left of the timer, neither running nor stored
    expect(vi.getTimerCount()).toBe(0);
    expect(queue._timer).toBe(null);

    await vi.advanceTimersByTimeAsync(50);
    expect(events).toEqual([]);
});

test('promiseQueue: a rejected promise is recorded and the queue carries on', async () => {
    const queue = promiseQueue();

    queue.add([delay(5, new Error('failed'), true), delay(10, 'ok')]);
    const stats = await whenDone(queue);

    expect(stats).toMatchObject({ completed: 1, rejected: 1, pending: 0, total: 2 });
    expect(stats.errors).toBe('Error: failed\n');
    expect(stats.promises.map((item) => item.status)).toEqual(['rejected', 'fulfilled']);
    expect(stats.promises[0].error.message).toBe('failed');
    expect(stats.promises[1].response).toBe('ok');
});

test('promiseQueue: a function that throws is rejected and the queue carries on', async () => {
    const queue = promiseQueue();

    const unhandled = await getUnhandledRejections(async () => {
        queue.add(() => {
            throw new Error('thrown');
        });
        queue.add(() => 'still runs');
        await whenDone(queue);
    });
    const stats = queue.stats();

    expect(unhandled).toEqual([]);
    expect(stats).toMatchObject({ completed: 1, rejected: 1, pending: 0, total: 2 });
    expect(stats.errors).toBe('Error: thrown\n');
    expect(stats.promises[0].status).toBe('rejected');
    expect(stats.promises[1].response).toBe('still runs');
});

test('promiseQueue: a function whose promise is rejected is rejected too', async () => {
    const queue = promiseQueue();

    const unhandled = await getUnhandledRejections(async () => {
        queue.add(() => delay(5, new Error('rejected later'), true));
        queue.add(() => 'still runs');
        await whenDone(queue);
    });
    const stats = queue.stats();

    expect(unhandled).toEqual([]);
    expect(stats).toMatchObject({ completed: 1, rejected: 1, pending: 0, total: 2 });
    expect(stats.errors).toBe('Error: rejected later\n');
    expect(stats.promises[0].status).toBe('rejected');
    expect(stats.promises[1].response).toBe('still runs');
});

test('promiseQueue: a promise rejected while it waits for its turn is not left unhandled', async () => {
    const queue = promiseQueue();

    const unhandled = await getUnhandledRejections(async () => {
        queue.add(delay(40, 'slow'));
        queue.add(Promise.reject(new Error('rejected early')));
        await whenDone(queue);
    });

    expect(unhandled).toEqual([]);
    expect(queue.stats()).toMatchObject({ completed: 1, rejected: 1, total: 2 });
});

test('promiseQueue: anything that is not a promise or a function is refused', () => {
    const queue = promiseQueue();
    const failed = [];
    vi.spyOn(console, 'error').mockImplementation(() => {});
    queue.on('fail', (value) => failed.push(value));

    queue.add('not a promise');
    queue.add([delay(1), 'not a promise']);
    queue.add([]);
    queue.add(null);

    expect(failed).toEqual(['not a promise', '[object Promise],not a promise', '', 'null']);
    expect(queue.stats().total).toBe(0);
    expect(queue.status()).toBe('done');
});

test('promiseQueue: clear() while a promise is running starts from scratch', async () => {
    const queue = promiseQueue();
    const events = [];
    queue.on('done', () => events.push('done'));

    const unhandled = await getUnhandledRejections(async () => {
        queue.add(delay(20, 'running'));
        queue.add(delay(30, 'waiting'));
        expect(queue.clear()).toBe(queue);
        // Long enough for both promises to settle
        await delay(60);
    });

    // What was in the queue is not part of it anymore: no errors, no events, nothing counted
    expect(unhandled).toEqual([]);
    expect(events).toEqual([]);
    expect(queue.stats()).toEqual({
        completed: 0,
        rejected: 0,
        pending: 0,
        total: 0,
        errors: '',
        promises: [],
    });

    // The queue can be used again
    queue.add(delay(5, 'again'));
    const stats = await whenDone(queue);

    expect(stats).toMatchObject({ completed: 1, rejected: 0, pending: 0, total: 1 });
    expect(events).toEqual(['done']);
});

test('promiseQueue: a promise that was running before clear() does not affect what is added after', async () => {
    const queue = promiseQueue();

    const unhandled = await getUnhandledRejections(async () => {
        queue.add(delay(10, 'old'));
        queue.clear();
        // Added while the old one is still running
        queue.add(delay(40, 'new'));
        await whenDone(queue);
        // Long enough for the new one to settle, whatever happened before
        await delay(60);
    });

    expect(unhandled).toEqual([]);
    expect(queue.stats()).toMatchObject({ completed: 1, rejected: 0, pending: 0, total: 1 });
    expect(queue.stats().promises.map((item) => item.response)).toEqual(['new']);
});

test('promiseQueue: clear() empties the list of processed promises', async () => {
    const queue = promiseQueue();

    queue.add(delay(1));
    await whenDone(queue);
    expect(queue.stats().promises.length).toBe(1);

    queue.clear();
    expect(queue.stats().promises).toEqual([]);
});

// =========================================
// --> promisePool
// --------------------------

test('promisePool: never runs more functions at the same time than the limit', async () => {
    const pool = promisePool(2);
    const counter = getCounter();

    pool.add([counter.task, counter.task, counter.task, counter.task, counter.task]);
    const stats = await whenDone(pool);

    expect(counter.peak).toBe(2);
    expect(stats).toMatchObject({ completed: 5, rejected: 0, pending: 0, total: 5 });
});

test('promisePool: emits "done", "completed" and "rejected" with the stats', async () => {
    const pool = promisePool(2);
    const events = [];
    vi.spyOn(console, 'info').mockImplementation(() => {});
    pool.on('done', (stats) => events.push(['done', stats.completed, stats.rejected]));
    pool.on('completed', (stats) => events.push(['completed', stats.completed, stats.rejected]));
    pool.on('rejected', (errors, stats) => events.push(['rejected', [...errors], stats.rejected]));

    pool.add([
        () => delay(5, 'ok'),
        () => delay(1, 'failed', true),
        () => {
            throw 'thrown';
        },
        'not a promise',
    ]);
    expect(pool.status()).toBe('in-progress');
    await whenDone(pool);

    expect(events).toEqual([
        ['done', 1, 3],
        ['completed', 1, 3],
        ['rejected', ['not a promise', 'failed', 'thrown'], 3],
    ]);
    expect(pool.status()).toBe('done');

    const stats = pool.stats();
    expect(stats).toEqual(pool.results());
    expect(Object.keys(stats)).toEqual([
        'completed',
        'rejected',
        'pending',
        'total',
        'errors',
        'promises',
    ]);
    expect(stats).toMatchObject({
        completed: 1,
        rejected: 3,
        pending: 0,
        total: 3,
        errors: 'not a promise\nfailed\nthrown',
    });
    expect(
        Object.values(stats.promises).map((item) => [item.status, item.response, item.error])
    ).toEqual([
        ['completed', 'ok', null],
        ['rejected', null, 'failed'],
        ['rejected', null, 'thrown'],
    ]);
});

test('promisePool: clear() while promises are running leaves nothing behind', async () => {
    const pool = promisePool(1);
    const events = [];
    let called = false;
    pool.on('done', () => events.push('done'));

    pool.add([
        () => delay(20, 'running'),
        () => {
            called = true;
        },
    ]);
    pool.clear();
    // Long enough for the promise that was running to settle
    await delay(50);

    // The function was still waiting in line, so it never gets called
    expect(called).toBe(false);
    expect(events).toEqual([]);
    expect(pool.status()).toBe('done');
    expect(pool.stats()).toEqual({
        completed: 0,
        rejected: 0,
        pending: 0,
        total: 0,
        errors: '',
        promises: {},
    });

    // The pool can be used again, and the limit still holds
    const counter = getCounter();
    pool.add([counter.task, counter.task, counter.task]);
    await vi.waitFor(() => expect(pool.stats().completed).toBe(3));

    expect(counter.peak).toBe(1);
    expect(pool.stats()).toMatchObject({ completed: 3, rejected: 0, pending: 0, total: 3 });
});

test('promisePool: a pool that is done starts over when more is added', async () => {
    const pool = promisePool(2);
    let done = 0;
    pool.on('done', () => done++);

    pool.add(() => delay(5));
    await whenDone(pool);
    expect(pool.isDone()).toBe(true);

    pool.add(() => delay(20));
    expect(pool.isDone()).toBe(false);
    expect(pool.status()).toBe('in-progress');
    await whenDone(pool);

    expect(done).toBe(2);
    expect(pool.isDone()).toBe(true);
    expect(pool.stats()).toMatchObject({ completed: 2, rejected: 0, pending: 0, total: 2 });

    // The same goes for a pool that was cleared
    pool.clear();
    pool.add(() => delay(5));
    expect(pool.status()).toBe('in-progress');
    await whenDone(pool);

    expect(done).toBe(3);
    expect(pool.stats()).toMatchObject({ completed: 1, rejected: 0, pending: 0, total: 1 });
});

test('promisePool: a value that is not a promise or a function is counted as rejected', () => {
    const pool = promisePool();
    vi.spyOn(console, 'info').mockImplementation(() => {});

    pool.add(['not a promise', null, 42]);

    expect(pool.stats()).toMatchObject({
        completed: 0,
        rejected: 3,
        total: 0,
        errors: 'not a promise\nnull\n42',
    });
});

test('promisePool: a promise rejected while it waits in line is not left unhandled', async () => {
    const pool = promisePool(1);

    const unhandled = await getUnhandledRejections(async () => {
        pool.add([delay(40, 'slow'), Promise.reject(new Error('rejected early'))]);
        await whenDone(pool);
    });

    expect(unhandled).toEqual([]);
    expect(pool.stats()).toMatchObject({ completed: 1, rejected: 1, total: 2 });
});

// =========================================
// --> doPoll
// --------------------------

test('doPoll: keeps calling the function until it gets a value', async () => {
    vi.useFakeTimers();
    let calls = 0;

    const { promise } = doPoll(() => (++calls === 3 ? 'found' : undefined), { interval: 100 });
    await vi.advanceTimersByTimeAsync(250);

    await expect(promise).resolves.toBe('found');
    expect(calls).toBe(3);
    expect(vi.getTimerCount()).toBe(0);
});

test('doPoll: any boolean stops it, false included', async () => {
    vi.useFakeTimers();

    await expect(doPoll(() => false).promise).resolves.toBe(false);
    await expect(doPoll(() => true).promise).resolves.toBe(true);
});

test('doPoll: settling on the first check leaves no timer or listener behind', async () => {
    vi.useFakeTimers();
    const listeners = new Set();
    const signal = {
        aborted: false,
        addEventListener: (type, listener) => listeners.add(listener),
        removeEventListener: (type, listener) => listeners.delete(listener),
    };

    await expect(doPoll(() => 'ready', { signal }).promise).resolves.toBe('ready');

    expect(vi.getTimerCount()).toBe(0);
    expect(listeners.size).toBe(0);
});

test('doPoll: waits for an async function before calling it again', async () => {
    vi.useFakeTimers();
    let calls = 0;

    const { promise } = doPoll(
        async () => {
            const call = ++calls;
            await delay(250);
            return call === 2 ? 'second call' : null;
        },
        { interval: 100 }
    );
    await vi.advanceTimersByTimeAsync(600);

    await expect(promise).resolves.toBe('second call');
    expect(calls).toBe(2);
    expect(vi.getTimerCount()).toBe(0);
});

test('doPoll: a promise is awaited instead of polled', async () => {
    vi.useFakeTimers();

    await expect(doPoll(Promise.resolve('value')).promise).resolves.toBe('value');
    await expect(doPoll(Promise.reject(new Error('rejected'))).promise).rejects.toThrow('rejected');
    expect(vi.getTimerCount()).toBe(0);
});

test('doPoll: rejects when it times out', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'info').mockImplementation(() => {});

    const options = { interval: 50, timeout: 200 };
    const withMessage = doPoll(() => undefined, { ...options, timeoutMsg: 'took too long' });
    const withoutMessage = doPoll(() => undefined, options);
    const rejections = Promise.all([
        expect(withMessage.promise).rejects.toBe('took too long'),
        expect(withoutMessage.promise).rejects.toBe('__TIMEOUT__'),
    ]);
    await vi.advanceTimersByTimeAsync(200);
    await rejections;

    expect(console.info).toHaveBeenCalledWith('took too long');
    expect(vi.getTimerCount()).toBe(0);
});

test('doPoll: stop() rejects with the given reason', async () => {
    vi.useFakeTimers();

    const { promise, stop } = doPoll(() => undefined);
    const rejection = expect(promise).rejects.toBe('stopped by hand');
    stop('stopped by hand');
    await rejection;

    expect(vi.getTimerCount()).toBe(0);
});

test('doPoll: the function can settle it with the functions it receives', async () => {
    vi.useFakeTimers();

    // A falsy value would otherwise keep it polling
    await expect(doPoll((done) => done(0)).promise).resolves.toBe(0);
    await expect(doPoll((done, stop) => stop('not today')).promise).rejects.toBe('not today');
});

test('doPoll: an error thrown by the function rejects', async () => {
    vi.useFakeTimers();

    const { promise } = doPoll(() => {
        throw new Error('broken');
    });

    await expect(promise).rejects.toThrow('broken');
});

test('doPoll: an AbortSignal stops it', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();

    const { promise } = doPoll(() => undefined, { signal: controller.signal });
    const rejection = expect(promise).rejects.toBe('cancelled');
    controller.abort('cancelled');
    await rejection;
    expect(vi.getTimerCount()).toBe(0);

    const alreadyAborted = doPoll(() => undefined, { signal: AbortSignal.abort('too late') });
    await expect(alreadyAborted.promise).rejects.toBe('too late');
    expect(vi.getTimerCount()).toBe(0);
});

test('doPoll: only functions and promises can be polled', () => {
    expect(() => doPoll('not a function')).toThrow(
        'doPoll: The first argument must be a function or Promise.'
    );
});

// =========================================
// --> doTimeout
// --------------------------

test('doTimeout: calls back after the delay, with or without an ID', () => {
    vi.useFakeTimers();
    const withId = vi.fn();
    const withoutId = vi.fn();

    expect(doTimeout('with-id', 100, withId)).toBe(true);
    expect(doTimeout(100, withoutId)).toBe(true);

    vi.advanceTimersByTime(99);
    expect(withId).not.toHaveBeenCalled();
    expect(withoutId).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(withId.mock.calls).toEqual([[]]);
    expect(withoutId.mock.calls).toEqual([[]]);
    expect(vi.getTimerCount()).toBe(0);
});

test('doTimeout: the extra arguments are passed to the callback', () => {
    vi.useFakeTimers();
    const withId = vi.fn();
    const withoutId = vi.fn();

    doTimeout('with-args', 100, withId, 'John', 30);
    doTimeout(100, withoutId, 'John', 30);
    vi.advanceTimersByTime(100);

    expect(withId.mock.calls).toEqual([['John', 30]]);
    expect(withoutId.mock.calls).toEqual([['John', 30]]);
});

test('doTimeout: the same ID replaces the timeout that was set before', () => {
    vi.useFakeTimers();
    const first = vi.fn();
    const second = vi.fn();

    doTimeout('same-id', 100, first);
    doTimeout('same-id', 50, second);
    vi.advanceTimersByTime(200);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
});

test('doTimeout: the ID without a callback cancels the timeout', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    doTimeout('cancel-me', 100, callback);
    expect(doTimeout('cancel-me')).toBeUndefined();

    // With a delay too: nothing is called, now or later
    doTimeout('cancel-me-too', 100, callback);
    expect(doTimeout('cancel-me-too', 0)).toBeUndefined();

    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();
});

test('doTimeout: keeps calling back for as long as the callback returns true', () => {
    vi.useFakeTimers();
    let calls = 0;

    doTimeout('loop', 50, () => ++calls < 3);
    vi.advanceTimersByTime(500);

    expect(calls).toBe(3);
    expect(vi.getTimerCount()).toBe(0);
});

test('doTimeout: invalid parameters', () => {
    expect(() => doTimeout()).toThrow('Invalid parameters');
    expect(() => doTimeout(100)).toThrow('Invalid parameters');
    expect(() => doTimeout('id', 'soon', () => {})).toThrow('Invalid parameters');
});

// =========================================
// --> doAsync
// --------------------------

test('doAsync: returns a promise whatever the function does', async () => {
    await expect(doAsync(() => 'sync')).resolves.toBe('sync');
    await expect(doAsync(async () => 'async')).resolves.toBe('async');
    await expect(doAsync((a, b) => a + b, 1, 2)).resolves.toBe(3);
    await expect(doAsync(() => {})).resolves.toBeUndefined();
    await expect(
        doAsync(() => {
            throw new Error('sync error');
        })
    ).rejects.toThrow('sync error');
    await expect(
        doAsync(async () => {
            throw new Error('async error');
        })
    ).rejects.toThrow('async error');
});
