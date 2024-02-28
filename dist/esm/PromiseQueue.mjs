class EventBus {
    constructor() {
        // Memory storage for all the events
        this.listeners = {};
    }
    // creates an event that can be triggered any number of times
    /**
     * creates an event that can be triggered any number of times
     * @method on
     * @param {string} eventName - The name of the event
     * @param {function} callback - The callback to execute
     * @return {void}
     * @example eventBus.on('event.name', function() { console.log('event.name was triggered') })
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
     * @example eventBus.once('event.name', function() { console.log('event.name was triggered only once') })
     */
    once(eventName, callback) {
        this.registerListener(eventName, callback, 1);
    }
    /**
     * reates an event that can be triggered only a number of times. If it is emitted more than that, the callback will not be be executed anymore!
     * @method exactly
     * @param {string} eventName - The name of the event
     * @return {void}
     * @example eventBus.exactly('event.name', function() { console.log('event.name was triggered 3 times') }, 3)
     */
    exactly(eventName, callback, capacity) {
        this.registerListener(eventName, callback, capacity);
    }
    /**
     * kill an event with all it's callbacks
     * @method off
     * @param {string} eventName - The name of the event
     * @return {void}
     * @example eventBus.off('event.name')
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
     * @example eventBus.detach('event.name', callback)
     */
    detach(eventName, callback) {
        const listeners = this.listeners[eventName] || [];
        const filteredListeners = listeners.filter(function (value) {
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
     * @example eventBus.emit('event.name', arg1, arg2, arg3)
     * @example eventBus.emit('event.name', arg1, arg2, arg3, {__context: YourInstance})
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
                // which will suppport emit("name*") or emit("name**") or emit("name.*name**")
                matches = this.patternSearch(eventName, Object.keys(this.listeners));
                if (matches) {
                    matches.forEach((match) => {
                        queueListeners = queueListeners.concat(this.listeners[match]);
                    });
                }
            } else {
                // case 2, if the incoming string matches a registered pattern
                // which will support on("name*") | on("name**") | on("name.*name**")
                for (const key in this.listeners) {
                    matches = this.patternSearch(key, [eventName]);
                    if (matches) {
                        queueListeners = queueListeners.concat(this.listeners[key]);
                    }
                }
            }
        }
        queueListeners.forEach((listener, k) => {
            let callback = listener.callback;
            if (context) {
                callback = callback.bind(context);
            }
            callback(...args);
            if (listener.triggerCapacity !== undefined) {
                listener.triggerCapacity--;
                queueListeners[k].triggerCapacity = listener.triggerCapacity;
            }
            if (this.checkToRemoveListener(listener)) {
                this.listeners[eventName].splice(k, 1);
            }
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
        const regex = new RegExp(this.setWildCardString(pattern));
        filteredList = list.filter((item) => regex.test(item));
        return filteredList.length === 0 ? null : filteredList;
    }
    setWildCardString(string) {
        // eslint-disable-next-line
        let regexStr = string.replace(/([.+?^${}()|\[\]\/\\])/g, '\\$&'); // escape all regex special chars
        regexStr = regexStr
            // eslint-disable-next-line
            .replace(/\*\*/g, '[_g_]') // Replace wildcard patterns with temporary markers
            // eslint-disable-next-line
            .replace(/\*/g, '(.*?)')
            .replace(/\[_g_\]/g, '.*');
        return `^${regexStr}$`;
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
            // eslint-disable-next-line
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

/**
 * Generate unique ids
 * @function getDynamicId
 * @memberof Utility
 * @return string Format kn__000000__000
 */
function getDynamicId() {
    return 'kn__' + new Date().getTime() + '__' + Math.floor(Math.random() * (999 - 100));
}

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
        rejectPromise(console.error('Polling was cancelled or timed out.'));
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

export { promisePool as PromisePool, PromiseQueue, doPoll, promisePool, PromiseQueue as promiseQueue };
