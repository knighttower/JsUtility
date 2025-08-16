class EventBus {
    constructor() {
        // cleanup
        this.listeners = {};
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
        let queueListeners = [];
        let matches = null;
        const allArgs = this.extractContextFromArgs(args);
        const context = allArgs[0];
        args = allArgs[1];

        // name exact match
        if (this.hasListener(eventName)) {
            queueListeners = this.listeners[eventName];
        } else {
            // -----------------------------------------
            // Wildcard support
            if (eventName.includes('*')) {
                // case 1, if the incoming string has * or ** in it
                // Matches the emit 'eventName' to the registered 'on' this.listeners
                matches = this.patternSearch(eventName, Object.keys(this.listeners));

                if (matches.length > 0) {
                    matches.forEach((match) => {
                        queueListeners = queueListeners.concat(this.listeners[match]);
                    });
                }
            } else {
                // case 2, if the incoming string does not have * or ** in it
                // get the patterns from the this.listeners (on method) and match them to the emit name
                for (const key in this.listeners) {
                    if (key.includes('*')) {
                        matches = this.patternSearch(key, [eventName]);
                        if (matches) {
                            queueListeners = queueListeners.concat(this.listeners[key]);
                        }
                    }
                }
            }
        }

        queueListeners.forEach((listener, k) => {
            let callback = listener.callback;
            if (context) {
                callback = callback.bind(context);
            }
            if (listener.triggerCapacity !== undefined) {
                listener.triggerCapacity--;
                queueListeners[k].triggerCapacity = listener.triggerCapacity;
            }
            if (this.checkToRemoveListener(listener)) {
                this.listeners[eventName].splice(k, 1);
            }
            callback(...args);
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
        const regex = new RegExp(this.setWildCardString(pattern), 'g');

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
             
            if (arg && typeof arg === 'object' && arg.hasOwnProperty('__context')) {
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
 * @return string Format kn__000000__000
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
 * @example typeOf({}) // returns 'object'
 */
function typeOf(input, test) {
    // Special case for null since it can be treated as an object
    if (input === null) {
        if (test) {
            return test === null || test === 'null' ? true : false;
        }
        return 'null';
    }

    let inputType;

    switch (typeof input) {
        case 'number':
        case 'string':
        case 'boolean':
        case 'undefined':
        case 'bigint':
        case 'symbol':
        case 'function':
            inputType = typeof input;
            break;
        case 'object':
            inputType = Array.isArray(input) ? 'array' : 'object';

            break;
        default:
            inputType = 'unknown';
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
//     getGoogleMapsAddress,
//     getRandomId,
//     includes,
//     isEmpty, // from https://moderndash.io/
//     isNumber,
//     instanceOf,
//     openGoogleMapsAddress,
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
const doPoll = (fn, options = {}) => {
    const isThenable = (v) =>
        v != null &&
        (typeof v === 'object' || typeof v === 'function') &&
        typeof v.then === 'function';

    if (!(typeof fn === 'function' || isThenable(fn))) {
        throw new Error('doPoll: The first argument must be a function or Promise.');
    }

    const { msg, interval = 200, timeout = 1000, timeoutMsg = msg ?? null, signal } = options;
    const tickMs = Number.isFinite(interval) && interval > 0 ? interval : 200;
    const maxMs = Number.isFinite(timeout) && timeout > 0 ? timeout : 1000;
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
 * @description Class to manage a pool of promises with status tracking.
 * @methods
 * add: Adds a promise or array of promises to the pool and sets up handling for resolution.
 * status: Returns the overall status of the promise pool.
 * isDone: Returns true if the pool is done processing all promises.
 * results: Gets the results of the promise pool.
 * stats: Gets the results of the promise pool.
 * clear: Clears all promises from the pool.
 * @returns {Object} An instance of the PromisePool class.
 * @example
 * const pool = promisePool();
 * pool.add(fetch('https://jsonplaceholder.typicode.com/todos/1'));
 * pool.add(fetch('https://jsonplaceholder.typicode.com/todos/2'));
 * pool.status(); // 'in-progress'
 * pool.isDone(); // use this to check if the pool has completed its cycle
 * pool.on('completed', (stats) => {}); // 'completed' is emitted only if there are any promises
 * pool.on('done', (stats) => {}); // 'done' is emitted whether or not there are any promises
 * pool.on('rejected', (rejectedPromises, stats) => {});
 * pool.on('stats', (stats) => {});
 */
const promisePool = () => {
    let _status = 'not-started'; // 'in-progress' or 'done'
    const promises = {};
    const rejectedPromises = [];
    let _stats = {
        completed: 0,
        rejected: 0,
        pending: 0,
        total: 0,
        errors: '',
    };

    return new (class extends EventBus {
        constructor() {
            super();
            const $this = this;
            this._currentPoll = null;
            setTimeout(() => {
                $this._poll();
            }, 100);
        }

        _poll() {
            const $this = this;
            this._currentPoll && this._currentPoll.stop();
            this._currentPoll = doPoll(
                () => {
                    if ($this.isDone()) {
                        return true;
                    }
                },
                { timeoutMsg: '' }
            );
            return this._currentPoll;
        }

        clear() {
            _status = 'not-started';
            _stats = {
                completed: 0,
                rejected: 0,
                pending: 0,
                total: 0,
                errors: '',
            };
            rejectedPromises.length = 0;
            Object.keys(promises).forEach((key) => {
                promises[key].rejecter('Promise pool cleared.');
                delete promises[key];
            });
            this._currentPoll = this._poll();
        }

        /**
         * Adds a promise or array of promises to the pool and sets up handling for resolution.
         * @param {Promise|Array<Promise>} _promises The promise or array of promises to add to the pool.
         */
        add(_promises) {
            const $this = this;
            if (!_promises) {
                $this._updateStatus();
                return;
            }
            _status = 'in-progress';
            const promiseCollection = makeArray(_promises);

            promiseCollection.forEach((promise) => {
                if (!(promise instanceof Promise)) {
                    if (typeof promise === 'function') {
                        promise = doAsync(() => promise());
                    } else {
                        console.info('---> Invalid promise added to the pool.');
                        rejectedPromises.push(promise.toString());
                        return;
                    }
                }
                _stats.total++;
                const promiseId = getDynamicId();

                promises[promiseId] = {
                    status: 'in-progress',
                    response: null,
                    error: null,
                    resolver: null,
                    rejecter: null,
                };
                new Promise((resolve, reject) => {
                    promises[promiseId].resolver = (response) => {
                        if (promises[promiseId].status === 'rejected') {
                            return;
                        }
                        promises[promiseId].status = 'completed';
                        promises[promiseId].response = response;
                        $this._updateStatus();
                        resolve(response);
                    };
                    promises[promiseId].rejecter = (error) => {
                        promises[promiseId].status = 'rejected';
                        promises[promiseId].error = error;
                        rejectedPromises.push(error);
                        $this._updateStatus();
                        reject();
                    };
                    promise
                        .then((response) => {
                            // using the "?" in case it has been removed from the pool
                            promises[promiseId]?.resolver(response);
                        })
                        .catch((error) => {
                            promises[promiseId]?.rejecter(error);
                        });
                }).catch((error) => {
                    promises[promiseId]?.rejecter(error);
                });
            });
        }

        /**
         * Returns the overall status of the promise pool.
         * @returns {String} The current status of the pool.
         */
        status() {
            this._updateStatus();
            return _status;
        }

        /**
         * Checks if the pool has finished processing all promises.
         * @returns {Boolean} True if all promises are resolved or rejected.
         */
        isDone() {
            this._updateStatus();
            return _status === 'done';
        }

        isEmpty() {
            return _stats.total === 0;
        }

        /**
         * gets the results of the promise pool.
         * @returns {Object} The results of the promise pool.
         */
        results() {
            this._updateStatus();
            return _stats;
        }
        stats() {
            return this.results();
        }

        /**
         * Updates the status of the promise pool based on the status of individual promises.
         * @private
         */
        _updateStatus() {
            if (_status === 'done') {
                return;
            }
            const instances = Object.values(promises);

            _stats = {
                completed: instances.filter((promise) => promise.status === 'completed').length,
                rejected: instances.filter((promise) => promise.status === 'rejected').length,
                pending: instances.filter((promise) => promise.status === 'in-progress').length,
                total: instances.length,
                errors: rejectedPromises.join('\n'),
                promises,
            };
            this.emit('stats', _stats);

            const allCompletedOrRejected = instances.every(
                (promise) => promise.status === 'completed' || promise.status === 'rejected'
            );

            _status = allCompletedOrRejected || _stats.total === 0 ? 'done' : 'in-progress';

            if (_status === 'done') {
                //emits 'done' whether or not there are any promises but the pool has run its cycle
                this.emit('done', _stats);
                // if there are any promises, emit 'completed' and 'rejected'
                if (_stats.total > 0) {
                    this.emit('completed', _stats);
                    this.emit('rejected', rejectedPromises, _stats);
                }
            }
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

export { doAsync, doPoll, doTimeout, promisePool, promiseQueue };
