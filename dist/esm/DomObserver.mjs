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
var executeOnNodeChanged = {};
/**
 * When node change
 * @param {String} id
 * @param {Function} callback Callback when any node changes/ add/deleted/modified
 * @return {Void}
 */
var addOnNodeChange = function addOnNodeChange(id, callback) {
  if (callback) {
    executeOnNodeChanged[id] = callback;
  }
};
/**
 * Remove from node change
 * @param {String} id
 * @return {Void}
 */
var removeOnNodeChange = function removeOnNodeChange(id) {
  if (id) {
    delete executeOnNodeChanged[id];
  }
};
/**
 * Deep cleanup
 * @return {Void}
 */
var cleanup = function cleanup() {
  Object.keys(executeOnNodeChanged).forEach(function (key) {
    return delete executeOnNodeChanged[key];
  });
};
/**
 * Observer
 * @private
 * @return {MutationObserver}
 */
(function () {
  if (typeof window !== 'undefined') {
    var callback = function callback(mutationList) {
      var _iterator = _createForOfIteratorHelper(mutationList),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var mutation = _step.value;
          if (mutation.type === 'childList') {
            for (var id in executeOnNodeChanged) {
              executeOnNodeChanged[id]();
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var config = {
      childList: true,
      subtree: true
    };
    var observer = new MutationObserver(callback);
    observer.observe(document.body, config);
  }
})();
var DomObserver = {
  executeOnNodeChanged: executeOnNodeChanged,
  addOnNodeChange: addOnNodeChange,
  removeOnNodeChange: removeOnNodeChange,
  cleanup: cleanup
};

export { DomObserver, DomObserver as default, DomObserver as domObserver };
