/**
 * @module domTracking
 * @description
 * A module to track the loading of the DOM and the application
 * @example
 * domTracking.afterLoad(() => {
 *   // Do something after the page has loaded
 * });
 * domTracking.isReady(() => {
 *  // Do something after the page has loaded
 * });
 */
const domTracking = (($win) => {
    const $this = {
        isLoaded: false,
        onLoadedCallbacks: [],
    };

    /**
     * for those that want to subscribe to the ready event
     * @param {Function} callback
     * @return {Void}
     */
    $this.isReady = (callback) => {
        if ($this.isLoaded) {
            callback();
        } else {
            $this.onLoadedCallbacks.push(callback);
        }
    };
    $this.ready = $this.isReady;

    /**
     * Method to trigger when the DOM has loaded
     * @param {Function} callback
     * @return {Void}
     * @example
     * domTracking.afterLoad(() => {
     *    // Do something after the page has loaded
     * });
     */
    $this.afterLoad = (callback) => {
        return $this.isReady(() => {
            let triggered = false;
            let observer;
            let fallbackTimer, retryTimer;

            const triggerCallback = () => {
                if (triggered) return;
                triggered = true;
                callback();
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
                clearTimeout(fallbackTimer);
                clearTimeout(retryTimer);
            };

            // Fallback using requestAnimationFrame
            try {
                retryTimer = setTimeout(() => {
                    requestAnimationFrame(triggerCallback);
                }, 5000);
            } catch (err) {
                console.error('requestAnimationFrame error:', err);
            }
            // Fallback using setTimeout
            fallbackTimer = setTimeout(triggerCallback, 10000);

            // Use PerformanceObserver if available
            try {
                observer = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    for (const entry of entries) {
                        if (
                            entry.name === 'first-contentful-paint' ||
                            entry.name === 'first-paint'
                        ) {
                            triggerCallback();
                            break;
                        }
                    }
                });
                observer.observe({ type: 'paint', buffered: true });
            } catch (err) {
                console.error('PerformanceObserver error:', err);
            }
        });
    };

    // This can be called externally by other scripts to signal that it has loaded
    $this.domHasLoaded = () => {
        if (!$this.isLoaded) {
            $this.isLoaded = true;
            $this.onLoadedCallbacks.forEach((callback) => {
                callback();
            });
        }
    };

    /**
     * Method to trigger when the DOM is first available for handling
     * @return {Void}
     */
    const onDOMReady = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', $this.domHasLoaded);
        } else {
            $this.domHasLoaded();
        }
    };

    onDOMReady();

    return ($win.xdom = $win.xdom || Object.seal($this));
})(window);
/*
 * xloader.js v1.0.0
 * lightweight script and css loader
 * @usage
 * xloader.scripts.load(['https://cdn.example.com/script.js'], 'script-group-id').then(() => {});
 * xloader.scripts.ready('script-group-id').then(() => {});
 * xloader.scripts.ready(['script-group-id-1', 'script-group-id-2']).then(() => {});
 * xloader.scripts.isLoaded('script-group-id');
 * xloader.scripts.hasId('script-group-id');
 * xloader.css.load(['https://cdn.example.com/style.css'], 'css-group-id').then(() => {});
 * xloader.css.ready('css-group-id').then(() => {});
 * xloader.css.isLoaded('css-group-id');
 * @html
 * <x-loader x-js="https://cdn.example.com/script.js" x-id="script-group-id" x-deps="anyDeps,otherDeps"></x-loader>
 * <x-loader x-css="https://cdn.example.com/style.css" x-id="css-group-id"></x-loader>
 * <x-loader x-img="https://cdn.example.com/image.jpg" x-id="img-group-id"></x-loader>
 */
