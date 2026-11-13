'use strict';

class EventBus {
    constructor() {
        // cleanup
        // An object without prototype: a normal one ({}) already has 'constructor', 'toString' and
        // the like, so events with those names were taken for registered ones and broke
        this.listeners = Object.create(null);
    }
    // creates an event that can be triggered any number of times
    /**
     * creates an event that can be triggered any number of times
     * @method on
     * @param {string} eventName - The name of the event
     * @param {function} callback - The callback to execute
     * @return {void}
     * @example EventBus.on('event.name', function() { console.log('event.name was triggered') })
     */
    on(eventName, callback) {
        this.registerListener(eventName, callback);
    }
    /**
     * creates an event that can be triggered only once. If it is emitted twice, the callback will only be executed once!
     * @method once
     * @param {string} eventName - The name of the event
     * @param {function} callback - The callback to execute
     * @return {void}
     * @example EventBus.once('event.name', function() { console.log('event.name was triggered only once') })
     */
    once(eventName, callback) {
        this.registerListener(eventName, callback, 1);
    }
    /**
     * reates an event that can be triggered only a number of times. If it is emitted more than that, the callback will not be be executed anymore!
     * @method exactly
     * @param {string} eventName - The name of the event
     * @return {void}
     * @example EventBus.exactly('event.name', function() { console.log('event.name was triggered 3 times') }, 3)
     */
    exactly(eventName, callback, capacity) {
        this.registerListener(eventName, callback, capacity);
    }
    /**
     * kill an event with all it's callbacks
     * @method off
     * @param {string} eventName - The name of the event
     * @return {void}
     * @example EventBus.off('event.name')
     */
    off(eventName) {
        delete this.listeners[eventName];
    }
    /**
     * removes the given callback for the given event
     * @method detach
     * @param {string} eventName - The name of the event
     * @param {function} callback - The callback to remove
     * @return {void|boolean} - Returns true if the event was found and removed, void otherwise
     * @example EventBus.detach('event.name', callback)
     */
    detach(eventName, callback) {
        const listenersRecords = this.listeners[eventName] || [];
        const filteredListeners = listenersRecords.filter(function (value) {
            return value.callback !== callback;
        });
        if (eventName in this.listeners) {
            this.listeners[eventName] = filteredListeners;
            return true; // Event was found and removed
        }
        return false; // Event was not found
    }

    /**
     * emits an event with the given name and arguments
     * @param {string} eventName - The name of the event
     * @param {any} args - The arguments to pass to the callback
     * @return {void}
     * @use {__context: this|Instance} to pass the context to the callback
     * @example EventBus.emit('event.name', arg1, arg2, arg3)
     * @example EventBus.emit('event.name', arg1, arg2, arg3, {__context: YourInstance})
     */
    emit(eventName, ...args) {
        const [context, params] = this.extractContextFromArgs(args);
        const names = Object.keys(this.listeners);
        let matches;

        if (typeof eventName !== 'string' && this.hasListener(eventName)) {
            // name exact match, the only one possible for a name that is not a string (a number, a symbol)
            matches = [eventName];
        } else if (eventName.includes('*')) {
            // -----------------------------------------
            // Wildcard support
            // case 1, if the incoming string has * or ** in it
            // Matches the emit 'eventName' to the registered 'on' this.listeners
            // The listeners registered under that same name are among them, since it matches itself
            matches = this.patternSearch(eventName, names) ?? [];
        } else {
            // case 2, if the incoming string does not have * or ** in it
            // name exact match, plus the patterns from the this.listeners (on method) that match the
            // emit name. Having the exact name registered used to leave those patterns out, even
            // when none of its listeners was left
            matches = names.filter(
                (name) =>
                    name === eventName ||
                    (name.includes('*') && this.patternSearch(name, [eventName]))
            );
        }

        // Every listener is collected, along with the name it was registered under, before any of
        // them is called, since the callbacks can add and remove listeners
        const queueListeners = [];
        matches.forEach((name) => {
            this.listeners[name].forEach((listener) => queueListeners.push([name, listener]));
        });

        queueListeners.forEach(([name, listener]) => {
            if (listener.triggerCapacity !== undefined) {
                listener.triggerCapacity--;
            }
            if (this.checkToRemoveListener(listener)) {
                // Removed from the list it was registered in, wherever it is in that list by now
                const registered = this.listeners[name] ?? [];
                const index = registered.indexOf(listener);
                if (index > -1) {
                    registered.splice(index, 1);
                }
            }
            listener.callback.apply(context || undefined, params);
        });
    }
    /**
     * Search for a pattern in a list of strings
     * @method patternSearch
     * @private
     * @param {string} pattern - The pattern to search for
     * @param {string[]} list - The list of strings to search in
     * @return {string[]|null} - Returns a list of strings that match the pattern, or null if no match is found
     * @example patternSearch('name.*', ['name.a', 'name.b', 'name.c']) // returns ['name.a', 'name.b', 'name.c']
     */
    patternSearch(pattern, list) {
        let filteredList = [];
        // console.log('__testLogHere__', pattern, this.setWildCardString(pattern));
        // Without the 'g' flag: with it, test() carries on from where the previous match ended,
        // so the item that came after a match was never found
        const regex = new RegExp(this.setWildCardString(pattern));

        filteredList = list.filter((item) => regex.test(item));
        return filteredList.length === 0 ? null : filteredList;
    }
    setWildCardString(string) {
         
        let regexStr = string.replace(/([.+?^${}()|\[\]\/\\])/g, '\\$&'); // escape all regex special chars
         
        regexStr = regexStr.replace(/\*/g, '(.*?)');
        return `^${regexStr}`;
    }
    /**
     * Extract the context from the arguments
     * @method extractContextFromArgs
     * @private
     * @param {any[]} args - The arguments to extract the context from
     * @return {any[]} - Returns an array with the context as the first element and the arguments as the second element
     */
    extractContextFromArgs(args) {
        let context = null;
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
             
            // Checked through Object: the data can be an object without a hasOwnProperty of its own
            if (
                arg &&
                typeof arg === 'object' &&
                Object.prototype.hasOwnProperty.call(arg, '__context')
            ) {
                context = arg.__context;
                args.splice(i, 1);
                break;
            }
        }
        return [context, args];
    }
    registerListener(eventName, callback, triggerCapacity) {
        if (!this.hasListener(eventName)) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push({ callback, triggerCapacity });
    }
    checkToRemoveListener(eventInformation) {
        if (eventInformation.triggerCapacity !== undefined) {
            return eventInformation.triggerCapacity <= 0;
        }
        return false;
    }
    hasListener(eventName) {
        return eventName in this.listeners;
    }
}

