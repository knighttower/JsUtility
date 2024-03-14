'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * URL Object Class with public methods for URL functions and manipulation.
 *
 * @module urlHelper
 */
function UrlHelper(__u) {

    /**
     * Reference to the global window object.
     * @type {Window}
     */
    const win = window;

    /**
     * Reference to the global document object.
     * @type {Document}
     */
    const doc = document;

    /**
     * Get the host value, check if template head has defined this variable.
     * @type {string|boolean}
     */
    const $H = win.$HOST || false;

    /**
     * Get the template value, check if template head has defined this variable.
     * @type {string|boolean}
     */
    const $TMP = win.$TEMPLATE || false;

    /**
     * Server Protocol.
     * @type {string}
     */
    const PROTOCOL = win.location.protocol.replace(':', '');

    /**
     * Hostname.
     * @type {string}
     */
    const HOST = $H || win.location.host;

    /**
     * Template URL.
     * @type {string}
     */
    const TEMPLATE = $TMP || '';

    /**
     * Current Pathname.
     * @type {string}
     */
    const PATH = location.pathname;

    /**
     * Site URL.
     * @type {string}
     */
    const SITE_URL = $H ? $H : `${PROTOCOL}://${HOST}`;

    /**
     * Full URL.
     * @type {string}
     */
    const FULL_URL = $H ? `${$H}${PATH}` : `${PROTOCOL}://${HOST}${PATH}`;

    /**
     * Cached URL parameters.
     * @type {Object|null}
     */
    let cachedURLParams = null;

    /**
     * Parse and return URL parameters.
     *
     * @return {Object} with params, queryString, search, keys, values, and collection.
     * @private
     */
    const parseURLParams = () => {
        if (cachedURLParams) {
            return cachedURLParams;
        }

        const params = new URLSearchParams(win.location.search);
        const vars = {};

        for (const [key, value] of params.entries()) {
            vars[key] = value;
        }

        cachedURLParams = {
            params,
            queryString: params.toString(),
            search: win.location.search,
            keys: Array.from(params.keys()),
            values: Array.from(params.values()),
            collection: vars,
        };

        return cachedURLParams;
    };

    /**
     * Get the current page name (Last part of the URL).
     *
     * @return {string} Current page name.
     */
    __u.getPage = () => {
        const cURL = doc.location.toString().toLowerCase();
        const page = cURL.split('/').pop().split('.')[0];
        return page || 'index'; // assuming 'index' as the default page name
    };

    /**
     * Get the query object info from the current URL.
     *
     * @return {Object} with params, queryString, search, keys, values, and collection.
     */
    __u.getParams = () => {
        return parseURLParams();
    };

    /**
     * Get the query string from the current URL.
     *
     * @return {string} Query string.
     */
    __u.getQuery = () => {
        return parseURLParams().queryString;
    };

    /**
     * Add params to the current query string from the current URL.
     *
     * @param {Object} query - The query object to add.
     * @return {Object} with collection and queryString.
     */
    __u.addToQuery = (query) => {
        const currentQuery = parseURLParams().collection;
        Object.assign(currentQuery, query);
        const qString = Object.entries(currentQuery)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        return {
            collection: currentQuery,
            queryString: qString,
        };
    };

    /**
     * Get only the URL hash.
     *
     * @return {string} Current hash.
     */
    __u.getHash = () => win.location.hash.substring(1);

    /**
     * Set the URL hash.
     *
     * @param {string} h - The hash to set.
     */
    __u.setHash = (h) => {
        doc.location.hash = h;
    };

    /**
     * Remove the URL hash.
     */
    __u.deleteHash = () => {
        history.pushState('', doc.title, win.location.pathname);
    };

    /**
     * Go to a specific URL on the same page.
     *
     * @param {string} url - The URL to go to.
     * @return {boolean} Always returns false to prevent browser default behavior.
     */
    __u.goTo = (url) => {
        win.location.href = url;
        return false;
    };

    /**
     * Open a URL in the browser.
     *
     * @param {string} url - The URL to open.
     * @param {string} [name='_blank'] - The name attribute for the new window.
     * @param {string} [params=''] - The window parameters.
     * @return {Window} The window object of the opened URL.
     */
    __u.open = (url, name = '_blank', params = '') => {
        return win.open(url, name, params);
    };

    /**
     * Execute a function if the current URL changes.
     *
     * @param {function} callback - The callback function to execute.
     */
    __u.onChange = (callback) => {
        if (typeof callback === 'function') {
            win.addEventListener('hashchange', callback);
        }
    };

    // Expose constants
    __u.fullUrl = FULL_URL;
    __u.siteUrl = SITE_URL;
    __u.template = TEMPLATE;
    __u.protocol = PROTOCOL;
    __u.host = HOST;
    __u.path = PATH;
    __u.readUrl = doc.URL;
}

exports.UrlHelper = UrlHelper;
exports.default = UrlHelper;
exports.urlHelper = UrlHelper;
