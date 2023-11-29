var UrlHelper = (function () {
  'use strict';

  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

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
    var win = window;

    /**
     * Reference to the global document object.
     * @type {Document}
     */
    var doc = document;

    /**
     * Get the host value, check if template head has defined this variable.
     * @type {string|boolean}
     */
    var $H = win.$HOST || false;

    /**
     * Get the template value, check if template head has defined this variable.
     * @type {string|boolean}
     */
    var $TMP = win.$TEMPLATE || false;

    /**
     * Server Protocol.
     * @type {string}
     */
    var PROTOCOL = win.location.protocol.replace(':', '');

    /**
     * Hostname.
     * @type {string}
     */
    var HOST = $H || win.location.host;

    /**
     * Template URL.
     * @type {string}
     */
    var TEMPLATE = $TMP || '';

    /**
     * Current Pathname.
     * @type {string}
     */
    var PATH = location.pathname;

    /**
     * Site URL.
     * @type {string}
     */
    var SITE_URL = $H ? $H : "".concat(PROTOCOL, "://").concat(HOST);

    /**
     * Full URL.
     * @type {string}
     */
    var FULL_URL = $H ? "".concat($H).concat(PATH) : "".concat(PROTOCOL, "://").concat(HOST).concat(PATH);

    /**
     * Cached URL parameters.
     * @type {Object|null}
     */
    var cachedURLParams = null;

    /**
     * Parse and return URL parameters.
     *
     * @return {Object} with params, queryString, search, keys, values, and collection.
     * @private
     */
    var parseURLParams = function parseURLParams() {
      if (cachedURLParams) {
        return cachedURLParams;
      }
      var params = new URLSearchParams(win.location.search);
      var vars = {};
      var _iterator = _createForOfIteratorHelper(params.entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];
          vars[key] = value;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      cachedURLParams = {
        params: params,
        queryString: params.toString(),
        search: win.location.search,
        keys: Array.from(params.keys()),
        values: Array.from(params.values()),
        collection: vars
      };
      return cachedURLParams;
    };

    /**
     * Get the current page name (Last part of the URL).
     *
     * @return {string} Current page name.
     */
    __u.getPage = function () {
      var cURL = doc.location.toString().toLowerCase();
      var page = cURL.split('/').pop().split('.')[0];
      return page || 'index'; // assuming 'index' as the default page name
    };

    /**
     * Get the query object info from the current URL.
     *
     * @return {Object} with params, queryString, search, keys, values, and collection.
     */
    __u.getParams = function () {
      return parseURLParams();
    };

    /**
     * Get the query string from the current URL.
     *
     * @return {string} Query string.
     */
    __u.getQuery = function () {
      return parseURLParams().queryString;
    };

    /**
     * Add params to the current query string from the current URL.
     *
     * @param {Object} query - The query object to add.
     * @return {Object} with collection and queryString.
     */
    __u.addToQuery = function (query) {
      var currentQuery = parseURLParams().collection;
      Object.assign(currentQuery, query);
      var qString = Object.entries(currentQuery).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        return "".concat(key, "=").concat(value);
      }).join('&');
      return {
        collection: currentQuery,
        queryString: qString
      };
    };

    /**
     * Get only the URL hash.
     *
     * @return {string} Current hash.
     */
    __u.getHash = function () {
      return win.location.hash.substring(1);
    };

    /**
     * Set the URL hash.
     *
     * @param {string} h - The hash to set.
     */
    __u.setHash = function (h) {
      doc.location.hash = h;
    };

    /**
     * Remove the URL hash.
     */
    __u.deleteHash = function () {
      history.pushState('', doc.title, win.location.pathname);
    };

    /**
     * Go to a specific URL on the same page.
     *
     * @param {string} url - The URL to go to.
     * @return {boolean} Always returns false to prevent browser default behavior.
     */
    __u.goTo = function (url) {
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
    __u.open = function (url) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_blank';
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      return win.open(url, name, params);
    };

    /**
     * Execute a function if the current URL changes.
     *
     * @param {function} callback - The callback function to execute.
     */
    __u.onChange = function (callback) {
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

  return UrlHelper;

})();
