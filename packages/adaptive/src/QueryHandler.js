// Author Knighttower
// MIT License
// Copyright (c) [2022] [Knighttower] https://github.com/knighttower

/**
 * @class CSS Query Handler
 * @return QueryHandler
 */
const QH = (function QueryHandler() {
    ('use strict');
    const $window = typeof window !== 'undefined' ? window : {};
    /**
     * Query Handler Class Object
     * @private
     * @return {Object}
     */
    const $this = {};
    const QueryHandler = new Proxy($this, {
        get(target, prop) {
            if (prop in target) {
                return target[prop];
            }
        },
    });

    /**
     * Holds memory of registered queries expressions
     * @private
     */
    const registeredQueries = {};

    /**
     * Holds memory of registered queries to match
     * @private
     */
    const domQueriesMatch = {};

    /**
     * Holds memory of registered queries to Unmatch
     * @private
     */
    const domQueriesUnMatch = {};

    /**
     * Flag
     * @private
     */
    let loaded = false;

    // =========================================
    // --> PUBLIC
    // --------------------------

    /**
     * Register a query
     * @param {Object} queries Media queries with breakdowns and directives
     * @param {Function} matchCallback Callback
     * @param {Function|Null} unMatchCallback Callback
     * @param {Object|Null} Adaptive When in use with Adaptive.js object
     * @return {Void}
     */
    $this.add = (queries, matchCallback, unMatchCallback = null, Adaptive = null) => {
        for (let query in queries) {
            // Values are the classes, styles, functions
            let values = queries[query];

            // Set a preset if found or just the query in case is custom
            let queryExpression = getPreset(query, Adaptive) ?? query;

            // If it does not exists, add it as an array
            if (!domQueriesMatch[queryExpression]) {
                domQueriesMatch[queryExpression] = [];
                domQueriesUnMatch[queryExpression] = [];
            }

            domQueriesMatch[queryExpression].push([matchCallback, values]);
            if (unMatchCallback) {
                domQueriesUnMatch[queryExpression].push([unMatchCallback, values]);
            }

            registerQueryListener(queryExpression);
        }
    };

    /**
     * Remove items from domQueriesMatch based on value and prop.
     *
     * @param {any} value - The value to be removed.
     * @param {string} prop - The property to look up in the object.
     */
    $this.remove = (value, prop) => {
        for (const [expression, collection] of Object.entries(domQueriesMatch)) {
            for (const reg of collection) {
                let type = typeof reg[1];
                // LookUp by the prop value when the second array element is an object
                if (prop && type === 'object') {
                    if (prop in reg[1] && reg[1][prop] === value) {
                        console.log(domQueriesMatch[expression]);
                        domQueriesMatch[expression] = domQueriesMatch[expression].filter(function (o) {
                            return o[1][prop] !== value;
                        });
                    }
                    // LookUp by the value (function) and prop when the second array element is a string
                } else if (type === 'string' && reg[1] === prop) {
                    domQueriesMatch[expression] = domQueriesMatch[expression].filter(function (o) {
                        return o[0] !== value;
                    });
                }
            }
        }
    };

    /**
     * Initialization of the class functionality
     * @return {Void}
     */
    $this.init = () => {
        loaded = true;
        Object.keys(domQueriesMatch).forEach((queryExpression) => {
            // Listener for after initial load
            registerQueryListener(queryExpression);
            // Run the queries on load once
            singleRun(queryExpression);
        });
    };

    /**
     * Reset the whole object | warning
     * @return {Void}
     */
    $this.reset = () => {
        Object.keys(registeredQueries).forEach((queryExpression) => {
            $window.matchMedia(queryExpression).removeEventListener('change', registeredQueries[queryExpression]);
            delete registeredQueries[queryExpression];
        });
        Object.keys(domQueriesMatch).forEach((key) => delete domQueriesMatch[key]);
        Object.keys(domQueriesUnMatch).forEach((key) => delete domQueriesUnMatch[key]);
    };

    // =========================================
    // --> PRIVATE
    // --------------------------

    function singleRun(queryExpression) {
        let mq = $window.matchMedia(queryExpression);
        if (mq.matches) {
            domQueriesMatch[mq.media].forEach(function (callback) {
                return callback[0](callback[1]);
            });
        }
    }

    /**
     * Get the preset query values present in Adaptive object
     * @private
     */
    function getPreset(queryId, Adaptive = null) {
        let presets = {
            q: null, // query min-max values preset
            e: null, // custom expression preset
        };

        // -----------------------------------------
        // when working with Adaptive.Js
        if (Adaptive) {
            let presetQs = Adaptive.getMinMaxQueries();
            let presetEs = Adaptive.getExpQueries();
            presets.q = presetQs[queryId] ?? null;
            presets.e = presetEs[queryId] ?? null;

            if (!presets.q && !presets.e) {
                if (queryId.includes('|')) {
                    let qs = queryId.split('|');
                    let qs1 = qs[0];
                    let qs2 = qs[1];

                    if (presetQs[qs1] && presetQs[qs2]) {
                        return buildExpression(presetQs[qs1], presetQs[qs2], true);
                    }

                    if (presetEs[qs1] && presetEs[qs2]) {
                        return buildExpression(presetEs[qs1], presetEs[qs2], true, true);
                    }
                }
            } else {
                // Write the correct expression for the preset min-max
                if (presets.q) {
                    return buildExpression(presets.q[0], presets.q[1]);
                }
                // No need to build the expression as it already is
                if (presets.e) {
                    return presets.e;
                }
            }
        }

        return null;
    }

    /**
     * @private
     */
    function buildExpression(q1, q2, isCompound = false, isExpression = false) {
        let templateQuery = '(min-width: $1px) and (max-width: $2px)';

        if (isCompound) {
            if (!isExpression) {
                q1 = templateQuery.replace('$1', q1[0]).replace('$2', q1[1]);
                q2 = templateQuery.replace('$1', q2[0]).replace('$2', q2[1]);
            }
            return `${q1}, ${q2}`;
        }

        return templateQuery.replace('$1', q1).replace('$2', q2);
    }

    function registerQueryListener(queryExpression) {
        // If not already registered
        // This helps to avoid too many Listeners created
        if (!registeredQueries[queryExpression]) {
            let matchQuery = $window.matchMedia(queryExpression);
            let callback = (mq) => {
                if (!mq.matches) {
                    domQueriesUnMatch[mq.media].forEach(function (callback) {
                        return callback[0](callback[1]);
                    });
                } else {
                    domQueriesMatch[mq.media].forEach(function (callback) {
                        return callback[0](callback[1]);
                    });
                }
            };

            registeredQueries[queryExpression] = callback;
            return matchQuery.addEventListener('change', callback);
        }
        // For those added after the loaded event
        if (loaded) {
            singleRun(queryExpression);
        }
    }
    $window.QueryHandler = QueryHandler;

    return $window.QueryHandler;
})();

export { QH as QueryHandler, QH as queryHandler, QH as default };