const xloader = ((w) => {

    const loadedSet = new Map();
    const regIds = new Map();
    const loaded = new Map();
    const loadingSet = new Map();
    const loadingAssets = new Map();

    // -----------------------------------------
    // --> @TODO: Add support for asset types
    // const assetTypes = {
    //     css: 'css',
    //     js: 'scripts',
    // };

    class LoadChecker {
        /**
         * Check if the an asset with ID is ready
         * @param {String|Array} ids
         * @param {Number} timeout
         * @return {Promise}
         * @example xloader.loader.ready('some_custom_id').then(() => {});
         */
        ready(ids, timeout = 3000) {
            if (!ids) return Promise.reject(new Error('loader ID required!'));
            if (Array.isArray(ids)) {
                return Promise.all(ids.map((id) => this.ready(id, timeout)));
            }
            ids = ids.trim();
            // has loaded
            if (loadedSet.get(ids)) return Promise.resolve(true);
            // is loading
            if (loadingSet.get(ids)) return loadingSet.get(ids);
            // not loaded and should wait
            return new Promise((resolve, reject) => {
                let maxTimeout;
                const cancelTimeout = () => {
                    maxTimeout && clearTimeout(maxTimeout);
                };
                const interval = setInterval(() => {
                    if (loadedSet.get(ids)) {
                        clearInterval(interval);
                        resolve(true);
                        cancelTimeout();
                        return;
                    }
                    if (loadingSet.get(ids)) {
                        clearInterval(interval);
                        cancelTimeout();

                        const loadTimeout = setTimeout(() => {
                            cancelTimeout();
                            reject(console.log(`Timeout ID "${ids}".`));
                        }, timeout);

                        loadingSet.get(ids).finally(() => {
                            cancelTimeout();
                            clearTimeout(loadTimeout);
                            resolve(true);
                        });

                        return;
                    }
                }, 50);

                // set to 1m for slow connections
                maxTimeout = setTimeout(() => {
                    clearInterval(interval);
                    reject(console.log(`Timeout ID "${ids}".`));
                }, 1000 * 60);
            });
        }

        /**
         * Check if the an asset with ID is loaded
         * @param {String|Array} ids
         * @return {Boolean}
         */
        isLoaded(ids) {
            if (Array.isArray(ids)) {
                return ids.every((id) => this.isLoaded(id));
            }
            return !!loadedSet.get(ids) || !!window[ids];
        }

        /**
         * Check if the an asset with ID is registered
         * @param {String|Array} ids
         * @return {Boolean}
         */
        hasId(ids) {
            if (Array.isArray(ids)) {
                return ids.every((id) => this.hasId(id));
            }
            return !!regIds.get(ids);
        }

        /**
         * Wait for an object in the window with ID to be ready
         * @param {String|Array} ids
         * @param {Number} timeout
         * @return {Promise}
         * @example xloader.loader.when('jQuery').then(() => {});
         * @example xloader.loader.when(['jQuery', 'Vue']).then(() => {});
         */
        when(ids, timeout = 3000) {
            if (!ids) return Promise.reject(new Error('loader ID required!'));
            if (Array.isArray(ids)) {
                return Promise.all(ids.map((id) => this.when(id, timeout)));
            }
            ids = ids.trim();
            return new Promise((resolve, reject) => {
                let maxTimeout;
                const cancelTimeout = () => {
                    maxTimeout && clearTimeout(maxTimeout);
                };
                const interval = setInterval(() => {
                    if (window[ids]) {
                        clearInterval(interval);
                        resolve(true);
                        cancelTimeout();
                        return;
                    }
                }, 50);

                maxTimeout = setTimeout(() => {
                    clearInterval(interval);
                    reject(console.warn(`Timeout "${ids}": not in window.`));
                }, timeout);
            });
        }
    }

    class AssetLoader {
        constructor(type = 'js') {
            this.type = type;
            const checker = new LoadChecker();
            this.ready = checker.ready.bind(checker);
            this.isLoaded = checker.isLoaded.bind(checker);
            this.hasId = checker.hasId.bind(checker);
        }
        /**
         * Load assets
         * @param {String|Array} assets
         * @param {String} id
         * @param {String} loadType - 'eager' | 'lazy' default null
         * @param {Object} attributes - Additional attributes to add to the element
         * @param {HTMLElement} $element - The element to append the asset to
         * @return {Promise}
         * @throws {Error}
         * @example
         * xloader.scripts.load('https://cdn.example.com/script.js', 'script-group-id').then(() => {});
         */
        load(assets, ...args) {
            let id, loadType, attributes, $element;
            if (typeof args[0] === 'object' && args[0] !== null) {
                ({ id, loadType, attributes, $element } = args[0]);
            } else {
                [id, loadType, attributes, $element] = args;
            }
            assets = Array.isArray(assets) ? assets : [assets];
            if (assets.length === 0) {
                return Promise.reject(new Error('URL required!'));
            }

            id = id || `__${Math.random().toString(36).substring(2, 15)}`;

            if (regIds.has(id)) {
                console.warn(`ID "${id}" is already registered.`);
                return Promise.resolve(true);
            }
            regIds.set(id, true);

            const promises = assets.map((src) => {
                if (loadingAssets.get(src) && this.type !== 'img') return loadingAssets.get(src);

                const promise = new Promise((resolve, reject) => {
                    if (loaded.get(src) && this.type !== 'img') {
                        resolve(src);
                        return;
                    }

                    return (() => {
                        let element;
                        if (this.type === 'img') {
                            element = new Image();
                        } else {
                            element = document.createElement(
                                this.type === 'css' ? 'link' : 'script'
                            );
                        }
                        switch (this.type) {
                            case 'css':
                                element.rel = 'stylesheet';
                                element.type = 'text/css';
                                element.href = src;
                                break;
                            case 'js':
                                element.src = src;
                                element.async = true;
                                break;
                            case 'img':
                                const defaultAttrs = {
                                    alt: location.href,
                                    width: 'auto',
                                    height: 'auto',
                                    class: '',
                                };
                                attributes = { ...defaultAttrs, ...(attributes || {}) };

                                Object.keys(attributes).forEach((key) => {
                                    if (!['src', 'loading'].includes(key)) {
                                        element.setAttribute(key, attributes[key]);
                                    }
                                });
                                element.src = src;

                                break;
                        }

                        element.onload = () => {
                            loaded.set(src, true);

                            if (this.type === 'img') {
                                const loadImg = () => {
                                    $element = $element || document.querySelector(`[x-id="${id}"]`);
                                    $element.style.display = 'none';
                                    $element.insertAdjacentElement('afterend', element);

                                    // Had to resort to this since the inner image was not being removed
                                    $element.remove();
                                };

                                if (loadType === 'lazy') {
                                    element.setAttribute('fetchpriority', 'low');
                                    domTracking.afterLoad(loadImg);
                                } else {
                                    domTracking.isReady(loadImg);
                                }
                            }
                            resolve(src);
                        };
                        element.onerror = () => reject(new Error(`Failed to load: ${src}`));

                        if (this.type !== 'img') {
                            switch (loadType) {
                                case 'eager':
                                    document.head.appendChild(element);
                                    break;
                                case 'lazy':
                                    domTracking.isReady(() => {
                                        document.body.appendChild(element);
                                    });
                                    break;
                                default:
                                    document.body.appendChild(element);
                                    break;
                            }
                        }

                        return element;
                    })();
                });

                loadingAssets.set(src, promise);
                return promise;
            });

            const promiseSet = Promise.all(promises)
                .then((loaded) => {
                    loadedSet.set(id, true);
                    return loaded;
                })
                .catch((error) => {
                    console.error(`Asset ID "${id}":`, error);
                    throw error;
                });

            loadingSet.set(id, promiseSet);
            return promiseSet;
        }
    }

    class XLoader {
        constructor() {
            this.scripts = new AssetLoader();
            this.css = new AssetLoader('css');
            this.img = new AssetLoader('img');
            this.loader = new LoadChecker();
            // This helps to load anything BEFORE the loader has been initialized
            this.autoLoadScripts();
        }
        /**
         * Load assets
         * @param {Arrya} elements - Array of DOM elements to load
         * @return {Void}
         */
        autoLoadScripts(elements) {
            const loadedTags = elements || document.querySelectorAll('x-loader:not([x-reg])');
            loadedTags.forEach((element) => {
                if (element.attributes['x-reg']?.value) {
                    return;
                } else {
                    element.setAttribute('x-reg', true);
                }
                const data = (() => {
                    const attributes = {};
                    const excludedAttrs = [
                        'x-type',
                        'x-dep',
                        'x-img',
                        'x-js',
                        'x-loading',
                        'x-css',
                        'x-id',
                    ];

                    // Extract dependencies and load type
                    const dep = element.getAttribute('x-dep')?.trim().split(',') || null;
                    const loadType =
                        element.getAttribute('x-loading') || element.getAttribute('x-type');

                    // Determine type and src
                    let type = null;
                    let src = null;
                    ['x-js', 'x-css', 'x-img'].some((attr) => {
                        const value = element.getAttribute(attr);
                        if (value) {
                            type = attr === 'x-js' ? 'scripts' : attr.slice(2);
                            src = value.split(',');
                            return true;
                        }
                        return false;
                    });

                    // Extract other attributes
                    Array.from(element.attributes).forEach((attr) => {
                        if (!excludedAttrs.includes(attr.name)) {
                            attributes[attr.name.replace(/^x-/, '')] = attr.value;
                        }
                    });

                    return { attributes, dep, loadType, type, src, $element: element };
                })();

                if (data.src) {
                    const id =
                        element.getAttribute('x-id') ||
                        `x__${Math.random().toString(36).substring(2, 15)}`;
                    element.setAttribute('x-id', id);

                    const loadAsset = () =>
                        this[data.type].load(data.src, {
                            id,
                            loadType: data.loadType,
                            attributes: data.attributes,
                            $element: data.$element,
                        });

                    if (data.dep) {
                        this.loader.ready(data.dep).then(loadAsset);
                    } else {
                        loadAsset();
                    }
                }
            });
        }
    }

    // -----------------------------------------
    // Initialize the loader
    const loader = (w.xloader = w?.xloader || new XLoader());

    // -----------------------------------------
    // Create a class for the element
    /**
     * @attribute x-reg
     * Marks an `<x-script>` as registered, preventing duplicate processing.
     *
     * @attribute x-load
     * Specifies the URL of the script to load.
     *
     * @attribute x-dep
     * (Optional) The ID of the script group to wait for before loading this script.
     *
     * @attribute x-id
     * (Optional) The unique ID to assign to the script group after loading.
     *
     * @attribute x-type
     * (Optional) The type of loading to use. Default is 'normal'.
     */
    class LoaderTag extends HTMLElement {
        constructor() {
            // Always call super first in constructor
            super();
        }
        connectedCallback() {
            if (this.hasAttribute('x-img')) {
                let tmp; // placeholder
                const innerHTML = this.getAttribute('x-loader-html');
                if (innerHTML) {
                    tmp = document.createElement('div');
                    tmp.innerHTML = innerHTML;
                } else {
                    tmp = document.createElement('img');
                    const setWidth = this.getAttribute('width');
                    const setHeight = this.getAttribute('height');

                    const height = (() => {
                        if (setHeight) {
                            return {
                                maxHeight: `${setHeight}px`,
                                height: '100%',
                                aspectRatio: `${setWidth || 16} / ${setHeight}`,
                            };
                        }

                        return {
                            maxHeight: '100%',
                            height: 'auto',
                            aspectRatio: '16 / 9',
                        };
                    })();
                    Object.assign(tmp.style, {
                        maxWidth: '100%',
                        width: setWidth ? `${setWidth}px` : '100%',
                        ...height,
                    });
                    const img = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

                    tmp.src = img;
                }

                tmp.classList.add('x-loader');
                this.appendChild(tmp);
            }
            // -----------------------------------------
            // Trigger the autoLoadScripts method
            loader.autoLoadScripts([this]);
        }
    }
    customElements.define('x-loader', LoaderTag);

    // Attach xloader globally
    return loader;
})(window);

export { xloader as default, domTracking, xloader };
