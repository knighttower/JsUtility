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

    // Example usage without an ID
    doTimeout(1000, () => {
        console.log('Timeout executed without ID');
        done = true;
        return false; // Return true to repeat
    });

    // Example usage for polling
    doTimeout(100, function () {
        if (done) {
            console.log('Condition met, stopping the polling.');
            return false; // Stop polling when some condition is true
        }
        console.log('Condition not met, continue polling.');
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

test('promisePool add promise', async () => {
    const pool = promisePool();
    pool.add(fetch('https://jsonplaceholder.typicode.com/todos/1'));

    const result = await doPoll(() => {
        if (pool.isDone()) {
            return true;
        }
    }).promise;

    expect(result).toBe(true);
    // assert.equal(typeof result, 'string');
});

test('promisePool empty', async () => {
    const pool = promisePool();

    const result = await doPoll(() => {
        if (pool.isEmpty()) {
            return true;
        }
    }).promise;

    expect(result).toBe(true);
    // assert.equal(typeof result, 'string');
});

test('promisePool empty2', async () => {
    const pool = promisePool();
    let result = false;

    pool.on('completed', () => {
        console.log('completed');
        result = true;
    });

    assert.equal(pool.isEmpty(), true);

    // expect(
    //     doPoll(() => {
    //         if (result === true) {
    //             return true;
    //         }
    //     }).promise
    // ).resolves.toBe('undefined');
    // assert.equal(typeof result, 'string');
});

test('promisePool add bad promise', async () => {
    const pool = promisePool();
    let result = false;
    pool.add(() => {
        //iterate
        for (let i = 0; i < 5000; i++) {}
    });
    pool.add(['hello']);

    pool.on('rejected', (error) => {
        console.log('----> fail:', error);
        result = true;
    });

    const pollResult = await doPoll(
        () => {
            if (result === true) {
                return true;
            }
        },
        { timeout: 6000 }
    ).promise;

    expect(pollResult).toBe(true);
});

test('promisePool add function', async () => {
    const pool = promisePool();

    pool.add(() => {
        //iterate
        for (let i = 0; i < 50000; i++) {}
    });

    const result = await doPoll(() => {
        if (pool.isDone()) {
            return true;
        }
    }).promise;

    expect(result).toBe(true);
});

test('promisePool', async () => {
    const pool = promisePool();
    pool.add(fetch('https://jsonplaceholder.typicode.com/todos/1'));
    pool.add(fetch('https://jsonplaceholder.typicode.com/todos/2'));
    pool.add(() => {
        // iterate 5000 times
        for (let i = 0; i < 5000; i++) {}
        console.log('------------------ for loop done');
    });
    pool.add(() => {
        // iterate 5000 times
        for (let i = 0; i < 4000; i++) {}
        console.log('------------------ for loop done');
    });
    pool.add(doAsync(() => fetch('https://jsonplaceholder.typicode.com/todos/3')));
    pool.add(doAsync(() => fetch('https://jsonplaceholder.typicode.com/todos/3')));
    pool.status(); // 'in-progress'
    pool.on('completed', () => {
        console.log('completed');
    });
    pool.on('rejected', (rejectedPromises) => {
        console.log('rejected:', rejectedPromises);
    });
    pool.on('stats', (stats) => {
        console.log(stats);
    });

    const result = await doPoll(
        () => {
            if (pool.isDone()) {
                return true;
            }
        },
        { timeout: 3000, interval: 500 }
    ).promise;

    expect(result).toBe(true);
    // assert.equal(typeof result, 'string');
});

test('promise pool 2', async () => {
    const promPool = promisePool();

    // Adding a single promise
    // promPool.add(new Promise((resolve) => setTimeout(resolve, 1000)));

    // Adding multiple promises
    // promPool.add([
    //     new Promise((resolve) => setTimeout(resolve, 500)),
    //     new Promise((resolve, reject) => setTimeout(reject, 1500)),
    // ]);
    // promPool.on('stats', (stats) => {
    //     console.log(stats);
    // });
    // promPool.on('completed', () => {
    //     console.log('All promises resolved or rejected.');
    // });
    // const done = await vi.waitUntil(
    //     () => {
    //         if (promPool.isDone()) {
    //             console.log('______log______');
    //             console.log(promPool.status());

    //             return true;
    //         }
    //     },
    //     {
    //         timeout: 5000, // default is 1000
    //         interval: 500, // default is 50
    //     }
    // );
    // expect(done).toBe(true);
});

test('promise pool clear', async () => {
    const promPool = promisePool();

    // Adding a single promise
    promPool.add(new Promise((resolve) => setTimeout(resolve, 1000)));

    promPool.on('stats', (stats) => {
        console.log(stats);
    });
    promPool.clear();
    promPool.stats();
    console.log('______ STATUS ______', promPool.status(), promPool.stats());
    // promPool.on('completed', () => {
    //     console.log('All promises resolved or rejected.');
    // });
    // const done = await vi.waitUntil(
    //     () => {
    //         if (promPool.isDone()) {
    //             console.log('______log______');
    //             console.log(promPool.status());

    //             return true;
    //         }
    //     },
    //     {
    //         timeout: 3000, // default is 1000
    //         interval: 500, // default is 50
    //     }
    // );
    assert.equal(promPool.status(), 'done');
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

// test('doAsync', async () => {
//     const doasync = doAsync(() => {
//         return fetch('https://knighttower.io');
//     });
//     let response = false;
//     const done2 = await vi.waitUntil(() => doasync, {
//         timeout: 3000, // default is 1000
//         interval: 200, // default is 50
//     });

//     expect(done2).toBeTypeOf('object');
// });

// test('doAsync 2', async () => {
//     const doasync = doAsync(
//         (arg1, arg2) => {
//             console.log('______log______', arg1, arg2);
//             return fetch('https://knighttower.io');
//         },
//         'hello',
//         'world'
//     );
//     let response = false;
//     console.log('______ log ______', await doasync);
//     const done2 = await vi.waitUntil(() => doasync, {
//         timeout: 3000, // default is 1000
//         interval: 200, // default is 50
//     });

//     expect(done2).toBeTypeOf('object');
// });

// test('doAsync empty', async () => {
//     var hello = async () => {
//         () => {};
//     };
//     const doasync = doAsync(() => {
//         console.log('______logw______');
//         () => {};
//     });
//     let response = false;
// });

// test('doAsync empty', async () => {
//     const doasync = doAsync(() => {
//         console.log('______logw______');
//         () => {};
//         return true;
//     });
//     console.log('______ log ______', await doasync);
//     let response = false;
//     const done2 = await vi.waitUntil(() => doasync, {
//         timeout: 4000, // default is 1000
//         interval: 200, // default is 50
//     });

//     expect(done2).toBe(true);
// });
