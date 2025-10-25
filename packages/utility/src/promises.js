import { EventBus } from './event-bus/EventBus.js';
import { getDynamicId, makeArray, typeOf } from './utility.js';

// @resources: look at the workerpool library for more advanced promise/worker handling
// https://github.com/josdejong/workerpool?tab=readme-ov-file

// =========================================
// --> promiseQueue
// --------------------------
/**
 * @class promiseQueue
 * Class to manage a queue of promises, executing them sequentially with status tracking for each promise.
 * @extends EventBus
 * @methods
 * add: Adds a promise to the queue and starts the queue processing if not already started.
 * clear: Clears the promise queue.
 * status: Returns the current status of all promises in the queue.
 * @returns {Object} An instance of the promiseQueue class.
 * @example
 * const queue = promiseQueue();
 * queue.add(fetch('https://jsonplaceholder.typicode.com/todos/1'));
 * queue.add(fetch('https://jsonplaceholder.typicode.com/todos/2'));
 * queue.status(); // 'in-progress'
 * queue.on('completed', () => {});
 */
export const promiseQueue = () => {
    const stats = {
        completed: 0,
        rejected: 0,
        pending: 0,
        total: 0,
        errors: '',
        promises: [],
    };
    return new (class extends EventBus {
        constructor() {
            super();
            this.queue = [];
            this.inProgress = false;
            this._timer = null;
            this._stats = { ...stats };
        }

        /**
         * Adds a promise to the queue and starts the queue processing if not already started.
         * @param {Promise} promiseFunction A function that returns a promise.
         */
        add(promise) {
            const isValidPromise = (() => {
                if (promise instanceof Promise) {
                    return true;
                }
                if (Array.isArray(promise)) {
                    return promise.length > 0 && promise.every((item) => item instanceof Promise);
                }
                return false;
            })();

            if (!isValidPromise) {
                if (typeOf(promise, 'function')) {
                    promise = new Promise(async (resolve) => {
                        const fx = await promise();
                        return resolve(fx);
                    });
                } else {
                    console.error('---> Invalid promise added to the Queue:', promise.toString());
                    return this.emit('fail', promise.toString());
                }
            }

            makeArray(promise).forEach((promiseFunction) => {
                this._stats.total++;
                this._stats.pending++;
                this.queue.push({
                    promiseFunction,
                    response: null,
                    status: 'pending', // 'pending', 'fulfilled', or 'rejected'
                    error: null,
                });
            });

            if (!this.inProgress) {
                this._next();
            }
            this._setTimer();
        }

        /**
         * Clears the promise queue.
         */
        clear() {
            this._timer && clearInterval(this._timer);
            this._timer = null;
            this.queue = [];
            this.inProgress = false;
            this._stats = { ...stats };
            return this;
        }

        _setTimer() {
            if (this._timer) {
                clearInterval(this._timer);
            }
            this._timer = setInterval(() => {
                if (this.status() === 'done') {
                    clearInterval(this._timer);
                    this._timer = null;
                    this.emit('completed', this._stats);
                    this.emit('done', this._stats);
                }
            }, 10);
        }

        /**
         * Processes the next promise in the queue, if any.
         * @private
         */
        _next() {
            if (this.queue.length === 0) {
                this.inProgress = false;
                return;
            }

            this.inProgress = true;
            // this always grabs the first promise in the queue and then removes it after processing
            const { promiseFunction } = this.queue[0];
            promiseFunction
                .then((response) => {
                    this.queue[0].status = 'fulfilled';
                    this.queue[0].response = response;
                    this._stats.completed++;
                })
                .catch((error) => {
                    this._stats.errors += error + '\n';
                    this.queue[0].status = 'rejected';
                    this._stats.rejected++;
                })
                .finally(() => {
                    this._stats.promises.push(this.queue[0]);
                    this._stats.pending--;
                    this.queue.shift(); // Remove the processed promise from the queue
                    this._next(); // Process the next promise
                });
        }

        stats() {
            return this._stats;
        }

        /**
         * Returns the current status of all promises in the queue.
         * @returns {Array<Object>} An array of objects with the status of each promise.
         */
        status() {
            return this.queue.length === 0 ? 'done' : 'in-progress';
        }
    })();
};

// =========================================
// --> doPoll
// --------------------------
/**
 * Creates a poll function that continuously calls a given function until it returns true or a promise resolves.
 * @param {Function} fn - The function to be polled. It can return a promise or a boolean.
 * @param {Object} options - Configuration options for polling.
 * @param {number} [options.interval=200] - The interval in milliseconds between each poll.
 * @param {number} [options.timeout=1000] - The maximum time in milliseconds to continue polling.
 * @returns {Object} { promise, stop } - An object containing the polling promise and a cancel function.
 * @fails returns 'failed' if the polling times out or is cancelled.
 * @options: {}
 * - interval: The interval in milliseconds between each poll.
 * - timeout: The maximum time in milliseconds to continue polling.
 * @example
 * const { promise, stop } = doPoll(() => {
 *    // Polling logic here
 *   return true; // or return a promise
 * }
 */
