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
let observer;
/**
 * When node change
 * @param {String} id
 * @param {Function} callback Callback when any node changes/ add/deleted/modified
 * @memberof DomObserver
 * @usage domObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })
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
 * @memberof DomObserver
 * @usage domObserver.removeOnNodeChange('elementIdentifier')
 * @return {Void}
 */
const removeOnNodeChange = (id) => {
    if (id) {
        delete executeOnNodeChanged[id];
        if (Object.keys(executeOnNodeChanged).length === 0 && observer) {
            observer.disconnect();
            observer = null;
        }
    }
};
/**
 * Deep cleanup
 * @return {Void}
 */
const cleanup = () => {
    Object.keys(executeOnNodeChanged).forEach((key) => delete executeOnNodeChanged[key]);
    if (observer) {
        observer.disconnect();
        observer = null;
    }
};
/**
 * Observer
 * @private
 * @return {MutationObserver}
 */
const start = () => {
    if (typeof window !== 'undefined' && !observer) {
        const callback = (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    for (const id in executeOnNodeChanged) {
                        executeOnNodeChanged[id]();
                    }
                }
            }
        };
        observer = new MutationObserver(callback);
        const config = { childList: true, subtree: true };

        if (document.readyState !== 'loading') {
            observer.observe(document.body, config);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, config);
            });
        }
    }
};

/**
 * @exports domObserver
 * @type {Object}
 * @usage domObserver.addOnNodeChange('elementIdentifier', () => { console.log('Node changed') })
 * @usage domObserver.removeOnNodeChange('elementIdentifier')
 * @usage domObserver.cleanup()
 */
export const domObserver = {
    start,
    addOnNodeChange,
    removeOnNodeChange,
    cleanup,
};
export { domObserver as default, domObserver as DomObserver };
