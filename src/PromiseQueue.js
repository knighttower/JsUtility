import { EventBus } from './EventBus.js';
import { getDynamicId, makeArray } from './Utility.js';

/**
 * @class promisePool
 * @description Class to manage a pool of promises with status tracking.
 * @methods
 * add: Adds a promise to the pool and sets up handling for resolution.
 * status: Returns the overall status of the promise pool.
 * isDone: Returns true if the pool is done processing all promises.
 * clear: Clears all promises from the pool.
 */
const promisePool = () => {
    let _status = 'in-progress'; // 'in progress' or 'done'
    let promises = {};
    let rejectedPromises = [];

    return new (class extends EventBus {
        constructor() {
            super();
        }
        /**
         * Adds a promise to the pool and sets up handling for resolution.
         * @param {Promise|Array} promise The promise to add to the pool.
         */
        add(promise) {
            // console.log(promise instanceof Promise !== true, !Array.isArray(promise));
            const isValid =
                promise instanceof Promise !== true ||
                !(Array.isArray(promise) && promise.every((item) => item instanceof Promise));

            if (!isValid) {
                throw new Error('promisePool: The first argument must be a promise or an array of promises.');
            }
            const $this = this;
            const promiseCollection = makeArray(promise);
            promiseCollection.forEach((promise) => {
                const promiseBag = Promise.all([promise]);
                const promiseId = getDynamicId();
                promises[promiseId] = {
                    promiseBag,
                    status: 'in-progress',
                };
                promiseBag
                    .then(() => {
                        promises[promiseId].status = 'completed';
                        $this._updateStatus();
                    })
                    .catch(() => {
                        promises[promiseId].status = 'rejected';
                        $this._updateStatus();
                    });
            });
        }

        /**
         * Returns the overall status of the promise pool.
         * @returns {String} The current status of the pool.
         */
        status() {
            return _status;
        }

        isDone() {
            return _status === 'done';
        }

        _updateStatus() {
            if (_status === 'done') {
                return;
            }

            const instances = Object.values(promises);
            instances.forEach((promise) => {
                if (promise.status === 'rejected') {
                    rejectedPromises.push(promise);
                }
            });

            const statuses = instances.every(
                (promise) => promise.status === 'completed' || promise.status === 'rejected',
            );

            _status = statuses ? 'done' : 'in-progress';

            this.emit('stats', {
                completed: instances.filter((promise) => promise.status === 'completed').length,
                rejected: rejectedPromises.length,
                pending: instances.filter((promise) => promise.status === 'in-progress').length,
                total: instances.length,
            });

            if (_status === 'done') {
                this.emit('completed');
                this.emit('rejected', rejectedPromises);
                this.clear();
            }
        }

        /**
         * Clears all promises from the pool.
         */
        clear() {
            promises = {};
            rejectedPromises = [];
        }
    })();
};

/**
 * @class PromiseQueue
 * Class to manage a queue of promises, executing them sequentially with status tracking for each promise.
 * @extends EventBus
 * @methods
 * add: Adds a promise to the queue and starts the queue processing if not already started.
 * clear: Clears the promise queue.
 * status: Returns the current status of all promises in the queue.
 */
const PromiseQueue = class extends EventBus {
    constructor() {
        super();
        this.queue = [];
        this.inProgress = false;
        this._timer = null;
    }

    /**
     * Adds a promise to the queue and starts the queue processing if not already started.
     * @param {Function} promiseFunction A function that returns a promise.
     */
    add(promises) {
        makeArray(promises).forEach((promiseFunction) => {
            this.queue.push({
                promiseFunction,
                status: 'pending', // 'pending', 'fulfilled', or 'rejected'
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
        this.queue = [];
    }

    _setTimer() {
        if (this._timer) {
            clearInterval(this._timer);
        }
        this._timer = setInterval(() => {
            if (this.status() === 'done') {
                this.emit('completed');
                clearInterval(this._timer);
                this._timer = null;
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
        const { promiseFunction } = this.queue[0];
        promiseFunction()
            .then(() => {
                this.queue[0].status = 'fulfilled';
            })
            .catch(() => {
                this.queue[0].status = 'rejected';
            })
            .finally(() => {
                this.queue.shift(); // Remove the processed promise from the queue
                this._next(); // Process the next promise
            });
    }

    /**
     * Returns the current status of all promises in the queue.
     * @returns {Array<Object>} An array of objects with the status of each promise.
     */
    status() {
        return this.queue.length === 0 ? 'done' : 'in-progress';
    }
};

/**
 * Creates a poll function that continuously calls a given function until it returns true or a promise resolves.
 * @param {Function} fn - The function to be polled. It can return a promise or a boolean.
 * @param {Object} options - Configuration options for polling.
 * @param {number} [options.interval=200] - The interval in milliseconds between each poll.
 * @param {number} [options.timeout=1000] - The maximum time in milliseconds to continue polling.
 * @returns {Object} { promise, stop } - An object containing the polling promise and a cancel function.
 * @fails returns 'failed' if the polling times out or is cancelled.
 * @example
 * const { promise, stop } = doPoll(() => {
 *    // Polling logic here
 *   return true; // or return a promise
 * }
 */
const doPoll = (fn, options = {}) => {
    if (typeof fn !== 'function') {
        throw new Error('doPoll: The first argument must be a function.');
    }
    const { interval = 200, timeout = 1000 } = options;
    let timeoutId, intervalId;
    let resolvePromise, rejectPromise;
    let stopped = false;

    const stop = () => {
        clearTimers();
        console.error('Polling was cancelled or timed out.');
        rejectPromise('failed');
    };

    const done = (result) => {
        clearTimers();
        resolvePromise(result);
    };

    function clearTimers() {
        stopped = true;
        clearTimeout(timeoutId);
        clearInterval(intervalId);
    }

    const promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
        const isPromise = fn instanceof Promise;

        const poll = () => {
            if (stopped) {
                return;
            }

            const pollThis = isPromise ? fn : fn();

            if (isPromise) {
                pollThis
                    .then((resolvedValue) => {
                        if (resolvedValue) {
                            done(resolvedValue);
                        }
                    })
                    .catch(rejectPromise);
            } else {
                if (Boolean(pollThis) || pollThis) {
                    done(pollThis);
                }
            }
        };

        intervalId = setInterval(poll, interval);
        poll(); // Initial call to handle any immediate resolution

        timeoutId = setTimeout(() => {
            if (!stopped) {
                stop();
            }
        }, timeout);
    });

    return { promise, stop };
};

export { promisePool, promisePool as PromisePool, PromiseQueue, PromiseQueue as promiseQueue, doPoll };
