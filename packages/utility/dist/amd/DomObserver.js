define(['exports'], (function (exports) { 'use strict';

    // Author Knighttower
    // MIT License
    // [2022] [Knighttower] https://github.com/knighttower
    /**
     * @module DomObserver
     * Detect DOM changes
     * @name DomObserver
     * @param {window} selector
     * @param {Function}
     * @return DomObserver
     * @example DomObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })
     * @example DomObserver.removeOnNodeChange('elementIdentifier')
     */
    /**
     * Holds memory of registered functions
     * @private
     */
    const executeOnNodeChanged = {};
    /**
     * When node change
     * @param {String} id
     * @param {Function} callback Callback when any node changes/ add/deleted/modified
     * @return {Void}
     */
    const addOnNodeChange = (id, callback) => {
        if (callback) {
            executeOnNodeChanged[id] = callback;
        }
    };
    /**
     * Remove from node change
     * @param {String} id
     * @return {Void}
     */
    const removeOnNodeChange = (id) => {
        if (id) {
            delete executeOnNodeChanged[id];
        }
    };
    /**
     * Deep cleanup
     * @return {Void}
     */
    const cleanup = () => {
        Object.keys(executeOnNodeChanged).forEach((key) => delete executeOnNodeChanged[key]);
    };
    /**
     * Observer
     * @private
     * @return {MutationObserver}
     */
    (() => {
        if (typeof window !== 'undefined') {
            const callback = (mutationList) => {
                for (const mutation of mutationList) {
                    if (mutation.type === 'childList') {
                        for (const id in executeOnNodeChanged) {
                            executeOnNodeChanged[id]();
                        }
                    }
                }
            };
            const config = {
                childList: true,
                subtree: true,
            };
            const observer = new MutationObserver(callback);
            observer.observe(document.body, config);
        }
    })();
    const DomObserver = {
        executeOnNodeChanged,
        addOnNodeChange,
        removeOnNodeChange,
        cleanup,
    };

    exports.DomObserver = DomObserver;
    exports.default = DomObserver;
    exports.domObserver = DomObserver;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