export const doPoll = (fn, options = {}) => {
    const isThenable = (v) =>
        v != null &&
        (typeof v === 'object' || typeof v === 'function') &&
        typeof v.then === 'function';

    if (!(typeof fn === 'function' || isThenable(fn))) {
        throw new Error('doPoll: The first argument must be a function or Promise.');
    }

    const { msg, interval = 200, timeout = 10000, timeoutMsg = msg ?? null, signal } = options;
    const tickMs = Number.isFinite(interval) && interval > 0 ? interval : 200;
    const maxMs = Number.isFinite(timeout) && timeout > 0 ? timeout : 10000;
    const fnIsThenable = isThenable(fn);

    let timeoutId, intervalId;
    let resolvePromise, rejectPromise;
    let stopped = false;
    let running = false;
    let settled = false;

    const clearTimers = () => {
        stopped = true;
        if (timeoutId) clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
        if (signal) signal.removeEventListener?.('abort', onAbort);
    };

    const done = (val) => {
        if (settled) return;
        settled = true;
        clearTimers();
        resolvePromise(val);
    };

    const settleReject = (reason) => {
        if (settled) return;
        settled = true;
        clearTimers();
        rejectPromise(reason);
    };

    const stop = (reason) => {
        if (reason === '__TIMEOUT__' && typeOf(timeoutMsg, 'string')) {
            console.info(timeoutMsg);
            return settleReject(timeoutMsg);
        }
        return settleReject(reason);
    };

    const handleValue = (val) => {
        // resolve on any boolean (including false) or any truthy value
        if (typeOf(val, 'boolean') || val) done(val);
    };

    const onAbort = () => stop(signal?.reason ?? 'aborted');

    const promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;

        const poll = () => {
            if (stopped || running || settled) return;

            try {
                const fx = fnIsThenable ? fn : fn(done, stop);

                if (isThenable(fx)) {
                    running = true;
                    fx.then((val) => {
                        running = false;
                        handleValue(val);
                    }).catch((err) => {
                        running = false;
                        if (!stopped) stop(err);
                    });
                } else {
                    handleValue(fx);
                }
            } catch (err) {
                if (!stopped) stop(err);
            }
        };

        if (fnIsThenable) {
            poll(); // single-shot for passed thenable
        } else {
            intervalId = setInterval(poll, tickMs);
            poll(); // initial tick
        }

        timeoutId = setTimeout(() => {
            if (!stopped) stop('__TIMEOUT__');
        }, maxMs);

        if (signal?.aborted) onAbort();
        else if (signal) signal.addEventListener?.('abort', onAbort, { once: true });
    });

    return { promise, stop };
};

// =========================================
// --> promisePool
// --------------------------
/**
 * @class PromisePool
 * @description Class to manage a pool of promises with status tracking and concurrency control.
 * @methods
 * add: Adds a promise or array of promises to the pool and sets up handling for resolution.
 * status: Returns the overall status of the promise pool.
 * isDone: Returns true if the pool is done processing all promises.
 * results: Gets the results of the promise pool.
 * stats: Gets the results of the promise pool.
 * clear: Clears all promises from the pool.
 * isEmpty: Returns true if the pool has no promises.
 * @param {Number} maxConcurrency Maximum number of concurrent promises (default: 10)
 * @returns {Object} An instance of the PromisePool class.
 * @example
 * const pool = promisePool(5);
 * pool.add(fetch('https://jsonplaceholder.typicode.com/todos/1'));
 * pool.add(fetch('https://jsonplaceholder.typicode.com/todos/2'));
 * pool.status(); // 'in-progress'
 * pool.isDone(); // use this to check if the pool has completed its cycle
 * pool.on('completed', (stats) => {}); // 'completed' is emitted only if there are any promises
 * pool.on('done', (stats) => {}); // 'done' is emitted whether or not there are any promises
 * pool.on('rejected', (rejectedPromises, stats) => {});
 * pool.on('stats', (stats) => {});
 */