// // -----------------------------------------
// /**
//  * @knighttower
//  * @url knighttower.io
//  * @git https://github.com/knighttower/
//  */
// // -----------------------------------------


/**
 * Make sure the the item is an array or convert it to an array
 * @function makeArray
 * @param {String|Array} item
 * @return array
 * @example makeArray('test') // ['test']
 */
const makeArray = (item) => (Array.isArray(item) ? item : [item]);

/**
 * Generate a random alphanumeric string (not an RFC UUID, and not for security purposes)
 * @function uuid
 * @param {Number} max Length of the string. Defaults to 20, and to 40 when 0 or any other falsy value is passed
 * @return string
 * @example uuid() // 20 characters
 * @example uuid(8) // 8 characters
 */
const uuid = (max = 20) => {
    const rnd = () => Math.random().toString(36).substring(2, 15);
    max = max || 40;
    var str = '';
    for (var i = 0; i < max / 3 + 1; i++) {
        str += rnd();
    }
    return str.substring(0, max);
};

/**
 * Generate unique ids
 * @function getDynamicId
 * @memberof utility
 * @return string Format id__00000000__000
 */
function getDynamicId() {
    return 'id__' + uuid(8) + '__' + new Date().getTime();
}

/**
 * Check the type of a variable, and get the correct type for it. It also accepts simple comparisons
 * For more advance type checking see https://github.com/knighttower/JsTypeCheck
 * @param {any} input - The variable to check
 * @param {string} test - The types to check against, piped string
 * @return {string|boolean} - The type of the variable
 * @example typeOf('hello', 'string') // returns true
 * @example typeOf('hello', 'number') // returns false
 * @example typeOf('hello', 'string') // returns true
 * @example typeOf('hello') // returns 'string'
 * @example typeOf(123, 'number|int') // returns 'number'
 * @example typeOf(null, 'null|string') // returns 'null'
 * @example typeOf({}) // returns 'object'
 * @example typeOf([]) // returns 'array'
 */
function typeOf(input, test) {
    // null and arrays are both 'object' for the native typeof
    let inputType = typeof input;
    if (input === null) {
        inputType = 'null';
    } else if (Array.isArray(input)) {
        inputType = 'array';
    }

    if (test) {
        if (test.includes('|')) {
            for (let type of test.split('|')) {
                if (inputType === type) {
                    return type;
                }
            }
            return false;
        }

        return test === inputType;
    }

    return inputType;
}

