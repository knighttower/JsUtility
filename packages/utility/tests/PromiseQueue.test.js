import { test, vi, expect } from 'vitest';
import assert from 'assert';
import { promisePool, doPoll, promiseQueue, doTimeout, doAsync } from '../src/promises';

vi.setConfig({
    testTimeout: 50000,
});

test('doTimeout', async () => {
    let done = false;
    // Example usage with an ID
    doTimeout('exampleTimeout', 1000, () => {
        console.log('Timeout executed with ID');
        return false; // Return true to repeat
    });
    doTimeout('exampleTimeout', 250, () => {
        console.log('Timeout executed with IDs');
    });

    // Example usage without an ID
    doTimeout(1000, () => {
        console.log('Timeout executed without ID');
        done = true;
        return false; // Return true to repeat
    });

    // Example usage for polling
    doTimeout(100, function () {
        if (done) {
            console.log('Condition met, stopping the doTimeout.');
            return false; // Stop polling when some condition is true
        }
        console.log('Condition not met, continue doTimeout.');
        return true; // Continue polling by returning true
    });
    const done2 = await vi.waitUntil(
        () => {
            if (done) {
                return true;
            }
        },
        {
            timeout: 4000, // default is 1000
            interval: 500, // default is 50
        }
    );
    expect(done2).toBe(true);
});

// test('promise queue', async () => {
//     assert.equal(false, false);

//     const queue = promiseQueue();

//     queue.add(
//         new Promise((resolve) => setTimeout(resolve, 1000)).then(() => console.log('resolved'))
//     );
//     queue.add(new Promise((resolve) => setTimeout(resolve, 1000)).then(() => 4444));

//     queue.add(() => {
//         return new Promise((resolve, reject) => setTimeout(reject, 500))
//             .finally(() => {
//                 console.log('----> rejected');
//             })
//             .catch((error) => {
//                 console.log('----> error:', error);
//             });
//     });
//     queue.on('completed', () => {
//         console.log('All promises queue resolved or rejected.');
//     });

//     const done = await vi.waitUntil(
//         () => {
//             console.log('----', queue.status());
//             if (queue.status() === 'done') {
//                 console.log('______promise queue done  ______');
//                 console.log(queue.stats());
//                 return true;
//             }
//         },
//         {
//             timeout: 4000, // default is 1000
//             interval: 500, // default is 50
//         }
//     );
//     expect(done).toBe(true);
// });

test('polling', async () => {
    assert.equal(false, false);
    let response = false;
    const { promise, stop } = doPoll(
        () => {
            setTimeout(() => {
                response = true;
            }, 1500);
            console.log('1500');
            return false;
        },
        { timeout: 2500, interval: 500 }
    );
    const result = await promise;
    expect(result).toBe(false);
    const done = await vi.waitUntil(
        () => {
            if (response) {
                console.log('waitUntil');
                return response;
            }
        },
        {
            timeout: 3000, // default is 1000
            interval: 2000, // default is 50
        }
    );
    expect(done).toBe(true);
});

test('doAsync', async () => {
    const doasync = doAsync(() => {
        return fetch('https://knighttower.io');
    });
    let response = false;
    const done2 = await vi.waitUntil(() => doasync, {
        timeout: 3000, // default is 1000
        interval: 200, // default is 50
    });

    expect(done2).toBeTypeOf('object');
});

test('doAsync 2', async () => {
    const doasync = doAsync(
        (arg1, arg2) => {
            console.log('______log______', arg1, arg2);
            return fetch('https://knighttower.io');
        },
        'hello',
        'world'
    );
    let response = false;
    console.log('______ log ______', await doasync);
    const done2 = await vi.waitUntil(() => doasync, {
        timeout: 3000, // default is 1000
        interval: 200, // default is 50
    });

    expect(done2).toBeTypeOf('object');
});

test('doAsync empty', async () => {
    var hello = async () => {
        () => {};
    };
    const doasync = doAsync(() => {
        console.log('______logw______');
        () => {};
    });
    let response = false;
});

test('doAsync empty', async () => {
    const doasync = doAsync(() => {
        console.log('______logw______');
        () => {};
        return true;
    });
    console.log('______ log ______', await doasync);
    let response = false;
    const done2 = await vi.waitUntil(() => doasync, {
        timeout: 4000, // default is 1000
        interval: 200, // default is 50
    });

    expect(done2).toBe(true);
});