export const promisePool = (maxConcurrency = 10) => {
    let _status = 'not-started'; // 'not-started', 'in-progress', or 'done'
    const promises = {};
    const rejectedPromises = [];
    const queue = [];
    let activeCount = 0;
    let totalAdded = 0;
    let completedCount = 0;
    let rejectedCount = 0;

    return new (class extends EventBus {
        constructor() {
            super();
        }

        /**
         * Clears all promises from the pool and resets state.
         */
        clear() {
            _status = 'done';
            totalAdded = 0;
            completedCount = 0;
            rejectedCount = 0;
            activeCount = 0;
            rejectedPromises.length = 0;
            queue.length = 0;

            Object.keys(promises).forEach((key) => {
                if (promises[key].rejecter) {
                    promises[key].rejecter('Promise pool cleared.');
                }
                delete promises[key];
            });
        }

        /**
         * Adds a promise or array of promises to the pool and sets up handling for resolution.
         * @param {Promise|Array<Promise>|Function|Array<Function>} _promises The promise(s) or function(s) to add to the pool.
         */
        add(_promises) {
            const $this = this;
            if (!_promises) {
                $this._updateStatus();
                return;
            }

            if (_status === 'not-started') {
                _status = 'in-progress';
            }

            const promiseCollection = makeArray(_promises);

            promiseCollection.forEach((promise) => {
                let originalPromise = promise;
                let promiseFunction;

                if (!(promise instanceof Promise)) {
                    if (typeof promise === 'function') {
                        promiseFunction = promise;
                        promise = null; // Will be created when dequeued
                    } else {
                        console.info('---> Invalid promise added to the pool.');
                        rejectedPromises.push(promise.toString());
                        rejectedCount++;
                        return;
                    }
                } else {
                    promiseFunction = () => promise;
                }

                totalAdded++;
                const promiseId = getDynamicId();

                promises[promiseId] = {
                    status: 'in-progress',
                    promise: originalPromise,
                    promiseFunction: promiseFunction,
                    response: null,
                    error: null,
                    resolver: null,
                    rejecter: null,
                };

                queue.push(promiseId);
            });

            this._processQueue();
        }

        /**
         * Processes queued promises up to the concurrency limit.
         * @private
         */
        _processQueue() {
            const $this = this;

            while (activeCount < maxConcurrency && queue.length > 0) {
                const promiseId = queue.shift();
                const promiseData = promises[promiseId];

                if (!promiseData) continue;

                activeCount++;
                $this._updateStatus();

                new Promise((resolve, reject) => {
                    promiseData.resolver = (response) => {
                        if (promiseData.status === 'rejected') {
                            return;
                        }
                        promiseData.status = 'completed';
                        promiseData.response = response;
                        completedCount++;
                        resolve(response);
                    };

                    promiseData.rejecter = (error) => {
                        promiseData.status = 'rejected';
                        promiseData.error = error;
                        rejectedPromises.push(error);
                        rejectedCount++;
                        reject(error);
                    };

                    // Execute the promise function
                    let promise;
                    try {
                        promise = promiseData.promiseFunction();
                        if (!(promise instanceof Promise)) {
                            promise = Promise.resolve(promise);
                        }
                    } catch (error) {
                        promise = Promise.reject(error);
                    }

                    promise
                        .then((response) => {
                            promises[promiseId]?.resolver(response);
                        })
                        .catch((error) => {
                            promises[promiseId]?.rejecter(error);
                        });
                })
                    .catch(() => {
                        // Error already handled by rejecter
                    })
                    .finally(() => {
                        activeCount--;
                        $this._updateStatus();

                        // Continue processing queue
                        if (queue.length > 0) {
                            $this._processQueue();
                        } else if (activeCount === 0) {
                            $this._checkCompletion();
                        }
                    });
            }
        }

        /**
         * Checks if all promises are complete and emits appropriate events.
         * @private
         */
        _checkCompletion() {
            if (_status === 'done') {
                return;
            }

            const allDone = activeCount === 0 && queue.length === 0;

            if (allDone) {
                const instances = Object.values(promises);
                const allCompletedOrRejected = instances.every(
                    (promise) => promise.status === 'completed' || promise.status === 'rejected'
                );

                if (allCompletedOrRejected || totalAdded === 0) {
                    _status = 'done';
                    const stats = this._getStats();

                    // Emits 'done' whether or not there are any promises
                    this.emit('done', stats);

                    // If there are any promises, emit 'completed' and 'rejected'
                    if (totalAdded > 0) {
                        this.emit('completed', stats);
                        if (rejectedPromises.length > 0) {
                            this.emit('rejected', rejectedPromises, stats);
                        }
                    }
                }
            }
        }

        /**
         * Returns the overall status of the promise pool.
         * @returns {String} The current status of the pool ('not-started', 'in-progress', or 'done').
         */
        status() {
            return _status;
        }

        /**
         * Checks if the pool has finished processing all promises.
         * @returns {Boolean} True if all promises are resolved or rejected.
         */
        isDone() {
            return _status === 'done';
        }

        /**
         * Checks if the pool is empty (no promises added).
         * @returns {Boolean} True if the pool has no promises.
         */
        isEmpty() {
            return totalAdded === 0;
        }

        /**
         * Gets the results of the promise pool.
         * @returns {Object} The results of the promise pool.
         */
        results() {
            return this._getStats();
        }

        /**
         * Gets the statistics of the promise pool.
         * @returns {Object} The statistics of the promise pool.
         */
        stats() {
            return this.results();
        }

        /**
         * Generates current statistics for the promise pool.
         * @private
         * @returns {Object} Statistics object.
         */
        _getStats() {
            const instances = Object.values(promises);
            return {
                completed: completedCount,
                rejected: rejectedCount,
                pending: queue.length + activeCount,
                total: totalAdded,
                errors: rejectedPromises.join('\n'),
                promises,
            };
        }

        /**
         * Updates the status and emits stats event.
         * @private
         */
        _updateStatus() {
            const stats = this._getStats();
            this.emit('stats', stats);
        }
    })();
};

