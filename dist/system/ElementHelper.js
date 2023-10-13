System.register('adaptive', [], (function (exports) {
  'use strict';
  return {
    execute: (function () {

      function _typeof(o) {
        "@babel/helpers - typeof";

        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
          return typeof o;
        } : function (o) {
          return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
          writable: false
        });
        return Constructor;
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
      function _toPrimitive(input, hint) {
        if (typeof input !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== undefined) {
          var res = prim.call(input, hint || "default");
          if (typeof res !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return typeof key === "symbol" ? key : String(key);
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

      /**
       * @class Adds some extra functionality to interact with a DOM element
       * @param {String|Object} selector Class or ID or DOM element
       * @param {String} scope The scope to search in, window, document, dom element. Defaults to document
       * @return {Object}
       * @example new ElementHelper('elementSelector')
       * @example new ElementHelper('elementSelector', domElement|window|document)
       *
       */
      var ElementHelper = exports('default', /*#__PURE__*/function () {
        /**
         * Constructor
         * @param {String|Object} selector
         * @return {Object}
         */
        function ElementHelper(selector) {
          var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
          _classCallCheck(this, ElementHelper);
          this.selector = selector;
          if (_typeof(selector) === 'object') {
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
        _createClass(ElementHelper, [{
          key: "isInDom",
          value: function isInDom() {
            var _this$domElement;
            return Boolean((_this$domElement = this.domElement) === null || _this$domElement === void 0 ? void 0 : _this$domElement.outerHTML);
          }

          /**
           * Wait for element exists or is visible. It will keep querying
           * @function whenInDom
           * @return {Promise}
           */
        }, {
          key: "whenInDom",
          value: function whenInDom() {
            var $this = this;
            var callbackId = Date.now() + Math.floor(Math.random() * 1000);
            return new Promise(function (resolveThis) {
              if (!$this.isInDom()) {
                DomObserver.addOnNodeChange(callbackId, function () {
                  var element = new ElementHelper($this.selector);
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
        }, {
          key: "getElementByXpath",
          value: function getElementByXpath(xpath) {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          }

          /**
           * Get the element xpath string
           * @author Based on https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reload-to-the-same-place-even-if/2631931#2631931
           * @return {String}
           */
        }, {
          key: "getXpathTo",
          value: function getXpathTo() {
            var element = this.domElement;
            if (element.id) {
              return "//*[@id='".concat(element.id, "']");
            }
            if (element === document.body) {
              return '//' + element.tagName;
            }
            var ix = 0;
            var siblings = element.parentNode.childNodes;
            for (var i = 0; i < siblings.length; i++) {
              var sibling = siblings[i];
              if (sibling === element) {
                return new ElementHelper(element.parentNode).getXpathTo() + '/' + element.tagName + '[' + (ix + 1) + ']';
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
        }, {
          key: "getAttribute",
          value: function getAttribute(attr) {
            return this.domElement.getAttribute(attr) || null;
          }

          /**
           * Create a unique has for the element derived from its xpath
           * @author Based on https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
           * @return {String}
           */
        }, {
          key: "getHash",
          value: function getHash() {
            var string = String(this.getXpathTo());
            var hash = 0;
            if (string.length === 0) {
              return hash;
            }
            for (var i = 0; i < string.length; i++) {
              var _char = string.charCodeAt(i);
              hash = (hash << 5) - hash + _char;
              hash = hash & hash;
            }
            return hash;
          }
        }]);
        return ElementHelper;
      }());

    })
  };
}));
