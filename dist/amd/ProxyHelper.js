define((function () { 'use strict';

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /* Author Knighttower
      MIT License
      [2023] [Knighttower] https://github.com/knighttower
  */
  /**
   * @module ProxyHelper
   * Convert to proxy to protect objects
   * Allows to declare _private, _protected and _mutable - all arrays with prop names
   * @example ProxyHelper({objectProps..., _protected: array(...)})
   * @param {Object} object
   * @return {Proxy}
   * @usage const proxy = ProxyHelper({objectProps..., _protected: array(...), _private: array(...), _mutable: array(...)})
   * @usage _protected: array(...) -> Cannot be modified
   * @usage _private: array(...) -> Cannot be accessed
   * @usage _mutable: array(...) -> Can be modified
   */
  function ProxyHelper(object) {

    var _private = new Map((object._private || ['_private']).map(function (prop) {
      return [prop, true];
    }));
    var _protected = new Map([].concat(_toConsumableArray(_private), _toConsumableArray((object._protected || []).map(function (prop) {
      return [prop, true];
    }))));
    var _mutable = new Map((object._mutable || []).map(function (prop) {
      return [prop, true];
    }));
    return new Proxy(object, {
      get: function get(target, prop) {
        if (prop in target && !_private.has(String(prop))) {
          return target[prop];
        } else {
          console.error('Prop is private, not set, or object is protected', prop);
          return undefined;
        }
      },
      set: function set(target, prop, value) {
        prop = String(prop);
        if (prop in target) {
          if (_mutable.has(prop)) {
            target[prop] = value;
            return true;
          }
          if (!_protected.has(prop) && !_private.has(prop)) {
            target[prop] = value;
            return true;
          } else {
            console.error('The prop is protected or private and cannot be modified', prop, value);
            return false;
          }
        } else {
          console.error('Protected Object, cannot set new props', prop, value);
          return false;
        }
      }
    });
  }

  return ProxyHelper;

}));