// =========================================
// --> doTimeout
// --------------------------
const doTimeoutStore = {};

/**
 * Initialize, cancel, or force execution of a callback after a delay using a unique ID.
 * If delay and callback are specified, a timeout is initialized. The callback will execute
 * asynchronously after the delay. If an ID is specified, this timeout will override and
 * cancel any existing timeout with the same ID. Any additional arguments will be passed
 * into the callback when it is executed.
 * If the callback returns true, the timeout loop will execute again, after the delay,
 * creating a polling loop until the callback returns a non-true value.
 *
 * @param {string|number} idOrDelay - A unique identifier for this timeout or the delay if no ID is given.
 * @param {number|Function} delayOrCallback - A zero-or-greater delay in milliseconds or the callback function if no ID is given.
 * @param {Function} [callback] - A function to be executed after delay milliseconds.
 * @param {...any} args - Additional arguments to pass to the callback.
 * @returns {boolean | undefined} - If the callback is yet to be executed, true is returned, otherwise undefined.
 * @usage
 * // Initialize a timeout with an ID
 * doTimeout('myTimeout', 1000, () => console.log('Hello, world!'));
 * // Initialize a timeout without an ID
 * doTimeout(1000, () => console.log('Hello, world!'));
 * // Cancel a timeout with an ID
 * doTimeout('myTimeout');
 * // Force execution of a timeout with an ID
 * doTimeout('myTimeout', 0);
 * // Initialize a polling loop
 * doTimeout(100, function() {
 *     if (someCondition()) {
 *         console.log('Condition met, stopping the polling.');
 *         return false;  // Stop polling when some condition is true
 *     }
 *     console.log('Condition not met, continue polling.');
 *     return true;  // Continue polling by returning true
 * });
 */
export function doTimeout(idOrDelay, delayOrCallback, callback, ...args) {
    let id, delay;

    if (typeof idOrDelay === 'string' && typeof delayOrCallback === 'number') {
        id = idOrDelay;
        delay = delayOrCallback;
    } else if (typeof idOrDelay === 'number' && typeof delayOrCallback === 'function') {
        delay = idOrDelay;
        callback = delayOrCallback;
    } else if (!delayOrCallback && typeof idOrDelay === 'string') {
        id = idOrDelay;
    } else {
        throw new Error('Invalid parameters');
    }

    // Namespace for timeout IDs to prevent conflicts
    const namespace = '_doTimeout_';
    const fullId = id ? namespace + id : null;

    // Clear any existing timeout with this ID
    if (fullId && fullId in doTimeoutStore) {
        clearTimeout(doTimeoutStore[fullId]);
        delete doTimeoutStore[fullId];
    }

    // Clean up function to remove the timeout ID
    function cleanup() {
        if (fullId && fullId in doTimeoutStore) {
            delete doTimeoutStore[fullId];
        }
    }

    // Setup the actual timeout function
    function setupTimeout() {
        doTimeoutStore[fullId] = setTimeout(() => {
            if (callback(...args) === true) {
                setupTimeout();
            } else {
                cleanup();
            }
        }, delay);
    }

    // If callback is a function and delay is defined, set up the timeout
    if (typeof callback === 'function' && typeof delay === 'number') {
        setupTimeout();
        return true;
    }

    // Cancel the timeout without executing the callback
    if (id && delay === undefined) {
        cleanup();
    }
}

// =========================================
// --> doAsync
// --------------------------
/**
 * Wraps a function that might be synchronous or asynchronous into a standardized asynchronous workflow.
 * Helps to mitigate the need to know if a function is synchronous or asynchronous.
 * @param {Function} fn - A function that may be synchronous or return a Promise.
 * @param {...any} args - Arguments to be passed to the function.
 * @returns {Promise<any>} - A Promise resolving with the function's return value or resolving with `true` if the function returns void or rejecting with any thrown error.
 */
export function doAsync(fn, ...args) {
    return new Promise((resolve, reject) => {
        try {
            Promise.resolve(fn(...args))
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        } catch (error) {
            reject(error);
        }
    });
}