// //   utility; {
//     convertToBool,
//     currencyToDecimal,
//     convertToNumber,
//     dateFormat,
//     decimalToCurrency,
//     emptyOrValue,
//    extend,
//     formatPhoneNumber,
//     getDynamicId,
//     getRandomId,
//     includes,
//     isEmpty, // from https://moderndash.io/
//     isNumber,
//     instanceOf,
//     toCurrency,
//     toDollarString,
//     typeOf,
//     validateEmail,
//     validatePhone,
//     makeArray,
//     uuid,
//     uniqueId,
// };

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
const promiseQueue = () => {
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
                    promise = new Promise(async (resolve, reject) => {
                        // An error thrown by the function, or the rejection of the promise it returns,
                        // rejects this promise. Both were lost before, so this promise never settled
                        // and the queue never finished
                        try {
                            const fx = await promise();
                            return resolve(fx);
                        } catch (error) {
                            return reject(error);
                        }
                    });
                } else {
                    // String() instead of .toString(), which throws when the value is null or undefined
                    console.error('---> Invalid promise added to the Queue:', String(promise));
                    return this.emit('fail', String(promise));
                }
            }

            makeArray(promise).forEach((promiseFunction) => {
                // A promise can be rejected while it waits for its turn. With nothing attached to it
                // yet, that is an unhandled rejection, which stops a Node process. This only marks it
                // as handled, the rejection is still recorded when its turn comes
                promiseFunction.catch(() => {});
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
            // With a new list: the copy alone would keep sharing the one that already has promises in it
            this._stats = { ...stats, promises: [] };
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
            // clear() can be called while this promise is running. By the time it settles it is not
            // the first one in the queue anymore, so what follows would be applied to another
            // promise, or to none at all
            const item = this.queue[0];
            const wasCleared = () => this.queue[0] !== item;
            promiseFunction
                .then((response) => {
                    if (wasCleared()) return;
                    this.queue[0].status = 'fulfilled';
                    this.queue[0].response = response;
                    this._stats.completed++;
                })
                .catch((error) => {
                    if (wasCleared()) return;
                    this._stats.errors += error + '\n';
                    this.queue[0].status = 'rejected';
                    this.queue[0].error = error;
                    this._stats.rejected++;
                })
                .finally(() => {
                    if (wasCleared()) return;
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
const doPoll = (fn, options = {}) => {
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

        // The first tick may have settled it already, and the clean up has run by then. The timeout
        // below would never be cleared and the listener would stay on the signal
        if (settled) return;

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
const promisePool = (maxConcurrency = 10) => {
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
            activeCount = 0;
            queue.length = 0;

            Object.keys(promises).forEach((key) => {
                if (promises[key].rejecter) {
                    promises[key].rejecter('Promise pool cleared.');
                }
                delete promises[key];
            });

            // These two are reset after the loop: rejecting the promises that were running
            // counts them as rejected
            rejectedCount = 0;
            rejectedPromises.length = 0;
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
                        // String() instead of .toString(), which throws when the value is null or undefined
                        rejectedPromises.push(String(promise));
                        rejectedCount++;
                        return;
                    }
                } else {
                    // It is already running and can be rejected while it waits in line. With nothing
                    // attached to it yet, that is an unhandled rejection, which stops a Node process.
                    // This only marks it as handled, the rejection is still recorded when its turn comes
                    promise.catch(() => {});
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

            // A pool that is done, or was cleared, starts over when it gets more promises to process.
            // Its status stayed as 'done' before, so 'done' and 'completed' were never emitted again
            if (queue.length > 0) {
                _status = 'in-progress';
            }

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
                        // clear() took it out of the pool while it was running and reset the count,
                        // so there is nothing left to update for it
                        if (promises[promiseId] !== promiseData) return;
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
            Object.values(promises);
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
function doTimeout(idOrDelay, delayOrCallback, callback, ...args) {
    let id, delay;

    if (typeof idOrDelay === 'string' && typeof delayOrCallback === 'number') {
        id = idOrDelay;
        delay = delayOrCallback;
    } else if (typeof idOrDelay === 'number' && typeof delayOrCallback === 'function') {
        // Without an ID, what came in as 'callback' is the first of the additional arguments
        if (arguments.length > 2) {
            args.unshift(callback);
        }
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
function doAsync(fn, ...args) {
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

exports.doAsync = doAsync;
exports.doPoll = doPoll;
exports.doTimeout = doTimeout;
exports.promisePool = promisePool;
exports.promiseQueue = promiseQueue;
