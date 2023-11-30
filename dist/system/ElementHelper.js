System.register('ElementHelper', [], (function (exports) {
    'use strict';
    return {
        execute: (function () {

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

            // Author Knighttower
            // MIT License
            // Copyright (c) [2022] [Knighttower] https://github.com/knighttower


            /**
             * @class Adds some extra functionality to interact with a DOM element
             * @param {String|Object} selector Class or ID or DOM element
             * @param {String} scope The scope to search in, window, document, dom element. Defaults to document
             * @return {Object}
             * @example new ElementHelper('elementSelector')
             * @example new ElementHelper('elementSelector', domElement|window|document)
             *
             */
            class ElementHelper {
                /**
                 * Constructor
                 * @param {String|Object} selector
                 * @return {Object}
                 */
                constructor(selector, scope = document) {
                    this.selector = selector;
                    if (typeof selector === 'object') {
                        this.domElement = selector;
                    } else if (String(selector).includes('//')) {
                        this.domElement = this.getElementByXpath(selector);
                    } else {
                        this.domElement = scope.querySelector(selector);
                    }
                }

                // =========================================
                // --> Public
                // --------------------------

                /**
                 * Check if the element exists or is visible. It will keep querying
                 * @return {Boolean}
                 */
                isInDom() {
                    return Boolean(this.domElement?.outerHTML);
                }

                /**
                 * Wait for element exists or is visible. It will keep querying
                 * @function whenInDom
                 * @return {Promise}
                 */
                whenInDom() {
                    let $this = this;
                    let callbackId = Date.now() + Math.floor(Math.random() * 1000);

                    return new Promise(function (resolveThis) {
                        if (!$this.isInDom()) {
                            DomObserver.addOnNodeChange(callbackId, () => {
                                let element = new ElementHelper($this.selector);
                                if (element.isInDom()) {
                                    $this = element;
                                    resolveThis($this);
                                    DomObserver.removeOnNodeChange(callbackId);
                                }
                            });
                        } else {
                            resolveThis($this);
                        }
                    });
                }

                /**
                 * Find element by Xpath string
                 * @param {String} xpath
                 * @example getElementByXpath("//html[1]/body[1]/div[1]")
                 * @return {Object} DOM element
                 */
                getElementByXpath(xpath) {
                    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                }

                /**
                 * Get the element xpath string
                 * @author Based on https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reload-to-the-same-place-even-if/2631931#2631931
                 * @return {String}
                 */
                getXpathTo() {
                    let element = this.domElement;

                    if (element.id) {
                        return `//*[@id='${element.id}']`;
                    }
                    if (element === document.body) {
                        return '//' + element.tagName;
                    }

                    let ix = 0;
                    let siblings = element.parentNode.childNodes;
                    for (let i = 0; i < siblings.length; i++) {
                        let sibling = siblings[i];
                        if (sibling === element) {
                            return (
                                new ElementHelper(element.parentNode).getXpathTo() + '/' + element.tagName + '[' + (ix + 1) + ']'
                            );
                        }
                        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                            ix++;
                        }
                    }
                }

                /**
                 * Get the element attribute, but parse it if it is an object or array
                 * @param {String} attr Atrribute name
                 * @return {String|Array|Object|Null}
                 */
                getAttribute(attr) {
                    return this.domElement.getAttribute(attr) || null;
                }

                /**
                 * Create a unique has for the element derived from its xpath
                 * @author Based on https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
                 * @return {String}
                 */
                getHash() {
                    let string = String(this.getXpathTo());
                    let hash = 0;

                    if (string.length === 0) {
                        return hash;
                    }

                    for (let i = 0; i < string.length; i++) {
                        let char = string.charCodeAt(i);
                        hash = (hash << 5) - hash + char;
                        hash = hash & hash;
                    }

                    return hash;
                }
            } exports({ elementHelper: ElementHelper, default: ElementHelper, ElementHelper: ElementHelper });

        })
    };
}));
