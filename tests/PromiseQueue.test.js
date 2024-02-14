import { test, vi, expect } from 'vitest';
import assert from 'assert';
import { promisePool, doPoll, PromiseQueue } from '../src/PromiseQueue';

test('promise pool', async () => {
    assert.equal(false, false);

    const promPool = promisePool();

    // Adding a single promise
    promPool.add(new Promise((resolve) => setTimeout(resolve, 1000)));

    // Adding multiple promises
    promPool.add([
        new Promise((resolve) => setTimeout(resolve, 500)),
        new Promise((resolve, reject) => setTimeout(reject, 1500)),
    ]);
    promPool.on('completed', () => {
        console.log('All promises resolved or rejected.');
    });
    const done = await vi.waitUntil(
        () => {
            console.log('----', promPool.status());
            if (promPool.status() === 'done') {
                console.log('______log______');
                console.log(promPool.status());

                return true;
            }

            return false;
        },
        {
            timeout: 3000, // default is 1000
            interval: 500, // default is 50
        },
    );
    expect(done).toBe(true);
});

test('promise queue', async () => {
    assert.equal(false, false);

    const queue = new PromiseQueue();

    queue.add(() => new Promise((resolve) => setTimeout(resolve, 1000)).then(() => console.log('resolved')));
    queue.add(() => new Promise((resolve, reject) => setTimeout(reject, 500)).finally(() => console.log('rejected')));
    queue.on('completed', () => {
        console.log('All promises resolved or rejected.');
    });

    const done = await vi.waitUntil(
        () => {
            console.log('----', queue.status());
            if (queue.status() === 'done') {
                console.log('______log______');
                console.log(queue.status());

                return true;
            }
        },
        {
            timeout: 3000, // default is 1000
            interval: 500, // default is 50
        },
    );
    expect(done).toBe(true);
});

test('polling', async () => {
    assert.equal(false, false);
    let response = false;
    const done = await vi.waitUntil(
        () => {
            doPoll(
                () => {
                    setTimeout(() => {
                        response = true;
                    }, 1500);
                    console.log('1500');
                },
                { timeout: 2500, interval: 500 },
            );
            console.log('waitUntil');
            if (response) {
                return true;
            }
        },
        {
            timeout: 3000, // default is 1000
            interval: 2000, // default is 50
        },
    );
    expect(done).toBe(true);
});
