/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Baobab Type Checking
 * =====================
 *
 * Helpers functions used throughout the library to perform some type
 * tests at runtime.
 *
 */


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _monkey = __webpack_require__(2);

var type = {};

/**
 * Helpers
 * --------
 */

/**
 * Checking whether the given variable is of any of the given types.
 *
 * @todo   Optimize this function by dropping `some`.
 *
 * @param  {mixed} target  - Variable to test.
 * @param  {array} allowed - Array of allowed types.
 * @return {boolean}
 */
function anyOf(target, allowed) {
  return allowed.some(function (t) {
    return type[t](target);
  });
}

/**
 * Simple types
 * -------------
 */

/**
 * Checking whether the given variable is an array.
 *
 * @param  {mixed} target - Variable to test.
 * @return {boolean}
 */
type.array = function (target) {
  return Array.isArray(target);
};

/**
 * Checking whether the given variable is an object.
 *
 * @param  {mixed} target - Variable to test.
 * @return {boolean}
 */
type.object = function (target) {
  return target && typeof target === 'object' && !Array.isArray(target) && !(target instanceof Date) && !(target instanceof RegExp) && !(typeof Map === 'function' && target instanceof Map) && !(typeof Set === 'function' && target instanceof Set);
};

/**
 * Checking whether the given variable is a string.
 *
 * @param  {mixed} target - Variable to test.
 * @return {boolean}
 */
type.string = function (target) {
  return typeof target === 'string';
};

/**
 * Checking whether the given variable is a number.
 *
 * @param  {mixed} target - Variable to test.
 * @return {boolean}
 */
type.number = function (target) {
  return typeof target === 'number';
};

/**
 * Checking whether the given variable is a function.
 *
 * @param  {mixed} target - Variable to test.
 * @return {boolean}
 */
type['function'] = function (target) {
  return typeof target === 'function';
};

/**
 * Checking whether the given variable is a JavaScript primitive.
 *
 * @param  {mixed} target - Variable to test.
 * @return {boolean}
 */
type.primitive = function (target) {
  return target !== Object(target);
};

/**
 * Complex types
 * --------------
 */

/**
 * Checking whether the given variable is a valid splicer.
 *
 * @param  {mixed} target    - Variable to test.
 * @param  {array} [allowed] - Optional valid types in path.
 * @return {boolean}
 */
type.splicer = function (target) {
  if (!type.array(target) || target.length < 1) return false;
  if (target.length > 1 && isNaN(+target[1])) return false;

  return anyOf(target[0], ['number', 'function', 'object']);
};

/**
 * Checking whether the given variable is a valid cursor path.
 *
 * @param  {mixed} target    - Variable to test.
 * @param  {array} [allowed] - Optional valid types in path.
 * @return {boolean}
 */

// Order is important for performance reasons
var ALLOWED_FOR_PATH = ['string', 'number', 'function', 'object'];

type.path = function (target) {
  if (!target && target !== 0 && target !== '') return false;

  return [].concat(target).every(function (step) {
    return anyOf(step, ALLOWED_FOR_PATH);
  });
};

/**
 * Checking whether the given path is a dynamic one.
 *
 * @param  {mixed} path - The path to test.
 * @return {boolean}
 */
type.dynamicPath = function (path) {
  return path.some(function (step) {
    return type['function'](step) || type.object(step);
  });
};

/**
 * Retrieve any monkey subpath in the given path or null if the path never comes
 * across computed data.
 *
 * @param  {mixed} data - The data to test.
 * @param  {array} path - The path to test.
 * @return {boolean}
 */
type.monkeyPath = function (data, path) {
  var subpath = [];

  var c = data,
      i = undefined,
      l = undefined;

  for (i = 0, l = path.length; i < l; i++) {
    subpath.push(path[i]);

    if (typeof c !== 'object') return null;

    c = c[path[i]];

    if (c instanceof _monkey.Monkey) return subpath;
  }

  return null;
};

/**
 * Check if the given object property is a lazy getter used by a monkey.
 *
 * @param  {mixed}   o           - The target object.
 * @param  {string}  propertyKey - The property to test.
 * @return {boolean}
 */
type.lazyGetter = function (o, propertyKey) {
  var descriptor = Object.getOwnPropertyDescriptor(o, propertyKey);

  return descriptor && descriptor.get && descriptor.get.isLazyGetter === true;
};

/**
 * Returns the type of the given monkey definition or `null` if invalid.
 *
 * @param  {mixed} definition - The definition to check.
 * @return {string|null}
 */
type.monkeyDefinition = function (definition) {

  if (type.object(definition)) {
    if (!type['function'](definition.get) || definition.cursors && (!type.object(definition.cursors) || !Object.keys(definition.cursors).every(function (k) {
      return type.path(definition.cursors[k]);
    }))) return null;

    return 'object';
  } else if (type.array(definition)) {
    var offset = 1;

    if (type.object(definition[definition.length - 1])) offset++;

    if (!type['function'](definition[definition.length - offset]) || !definition.slice(0, -offset).every(function (p) {
      return type.path(p);
    })) return null;

    return 'array';
  }

  return null;
};

/**
 * Checking whether the given watcher definition is valid.
 *
 * @param  {mixed}   definition - The definition to check.
 * @return {boolean}
 */
type.watcherMapping = function (definition) {
  return type.object(definition) && Object.keys(definition).every(function (k) {
    return type.path(definition[k]);
  });
};

/**
 * Checking whether the given string is a valid operation type.
 *
 * @param  {mixed} string - The string to test.
 * @return {boolean}
 */

// Ordered by likeliness
var VALID_OPERATIONS = ['set', 'apply', 'push', 'unshift', 'concat', 'pop', 'shift', 'deepMerge', 'merge', 'splice', 'unset'];

type.operationType = function (string) {
  return typeof string === 'string' && !! ~VALID_OPERATIONS.indexOf(string);
};

exports['default'] = type;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* eslint eqeqeq: 0 */

/**
 * Baobab Helpers
 * ===============
 *
 * Miscellaneous helper functions.
 */


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.arrayFrom = arrayFrom;
exports.before = before;
exports.coercePath = coercePath;
exports.getIn = getIn;
exports.makeError = makeError;
exports.solveRelativePath = solveRelativePath;
exports.solveUpdate = solveUpdate;
exports.splice = splice;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _monkey = __webpack_require__(2);

var _type = __webpack_require__(0);

var _type2 = _interopRequireDefault(_type);

/**
 * Noop function
 */
var noop = Function.prototype;

var hasOwnProp = ({}).hasOwnProperty;

/**
 * Function returning the index of the first element of a list matching the
 * given predicate.
 *
 * @param  {array}     a  - The target array.
 * @param  {function}  fn - The predicate function.
 * @return {mixed}        - The index of the first matching item or -1.
 */
function index(a, fn) {
  var i = undefined,
      l = undefined;
  for (i = 0, l = a.length; i < l; i++) {
    if (fn(a[i])) return i;
  }
  return -1;
}

/**
 * Efficient slice function used to clone arrays or parts of them.
 *
 * @param  {array} array - The array to slice.
 * @return {array}       - The sliced array.
 */
function slice(array) {
  var newArray = new Array(array.length);

  var i = undefined,
      l = undefined;

  for (i = 0, l = array.length; i < l; i++) newArray[i] = array[i];

  return newArray;
}

/**
 * Archive abstraction
 *
 * @constructor
 * @param {integer} size - Maximum number of records to store.
 */

var Archive = (function () {
  function Archive(size) {
    _classCallCheck(this, Archive);

    this.size = size;
    this.records = [];
  }

  /**
   * Function creating a real array from what should be an array but is not.
   * I'm looking at you nasty `arguments`...
   *
   * @param  {mixed} culprit - The culprit to convert.
   * @return {array}         - The real array.
   */

  /**
   * Method retrieving the records.
   *
   * @return {array} - The records.
   */

  _createClass(Archive, [{
    key: 'get',
    value: function get() {
      return this.records;
    }

    /**
     * Method adding a record to the archive
     *
     * @param {object}  record - The record to store.
     * @return {Archive}       - The archive itself for chaining purposes.
     */
  }, {
    key: 'add',
    value: function add(record) {
      this.records.unshift(record);

      // If the number of records is exceeded, we truncate the records
      if (this.records.length > this.size) this.records.length = this.size;

      return this;
    }

    /**
     * Method clearing the records.
     *
     * @return {Archive} - The archive itself for chaining purposes.
     */
  }, {
    key: 'clear',
    value: function clear() {
      this.records = [];
      return this;
    }

    /**
     * Method to go back in time.
     *
     * @param {integer} steps - Number of steps we should go back by.
     * @return {number}       - The last record.
     */
  }, {
    key: 'back',
    value: function back(steps) {
      var record = this.records[steps - 1];

      if (record) this.records = this.records.slice(steps);
      return record;
    }
  }]);

  return Archive;
})();

exports.Archive = Archive;

function arrayFrom(culprit) {
  return slice(culprit);
}

/**
 * Function decorating one function with another that will be called before the
 * decorated one.
 *
 * @param  {function} decorator - The decorating function.
 * @param  {function} fn        - The function to decorate.
 * @return {function}           - The decorated function.
 */

function before(decorator, fn) {
  return function () {
    decorator.apply(null, arguments);
    fn.apply(null, arguments);
  };
}

/**
 * Function cloning the given regular expression. Supports `y` and `u` flags
 * already.
 *
 * @param  {RegExp} re - The target regular expression.
 * @return {RegExp}    - The cloned regular expression.
 */
function cloneRegexp(re) {
  var pattern = re.source;

  var flags = '';

  if (re.global) flags += 'g';
  if (re.multiline) flags += 'm';
  if (re.ignoreCase) flags += 'i';
  if (re.sticky) flags += 'y';
  if (re.unicode) flags += 'u';

  return new RegExp(pattern, flags);
}

/**
 * Function cloning the given variable.
 *
 * @todo: implement a faster way to clone an array.
 *
 * @param  {boolean} deep - Should we deep clone the variable.
 * @param  {mixed}   item - The variable to clone
 * @return {mixed}        - The cloned variable.
 */
function cloner(deep, item) {
  if (!item || typeof item !== 'object' || item instanceof Error || item instanceof _monkey.MonkeyDefinition || item instanceof _monkey.Monkey || 'ArrayBuffer' in global && item instanceof ArrayBuffer) return item;

  // Array
  if (_type2['default'].array(item)) {
    if (deep) {
      var a = [];

      var i = undefined,
          l = undefined;

      for (i = 0, l = item.length; i < l; i++) a.push(cloner(true, item[i]));
      return a;
    }

    return slice(item);
  }

  // Date
  if (item instanceof Date) return new Date(item.getTime());

  // RegExp
  if (item instanceof RegExp) return cloneRegexp(item);

  // Object
  if (_type2['default'].object(item)) {
    var o = {};

    var i = undefined,
        l = undefined,
        k = undefined;

    // NOTE: could be possible to erase computed properties through `null`.
    var props = Object.getOwnPropertyNames(item);
    for (i = 0, l = props.length; i < l; i++) {
      k = props[i];
      if (_type2['default'].lazyGetter(item, k)) {
        Object.defineProperty(o, k, {
          get: Object.getOwnPropertyDescriptor(item, k).get,
          enumerable: true,
          configurable: true
        });
      } else {
        Object.defineProperty(o, k, {
          value: deep ? cloner(true, item[k]) : item[k],
          enumerable: Object.getOwnPropertyDescriptor(item, k).enumerable,
          writable: true,
          configurable: true
        });
      }
    }
    return o;
  }

  return item;
}

/**
 * Exporting shallow and deep cloning functions.
 */
var shallowClone = cloner.bind(null, false),
    deepClone = cloner.bind(null, true);

exports.shallowClone = shallowClone;
exports.deepClone = deepClone;

/**
 * Coerce the given variable into a full-fledged path.
 *
 * @param  {mixed} target - The variable to coerce.
 * @return {array}        - The array path.
 */

function coercePath(target) {
  if (target || target === 0 || target === '') return target;
  return [];
}

/**
 * Function comparing an object's properties to a given descriptive
 * object.
 *
 * @param  {object} object      - The object to compare.
 * @param  {object} description - The description's mapping.
 * @return {boolean}            - Whether the object matches the description.
 */
function compare(object, description) {
  var ok = true,
      k = undefined;

  // If we reached here via a recursive call, object may be undefined because
  // not all items in a collection will have the same deep nesting structure.
  if (!object) return false;

  for (k in description) {
    if (_type2['default'].object(description[k])) {
      ok = ok && compare(object[k], description[k]);
    } else if (_type2['default'].array(description[k])) {
      ok = ok && !! ~description[k].indexOf(object[k]);
    } else {
      if (object[k] !== description[k]) return false;
    }
  }

  return ok;
}

/**
 * Function freezing the given variable if possible.
 *
 * @param  {boolean} deep - Should we recursively freeze the given objects?
 * @param  {object}  o    - The variable to freeze.
 * @return {object}    - The merged object.
 */
function freezer(deep, o) {
  if (typeof o !== 'object' || o === null || o instanceof _monkey.Monkey) return;

  Object.freeze(o);

  if (!deep) return;

  if (Array.isArray(o)) {

    // Iterating through the elements
    var i = undefined,
        l = undefined;

    for (i = 0, l = o.length; i < l; i++) freezer(true, o[i]);
  } else {
    var p = undefined,
        k = undefined;

    for (k in o) {
      if (_type2['default'].lazyGetter(o, k)) continue;

      p = o[k];

      if (!p || !hasOwnProp.call(o, k) || typeof p !== 'object' || Object.isFrozen(p)) continue;

      freezer(true, p);
    }
  }
}

/**
 * Exporting both `freeze` and `deepFreeze` functions.
 * Note that if the engine does not support `Object.freeze` then this will
 * export noop functions instead.
 */
var isFreezeSupported = typeof Object.freeze === 'function';

var freeze = isFreezeSupported ? freezer.bind(null, false) : noop,
    deepFreeze = isFreezeSupported ? freezer.bind(null, true) : noop;

exports.freeze = freeze;
exports.deepFreeze = deepFreeze;

/**
 * Function retrieving nested data within the given object and according to
 * the given path.
 *
 * @todo: work if dynamic path hit objects also.
 * @todo: memoized perfgetters.
 *
 * @param  {object}  object - The object we need to get data from.
 * @param  {array}   path   - The path to follow.
 * @return {object}  result            - The result.
 * @return {mixed}   result.data       - The data at path, or `undefined`.
 * @return {array}   result.solvedPath - The solved path or `null`.
 * @return {boolean} result.exists     - Does the path exists in the tree?
 */
var NOT_FOUND_OBJECT = { data: undefined, solvedPath: null, exists: false };

function getIn(object, path) {
  if (!path) return NOT_FOUND_OBJECT;

  var solvedPath = [];

  var exists = true,
      c = object,
      idx = undefined,
      i = undefined,
      l = undefined;

  for (i = 0, l = path.length; i < l; i++) {
    if (!c) return {
      data: undefined,
      solvedPath: solvedPath.concat(path.slice(i)),
      exists: false
    };

    if (typeof path[i] === 'function') {
      if (!_type2['default'].array(c)) return NOT_FOUND_OBJECT;

      idx = index(c, path[i]);
      if (! ~idx) return NOT_FOUND_OBJECT;

      solvedPath.push(idx);
      c = c[idx];
    } else if (typeof path[i] === 'object') {
      if (!_type2['default'].array(c)) return NOT_FOUND_OBJECT;

      idx = index(c, function (e) {
        return compare(e, path[i]);
      });
      if (! ~idx) return NOT_FOUND_OBJECT;

      solvedPath.push(idx);
      c = c[idx];
    } else {
      solvedPath.push(path[i]);
      exists = typeof c === 'object' && path[i] in c;
      c = c[path[i]];
    }
  }

  return { data: c, solvedPath: solvedPath, exists: exists };
}

/**
 * Little helper returning a JavaScript error carrying some data with it.
 *
 * @param  {string} message - The error message.
 * @param  {object} [data]  - Optional data to assign to the error.
 * @return {Error}          - The created error.
 */

function makeError(message, data) {
  var err = new Error(message);

  for (var k in data) {
    err[k] = data[k];
  }return err;
}

/**
 * Function taking n objects to merge them together.
 * Note 1): the latter object will take precedence over the first one.
 * Note 2): the first object will be mutated to allow for perf scenarios.
 * Note 3): this function will consider monkeys as leaves.
 *
 * @param  {boolean}   deep    - Whether the merge should be deep or not.
 * @param  {...object} objects - Objects to merge.
 * @return {object}            - The merged object.
 */
function merger(deep) {
  for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objects[_key - 1] = arguments[_key];
  }

  var o = objects[0];

  var t = undefined,
      i = undefined,
      l = undefined,
      k = undefined;

  for (i = 1, l = objects.length; i < l; i++) {
    t = objects[i];

    for (k in t) {
      if (deep && _type2['default'].object(t[k]) && !(t[k] instanceof _monkey.Monkey)) {
        o[k] = merger(true, o[k] || {}, t[k]);
      } else {
        o[k] = t[k];
      }
    }
  }

  return o;
}

/**
 * Exporting both `shallowMerge` and `deepMerge` functions.
 */
var shallowMerge = merger.bind(null, false),
    deepMerge = merger.bind(null, true);

exports.shallowMerge = shallowMerge;
exports.deepMerge = deepMerge;

/**
 * Solving a potentially relative path.
 *
 * @param  {array} base - The base path from which to solve the path.
 * @param  {array} to   - The subpath to reach.
 * @param  {array}      - The solved absolute path.
 */

function solveRelativePath(base, to) {
  var solvedPath = [];

  // Coercing to array
  to = [].concat(to);

  for (var i = 0, l = to.length; i < l; i++) {
    var step = to[i];

    if (step === '.') {
      if (!i) solvedPath = base.slice(0);
    } else if (step === '..') {
      solvedPath = (!i ? base : solvedPath).slice(0, -1);
    } else {
      solvedPath.push(step);
    }
  }

  return solvedPath;
}

/**
 * Function determining whether some paths in the tree were affected by some
 * updates that occurred at the given paths. This helper is mainly used at
 * cursor level to determine whether the cursor is concerned by the updates
 * fired at tree level.
 *
 * NOTES: 1) If performance become an issue, the following threefold loop
 *           can be simplified to a complex twofold one.
 *        2) A regex version could also work but I am not confident it would
 *           be faster.
 *        3) Another solution would be to keep a register of cursors like with
 *           the monkeys and update along this tree.
 *
 * @param  {array} affectedPaths - The paths that were updated.
 * @param  {array} comparedPaths - The paths that we are actually interested in.
 * @return {boolean}             - Is the update relevant to the compared
 *                                 paths?
 */

function solveUpdate(affectedPaths, comparedPaths) {
  var i = undefined,
      j = undefined,
      k = undefined,
      l = undefined,
      m = undefined,
      n = undefined,
      p = undefined,
      c = undefined,
      s = undefined;

  // Looping through possible paths
  for (i = 0, l = affectedPaths.length; i < l; i++) {
    p = affectedPaths[i];

    if (!p.length) return true;

    // Looping through logged paths
    for (j = 0, m = comparedPaths.length; j < m; j++) {
      c = comparedPaths[j];

      if (!c || !c.length) return true;

      // Looping through steps
      for (k = 0, n = c.length; k < n; k++) {
        s = c[k];

        // If path is not relevant, we break
        // NOTE: the '!=' instead of '!==' is required here!
        if (s != p[k]) break;

        // If we reached last item and we are relevant
        if (k + 1 === n || k + 1 === p.length) return true;
      }
    }
  }

  return false;
}

/**
 * Non-mutative version of the splice array method.
 *
 * @param  {array}    array        - The array to splice.
 * @param  {integer}  startIndex   - The start index.
 * @param  {integer}  nb           - Number of elements to remove.
 * @param  {...mixed} elements     - Elements to append after splicing.
 * @return {array}                 - The spliced array.
 */

function splice(array, startIndex, nb) {
  for (var _len2 = arguments.length, elements = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    elements[_key2 - 3] = arguments[_key2];
  }

  if (nb === undefined && arguments.length === 2) nb = array.length - startIndex;else if (nb === null || nb === undefined) nb = 0;else if (isNaN(+nb)) throw new Error('argument nb ' + nb + ' can not be parsed into a number!');
  nb = Math.max(0, nb);

  // Solving startIndex
  if (_type2['default']['function'](startIndex)) startIndex = index(array, startIndex);
  if (_type2['default'].object(startIndex)) startIndex = index(array, function (e) {
    return compare(e, startIndex);
  });

  // Positive index
  if (startIndex >= 0) return array.slice(0, startIndex).concat(elements).concat(array.slice(startIndex + nb));

  // Negative index
  return array.slice(0, array.length + startIndex).concat(elements).concat(array.slice(array.length + startIndex + nb));
}

/**
 * Function returning a unique incremental id each time it is called.
 *
 * @return {integer} - The latest unique id.
 */
var uniqid = (function () {
  var i = 0;

  return function () {
    return i++;
  };
})();

exports.uniqid = uniqid;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Baobab Monkeys
 * ===============
 *
 * Exposing both handy monkey definitions and the underlying working class.
 */


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _type = __webpack_require__(0);

var _type2 = _interopRequireDefault(_type);

var _update2 = __webpack_require__(6);

var _update3 = _interopRequireDefault(_update2);

var _helpers = __webpack_require__(1);

/**
 * Monkey Definition class
 * Note: The only reason why this is a class is to be able to spot it within
 * otherwise ordinary data.
 *
 * @constructor
 * @param {array|object} definition - The formal definition of the monkey.
 */

var MonkeyDefinition = function MonkeyDefinition(definition) {
  var _this = this;

  _classCallCheck(this, MonkeyDefinition);

  var monkeyType = _type2['default'].monkeyDefinition(definition);

  if (!monkeyType) throw (0, _helpers.makeError)('Baobab.monkey: invalid definition.', { definition: definition });

  this.type = monkeyType;

  if (this.type === 'object') {
    this.getter = definition.get;
    this.projection = definition.cursors || {};
    this.paths = Object.keys(this.projection).map(function (k) {
      return _this.projection[k];
    });
    this.options = definition.options || {};
  } else {
    var offset = 1,
        options = {};

    if (_type2['default'].object(definition[definition.length - 1])) {
      offset++;
      options = definition[definition.length - 1];
    }

    this.getter = definition[definition.length - offset];
    this.projection = definition.slice(0, -offset);
    this.paths = this.projection;
    this.options = options;
  }

  // Coercing paths for convenience
  this.paths = this.paths.map(function (p) {
    return [].concat(p);
  });

  // Does the definition contain dynamic paths
  this.hasDynamicPaths = this.paths.some(_type2['default'].dynamicPath);
}

/**
 * Monkey core class
 *
 * @constructor
 * @param {Baobab}           tree       - The bound tree.
 * @param {MonkeyDefinition} definition - A definition instance.
 */
;

exports.MonkeyDefinition = MonkeyDefinition;

var Monkey = (function () {
  function Monkey(tree, pathInTree, definition) {
    var _this2 = this;

    _classCallCheck(this, Monkey);

    // Properties
    this.tree = tree;
    this.path = pathInTree;
    this.definition = definition;

    // Adapting the definition's paths & projection to this monkey's case
    var projection = definition.projection,
        relative = _helpers.solveRelativePath.bind(null, pathInTree.slice(0, -1));

    if (definition.type === 'object') {
      this.projection = Object.keys(projection).reduce(function (acc, k) {
        acc[k] = relative(projection[k]);
        return acc;
      }, {});
      this.depPaths = Object.keys(this.projection).map(function (k) {
        return _this2.projection[k];
      });
    } else {
      this.projection = projection.map(relative);
      this.depPaths = this.projection;
    }

    // Internal state
    this.state = {
      killed: false
    };

    /**
     * Listener on the tree's `write` event.
     *
     * When the tree writes, this listener will check whether the updated paths
     * are of any use to the monkey and, if so, will update the tree's node
     * where the monkey sits.
     */
    this.writeListener = function (_ref) {
      var path = _ref.data.path;

      if (_this2.state.killed) return;

      // Is the monkey affected by the current write event?
      var concerned = (0, _helpers.solveUpdate)([path], _this2.relatedPaths());

      if (concerned) _this2.update();
    };

    /**
     * Listener on the tree's `monkey` event.
     *
     * When another monkey updates, this listener will check whether the
     * updated paths are of any use to the monkey and, if so, will update the
     * tree's node where the monkey sits.
     */
    this.recursiveListener = function (_ref2) {
      var _ref2$data = _ref2.data;
      var monkey = _ref2$data.monkey;
      var path = _ref2$data.path;

      if (_this2.state.killed) return;

      // Breaking if this is the same monkey
      if (_this2 === monkey) return;

      // Is the monkey affected by the current monkey event?
      var concerned = (0, _helpers.solveUpdate)([path], _this2.relatedPaths(false));

      if (concerned) _this2.update();
    };

    // Binding listeners
    this.tree.on('write', this.writeListener);
    this.tree.on('_monkey', this.recursiveListener);

    // Updating relevant node
    this.update();
  }

  /**
   * Method returning solved paths related to the monkey.
   *
   * @param  {boolean} recursive - Should we compute recursive paths?
   * @return {array}             - An array of related paths.
   */

  _createClass(Monkey, [{
    key: 'relatedPaths',
    value: function relatedPaths() {
      var _this3 = this;

      var recursive = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var paths = undefined;

      if (this.definition.hasDynamicPaths) paths = this.depPaths.map(function (p) {
        return (0, _helpers.getIn)(_this3.tree._data, p).solvedPath;
      });else paths = this.depPaths;

      var isRecursive = recursive && this.depPaths.some(function (p) {
        return !!_type2['default'].monkeyPath(_this3.tree._monkeys, p);
      });

      if (!isRecursive) return paths;

      return paths.reduce(function (accumulatedPaths, path) {
        var monkeyPath = _type2['default'].monkeyPath(_this3.tree._monkeys, path);

        if (!monkeyPath) return accumulatedPaths.concat([path]);

        // Solving recursive path
        var relatedMonkey = (0, _helpers.getIn)(_this3.tree._monkeys, monkeyPath).data;

        return accumulatedPaths.concat(relatedMonkey.relatedPaths());
      }, []);
    }

    /**
     * Method used to update the tree's internal data with a lazy getter holding
     * the computed data.
     *
     * @return {Monkey} - Returns itself for chaining purposes.
     */
  }, {
    key: 'update',
    value: function update() {
      var deps = this.tree.project(this.projection);

      var lazyGetter = (function (tree, def, data) {
        var cache = null,
            alreadyComputed = false;

        return function () {

          if (!alreadyComputed) {
            cache = def.getter.apply(tree, def.type === 'object' ? [data] : data);

            if (tree.options.immutable && def.options.immutable !== false) (0, _helpers.deepFreeze)(cache);

            alreadyComputed = true;
          }

          return cache;
        };
      })(this.tree, this.definition, deps);

      lazyGetter.isLazyGetter = true;

      // Should we write the lazy getter in the tree or solve it right now?
      if (this.tree.options.lazyMonkeys) {
        this.tree._data = (0, _update3['default'])(this.tree._data, this.path, {
          type: 'monkey',
          value: lazyGetter
        }, this.tree.options).data;
      } else {
        var result = (0, _update3['default'])(this.tree._data, this.path, {
          type: 'set',
          value: lazyGetter(),
          options: {
            mutableLeaf: !this.definition.options.immutable
          }
        }, this.tree.options);

        if ('data' in result) this.tree._data = result.data;
      }

      // Notifying the monkey's update so we can handle recursivity
      this.tree.emit('_monkey', { monkey: this, path: this.path });

      return this;
    }

    /**
     * Method releasing the monkey from memory.
     */
  }, {
    key: 'release',
    value: function release() {

      // Unbinding events
      this.tree.off('write', this.writeListener);
      this.tree.off('_monkey', this.recursiveListener);
      this.state.killed = true;

      // Deleting properties
      // NOTE: not deleting this.definition because some strange things happen
      // in the _refreshMonkeys method. See #372.
      delete this.projection;
      delete this.depPaths;
      delete this.tree;
    }
  }]);

  return Monkey;
})();

exports.Monkey = Monkey;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  'use strict';

  /**
   * Here is the list of every allowed parameter when using Emitter#on:
   * @type {Object}
   */
  var __allowedOptions = {
    once: 'boolean',
    scope: 'object'
  };

  /**
   * Incremental id used to order event handlers.
   */
  var __order = 0;

  /**
   * A simple helper to shallowly merge two objects. The second one will "win"
   * over the first one.
   *
   * @param  {object}  o1 First target object.
   * @param  {object}  o2 Second target object.
   * @return {object}     Returns the merged object.
   */
  function shallowMerge(o1, o2) {
    var o = {},
        k;

    for (k in o1) o[k] = o1[k];
    for (k in o2) o[k] = o2[k];

    return o;
  }

  /**
   * Is the given variable a plain JavaScript object?
   *
   * @param  {mixed}  v   Target.
   * @return {boolean}    The boolean result.
   */
  function isPlainObject(v) {
    return v &&
           typeof v === 'object' &&
           !Array.isArray(v) &&
           !(v instanceof Function) &&
           !(v instanceof RegExp);
  }

  /**
   * Iterate over an object that may have ES6 Symbols.
   *
   * @param  {object}   object  Object on which to iterate.
   * @param  {function} fn      Iterator function.
   * @param  {object}   [scope] Optional scope.
   */
  function forIn(object, fn, scope) {
    var symbols,
        k,
        i,
        l;

    for (k in object)
      fn.call(scope || null, k, object[k]);

    if (Object.getOwnPropertySymbols) {
      symbols = Object.getOwnPropertySymbols(object);

      for (i = 0, l = symbols.length; i < l; i++)
        fn.call(scope || null, symbols[i], object[symbols[i]]);
    }
  }

  /**
   * The emitter's constructor. It initializes the handlers-per-events store and
   * the global handlers store.
   *
   * Emitters are useful for non-DOM events communication. Read its methods
   * documentation for more information about how it works.
   *
   * @return {Emitter}         The fresh new instance.
   */
  var Emitter = function() {
    this._enabled = true;

    // Dirty trick that will set the necessary properties to the emitter
    this.unbindAll();
  };

  /**
   * This method unbinds every handlers attached to every or any events. So,
   * these functions will no more be executed when the related events are
   * emitted. If the functions were not bound to the events, nothing will
   * happen, and no error will be thrown.
   *
   * Usage:
   * ******
   * > myEmitter.unbindAll();
   *
   * @return {Emitter}      Returns this.
   */
  Emitter.prototype.unbindAll = function() {

    this._handlers = {};
    this._handlersAll = [];
    this._handlersComplex = [];

    return this;
  };


  /**
   * This method binds one or more functions to the emitter, handled to one or a
   * suite of events. So, these functions will be executed anytime one related
   * event is emitted.
   *
   * It is also possible to bind a function to any emitted event by not
   * specifying any event to bind the function to.
   *
   * Recognized options:
   * *******************
   *  - {?boolean} once   If true, the handlers will be unbound after the first
   *                      execution. Default value: false.
   *  - {?object}  scope  If a scope is given, then the listeners will be called
   *                      with this scope as "this".
   *
   * Variant 1:
   * **********
   * > myEmitter.on('myEvent', function(e) { console.log(e); });
   * > // Or:
   * > myEmitter.on('myEvent', function(e) { console.log(e); }, { once: true });
   *
   * @param  {string}   event   The event to listen to.
   * @param  {function} handler The function to bind.
   * @param  {?object}  options Eventually some options.
   * @return {Emitter}          Returns this.
   *
   * Variant 2:
   * **********
   * > myEmitter.on(
   * >   ['myEvent1', 'myEvent2'],
   * >   function(e) { console.log(e); }
   * >);
   * > // Or:
   * > myEmitter.on(
   * >   ['myEvent1', 'myEvent2'],
   * >   function(e) { console.log(e); }
   * >   { once: true }}
   * >);
   *
   * @param  {array}    events  The events to listen to.
   * @param  {function} handler The function to bind.
   * @param  {?object}  options Eventually some options.
   * @return {Emitter}          Returns this.
   *
   * Variant 3:
   * **********
   * > myEmitter.on({
   * >   myEvent1: function(e) { console.log(e); },
   * >   myEvent2: function(e) { console.log(e); }
   * > });
   * > // Or:
   * > myEmitter.on({
   * >   myEvent1: function(e) { console.log(e); },
   * >   myEvent2: function(e) { console.log(e); }
   * > }, { once: true });
   *
   * @param  {object}  bindings An object containing pairs event / function.
   * @param  {?object}  options Eventually some options.
   * @return {Emitter}          Returns this.
   *
   * Variant 4:
   * **********
   * > myEmitter.on(function(e) { console.log(e); });
   * > // Or:
   * > myEmitter.on(function(e) { console.log(e); }, { once: true});
   *
   * @param  {function} handler The function to bind to every events.
   * @param  {?object}  options Eventually some options.
   * @return {Emitter}          Returns this.
   */
  Emitter.prototype.on = function(a, b, c) {
    var i,
        l,
        k,
        event,
        eArray,
        handlersList,
        bindingObject;

    // Variant 3
    if (isPlainObject(a)) {
      forIn(a, function(name, fn) {
        this.on(name, fn, b);
      }, this);

      return this;
    }

    // Variant 1, 2 and 4
    if (typeof a === 'function') {
      c = b;
      b = a;
      a = null;
    }

    eArray = [].concat(a);

    for (i = 0, l = eArray.length; i < l; i++) {
      event = eArray[i];

      bindingObject = {
        order: __order++,
        fn: b
      };

      // Defining the list in which the handler should be inserted
      if (typeof event === 'string' || typeof event === 'symbol') {
        if (!this._handlers[event])
          this._handlers[event] = [];
        handlersList = this._handlers[event];
        bindingObject.type = event;
      }
      else if (event instanceof RegExp) {
        handlersList = this._handlersComplex;
        bindingObject.pattern = event;
      }
      else if (event === null) {
        handlersList = this._handlersAll;
      }
      else {
        throw Error('Emitter.on: invalid event.');
      }

      // Appending needed properties
      for (k in c || {})
        if (__allowedOptions[k])
          bindingObject[k] = c[k];

      handlersList.push(bindingObject);
    }

    return this;
  };


  /**
   * This method works exactly as the previous #on, but will add an options
   * object if none is given, and set the option "once" to true.
   *
   * The polymorphism works exactly as with the #on method.
   */
  Emitter.prototype.once = function() {
    var args = Array.prototype.slice.call(arguments),
        li = args.length - 1;

    if (isPlainObject(args[li]) && args.length > 1)
      args[li] = shallowMerge(args[li], {once: true});
    else
      args.push({once: true});

    return this.on.apply(this, args);
  };


  /**
   * This method unbinds one or more functions from events of the emitter. So,
   * these functions will no more be executed when the related events are
   * emitted. If the functions were not bound to the events, nothing will
   * happen, and no error will be thrown.
   *
   * Variant 1:
   * **********
   * > myEmitter.off('myEvent', myHandler);
   *
   * @param  {string}   event   The event to unbind the handler from.
   * @param  {function} handler The function to unbind.
   * @return {Emitter}          Returns this.
   *
   * Variant 2:
   * **********
   * > myEmitter.off(['myEvent1', 'myEvent2'], myHandler);
   *
   * @param  {array}    events  The events to unbind the handler from.
   * @param  {function} handler The function to unbind.
   * @return {Emitter}          Returns this.
   *
   * Variant 3:
   * **********
   * > myEmitter.off({
   * >   myEvent1: myHandler1,
   * >   myEvent2: myHandler2
   * > });
   *
   * @param  {object} bindings An object containing pairs event / function.
   * @return {Emitter}         Returns this.
   *
   * Variant 4:
   * **********
   * > myEmitter.off(myHandler);
   *
   * @param  {function} handler The function to unbind from every events.
   * @return {Emitter}          Returns this.
   *
   * Variant 5:
   * **********
   * > myEmitter.off(event);
   *
   * @param  {string} event     The event we should unbind.
   * @return {Emitter}          Returns this.
   */
  function filter(target, fn) {
    target = target || [];

    var a = [],
        l,
        i;

    for (i = 0, l = target.length; i < l; i++)
      if (target[i].fn !== fn)
        a.push(target[i]);

    return a;
  }

  Emitter.prototype.off = function(events, fn) {
    var i,
        n,
        k,
        event;

    // Variant 4:
    if (arguments.length === 1 && typeof events === 'function') {
      fn = arguments[0];

      // Handlers bound to events:
      for (k in this._handlers) {
        this._handlers[k] = filter(this._handlers[k], fn);

        if (this._handlers[k].length === 0)
          delete this._handlers[k];
      }

      // Generic Handlers
      this._handlersAll = filter(this._handlersAll, fn);

      // Complex handlers
      this._handlersComplex = filter(this._handlersComplex, fn);
    }

    // Variant 5
    else if (arguments.length === 1 &&
             (typeof events === 'string' || typeof events === 'symbol')) {
      delete this._handlers[events];
    }

    // Variant 1 and 2:
    else if (arguments.length === 2) {
      var eArray = [].concat(events);

      for (i = 0, n = eArray.length; i < n; i++) {
        event = eArray[i];

        this._handlers[event] = filter(this._handlers[event], fn);

        if ((this._handlers[event] || []).length === 0)
          delete this._handlers[event];
      }
    }

    // Variant 3
    else if (isPlainObject(events)) {
      forIn(events, this.off, this);
    }

    return this;
  };

  /**
   * This method retrieve the listeners attached to a particular event.
   *
   * @param  {?string}    Name of the event.
   * @return {array}      Array of handler functions.
   */
  Emitter.prototype.listeners = function(event) {
    var handlers = this._handlersAll || [],
        complex = false,
        h,
        i,
        l;

    if (!event)
      throw Error('Emitter.listeners: no event provided.');

    handlers = handlers.concat(this._handlers[event] || []);

    for (i = 0, l = this._handlersComplex.length; i < l; i++) {
      h = this._handlersComplex[i];

      if (~event.search(h.pattern)) {
        complex = true;
        handlers.push(h);
      }
    }

    // If we have any complex handlers, we need to sort
    if (this._handlersAll.length || complex)
      return handlers.sort(function(a, b) {
        return a.order - b.order;
      });
    else
      return handlers.slice(0);
  };

  /**
   * This method emits the specified event(s), and executes every handlers bound
   * to the event(s).
   *
   * Use cases:
   * **********
   * > myEmitter.emit('myEvent');
   * > myEmitter.emit('myEvent', myData);
   * > myEmitter.emit(['myEvent1', 'myEvent2']);
   * > myEmitter.emit(['myEvent1', 'myEvent2'], myData);
   * > myEmitter.emit({myEvent1: myData1, myEvent2: myData2});
   *
   * @param  {string|array} events The event(s) to emit.
   * @param  {object?}      data   The data.
   * @return {Emitter}             Returns this.
   */
  Emitter.prototype.emit = function(events, data) {

    // Short exit if the emitter is disabled
    if (!this._enabled)
      return this;

    // Object variant
    if (isPlainObject(events)) {
      forIn(events, this.emit, this);
      return this;
    }

    var eArray = [].concat(events),
        onces = [],
        event,
        parent,
        handlers,
        handler,
        i,
        j,
        l,
        m;

    for (i = 0, l = eArray.length; i < l; i++) {
      handlers = this.listeners(eArray[i]);

      for (j = 0, m = handlers.length; j < m; j++) {
        handler = handlers[j];
        event = {
          type: eArray[i],
          target: this
        };

        if (arguments.length > 1)
          event.data = data;

        handler.fn.call('scope' in handler ? handler.scope : this, event);

        if (handler.once)
          onces.push(handler);
      }

      // Cleaning onces
      for (j = onces.length - 1; j >= 0; j--) {
        parent = onces[j].type ?
          this._handlers[onces[j].type] :
          onces[j].pattern ?
            this._handlersComplex :
            this._handlersAll;

        parent.splice(parent.indexOf(onces[j]), 1);
      }
    }

    return this;
  };


  /**
   * This method will unbind all listeners and make it impossible to ever
   * rebind any listener to any event.
   */
  Emitter.prototype.kill = function() {

    this.unbindAll();
    this._handlers = null;
    this._handlersAll = null;
    this._handlersComplex = null;
    this._enabled = false;

    // Nooping methods
    this.unbindAll =
    this.on =
    this.once =
    this.off =
    this.emit =
    this.listeners = Function.prototype;
  };


  /**
   * This method disabled the emitter, which means its emit method will do
   * nothing.
   *
   * @return {Emitter} Returns this.
   */
  Emitter.prototype.disable = function() {
    this._enabled = false;

    return this;
  };


  /**
   * This method enables the emitter.
   *
   * @return {Emitter} Returns this.
   */
  Emitter.prototype.enable = function() {
    this._enabled = true;

    return this;
  };


  /**
   * Version:
   */
  Emitter.version = '3.1.1';


  // Export:
  if (true) {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = Emitter;
    exports.Emitter = Emitter;
  } else if (typeof define === 'function' && define.amd)
    define('emmett', [], function() {
      return Emitter;
    });
  else
    this.Emitter = Emitter;
}).call(this);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8).default;
module.exports.default = module.exports;



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Baobab Cursors
 * ===============
 *
 * Cursors created by selecting some data within a Baobab tree.
 */


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _emmett = __webpack_require__(3);

var _emmett2 = _interopRequireDefault(_emmett);

var _monkey = __webpack_require__(2);

var _type = __webpack_require__(0);

var _type2 = _interopRequireDefault(_type);

var _helpers = __webpack_require__(1);

/**
 * Traversal helper function for dynamic cursors. Will throw a legible error
 * if traversal is not possible.
 *
 * @param {string} method     - The method name, to create a correct error msg.
 * @param {array}  solvedPath - The cursor's solved path.
 */
function checkPossibilityOfDynamicTraversal(method, solvedPath) {
  if (!solvedPath) throw (0, _helpers.makeError)('Baobab.Cursor.' + method + ': ' + ('cannot use ' + method + ' on an unresolved dynamic path.'), { path: solvedPath });
}

/**
 * Cursor class
 *
 * @constructor
 * @param {Baobab} tree   - The cursor's root.
 * @param {array}  path   - The cursor's path in the tree.
 * @param {string} hash   - The path's hash computed ahead by the tree.
 */

var Cursor = (function (_Emitter) {
  _inherits(Cursor, _Emitter);

  function Cursor(tree, path, hash) {
    var _this = this;

    _classCallCheck(this, Cursor);

    _get(Object.getPrototypeOf(Cursor.prototype), 'constructor', this).call(this);

    // If no path were to be provided, we fallback to an empty path (root)
    path = path || [];

    // Privates
    this._identity = '[object Cursor]';
    this._archive = null;

    // Properties
    this.tree = tree;
    this.path = path;
    this.hash = hash;

    // State
    this.state = {
      killed: false,
      recording: false,
      undoing: false
    };

    // Checking whether the given path is dynamic or not
    this._dynamicPath = _type2['default'].dynamicPath(this.path);

    // Checking whether the given path will meet a monkey
    this._monkeyPath = _type2['default'].monkeyPath(this.tree._monkeys, this.path);

    if (!this._dynamicPath) this.solvedPath = this.path;else this.solvedPath = (0, _helpers.getIn)(this.tree._data, this.path).solvedPath;

    /**
     * Listener bound to the tree's writes so that cursors with dynamic paths
     * may update their solved path correctly.
     *
     * @param {object} event - The event fired by the tree.
     */
    this._writeHandler = function (_ref) {
      var data = _ref.data;

      if (_this.state.killed || !(0, _helpers.solveUpdate)([data.path], _this._getComparedPaths())) return;

      _this.solvedPath = (0, _helpers.getIn)(_this.tree._data, _this.path).solvedPath;
    };

    /**
     * Function in charge of actually trigger the cursor's updates and
     * deal with the archived records.
     *
     * @note: probably should wrap the current solvedPath in closure to avoid
     * for tricky cases where it would fail.
     *
     * @param {mixed} previousData - the tree's previous data.
     */
    var fireUpdate = function fireUpdate(previousData) {
      var self = _this;

      var eventData = Object.defineProperties({}, {
        previousData: {
          get: function get() {
            return (0, _helpers.getIn)(previousData, self.solvedPath).data;
          },
          configurable: true,
          enumerable: true
        },
        currentData: {
          get: function get() {
            return self.get();
          },
          configurable: true,
          enumerable: true
        }
      });

      if (_this.state.recording && !_this.state.undoing) _this.archive.add(eventData.previousData);

      _this.state.undoing = false;

      return _this.emit('update', eventData);
    };

    /**
     * Listener bound to the tree's updates and determining whether the
     * cursor is affected and should react accordingly.
     *
     * Note that this listener is lazily bound to the tree to be sure
     * one wouldn't leak listeners when only creating cursors for convenience
     * and not to listen to updates specifically.
     *
     * @param {object} event - The event fired by the tree.
     */
    this._updateHandler = function (event) {
      if (_this.state.killed) return;

      var _event$data = event.data;
      var paths = _event$data.paths;
      var previousData = _event$data.previousData;
      var update = fireUpdate.bind(_this, previousData);
      var comparedPaths = _this._getComparedPaths();

      if ((0, _helpers.solveUpdate)(paths, comparedPaths)) return update();
    };

    // Lazy binding
    var bound = false;
    this._lazyBind = function () {
      if (bound) return;

      bound = true;

      if (_this._dynamicPath) _this.tree.on('write', _this._writeHandler);

      return _this.tree.on('update', _this._updateHandler);
    };

    // If the path is dynamic, we actually need to listen to the tree
    if (this._dynamicPath) {
      this._lazyBind();
    } else {

      // Overriding the emitter `on` and `once` methods
      this.on = (0, _helpers.before)(this._lazyBind, this.on.bind(this));
      this.once = (0, _helpers.before)(this._lazyBind, this.once.bind(this));
    }
  }

  /**
   * Method used to allow iterating over cursors containing list-type data.
   *
   * e.g. for(let i of cursor) { ... }
   *
   * @returns {object} -  Each item sequentially.
   */

  /**
   * Internal helpers
   * -----------------
   */

  /**
   * Method returning the paths of the tree watched over by the cursor and that
   * should be taken into account when solving a potential update.
   *
   * @return {array} - Array of paths to compare with a given update.
   */

  _createClass(Cursor, [{
    key: '_getComparedPaths',
    value: function _getComparedPaths() {

      // Checking whether we should keep track of some dependencies
      var additionalPaths = this._monkeyPath ? (0, _helpers.getIn)(this.tree._monkeys, this._monkeyPath).data.relatedPaths() : [];

      return [this.solvedPath].concat(additionalPaths);
    }

    /**
     * Predicates
     * -----------
     */

    /**
     * Method returning whether the cursor is at root level.
     *
     * @return {boolean} - Is the cursor the root?
     */
  }, {
    key: 'isRoot',
    value: function isRoot() {
      return !this.path.length;
    }

    /**
     * Method returning whether the cursor is at leaf level.
     *
     * @return {boolean} - Is the cursor a leaf?
     */
  }, {
    key: 'isLeaf',
    value: function isLeaf() {
      return _type2['default'].primitive(this._get().data);
    }

    /**
     * Method returning whether the cursor is at branch level.
     *
     * @return {boolean} - Is the cursor a branch?
     */
  }, {
    key: 'isBranch',
    value: function isBranch() {
      return !this.isRoot() && !this.isLeaf();
    }

    /**
     * Traversal Methods
     * ------------------
     */

    /**
     * Method returning the root cursor.
     *
     * @return {Baobab} - The root cursor.
     */
  }, {
    key: 'root',
    value: function root() {
      return this.tree.select();
    }

    /**
     * Method selecting a subpath as a new cursor.
     *
     * Arity (1):
     * @param  {path} path    - The path to select.
     *
     * Arity (*):
     * @param  {...step} path - The path to select.
     *
     * @return {Cursor}       - The created cursor.
     */
  }, {
    key: 'select',
    value: function select(path) {
      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      return this.tree.select(this.path.concat(path));
    }

    /**
     * Method returning the parent node of the cursor or else `null` if the
     * cursor is already at root level.
     *
     * @return {Baobab} - The parent cursor.
     */
  }, {
    key: 'up',
    value: function up() {
      if (!this.isRoot()) return this.tree.select(this.path.slice(0, -1));

      return null;
    }

    /**
     * Method returning the child node of the cursor.
     *
     * @return {Baobab} - The child cursor.
     */
  }, {
    key: 'down',
    value: function down() {
      checkPossibilityOfDynamicTraversal('down', this.solvedPath);

      if (!(this._get().data instanceof Array)) throw Error('Baobab.Cursor.down: cannot go down on a non-list type.');

      return this.tree.select(this.solvedPath.concat(0));
    }

    /**
     * Method returning the left sibling node of the cursor if this one is
     * pointing at a list. Returns `null` if this cursor is already leftmost.
     *
     * @return {Baobab} - The left sibling cursor.
     */
  }, {
    key: 'left',
    value: function left() {
      checkPossibilityOfDynamicTraversal('left', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.left: cannot go left on a non-list type.');

      return last ? this.tree.select(this.solvedPath.slice(0, -1).concat(last - 1)) : null;
    }

    /**
     * Method returning the right sibling node of the cursor if this one is
     * pointing at a list. Returns `null` if this cursor is already rightmost.
     *
     * @return {Baobab} - The right sibling cursor.
     */
  }, {
    key: 'right',
    value: function right() {
      checkPossibilityOfDynamicTraversal('right', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.right: cannot go right on a non-list type.');

      if (last + 1 === this.up()._get().data.length) return null;

      return this.tree.select(this.solvedPath.slice(0, -1).concat(last + 1));
    }

    /**
     * Method returning the leftmost sibling node of the cursor if this one is
     * pointing at a list.
     *
     * @return {Baobab} - The leftmost sibling cursor.
     */
  }, {
    key: 'leftmost',
    value: function leftmost() {
      checkPossibilityOfDynamicTraversal('leftmost', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.leftmost: cannot go left on a non-list type.');

      return this.tree.select(this.solvedPath.slice(0, -1).concat(0));
    }

    /**
     * Method returning the rightmost sibling node of the cursor if this one is
     * pointing at a list.
     *
     * @return {Baobab} - The rightmost sibling cursor.
     */
  }, {
    key: 'rightmost',
    value: function rightmost() {
      checkPossibilityOfDynamicTraversal('rightmost', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.rightmost: cannot go right on a non-list type.');

      var list = this.up()._get().data;

      return this.tree.select(this.solvedPath.slice(0, -1).concat(list.length - 1));
    }

    /**
     * Method mapping the children nodes of the cursor.
     *
     * @param  {function} fn      - The function to map.
     * @param  {object}   [scope] - An optional scope.
     * @return {array}            - The resultant array.
     */
  }, {
    key: 'map',
    value: function map(fn, scope) {
      checkPossibilityOfDynamicTraversal('map', this.solvedPath);

      var array = this._get().data,
          l = arguments.length;

      if (!_type2['default'].array(array)) throw Error('baobab.Cursor.map: cannot map a non-list type.');

      return array.map(function (item, i) {
        return fn.call(l > 1 ? scope : this, this.select(i), i, array);
      }, this);
    }

    /**
     * Getter Methods
     * ---------------
     */

    /**
     * Internal get method. Basically contains the main body of the `get` method
     * without the event emitting. This is sometimes needed not to fire useless
     * events.
     *
     * @param  {path}   [path=[]]       - Path to get in the tree.
     * @return {object} info            - The resultant information.
     * @return {mixed}  info.data       - Data at path.
     * @return {array}  info.solvedPath - The path solved when getting.
     */
  }, {
    key: '_get',
    value: function _get() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if (!_type2['default'].path(path)) throw (0, _helpers.makeError)('Baobab.Cursor.getters: invalid path.', { path: path });

      if (!this.solvedPath) return { data: undefined, solvedPath: null, exists: false };

      return (0, _helpers.getIn)(this.tree._data, this.solvedPath.concat(path));
    }

    /**
     * Method used to check whether a certain path exists in the tree starting
     * from the current cursor.
     *
     * Arity (1):
     * @param  {path}   path           - Path to check in the tree.
     *
     * Arity (2):
     * @param {..step}  path           - Path to check in the tree.
     *
     * @return {boolean}               - Does the given path exists?
     */
  }, {
    key: 'exists',
    value: function exists(path) {
      path = (0, _helpers.coercePath)(path);

      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      return this._get(path).exists;
    }

    /**
     * Method used to get data from the tree. Will fire a `get` event from the
     * tree so that the user may sometimes react upon it to fetch data, for
     * instance.
     *
     * Arity (1):
     * @param  {path}   path           - Path to get in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to get in the tree.
     *
     * @return {mixed}                 - Data at path.
     */
  }, {
    key: 'get',
    value: function get(path) {
      path = (0, _helpers.coercePath)(path);

      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      var _get2 = this._get(path);

      var data = _get2.data;
      var solvedPath = _get2.solvedPath;

      // Emitting the event
      this.tree.emit('get', { data: data, solvedPath: solvedPath, path: this.path.concat(path) });

      return data;
    }

    /**
     * Method used to shallow clone data from the tree.
     *
     * Arity (1):
     * @param  {path}   path           - Path to get in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to get in the tree.
     *
     * @return {mixed}                 - Cloned data at path.
     */
  }, {
    key: 'clone',
    value: function clone() {
      var data = this.get.apply(this, arguments);

      return (0, _helpers.shallowClone)(data);
    }

    /**
     * Method used to deep clone data from the tree.
     *
     * Arity (1):
     * @param  {path}   path           - Path to get in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to get in the tree.
     *
     * @return {mixed}                 - Cloned data at path.
     */
  }, {
    key: 'deepClone',
    value: function deepClone() {
      var data = this.get.apply(this, arguments);

      return (0, _helpers.deepClone)(data);
    }

    /**
     * Method used to return raw data from the tree, by carefully avoiding
     * computed one.
     *
     * @todo: should be more performant as the cloning should happen as well as
     * when dropping computed data.
     *
     * Arity (1):
     * @param  {path}   path           - Path to serialize in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to serialize in the tree.
     *
     * @return {mixed}                 - The retrieved raw data.
     */
  }, {
    key: 'serialize',
    value: function serialize(path) {
      path = (0, _helpers.coercePath)(path);

      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      if (!_type2['default'].path(path)) throw (0, _helpers.makeError)('Baobab.Cursor.getters: invalid path.', { path: path });

      if (!this.solvedPath) return undefined;

      var fullPath = this.solvedPath.concat(path);

      var data = (0, _helpers.deepClone)((0, _helpers.getIn)(this.tree._data, fullPath).data),
          monkeys = (0, _helpers.getIn)(this.tree._monkeys, fullPath).data;

      var dropComputedData = function dropComputedData(d, m) {
        if (!_type2['default'].object(m) || !_type2['default'].object(d)) return;

        for (var k in m) {
          if (m[k] instanceof _monkey.Monkey) delete d[k];else dropComputedData(d[k], m[k]);
        }
      };

      dropComputedData(data, monkeys);
      return data;
    }

    /**
     * Method used to project some of the data at cursor onto a map or a list.
     *
     * @param  {object|array} projection - The projection's formal definition.
     * @return {object|array}            - The resultant map/list.
     */
  }, {
    key: 'project',
    value: function project(projection) {
      if (_type2['default'].object(projection)) {
        var data = {};

        for (var k in projection) {
          data[k] = this.get(projection[k]);
        }return data;
      } else if (_type2['default'].array(projection)) {
        var data = [];

        for (var i = 0, l = projection.length; i < l; i++) {
          data.push(this.get(projection[i]));
        }return data;
      }

      throw (0, _helpers.makeError)('Baobab.Cursor.project: wrong projection.', { projection: projection });
    }

    /**
     * History Methods
     * ----------------
     */

    /**
     * Methods starting to record the cursor's successive states.
     *
     * @param  {integer} [maxRecords] - Maximum records to keep in memory. Note
     *                                  that if no number is provided, the cursor
     *                                  will keep everything.
     * @return {Cursor}               - The cursor instance for chaining purposes.
     */
  }, {
    key: 'startRecording',
    value: function startRecording(maxRecords) {
      maxRecords = maxRecords || Infinity;

      if (maxRecords < 1) throw (0, _helpers.makeError)('Baobab.Cursor.startRecording: invalid max records.', {
        value: maxRecords
      });

      this.state.recording = true;

      if (this.archive) return this;

      // Lazy binding
      this._lazyBind();

      this.archive = new _helpers.Archive(maxRecords);
      return this;
    }

    /**
     * Methods stopping to record the cursor's successive states.
     *
     * @return {Cursor} - The cursor instance for chaining purposes.
     */
  }, {
    key: 'stopRecording',
    value: function stopRecording() {
      this.state.recording = false;
      return this;
    }

    /**
     * Methods undoing n steps of the cursor's recorded states.
     *
     * @param  {integer} [steps=1] - The number of steps to rollback.
     * @return {Cursor}            - The cursor instance for chaining purposes.
     */
  }, {
    key: 'undo',
    value: function undo() {
      var steps = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      if (!this.state.recording) throw new Error('Baobab.Cursor.undo: cursor is not recording.');

      var record = this.archive.back(steps);

      if (!record) throw Error('Baobab.Cursor.undo: cannot find a relevant record.');

      this.state.undoing = true;
      this.set(record);

      return this;
    }

    /**
     * Methods returning whether the cursor has a recorded history.
     *
     * @return {boolean} - `true` if the cursor has a recorded history?
     */
  }, {
    key: 'hasHistory',
    value: function hasHistory() {
      return !!(this.archive && this.archive.get().length);
    }

    /**
     * Methods returning the cursor's history.
     *
     * @return {array} - The cursor's history.
     */
  }, {
    key: 'getHistory',
    value: function getHistory() {
      return this.archive ? this.archive.get() : [];
    }

    /**
     * Methods clearing the cursor's history.
     *
     * @return {Cursor} - The cursor instance for chaining purposes.
     */
  }, {
    key: 'clearHistory',
    value: function clearHistory() {
      if (this.archive) this.archive.clear();
      return this;
    }

    /**
     * Releasing
     * ----------
     */

    /**
     * Methods releasing the cursor from memory.
     */
  }, {
    key: 'release',
    value: function release() {

      // Removing listeners on parent
      if (this._dynamicPath) this.tree.off('write', this._writeHandler);

      this.tree.off('update', this._updateHandler);

      // Unsubscribe from the parent
      if (this.hash) delete this.tree._cursors[this.hash];

      // Dereferencing
      delete this.tree;
      delete this.path;
      delete this.solvedPath;
      delete this.archive;

      // Killing emitter
      this.kill();
      this.state.killed = true;
    }

    /**
     * Output
     * -------
     */

    /**
     * Overriding the `toJSON` method for convenient use with JSON.stringify.
     *
     * @return {mixed} - Data at cursor.
     */
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.serialize();
    }

    /**
     * Overriding the `toString` method for debugging purposes.
     *
     * @return {string} - The cursor's identity.
     */
  }, {
    key: 'toString',
    value: function toString() {
      return this._identity;
    }
  }]);

  return Cursor;
})(_emmett2['default']);

exports['default'] = Cursor;
if (typeof Symbol === 'function' && typeof Symbol.iterator !== 'undefined') {
  Cursor.prototype[Symbol.iterator] = function () {
    var array = this._get().data;

    if (!_type2['default'].array(array)) throw Error('baobab.Cursor.@@iterate: cannot iterate a non-list type.');

    var i = 0;

    var cursor = this,
        length = array.length;

    return {
      next: function next() {
        if (i < length) {
          return {
            value: cursor.select(i++)
          };
        }

        return {
          done: true
        };
      }
    };
  };
}

/**
 * Setter Methods
 * ---------------
 *
 * Those methods are dynamically assigned to the class for DRY reasons.
 */

// Not using a Set so that ES5 consumers don't pay a bundle size price
var INTRANSITIVE_SETTERS = {
  unset: true,
  pop: true,
  shift: true
};

/**
 * Function creating a setter method for the Cursor class.
 *
 * @param {string}   name          - the method's name.
 * @param {function} [typeChecker] - a function checking that the given value is
 *                                   valid for the given operation.
 */
function makeSetter(name, typeChecker) {

  /**
   * Binding a setter method to the Cursor class and having the following
   * definition.
   *
   * Note: this is not really possible to make those setters variadic because
   * it would create an impossible polymorphism with path.
   *
   * @todo: perform value validation elsewhere so that tree.update can
   * beneficiate from it.
   *
   * Arity (1):
   * @param  {mixed} value - New value to set at cursor's path.
   *
   * Arity (2):
   * @param  {path}  path  - Subpath to update starting from cursor's.
   * @param  {mixed} value - New value to set.
   *
   * @return {mixed}       - Data at path.
   */
  Cursor.prototype[name] = function (path, value) {

    // We should warn the user if he applies to many arguments to the function
    if (arguments.length > 2) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': too many arguments.');

    // Handling arities
    if (arguments.length === 1 && !INTRANSITIVE_SETTERS[name]) {
      value = path;
      path = [];
    }

    // Coerce path
    path = (0, _helpers.coercePath)(path);

    // Checking the path's validity
    if (!_type2['default'].path(path)) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': invalid path.', { path: path });

    // Checking the value's validity
    if (typeChecker && !typeChecker(value)) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': invalid value.', { path: path, value: value });

    // Checking the solvability of the cursor's dynamic path
    if (!this.solvedPath) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': the dynamic path of the cursor cannot be solved.', { path: this.path });

    var fullPath = this.solvedPath.concat(path);

    // Filing the update to the tree
    return this.tree.update(fullPath, {
      type: name,
      value: value
    });
  };
}

/**
 * Making the necessary setters.
 */
makeSetter('set');
makeSetter('unset');
makeSetter('apply', _type2['default']['function']);
makeSetter('push');
makeSetter('concat', _type2['default'].array);
makeSetter('unshift');
makeSetter('pop');
makeSetter('shift');
makeSetter('splice', _type2['default'].splicer);
makeSetter('merge', _type2['default'].object);
makeSetter('deepMerge', _type2['default'].object);
module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Baobab Update
 * ==============
 *
 * The tree's update scheme.
 */


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = update;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _type = __webpack_require__(0);

var _type2 = _interopRequireDefault(_type);

var _helpers = __webpack_require__(1);

function err(operation, expectedTarget, path) {
  return (0, _helpers.makeError)('Baobab.update: cannot apply the "' + operation + '" on ' + ('a non ' + expectedTarget + ' (path: /' + path.join('/') + ').'), { path: path });
}

/**
 * Function aiming at applying a single update operation on the given tree's
 * data.
 *
 * @param  {mixed}  data      - The tree's data.
 * @param  {path}   path      - Path of the update.
 * @param  {object} operation - The operation to apply.
 * @param  {object} [opts]    - Optional options.
 * @return {mixed}            - Both the new tree's data and the updated node.
 */

function update(data, path, operation) {
  var opts = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
  var operationType = operation.type;
  var value = operation.value;
  var _operation$options = operation.options;
  var operationOptions = _operation$options === undefined ? {} : _operation$options;

  // Dummy root, so we can shift and alter the root
  var dummy = { root: data },
      dummyPath = ['root'].concat(_toConsumableArray(path)),
      currentPath = [];

  // Walking the path
  var p = dummy,
      i = undefined,
      l = undefined,
      s = undefined;

  for (i = 0, l = dummyPath.length; i < l; i++) {

    // Current item's reference is therefore p[s]
    // The reason why we don't create a variable here for convenience
    // is because we actually need to mutate the reference.
    s = dummyPath[i];

    // Updating the path
    if (i > 0) currentPath.push(s);

    // If we reached the end of the path, we apply the operation
    if (i === l - 1) {

      /**
       * Set
       */
      if (operationType === 'set') {

        // Purity check
        if (opts.pure && p[s] === value) return { node: p[s] };

        if (_type2['default'].lazyGetter(p, s)) {
          Object.defineProperty(p, s, {
            value: value,
            enumerable: true,
            configurable: true
          });
        } else if (opts.persistent && !operationOptions.mutableLeaf) {
          p[s] = (0, _helpers.shallowClone)(value);
        } else {
          p[s] = value;
        }
      }

      /**
       * Monkey
       */
      else if (operationType === 'monkey') {
          Object.defineProperty(p, s, {
            get: value,
            enumerable: true,
            configurable: true
          });
        }

        /**
         * Apply
         */
        else if (operationType === 'apply') {
            var result = value(p[s]);

            // Purity check
            if (opts.pure && p[s] === result) return { node: p[s] };

            if (_type2['default'].lazyGetter(p, s)) {
              Object.defineProperty(p, s, {
                value: result,
                enumerable: true,
                configurable: true
              });
            } else if (opts.persistent) {
              p[s] = (0, _helpers.shallowClone)(result);
            } else {
              p[s] = result;
            }
          }

          /**
           * Push
           */
          else if (operationType === 'push') {
              if (!_type2['default'].array(p[s])) throw err('push', 'array', currentPath);

              if (opts.persistent) p[s] = p[s].concat([value]);else p[s].push(value);
            }

            /**
             * Unshift
             */
            else if (operationType === 'unshift') {
                if (!_type2['default'].array(p[s])) throw err('unshift', 'array', currentPath);

                if (opts.persistent) p[s] = [value].concat(p[s]);else p[s].unshift(value);
              }

              /**
               * Concat
               */
              else if (operationType === 'concat') {
                  if (!_type2['default'].array(p[s])) throw err('concat', 'array', currentPath);

                  if (opts.persistent) p[s] = p[s].concat(value);else p[s].push.apply(p[s], value);
                }

                /**
                 * Splice
                 */
                else if (operationType === 'splice') {
                    if (!_type2['default'].array(p[s])) throw err('splice', 'array', currentPath);

                    if (opts.persistent) p[s] = _helpers.splice.apply(null, [p[s]].concat(value));else p[s].splice.apply(p[s], value);
                  }

                  /**
                   * Pop
                   */
                  else if (operationType === 'pop') {
                      if (!_type2['default'].array(p[s])) throw err('pop', 'array', currentPath);

                      if (opts.persistent) p[s] = (0, _helpers.splice)(p[s], -1, 1);else p[s].pop();
                    }

                    /**
                     * Shift
                     */
                    else if (operationType === 'shift') {
                        if (!_type2['default'].array(p[s])) throw err('shift', 'array', currentPath);

                        if (opts.persistent) p[s] = (0, _helpers.splice)(p[s], 0, 1);else p[s].shift();
                      }

                      /**
                       * Unset
                       */
                      else if (operationType === 'unset') {
                          if (_type2['default'].object(p)) delete p[s];else if (_type2['default'].array(p)) p.splice(s, 1);
                        }

                        /**
                         * Merge
                         */
                        else if (operationType === 'merge') {
                            if (!_type2['default'].object(p[s])) throw err('merge', 'object', currentPath);

                            if (opts.persistent) p[s] = (0, _helpers.shallowMerge)({}, p[s], value);else p[s] = (0, _helpers.shallowMerge)(p[s], value);
                          }

                          /**
                           * Deep merge
                           */
                          else if (operationType === 'deepMerge') {
                              if (!_type2['default'].object(p[s])) throw err('deepMerge', 'object', currentPath);

                              if (opts.persistent) p[s] = (0, _helpers.deepMerge)({}, p[s], value);else p[s] = (0, _helpers.deepMerge)(p[s], value);
                            }

      // Deep freezing the resulting value
      if (opts.immutable && !operationOptions.mutableLeaf) (0, _helpers.deepFreeze)(p);

      break;
    }

    // If we reached a leaf, we override by setting an empty object
    else if (_type2['default'].primitive(p[s])) {
        p[s] = {};
      }

      // Else, we shift the reference and continue the path
      else if (opts.persistent) {
          p[s] = (0, _helpers.shallowClone)(p[s]);
        }

    // Should we freeze the current step before continuing?
    if (opts.immutable && l > 0) (0, _helpers.freeze)(p);

    p = p[s];
  }

  // If we are updating a dynamic node, we need not return the affected node
  if (_type2['default'].lazyGetter(p, s)) return { data: dummy.root };

  // Returning new data object
  return { data: dummy.root, node: p[s] };
}

module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _inferno = __webpack_require__(4);

var _inferno2 = _interopRequireDefault(_inferno);

__webpack_require__(10);

var _state = __webpack_require__(15);

var _state2 = _interopRequireDefault(_state);

var _Globe = __webpack_require__(19);

var _Globe2 = _interopRequireDefault(_Globe);

var _baobab = __webpack_require__(16);

var _baobab2 = _interopRequireDefault(_baobab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = new _baobab2.default({
  meta: {
    name: 'avkultra'
  },
  globe: {
    message: 'hello',
    name: 'wendy'
  }
});

var createVNode = _inferno2.default.createVNode;
var app = function app(props) {
  return createVNode(2, 'div', null, createVNode(2, 'h1', null, 'props:'));
};

var initialize = function initialize(tree, App) {
  tree.on('update', function () {
    return _inferno2.default.render(createVNode(16, App, null, null, {
      'props': tree
    }), document.querySelector('#app'));
  });
  _inferno2.default.render(createVNode(16, App, null, null, {
    'props': tree
  }), document.querySelector('#app'));
};

initialize(_state2.default, app);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @module Inferno-Shared
 */ /** TypeDoc Comment */
var NO_OP = '$NO_OP';
var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
// This should be boolean and not reference to window.document
var isBrowser = !!(typeof window !== 'undefined' && window.document);
// this is MUCH faster than .constructor === Array and instanceof Array
// in Node 7 and the later versions of V8, slower in older versions though
var isArray = Array.isArray;
function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}
function isStringOrNumber(o) {
    var type = typeof o;
    return type === 'string' || type === 'number';
}
function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
}
function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
}
function isFunction(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}
function isNumber(o) {
    return typeof o === 'number';
}
function isNull(o) {
    return o === null;
}
function isTrue(o) {
    return o === true;
}
function isUndefined(o) {
    return o === void 0;
}
function isObject(o) {
    return typeof o === 'object';
}
function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(("Inferno Error: " + message));
}
function warning(message) {
    // tslint:disable-next-line:no-console
    console.warn(message);
}
function combineFrom(first, second) {
    var out = {};
    if (first) {
        for (var key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (var key$1 in second) {
            out[key$1] = second[key$1];
        }
    }
    return out;
}
function Lifecycle() {
    this.listeners = [];
}
Lifecycle.prototype.addListener = function addListener(callback) {
    this.listeners.push(callback);
};
Lifecycle.prototype.trigger = function trigger() {
    var listeners = this.listeners;
    var listener;
    // We need to remove current listener from array when calling it, because more listeners might be added
    while (listener = listeners.shift()) {
        listener();
    }
};

/**
 * @module Inferno
 */ /** TypeDoc Comment */
var options = {
    afterMount: null,
    afterRender: null,
    afterUpdate: null,
    beforeRender: null,
    beforeUnmount: null,
    createVNode: null,
    findDOMNodeEnabled: false,
    recyclingEnabled: false,
    roots: []
};

/**
 * @module Inferno
 */ /** TypeDoc Comment */
var xlinkNS = "http://www.w3.org/1999/xlink";
var xmlNS = "http://www.w3.org/XML/1998/namespace";
var svgNS = "http://www.w3.org/2000/svg";
var strictProps = new Set();
strictProps.add("volume");
strictProps.add("defaultChecked");
var booleanProps = new Set();
booleanProps.add("muted");
booleanProps.add("scoped");
booleanProps.add("loop");
booleanProps.add("open");
booleanProps.add("checked");
booleanProps.add("default");
booleanProps.add("capture");
booleanProps.add("disabled");
booleanProps.add("readOnly");
booleanProps.add("required");
booleanProps.add("autoplay");
booleanProps.add("controls");
booleanProps.add("seamless");
booleanProps.add("reversed");
booleanProps.add("allowfullscreen");
booleanProps.add("novalidate");
booleanProps.add("hidden");
booleanProps.add("autoFocus");
booleanProps.add("selected");
var namespaces = new Map();
namespaces.set("xlink:href", xlinkNS);
namespaces.set("xlink:arcrole", xlinkNS);
namespaces.set("xlink:actuate", xlinkNS);
namespaces.set("xlink:show", xlinkNS);
namespaces.set("xlink:role", xlinkNS);
namespaces.set("xlink:title", xlinkNS);
namespaces.set("xlink:type", xlinkNS);
namespaces.set("xml:base", xmlNS);
namespaces.set("xml:lang", xmlNS);
namespaces.set("xml:space", xmlNS);
var isUnitlessNumber = new Set();
isUnitlessNumber.add("animationIterationCount");
isUnitlessNumber.add("borderImageOutset");
isUnitlessNumber.add("borderImageSlice");
isUnitlessNumber.add("borderImageWidth");
isUnitlessNumber.add("boxFlex");
isUnitlessNumber.add("boxFlexGroup");
isUnitlessNumber.add("boxOrdinalGroup");
isUnitlessNumber.add("columnCount");
isUnitlessNumber.add("flex");
isUnitlessNumber.add("flexGrow");
isUnitlessNumber.add("flexPositive");
isUnitlessNumber.add("flexShrink");
isUnitlessNumber.add("flexNegative");
isUnitlessNumber.add("flexOrder");
isUnitlessNumber.add("gridRow");
isUnitlessNumber.add("gridColumn");
isUnitlessNumber.add("fontWeight");
isUnitlessNumber.add("lineClamp");
isUnitlessNumber.add("lineHeight");
isUnitlessNumber.add("opacity");
isUnitlessNumber.add("order");
isUnitlessNumber.add("orphans");
isUnitlessNumber.add("tabSize");
isUnitlessNumber.add("widows");
isUnitlessNumber.add("zIndex");
isUnitlessNumber.add("zoom");
isUnitlessNumber.add("fillOpacity");
isUnitlessNumber.add("floodOpacity");
isUnitlessNumber.add("stopOpacity");
isUnitlessNumber.add("strokeDasharray");
isUnitlessNumber.add("strokeDashoffset");
isUnitlessNumber.add("strokeMiterlimit");
isUnitlessNumber.add("strokeOpacity");
isUnitlessNumber.add("strokeWidth");
var skipProps = new Set();
skipProps.add("children");
skipProps.add("childrenType");
skipProps.add("defaultValue");
skipProps.add("ref");
skipProps.add("key");
skipProps.add("checked");
skipProps.add("multiple");
var delegatedEvents = new Set();
delegatedEvents.add("onClick");
delegatedEvents.add("onMouseDown");
delegatedEvents.add("onMouseUp");
delegatedEvents.add("onMouseMove");
delegatedEvents.add("onSubmit");
delegatedEvents.add("onDblClick");
delegatedEvents.add("onKeyDown");
delegatedEvents.add("onKeyUp");
delegatedEvents.add("onKeyPress");

/**
 * @module Inferno
 */ /** TypeDoc Comment */
var isiOS = isBrowser && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var delegatedEvents$1 = new Map();
function handleEvent(name, lastEvent, nextEvent, dom) {
    var delegatedRoots = delegatedEvents$1.get(name);
    if (nextEvent) {
        if (!delegatedRoots) {
            delegatedRoots = { items: new Map(), docEvent: null };
            delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots);
            delegatedEvents$1.set(name, delegatedRoots);
        }
        if (!lastEvent) {
            if (isiOS && name === 'onClick') {
                trapClickOnNonInteractiveElement(dom);
            }
        }
        delegatedRoots.items.set(dom, nextEvent);
    }
    else if (delegatedRoots) {
        var items = delegatedRoots.items;
        if (items.delete(dom)) {
            // If any items were deleted, check if listener need to be removed
            if (items.size === 0) {
                document.removeEventListener(normalizeEventName(name), delegatedRoots.docEvent);
                delegatedEvents$1.delete(name);
            }
        }
    }
}
function dispatchEvent(event, target, items, count, isClick, eventData) {
    var eventsToTrigger = items.get(target);
    if (eventsToTrigger) {
        count--;
        // linkEvent object
        eventData.dom = target;
        if (eventsToTrigger.event) {
            eventsToTrigger.event(eventsToTrigger.data, event);
        }
        else {
            eventsToTrigger(event);
        }
        if (event.cancelBubble) {
            return;
        }
    }
    if (count > 0) {
        var parentDom = target.parentNode;
        // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
        // because the event listener is on document.body
        // Don't process clicks on disabled elements
        if (parentDom === null || (isClick && parentDom.nodeType === 1 && parentDom.disabled)) {
            return;
        }
        dispatchEvent(event, parentDom, items, count, isClick, eventData);
    }
}
function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
function stopPropagation() {
    this.cancelBubble = true;
    this.stopImmediatePropagation();
}
function attachEventToDocument(name, delegatedRoots) {
    var docEvent = function (event) {
        var count = delegatedRoots.items.size;
        if (count > 0) {
            event.stopPropagation = stopPropagation;
            // Event data needs to be object to save reference to currentTarget getter
            var eventData = {
                dom: document
            };
            try {
                Object.defineProperty(event, 'currentTarget', {
                    configurable: true,
                    get: function get() {
                        return eventData.dom;
                    }
                });
            }
            catch (e) { }
            dispatchEvent(event, event.target, delegatedRoots.items, count, event.type === 'click', eventData);
        }
    };
    document.addEventListener(normalizeEventName(name), docEvent);
    return docEvent;
}
// tslint:disable-next-line:no-empty
function emptyFn() { }
function trapClickOnNonInteractiveElement(dom) {
    // Mobile Safari does not fire properly bubble click events on
    // non-interactive elements, which means delegated click listeners do not
    // fire. The workaround for this bug involves attaching an empty click
    // listener on the target node.
    // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
    // Just set it using the onclick property so that we don't have to manage any
    // bookkeeping for it. Not sure if we need to clear it when the listener is
    // removed.
    // TODO: Only do this for the relevant Safaris maybe?
    dom.onclick = emptyFn;
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function isCheckedType(type) {
    return type === 'checkbox' || type === 'radio';
}
function onTextInputChange(e) {
    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    var previousValue = props.value;
    if (props.onInput) {
        var event = props.onInput;
        if (event.event) {
            event.event(event.data, e);
        }
        else {
            event(e);
        }
    }
    else if (props.oninput) {
        props.oninput(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    if (previousValue !== newProps.value) {
        // When this happens we need to store current cursor position and restore it, to avoid jumping
        applyValue(newProps, dom);
    }
}
function wrappedOnChange(e) {
    var props = this.vNode.props || EMPTY_OBJ;
    var event = props.onChange;
    if (event.event) {
        event.event(event.data, e);
    }
    else {
        event(e);
    }
}
function onCheckboxChange(e) {
    e.stopPropagation(); // This click should not propagate its for internal use
    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    if (props.onClick) {
        var event = props.onClick;
        if (event.event) {
            event.event(event.data, e);
        }
        else {
            event(e);
        }
    }
    else if (props.onclick) {
        props.onclick(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    applyValue(newProps, dom);
}
function processInput(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue(nextPropsOrEmpty, dom);
    if (isControlled) {
        dom.vNode = vNode; // TODO: Remove this when implementing Fiber's
        if (mounting) {
            if (isCheckedType(nextPropsOrEmpty.type)) {
                dom.onclick = onCheckboxChange;
                dom.onclick.wrapped = true;
            }
            else {
                dom.oninput = onTextInputChange;
                dom.oninput.wrapped = true;
            }
            if (nextPropsOrEmpty.onChange) {
                dom.onchange = wrappedOnChange;
                dom.onchange.wrapped = true;
            }
        }
    }
}
function applyValue(nextPropsOrEmpty, dom) {
    var type = nextPropsOrEmpty.type;
    var value = nextPropsOrEmpty.value;
    var checked = nextPropsOrEmpty.checked;
    var multiple = nextPropsOrEmpty.multiple;
    var defaultValue = nextPropsOrEmpty.defaultValue;
    var hasValue = !isNullOrUndef(value);
    if (type && type !== dom.type) {
        dom.setAttribute('type', type);
    }
    if (multiple && multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    if (!isNullOrUndef(defaultValue) && !hasValue) {
        dom.defaultValue = defaultValue + '';
    }
    if (isCheckedType(type)) {
        if (hasValue) {
            dom.value = value;
        }
        if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
    else {
        if (hasValue && dom.value !== value) {
            dom.defaultValue = value;
            dom.value = value;
        }
        else if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function updateChildOptionGroup(vNode, value) {
    var type = vNode.type;
    if (type === 'optgroup') {
        var children = vNode.children;
        if (isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
                updateChildOption(children[i], value);
            }
        }
        else if (isVNode(children)) {
            updateChildOption(children, value);
        }
    }
    else {
        updateChildOption(vNode, value);
    }
}
function updateChildOption(vNode, value) {
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    // we do this as multiple may have changed
    dom.value = props.value;
    if ((isArray(value) && value.indexOf(props.value) !== -1) || props.value === value) {
        dom.selected = true;
    }
    else if (!isNullOrUndef(value) || !isNullOrUndef(props.selected)) {
        dom.selected = props.selected || false;
    }
}
function onSelectChange(e) {
    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    var previousValue = props.value;
    if (props.onChange) {
        var event = props.onChange;
        if (event.event) {
            event.event(event.data, e);
        }
        else {
            event(e);
        }
    }
    else if (props.onchange) {
        props.onchange(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    if (previousValue !== newProps.value) {
        // When this happens we need to store current cursor position and restore it, to avoid jumping
        applyValue$1(newVNode, dom, newProps, false);
    }
}
function processSelect(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue$1(vNode, dom, nextPropsOrEmpty, mounting);
    if (isControlled) {
        dom.vNode = vNode; // TODO: Remove this when implementing Fiber's
        if (mounting) {
            dom.onchange = onSelectChange;
            dom.onchange.wrapped = true;
        }
    }
}
function applyValue$1(vNode, dom, nextPropsOrEmpty, mounting) {
    if (nextPropsOrEmpty.multiple !== dom.multiple) {
        dom.multiple = nextPropsOrEmpty.multiple;
    }
    var children = vNode.children;
    if (!isInvalid(children)) {
        var value = nextPropsOrEmpty.value;
        if (mounting && isNullOrUndef(value)) {
            value = nextPropsOrEmpty.defaultValue;
        }
        if (isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
                updateChildOptionGroup(children[i], value);
            }
        }
        else if (isVNode(children)) {
            updateChildOptionGroup(children, value);
        }
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function wrappedOnChange$1(e) {
    var props = this.vNode.props || EMPTY_OBJ;
    var event = props.onChange;
    if (event.event) {
        event.event(event.data, e);
    }
    else {
        event(e);
    }
}
function onTextareaInputChange(e) {
    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var previousValue = props.value;
    if (props.onInput) {
        var event = props.onInput;
        if (event.event) {
            event.event(event.data, e);
        }
        else {
            event(e);
        }
    }
    else if (props.oninput) {
        props.oninput(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    if (previousValue !== newProps.value) {
        // When this happens we need to store current cursor position and restore it, to avoid jumping
        applyValue$2(newVNode, vNode.dom, false);
    }
}
function processTextarea(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue$2(nextPropsOrEmpty, dom, mounting);
    if (isControlled) {
        dom.vNode = vNode; // TODO: Remove this when implementing Fiber's
        if (mounting) {
            dom.oninput = onTextareaInputChange;
            dom.oninput.wrapped = true;
            if (nextPropsOrEmpty.onChange) {
                dom.onchange = wrappedOnChange$1;
                dom.onchange.wrapped = true;
            }
        }
    }
}
function applyValue$2(nextPropsOrEmpty, dom, mounting) {
    var value = nextPropsOrEmpty.value;
    var domValue = dom.value;
    if (isNullOrUndef(value)) {
        if (mounting) {
            var defaultValue = nextPropsOrEmpty.defaultValue;
            if (!isNullOrUndef(defaultValue)) {
                if (defaultValue !== domValue) {
                    dom.defaultValue = defaultValue;
                    dom.value = defaultValue;
                }
            }
            else if (domValue !== '') {
                dom.defaultValue = '';
                dom.value = '';
            }
        }
    }
    else {
        /* There is value so keep it controlled */
        if (domValue !== value) {
            dom.defaultValue = value;
            dom.value = value;
        }
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
/**
 * There is currently no support for switching same input between controlled and nonControlled
 * If that ever becomes a real issue, then re design controlled elements
 * Currently user must choose either controlled or non-controlled and stick with that
 */
function processElement(flags, vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    if (flags & 512 /* InputElement */) {
        processInput(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
    }
    if (flags & 2048 /* SelectElement */) {
        processSelect(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
    }
    if (flags & 1024 /* TextareaElement */) {
        processTextarea(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
    }
}
function isControlledFormElement(nextPropsOrEmpty) {
    return (nextPropsOrEmpty.type && isCheckedType(nextPropsOrEmpty.type)) ? !isNullOrUndef(nextPropsOrEmpty.checked) : !isNullOrUndef(nextPropsOrEmpty.value);
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function normalizeChildNodes(parentDom) {
    var dom = parentDom.firstChild;
    while (dom) {
        if (dom.nodeType === 8) {
            if (dom.data === "!") {
                var placeholder = document.createTextNode("");
                parentDom.replaceChild(placeholder, dom);
                dom = dom.nextSibling;
            }
            else {
                var lastDom = dom.previousSibling;
                parentDom.removeChild(dom);
                dom = lastDom || parentDom.firstChild;
            }
        }
        else {
            dom = dom.nextSibling;
        }
    }
}
function hydrateComponent(vNode, dom, lifecycle, context, isSVG, isClass) {
    var type = vNode.type;
    var ref = vNode.ref;
    var props = vNode.props || EMPTY_OBJ;
    if (isClass) {
        var _isSVG = dom.namespaceURI === svgNS;
        var instance = createClassComponentInstance(vNode, type, props, context, _isSVG, lifecycle);
        var input = instance._lastInput;
        instance._vNode = vNode;
        hydrate(input, dom, lifecycle, instance._childContext, _isSVG);
        vNode.dom = input.dom;
        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
        instance._updating = false; // Mount finished allow going sync
        if (options.findDOMNodeEnabled) {
            componentToDOMNodeMap.set(instance, dom);
        }
    }
    else {
        var input$1 = createFunctionalComponentInput(vNode, type, props, context);
        hydrate(input$1, dom, lifecycle, context, isSVG);
        vNode.children = input$1;
        vNode.dom = input$1.dom;
        mountFunctionalComponentCallbacks(ref, dom, lifecycle);
    }
    return dom;
}
function hydrateElement(vNode, dom, lifecycle, context, isSVG) {
    var children = vNode.children;
    var props = vNode.props;
    var className = vNode.className;
    var flags = vNode.flags;
    var ref = vNode.ref;
    isSVG = isSVG || (flags & 128 /* SvgElement */) > 0;
    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type) {
        if (process.env.NODE_ENV !== "production") {
            warning("Inferno hydration: Server-side markup doesn't match client-side markup or Initial render target is not empty");
        }
        var newDom = mountElement(vNode, null, lifecycle, context, isSVG);
        vNode.dom = newDom;
        replaceChild(dom.parentNode, newDom, dom);
        return newDom;
    }
    vNode.dom = dom;
    if (!isInvalid(children)) {
        hydrateChildren(children, dom, lifecycle, context, isSVG);
    }
    else if (dom.firstChild !== null) {
        dom.textContent = ""; // dom has content, but VNode has no children remove everything from DOM
    }
    if (props) {
        var hasControlledValue = false;
        var isFormElement = (flags & 3584 /* FormElement */) > 0;
        if (isFormElement) {
            hasControlledValue = isControlledFormElement(props);
        }
        for (var prop in props) {
            // do not add a hasOwnProperty check here, it affects performance
            patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
        }
        if (isFormElement) {
            processElement(flags, vNode, dom, props, true, hasControlledValue);
        }
    }
    if (!isNullOrUndef(className)) {
        if (isSVG) {
            dom.setAttribute("class", className);
        }
        else {
            dom.className = className;
        }
    }
    else {
        if (dom.className !== "") {
            dom.removeAttribute("class");
        }
    }
    if (ref) {
        mountRef(dom, ref, lifecycle);
    }
    return dom;
}
function hydrateChildren(children, parentDom, lifecycle, context, isSVG) {
    normalizeChildNodes(parentDom);
    var dom = parentDom.firstChild;
    if (isStringOrNumber(children)) {
        if (!isNull(dom) && dom.nodeType === 3) {
            if (dom.nodeValue !== children) {
                dom.nodeValue = children;
            }
        }
        else if (children === "") {
            parentDom.appendChild(document.createTextNode(""));
        }
        else {
            parentDom.textContent = children;
        }
        if (!isNull(dom)) {
            dom = dom.nextSibling;
        }
    }
    else if (isArray(children)) {
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (!isNull(child) && isObject(child)) {
                if (!isNull(dom)) {
                    var nextSibling = dom.nextSibling;
                    hydrate(child, dom, lifecycle, context, isSVG);
                    dom = nextSibling;
                }
                else {
                    mount(child, parentDom, lifecycle, context, isSVG);
                }
            }
        }
    }
    else {
        // It's VNode
        if (!isNull(dom)) {
            hydrate(children, dom, lifecycle, context, isSVG);
            dom = dom.nextSibling;
        }
        else {
            mount(children, parentDom, lifecycle, context, isSVG);
        }
    }
    // clear any other DOM nodes, there should be only a single entry for the root
    while (dom) {
        var nextSibling$1 = dom.nextSibling;
        parentDom.removeChild(dom);
        dom = nextSibling$1;
    }
}
function hydrateText(vNode, dom) {
    if (dom.nodeType !== 3) {
        var newDom = mountText(vNode, null);
        vNode.dom = newDom;
        replaceChild(dom.parentNode, newDom, dom);
        return newDom;
    }
    var text = vNode.children;
    if (dom.nodeValue !== text) {
        dom.nodeValue = text;
    }
    vNode.dom = dom;
    return dom;
}
function hydrateVoid(vNode, dom) {
    vNode.dom = dom;
    return dom;
}
function hydrate(vNode, dom, lifecycle, context, isSVG) {
    var flags = vNode.flags;
    if (flags & 28 /* Component */) {
        hydrateComponent(vNode, dom, lifecycle, context, isSVG, (flags & 4 /* ComponentClass */) > 0);
    }
    else if (flags & 3970 /* Element */) {
        hydrateElement(vNode, dom, lifecycle, context, isSVG);
    }
    else if (flags & 1 /* Text */) {
        hydrateText(vNode, dom);
    }
    else if (flags & 4096 /* Void */) {
        hydrateVoid(vNode, dom);
    }
    else {
        if (process.env.NODE_ENV !== "production") {
            throwError(("hydrate() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
        }
        throwError();
    }
}
function hydrateRoot(input, parentDom, lifecycle) {
    if (!isNull(parentDom)) {
        var dom = parentDom.firstChild;
        if (!isNull(dom)) {
            hydrate(input, dom, lifecycle, EMPTY_OBJ, false);
            dom = parentDom.firstChild;
            // clear any other DOM nodes, there should be only a single entry for the root
            while ((dom = dom.nextSibling)) {
                parentDom.removeChild(dom);
            }
            return true;
        }
    }
    return false;
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
var componentPools = new Map();
var elementPools = new Map();
function recycleElement(vNode, lifecycle, context, isSVG) {
    var tag = vNode.type;
    var pools = elementPools.get(tag);
    if (!isUndefined(pools)) {
        var key = vNode.key;
        var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!isUndefined(pool)) {
            var recycledVNode = pool.pop();
            if (!isUndefined(recycledVNode)) {
                patchElement(recycledVNode, vNode, null, lifecycle, context, isSVG, true);
                return vNode.dom;
            }
        }
    }
    return null;
}
function poolElement(vNode) {
    var tag = vNode.type;
    var key = vNode.key;
    var pools = elementPools.get(tag);
    if (isUndefined(pools)) {
        pools = {
            keyed: new Map(),
            nonKeyed: []
        };
        elementPools.set(tag, pools);
    }
    if (isNull(key)) {
        pools.nonKeyed.push(vNode);
    }
    else {
        var pool = pools.keyed.get(key);
        if (isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}
function recycleComponent(vNode, lifecycle, context, isSVG) {
    var type = vNode.type;
    var pools = componentPools.get(type);
    if (!isUndefined(pools)) {
        var key = vNode.key;
        var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!isUndefined(pool)) {
            var recycledVNode = pool.pop();
            if (!isUndefined(recycledVNode)) {
                var flags = vNode.flags;
                var failed = patchComponent(recycledVNode, vNode, null, lifecycle, context, isSVG, (flags & 4 /* ComponentClass */) > 0, true);
                if (!failed) {
                    return vNode.dom;
                }
            }
        }
    }
    return null;
}
function poolComponent(vNode) {
    var hooks = vNode.ref;
    var nonRecycleHooks = hooks &&
        (hooks.onComponentWillMount ||
            hooks.onComponentWillUnmount ||
            hooks.onComponentDidMount ||
            hooks.onComponentWillUpdate ||
            hooks.onComponentDidUpdate);
    if (nonRecycleHooks) {
        return;
    }
    var type = vNode.type;
    var key = vNode.key;
    var pools = componentPools.get(type);
    if (isUndefined(pools)) {
        pools = {
            keyed: new Map(),
            nonKeyed: []
        };
        componentPools.set(type, pools);
    }
    if (isNull(key)) {
        pools.nonKeyed.push(vNode);
    }
    else {
        var pool = pools.keyed.get(key);
        if (isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function unmount(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    var flags = vNode.flags;
    if (flags & 28 /* Component */) {
        unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling);
    }
    else if (flags & 3970 /* Element */) {
        unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling);
    }
    else if (flags & (1 /* Text */ | 4096 /* Void */)) {
        unmountVoidOrText(vNode, parentDom);
    }
}
function unmountVoidOrText(vNode, parentDom) {
    if (!isNull(parentDom)) {
        removeChild(parentDom, vNode.dom);
    }
}
function unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    var instance = vNode.children;
    var flags = vNode.flags;
    var isStatefulComponent$$1 = flags & 4;
    var ref = vNode.ref;
    var dom = vNode.dom;
    if (!isRecycling) {
        if (isStatefulComponent$$1) {
            if (!instance._unmounted) {
                if (!isNull(options.beforeUnmount)) {
                    options.beforeUnmount(vNode);
                }
                if (!isUndefined(instance.componentWillUnmount)) {
                    instance.componentWillUnmount();
                }
                if (ref && !isRecycling) {
                    ref(null);
                }
                instance._unmounted = true;
                if (options.findDOMNodeEnabled) {
                    componentToDOMNodeMap.delete(instance);
                }
                unmount(instance._lastInput, null, instance._lifecycle, false, isRecycling);
            }
        }
        else {
            if (!isNullOrUndef(ref)) {
                if (!isNullOrUndef(ref.onComponentWillUnmount)) {
                    ref.onComponentWillUnmount(dom);
                }
            }
            unmount(instance, null, lifecycle, false, isRecycling);
        }
    }
    if (parentDom) {
        var lastInput = instance._lastInput;
        if (isNullOrUndef(lastInput)) {
            lastInput = instance;
        }
        removeChild(parentDom, dom);
    }
    if (options.recyclingEnabled &&
        !isStatefulComponent$$1 &&
        (parentDom || canRecycle)) {
        poolComponent(vNode);
    }
}
function unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    var dom = vNode.dom;
    var ref = vNode.ref;
    var props = vNode.props;
    if (ref && !isRecycling) {
        unmountRef(ref);
    }
    var children = vNode.children;
    if (!isNullOrUndef(children)) {
        unmountChildren$1(children, lifecycle, isRecycling);
    }
    if (!isNull(props)) {
        for (var name in props) {
            // do not add a hasOwnProperty check here, it affects performance
            if (props[name] !== null && isAttrAnEvent(name)) {
                patchEvent(name, props[name], null, dom);
                // We need to set this null, because same props otherwise come back if SCU returns false and we are recyling
                props[name] = null;
            }
        }
    }
    if (!isNull(parentDom)) {
        removeChild(parentDom, dom);
    }
    if (options.recyclingEnabled && (parentDom || canRecycle)) {
        poolElement(vNode);
    }
}
function unmountChildren$1(children, lifecycle, isRecycling) {
    if (isArray(children)) {
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (!isInvalid(child) && isObject(child)) {
                unmount(child, null, lifecycle, false, isRecycling);
            }
        }
    }
    else if (isObject(children)) {
        unmount(children, null, lifecycle, false, isRecycling);
    }
}
function unmountRef(ref) {
    if (isFunction(ref)) {
        ref(null);
    }
    else {
        if (isInvalid(ref)) {
            return;
        }
        if (process.env.NODE_ENV !== "production") {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
        }
        throwError();
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
// rather than use a Map, like we did before, we can use an array here
// given there shouldn't be THAT many roots on the page, the difference
// in performance is huge: https://esbench.com/bench/5802a691330ab09900a1a2da
var componentToDOMNodeMap = new Map();
var roots = options.roots;
/**
 * When inferno.options.findDOMNOdeEnabled is true, this function will return DOM Node by component instance
 * @param ref Component instance
 * @returns {*|null} returns dom node
 */
function findDOMNode(ref) {
    if (!options.findDOMNodeEnabled) {
        if (process.env.NODE_ENV !== "production") {
            throwError("findDOMNode() has been disabled, use Inferno.options.findDOMNodeEnabled = true; enabled findDOMNode(). Warning this can significantly impact performance!");
        }
        throwError();
    }
    var dom = ref && ref.nodeType ? ref : null;
    return componentToDOMNodeMap.get(ref) || dom;
}
function getRoot(dom) {
    for (var i = 0, len = roots.length; i < len; i++) {
        var root = roots[i];
        if (root.dom === dom) {
            return root;
        }
    }
    return null;
}
function setRoot(dom, input, lifecycle) {
    var root = {
        dom: dom,
        input: input,
        lifecycle: lifecycle
    };
    roots.push(root);
    return root;
}
function removeRoot(root) {
    for (var i = 0, len = roots.length; i < len; i++) {
        if (roots[i] === root) {
            roots.splice(i, 1);
            return;
        }
    }
}
if (process.env.NODE_ENV !== "production") {
    if (isBrowser && document.body === null) {
        warning('Inferno warning: you cannot initialize inferno without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.');
    }
}
var documentBody = isBrowser ? document.body : null;
/**
 * Renders virtual node tree into parent node.
 * @param {VNode | null | string | number} input vNode to be rendered
 * @param parentDom DOM node which content will be replaced by virtual node
 * @returns {InfernoChildren} rendered virtual node
 */
function render(input, parentDom) {
    if (documentBody === parentDom) {
        if (process.env.NODE_ENV !== "production") {
            throwError('you cannot render() to the "document.body". Use an empty element as a container instead.');
        }
        throwError();
    }
    if (input === NO_OP) {
        return;
    }
    var root = getRoot(parentDom);
    if (isNull(root)) {
        var lifecycle = new Lifecycle();
        if (!isInvalid(input)) {
            if (input.dom) {
                input = directClone(input);
            }
            if (!hydrateRoot(input, parentDom, lifecycle)) {
                mount(input, parentDom, lifecycle, EMPTY_OBJ, false);
            }
            root = setRoot(parentDom, input, lifecycle);
            lifecycle.trigger();
        }
    }
    else {
        var lifecycle$1 = root.lifecycle;
        lifecycle$1.listeners = [];
        if (isNullOrUndef(input)) {
            unmount(root.input, parentDom, lifecycle$1, false, false);
            removeRoot(root);
        }
        else {
            if (input.dom) {
                input = directClone(input);
            }
            patch(root.input, input, parentDom, lifecycle$1, EMPTY_OBJ, false, false);
        }
        root.input = input;
        lifecycle$1.trigger();
    }
    if (root) {
        var rootInput = root.input;
        if (rootInput && rootInput.flags & 28 /* Component */) {
            return rootInput.children;
        }
    }
}
function createRenderer(parentDom) {
    return function renderer(lastInput, nextInput) {
        if (!parentDom) {
            parentDom = lastInput;
        }
        render(nextInput, parentDom);
    };
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function patch(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    if (lastVNode !== nextVNode) {
        var lastFlags = lastVNode.flags;
        var nextFlags = nextVNode.flags;
        if (nextFlags & 28 /* Component */) {
            var isClass = (nextFlags & 4 /* ComponentClass */) > 0;
            if (lastFlags & 28 /* Component */) {
                patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling);
            }
            else {
                replaceVNode(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, isClass), lastVNode, lifecycle, isRecycling);
            }
        }
        else if (nextFlags & 3970 /* Element */) {
            if (lastFlags & 3970 /* Element */) {
                patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
            }
            else {
                replaceVNode(parentDom, mountElement(nextVNode, null, lifecycle, context, isSVG), lastVNode, lifecycle, isRecycling);
            }
        }
        else if (nextFlags & 1 /* Text */) {
            if (lastFlags & 1 /* Text */) {
                patchText(lastVNode, nextVNode);
            }
            else {
                replaceVNode(parentDom, mountText(nextVNode, null), lastVNode, lifecycle, isRecycling);
            }
        }
        else if (nextFlags & 4096 /* Void */) {
            if (lastFlags & 4096 /* Void */) {
                patchVoid(lastVNode, nextVNode);
            }
            else {
                replaceVNode(parentDom, mountVoid(nextVNode, null), lastVNode, lifecycle, isRecycling);
            }
        }
        else {
            // Error case: mount new one replacing old one
            replaceLastChildAndUnmount(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        }
    }
}
function unmountChildren(children, dom, lifecycle, isRecycling) {
    if (isVNode(children)) {
        unmount(children, dom, lifecycle, true, isRecycling);
    }
    else if (isArray(children)) {
        removeAllChildren(dom, children, lifecycle, isRecycling);
    }
    else {
        dom.textContent = "";
    }
}
function patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    var nextTag = nextVNode.type;
    var lastTag = lastVNode.type;
    if (lastTag !== nextTag) {
        replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
    }
    else {
        var dom = lastVNode.dom;
        var lastProps = lastVNode.props;
        var nextProps = nextVNode.props;
        var lastChildren = lastVNode.children;
        var nextChildren = nextVNode.children;
        var lastFlags = lastVNode.flags;
        var nextFlags = nextVNode.flags;
        var nextRef = nextVNode.ref;
        var lastClassName = lastVNode.className;
        var nextClassName = nextVNode.className;
        nextVNode.dom = dom;
        isSVG = isSVG || (nextFlags & 128 /* SvgElement */) > 0;
        if (lastChildren !== nextChildren) {
            var childrenIsSVG = isSVG === true && nextVNode.type !== "foreignObject";
            patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, childrenIsSVG, isRecycling);
        }
        // inlined patchProps  -- starts --
        if (lastProps !== nextProps) {
            var lastPropsOrEmpty = lastProps || EMPTY_OBJ;
            var nextPropsOrEmpty = nextProps || EMPTY_OBJ;
            var hasControlledValue = false;
            if (nextPropsOrEmpty !== EMPTY_OBJ) {
                var isFormElement = (nextFlags & 3584 /* FormElement */) > 0;
                if (isFormElement) {
                    hasControlledValue = isControlledFormElement(nextPropsOrEmpty);
                }
                for (var prop in nextPropsOrEmpty) {
                    // do not add a hasOwnProperty check here, it affects performance
                    var nextValue = nextPropsOrEmpty[prop];
                    var lastValue = lastPropsOrEmpty[prop];
                    patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue);
                }
                if (isFormElement) {
                    // When inferno is recycling form element, we need to process it like it would be mounting
                    processElement(nextFlags, nextVNode, dom, nextPropsOrEmpty, isRecycling, hasControlledValue);
                }
            }
            if (lastPropsOrEmpty !== EMPTY_OBJ) {
                for (var prop$1 in lastPropsOrEmpty) {
                    // do not add a hasOwnProperty check here, it affects performance
                    if (isNullOrUndef(nextPropsOrEmpty[prop$1]) &&
                        !isNullOrUndef(lastPropsOrEmpty[prop$1])) {
                        removeProp(prop$1, lastPropsOrEmpty[prop$1], dom, nextFlags);
                    }
                }
            }
        }
        // inlined patchProps  -- ends --
        if (lastClassName !== nextClassName) {
            if (isNullOrUndef(nextClassName)) {
                dom.removeAttribute("class");
            }
            else {
                if (isSVG) {
                    dom.setAttribute("class", nextClassName);
                }
                else {
                    dom.className = nextClassName;
                }
            }
        }
        if (nextRef) {
            if (lastVNode.ref !== nextRef || isRecycling) {
                mountRef(dom, nextRef, lifecycle);
            }
        }
    }
}
function patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    var patchArray = false;
    var patchKeyed = false;
    if (nextFlags & 64 /* HasNonKeyedChildren */) {
        patchArray = true;
    }
    else if ((lastFlags & 32 /* HasKeyedChildren */) > 0 &&
        (nextFlags & 32 /* HasKeyedChildren */) > 0) {
        patchKeyed = true;
        patchArray = true;
    }
    else if (isInvalid(nextChildren)) {
        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
    }
    else if (isInvalid(lastChildren)) {
        if (isStringOrNumber(nextChildren)) {
            setTextContent(dom, nextChildren);
        }
        else {
            if (isArray(nextChildren)) {
                mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
            }
            else {
                mount(nextChildren, dom, lifecycle, context, isSVG);
            }
        }
    }
    else if (isStringOrNumber(nextChildren)) {
        if (isStringOrNumber(lastChildren)) {
            updateTextContent(dom, nextChildren);
        }
        else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            setTextContent(dom, nextChildren);
        }
    }
    else if (isArray(nextChildren)) {
        if (isArray(lastChildren)) {
            patchArray = true;
            if (isKeyed(lastChildren, nextChildren)) {
                patchKeyed = true;
            }
        }
        else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
        }
    }
    else if (isArray(lastChildren)) {
        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
        mount(nextChildren, dom, lifecycle, context, isSVG);
    }
    else if (isVNode(nextChildren)) {
        if (isVNode(lastChildren)) {
            patch(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
        else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mount(nextChildren, dom, lifecycle, context, isSVG);
        }
    }
    if (patchArray) {
        if (patchKeyed) {
            patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
        else {
            patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
    }
}
function patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling) {
    var lastType = lastVNode.type;
    var nextType = nextVNode.type;
    var lastKey = lastVNode.key;
    var nextKey = nextVNode.key;
    if (lastType !== nextType || lastKey !== nextKey) {
        replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        return false;
    }
    else {
        var nextProps = nextVNode.props || EMPTY_OBJ;
        if (isClass) {
            var instance = lastVNode.children;
            instance._updating = true;
            if (instance._unmounted) {
                if (isNull(parentDom)) {
                    return true;
                }
                replaceChild(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, (nextVNode.flags & 4 /* ComponentClass */) > 0), lastVNode.dom);
            }
            else {
                var hasComponentDidUpdate = !isUndefined(instance.componentDidUpdate);
                var nextState = instance.state;
                // When component has componentDidUpdate hook, we need to clone lastState or will be modified by reference during update
                var lastState = hasComponentDidUpdate
                    ? combineFrom(nextState, null)
                    : nextState;
                var lastProps = instance.props;
                var childContext;
                if (!isNullOrUndef(instance.getChildContext)) {
                    childContext = instance.getChildContext();
                }
                nextVNode.children = instance;
                instance._isSVG = isSVG;
                if (isNullOrUndef(childContext)) {
                    childContext = context;
                }
                else {
                    childContext = combineFrom(context, childContext);
                }
                var lastInput = instance._lastInput;
                var nextInput = instance._updateComponent(lastState, nextState, lastProps, nextProps, context, false, false);
                var didUpdate = true;
                instance._childContext = childContext;
                if (isInvalid(nextInput)) {
                    nextInput = createVoidVNode();
                }
                else if (nextInput === NO_OP) {
                    nextInput = lastInput;
                    didUpdate = false;
                }
                else if (isStringOrNumber(nextInput)) {
                    nextInput = createTextVNode(nextInput, null);
                }
                else if (isArray(nextInput)) {
                    if (process.env.NODE_ENV !== "production") {
                        throwError("a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.");
                    }
                    throwError();
                }
                else if (isObject(nextInput)) {
                    if (!isNull(nextInput.dom)) {
                        nextInput = directClone(nextInput);
                    }
                }
                if (nextInput.flags & 28 /* Component */) {
                    nextInput.parentVNode = nextVNode;
                }
                else if (lastInput.flags & 28 /* Component */) {
                    lastInput.parentVNode = nextVNode;
                }
                instance._lastInput = nextInput;
                instance._vNode = nextVNode;
                if (didUpdate) {
                    patch(lastInput, nextInput, parentDom, lifecycle, childContext, isSVG, isRecycling);
                    if (hasComponentDidUpdate && instance.componentDidUpdate) {
                        instance.componentDidUpdate(lastProps, lastState);
                    }
                    if (!isNull(options.afterUpdate)) {
                        options.afterUpdate(nextVNode);
                    }
                    if (options.findDOMNodeEnabled) {
                        componentToDOMNodeMap.set(instance, nextInput.dom);
                    }
                }
                nextVNode.dom = nextInput.dom;
            }
            instance._updating = false;
        }
        else {
            var shouldUpdate = true;
            var lastProps$1 = lastVNode.props;
            var nextHooks = nextVNode.ref;
            var nextHooksDefined = !isNullOrUndef(nextHooks);
            var lastInput$1 = lastVNode.children;
            var nextInput$1 = lastInput$1;
            nextVNode.dom = lastVNode.dom;
            nextVNode.children = lastInput$1;
            if (lastKey !== nextKey) {
                shouldUpdate = true;
            }
            else {
                if (nextHooksDefined &&
                    !isNullOrUndef(nextHooks.onComponentShouldUpdate)) {
                    shouldUpdate = nextHooks.onComponentShouldUpdate(lastProps$1, nextProps);
                }
            }
            if (shouldUpdate !== false) {
                if (nextHooksDefined &&
                    !isNullOrUndef(nextHooks.onComponentWillUpdate)) {
                    nextHooks.onComponentWillUpdate(lastProps$1, nextProps);
                }
                nextInput$1 = nextType(nextProps, context);
                if (isInvalid(nextInput$1)) {
                    nextInput$1 = createVoidVNode();
                }
                else if (isStringOrNumber(nextInput$1) && nextInput$1 !== NO_OP) {
                    nextInput$1 = createTextVNode(nextInput$1, null);
                }
                else if (isArray(nextInput$1)) {
                    if (process.env.NODE_ENV !== "production") {
                        throwError("a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.");
                    }
                    throwError();
                }
                else if (isObject(nextInput$1)) {
                    if (!isNull(nextInput$1.dom)) {
                        nextInput$1 = directClone(nextInput$1);
                    }
                }
                if (nextInput$1 !== NO_OP) {
                    patch(lastInput$1, nextInput$1, parentDom, lifecycle, context, isSVG, isRecycling);
                    nextVNode.children = nextInput$1;
                    if (nextHooksDefined &&
                        !isNullOrUndef(nextHooks.onComponentDidUpdate)) {
                        nextHooks.onComponentDidUpdate(lastProps$1, nextProps);
                    }
                    nextVNode.dom = nextInput$1.dom;
                }
            }
            if (nextInput$1.flags & 28 /* Component */) {
                nextInput$1.parentVNode = nextVNode;
            }
            else if (lastInput$1.flags & 28 /* Component */) {
                lastInput$1.parentVNode = nextVNode;
            }
        }
    }
    return false;
}
function patchText(lastVNode, nextVNode) {
    var nextText = nextVNode.children;
    var dom = lastVNode.dom;
    nextVNode.dom = dom;
    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}
function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
}
function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    var lastChildrenLength = lastChildren.length;
    var nextChildrenLength = nextChildren.length;
    var commonLength = lastChildrenLength > nextChildrenLength
        ? nextChildrenLength
        : lastChildrenLength;
    var i = 0;
    for (; i < commonLength; i++) {
        var nextChild = nextChildren[i];
        if (nextChild.dom) {
            nextChild = nextChildren[i] = directClone(nextChild);
        }
        patch(lastChildren[i], nextChild, dom, lifecycle, context, isSVG, isRecycling);
    }
    if (lastChildrenLength < nextChildrenLength) {
        for (i = commonLength; i < nextChildrenLength; i++) {
            var nextChild$1 = nextChildren[i];
            if (nextChild$1.dom) {
                nextChild$1 = nextChildren[i] = directClone(nextChild$1);
            }
            appendChild(dom, mount(nextChild$1, null, lifecycle, context, isSVG));
        }
    }
    else if (nextChildrenLength === 0) {
        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
    }
    else if (lastChildrenLength > nextChildrenLength) {
        for (i = commonLength; i < lastChildrenLength; i++) {
            unmount(lastChildren[i], dom, lifecycle, false, isRecycling);
        }
    }
}
function patchKeyedChildren(a, b, dom, lifecycle, context, isSVG, isRecycling) {
    var aLength = a.length;
    var bLength = b.length;
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var aStart = 0;
    var bStart = 0;
    var i;
    var j;
    var aNode;
    var bNode;
    var nextNode;
    var nextPos;
    var node;
    if (aLength === 0) {
        if (bLength > 0) {
            mountArrayChildren(b, dom, lifecycle, context, isSVG);
        }
        return;
    }
    else if (bLength === 0) {
        removeAllChildren(dom, a, lifecycle, isRecycling);
        return;
    }
    var aStartNode = a[aStart];
    var bStartNode = b[bStart];
    var aEndNode = a[aEnd];
    var bEndNode = b[bEnd];
    if (bStartNode.dom) {
        b[bStart] = bStartNode = directClone(bStartNode);
    }
    if (bEndNode.dom) {
        b[bEnd] = bEndNode = directClone(bEndNode);
    }
    // Step 1
    /* eslint no-constant-condition: 0 */
    outer: while (true) {
        // Sync nodes with the same key at the beginning.
        while (aStartNode.key === bStartNode.key) {
            patch(aStartNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
            aStart++;
            bStart++;
            if (aStart > aEnd || bStart > bEnd) {
                break outer;
            }
            aStartNode = a[aStart];
            bStartNode = b[bStart];
            if (bStartNode.dom) {
                b[bStart] = bStartNode = directClone(bStartNode);
            }
        }
        // Sync nodes with the same key at the end.
        while (aEndNode.key === bEndNode.key) {
            patch(aEndNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
            aEnd--;
            bEnd--;
            if (aStart > aEnd || bStart > bEnd) {
                break outer;
            }
            aEndNode = a[aEnd];
            bEndNode = b[bEnd];
            if (bEndNode.dom) {
                b[bEnd] = bEndNode = directClone(bEndNode);
            }
        }
        // Move and sync nodes from right to left.
        if (aEndNode.key === bStartNode.key) {
            patch(aEndNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
            insertOrAppend(dom, bStartNode.dom, aStartNode.dom);
            aEnd--;
            bStart++;
            aEndNode = a[aEnd];
            bStartNode = b[bStart];
            if (bStartNode.dom) {
                b[bStart] = bStartNode = directClone(bStartNode);
            }
            continue;
        }
        // Move and sync nodes from left to right.
        if (aStartNode.key === bEndNode.key) {
            patch(aStartNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
            nextPos = bEnd + 1;
            nextNode = nextPos < b.length ? b[nextPos].dom : null;
            insertOrAppend(dom, bEndNode.dom, nextNode);
            aStart++;
            bEnd--;
            aStartNode = a[aStart];
            bEndNode = b[bEnd];
            if (bEndNode.dom) {
                b[bEnd] = bEndNode = directClone(bEndNode);
            }
            continue;
        }
        break;
    }
    if (aStart > aEnd) {
        if (bStart <= bEnd) {
            nextPos = bEnd + 1;
            nextNode = nextPos < b.length ? b[nextPos].dom : null;
            while (bStart <= bEnd) {
                node = b[bStart];
                if (node.dom) {
                    b[bStart] = node = directClone(node);
                }
                bStart++;
                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);
            }
        }
    }
    else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            unmount(a[aStart++], dom, lifecycle, false, isRecycling);
        }
    }
    else {
        aLength = aEnd - aStart + 1;
        bLength = bEnd - bStart + 1;
        var sources = new Array(bLength);
        // Mark all nodes as inserted.
        for (i = 0; i < bLength; i++) {
            sources[i] = -1;
        }
        var moved = false;
        var pos = 0;
        var patched = 0;
        // When sizes are small, just loop them through
        if (bLength <= 4 || aLength * bLength <= 16) {
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    for (j = bStart; j <= bEnd; j++) {
                        bNode = b[j];
                        if (aNode.key === bNode.key) {
                            sources[j - bStart] = i;
                            if (pos > j) {
                                moved = true;
                            }
                            else {
                                pos = j;
                            }
                            if (bNode.dom) {
                                b[j] = bNode = directClone(bNode);
                            }
                            patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                            patched++;
                            a[i] = null;
                            break;
                        }
                    }
                }
            }
        }
        else {
            var keyIndex = new Map();
            // Map keys by their index in array
            for (i = bStart; i <= bEnd; i++) {
                keyIndex.set(b[i].key, i);
            }
            // Try to patch same keys
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    j = keyIndex.get(aNode.key);
                    if (!isUndefined(j)) {
                        bNode = b[j];
                        sources[j - bStart] = i;
                        if (pos > j) {
                            moved = true;
                        }
                        else {
                            pos = j;
                        }
                        if (bNode.dom) {
                            b[j] = bNode = directClone(bNode);
                        }
                        patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                        patched++;
                        a[i] = null;
                    }
                }
            }
        }
        // fast-path: if nothing patched remove all old and add all new
        if (aLength === a.length && patched === 0) {
            removeAllChildren(dom, a, lifecycle, isRecycling);
            while (bStart < bLength) {
                node = b[bStart];
                if (node.dom) {
                    b[bStart] = node = directClone(node);
                }
                bStart++;
                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), null);
            }
        }
        else {
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (!isNull(aNode)) {
                    unmount(aNode, dom, lifecycle, true, isRecycling);
                    i--;
                }
            }
            if (moved) {
                var seq = lis_algorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        node = b[pos];
                        if (node.dom) {
                            b[pos] = node = directClone(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        insertOrAppend(dom, mount(node, dom, lifecycle, context, isSVG), nextNode);
                    }
                    else {
                        if (j < 0 || i !== seq[j]) {
                            pos = i + bStart;
                            node = b[pos];
                            nextPos = pos + 1;
                            nextNode = nextPos < b.length ? b[nextPos].dom : null;
                            insertOrAppend(dom, node.dom, nextNode);
                        }
                        else {
                            j--;
                        }
                    }
                }
            }
            else if (patched !== bLength) {
                // when patched count doesn't match b length we need to insert those new ones
                // loop backwards so we can use insertBefore
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        node = b[pos];
                        if (node.dom) {
                            b[pos] = node = directClone(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);
                    }
                }
            }
        }
    }
}
// // https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(arr) {
    var p = arr.slice(0);
    var result = [0];
    var i;
    var j;
    var u;
    var v;
    var c;
    var len = arr.length;
    for (i = 0; i < len; i++) {
        var arrI = arr[i];
        if (arrI === -1) {
            continue;
        }
        j = result[result.length - 1];
        if (arr[j] < arrI) {
            p[i] = j;
            result.push(i);
            continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
            c = ((u + v) / 2) | 0;
            if (arr[result[c]] < arrI) {
                u = c + 1;
            }
            else {
                v = c;
            }
        }
        if (arrI < arr[result[u]]) {
            if (u > 0) {
                p[i] = result[u - 1];
            }
            result[u] = i;
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
function isAttrAnEvent(attr) {
    return attr[0] === "o" && attr[1] === "n";
}
function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue) {
    if (lastValue !== nextValue) {
        if (skipProps.has(prop) || (hasControlledValue && prop === "value")) {
            return;
        }
        else if (booleanProps.has(prop)) {
            prop = prop === "autoFocus" ? prop.toLowerCase() : prop;
            dom[prop] = !!nextValue;
        }
        else if (strictProps.has(prop)) {
            var value = isNullOrUndef(nextValue) ? "" : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
        }
        else if (isAttrAnEvent(prop)) {
            patchEvent(prop, lastValue, nextValue, dom);
        }
        else if (isNullOrUndef(nextValue)) {
            dom.removeAttribute(prop);
        }
        else if (prop === "style") {
            patchStyle(lastValue, nextValue, dom);
        }
        else if (prop === "dangerouslySetInnerHTML") {
            var lastHtml = lastValue && lastValue.__html;
            var nextHtml = nextValue && nextValue.__html;
            if (lastHtml !== nextHtml) {
                if (!isNullOrUndef(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        }
        else {
            // We optimize for NS being boolean. Its 99.9% time false
            if (isSVG && namespaces.has(prop)) {
                // If we end up in this path we can read property again
                dom.setAttributeNS(namespaces.get(prop), prop, nextValue);
            }
            else {
                dom.setAttribute(prop, nextValue);
            }
        }
    }
}
function patchEvent(name, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        if (delegatedEvents.has(name)) {
            handleEvent(name, lastValue, nextValue, dom);
        }
        else {
            var nameLowerCase = name.toLowerCase();
            var domEvent = dom[nameLowerCase];
            // if the function is wrapped, that means it's been controlled by a wrapper
            if (domEvent && domEvent.wrapped) {
                return;
            }
            if (!isFunction(nextValue) && !isNullOrUndef(nextValue)) {
                var linkEvent = nextValue.event;
                if (linkEvent && isFunction(linkEvent)) {
                    dom[nameLowerCase] = function (e) {
                        linkEvent(nextValue.data, e);
                    };
                }
                else {
                    if (process.env.NODE_ENV !== "production") {
                        throwError(("an event on a VNode \"" + name + "\". was not a function or a valid linkEvent."));
                    }
                    throwError();
                }
            }
            else {
                dom[nameLowerCase] = nextValue;
            }
        }
    }
}
// We are assuming here that we come from patchProp routine
// -nextAttrValue cannot be null or undefined
function patchStyle(lastAttrValue, nextAttrValue, dom) {
    var domStyle = dom.style;
    var style;
    var value;
    if (isString(nextAttrValue)) {
        domStyle.cssText = nextAttrValue;
        return;
    }
    if (!isNullOrUndef(lastAttrValue) && !isString(lastAttrValue)) {
        for (style in nextAttrValue) {
            // do not add a hasOwnProperty check here, it affects performance
            value = nextAttrValue[style];
            if (value !== lastAttrValue[style]) {
                domStyle[style] = !isNumber(value) || isUnitlessNumber.has(style)
                    ? value
                    : value + "px";
            }
        }
        for (style in lastAttrValue) {
            if (isNullOrUndef(nextAttrValue[style])) {
                domStyle[style] = "";
            }
        }
    }
    else {
        for (style in nextAttrValue) {
            value = nextAttrValue[style];
            domStyle[style] = !isNumber(value) || isUnitlessNumber.has(style)
                ? value
                : value + "px";
        }
    }
}
function removeProp(prop, lastValue, dom, nextFlags) {
    if (prop === "value") {
        // When removing value of select element, it needs to be set to null instead empty string, because empty string is valid value for option which makes that option selected
        // MS IE/Edge don't follow html spec for textArea and input elements and we need to set empty string to value in those cases to avoid "null" and "undefined" texts
        dom.value = nextFlags & 2048 /* SelectElement */ ? null : "";
    }
    else if (prop === "style") {
        dom.removeAttribute("style");
    }
    else if (isAttrAnEvent(prop)) {
        handleEvent(prop, lastValue, null, dom);
    }
    else {
        dom.removeAttribute(prop);
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function mount(vNode, parentDom, lifecycle, context, isSVG) {
    var flags = vNode.flags;
    if (flags & 3970 /* Element */) {
        return mountElement(vNode, parentDom, lifecycle, context, isSVG);
    }
    else if (flags & 28 /* Component */) {
        return mountComponent(vNode, parentDom, lifecycle, context, isSVG, (flags & 4 /* ComponentClass */) > 0);
    }
    else if (flags & 4096 /* Void */) {
        return mountVoid(vNode, parentDom);
    }
    else if (flags & 1 /* Text */) {
        return mountText(vNode, parentDom);
    }
    else {
        if (process.env.NODE_ENV !== "production") {
            if (typeof vNode === "object") {
                throwError(("mount() received an object that's not a valid VNode, you should stringify it first. Object: \"" + (JSON.stringify(vNode)) + "\"."));
            }
            else {
                throwError(("mount() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
            }
        }
        throwError();
    }
}
function mountText(vNode, parentDom) {
    var dom = document.createTextNode(vNode.children);
    vNode.dom = dom;
    if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
    }
    return dom;
}
function mountVoid(vNode, parentDom) {
    var dom = document.createTextNode("");
    vNode.dom = dom;
    if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
    }
    return dom;
}
function mountElement(vNode, parentDom, lifecycle, context, isSVG) {
    if (options.recyclingEnabled) {
        var dom$1 = recycleElement(vNode, lifecycle, context, isSVG);
        if (!isNull(dom$1)) {
            if (!isNull(parentDom)) {
                appendChild(parentDom, dom$1);
            }
            return dom$1;
        }
    }
    var flags = vNode.flags;
    isSVG = isSVG || (flags & 128 /* SvgElement */) > 0;
    var dom = documentCreateElement(vNode.type, isSVG);
    var children = vNode.children;
    var props = vNode.props;
    var className = vNode.className;
    var ref = vNode.ref;
    vNode.dom = dom;
    if (!isInvalid(children)) {
        if (isStringOrNumber(children)) {
            setTextContent(dom, children);
        }
        else {
            var childrenIsSVG = isSVG === true && vNode.type !== "foreignObject";
            if (isArray(children)) {
                mountArrayChildren(children, dom, lifecycle, context, childrenIsSVG);
            }
            else if (isVNode(children)) {
                mount(children, dom, lifecycle, context, childrenIsSVG);
            }
        }
    }
    if (!isNull(props)) {
        var hasControlledValue = false;
        var isFormElement = (flags & 3584 /* FormElement */) > 0;
        if (isFormElement) {
            hasControlledValue = isControlledFormElement(props);
        }
        for (var prop in props) {
            // do not add a hasOwnProperty check here, it affects performance
            patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
        }
        if (isFormElement) {
            processElement(flags, vNode, dom, props, true, hasControlledValue);
        }
    }
    if (className !== null) {
        if (isSVG) {
            dom.setAttribute("class", className);
        }
        else {
            dom.className = className;
        }
    }
    if (!isNull(ref)) {
        mountRef(dom, ref, lifecycle);
    }
    if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
    }
    return dom;
}
function mountArrayChildren(children, dom, lifecycle, context, isSVG) {
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        // Verify can string/number be here. might cause de-opt. - Normalization takes care of it.
        if (!isInvalid(child)) {
            if (child.dom) {
                children[i] = child = directClone(child);
            }
            mount(children[i], dom, lifecycle, context, isSVG);
        }
    }
}
function mountComponent(vNode, parentDom, lifecycle, context, isSVG, isClass) {
    if (options.recyclingEnabled) {
        var dom$1 = recycleComponent(vNode, lifecycle, context, isSVG);
        if (!isNull(dom$1)) {
            if (!isNull(parentDom)) {
                appendChild(parentDom, dom$1);
            }
            return dom$1;
        }
    }
    var type = vNode.type;
    var props = vNode.props || EMPTY_OBJ;
    var ref = vNode.ref;
    var dom;
    if (isClass) {
        var instance = createClassComponentInstance(vNode, type, props, context, isSVG, lifecycle);
        var input = instance._lastInput;
        instance._vNode = vNode;
        vNode.dom = dom = mount(input, null, lifecycle, instance._childContext, isSVG);
        if (!isNull(parentDom)) {
            appendChild(parentDom, dom);
        }
        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
        instance._updating = false;
        if (options.findDOMNodeEnabled) {
            componentToDOMNodeMap.set(instance, dom);
        }
    }
    else {
        var input$1 = createFunctionalComponentInput(vNode, type, props, context);
        vNode.dom = dom = mount(input$1, null, lifecycle, context, isSVG);
        vNode.children = input$1;
        mountFunctionalComponentCallbacks(ref, dom, lifecycle);
        if (!isNull(parentDom)) {
            appendChild(parentDom, dom);
        }
    }
    return dom;
}
function mountClassComponentCallbacks(vNode, ref, instance, lifecycle) {
    if (ref) {
        if (isFunction(ref)) {
            ref(instance);
        }
        else {
            if (process.env.NODE_ENV !== "production") {
                if (isStringOrNumber(ref)) {
                    throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
                }
                else if (isObject(ref) && vNode.flags & 4 /* ComponentClass */) {
                    throwError("functional component lifecycle events are not supported on ES2015 class components.");
                }
                else {
                    throwError(("a bad value for \"ref\" was used on component: \"" + (JSON.stringify(ref)) + "\""));
                }
            }
            throwError();
        }
    }
    var hasDidMount = !isUndefined(instance.componentDidMount);
    var afterMount = options.afterMount;
    if (hasDidMount || !isNull(afterMount)) {
        lifecycle.addListener((function () {
            instance._updating = true;
            if (afterMount) {
                afterMount(vNode);
            }
            if (hasDidMount) {
                instance.componentDidMount();
            }
            instance._updating = false;
        }));
    }
}
function mountFunctionalComponentCallbacks(ref, dom, lifecycle) {
    if (ref) {
        if (!isNullOrUndef(ref.onComponentWillMount)) {
            ref.onComponentWillMount();
        }
        if (!isNullOrUndef(ref.onComponentDidMount)) {
            lifecycle.addListener((function () { return ref.onComponentDidMount(dom); }));
        }
    }
}
function mountRef(dom, value, lifecycle) {
    if (isFunction(value)) {
        lifecycle.addListener((function () { return value(dom); }));
    }
    else {
        if (isInvalid(value)) {
            return;
        }
        if (process.env.NODE_ENV !== "production") {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
        }
        throwError();
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
// We need EMPTY_OBJ defined in one place.
// Its used for comparison so we cant inline it into shared
var EMPTY_OBJ = {};
if (process.env.NODE_ENV !== "production") {
    Object.freeze(EMPTY_OBJ);
}
function createClassComponentInstance(vNode, Component, props, context, isSVG, lifecycle) {
    if (isUndefined(context)) {
        context = EMPTY_OBJ; // Context should not be mutable
    }
    var instance = new Component(props, context);
    vNode.children = instance;
    instance._blockSetState = false;
    instance.context = context;
    if (instance.props === EMPTY_OBJ) {
        instance.props = props;
    }
    // setState callbacks must fire after render is done when called from componentWillReceiveProps or componentWillMount
    instance._lifecycle = lifecycle;
    instance._unmounted = false;
    instance._pendingSetState = true;
    instance._isSVG = isSVG;
    if (!isNullOrUndef(instance.componentWillMount)) {
        instance._blockRender = true;
        instance.componentWillMount();
        instance._blockRender = false;
    }
    var childContext;
    if (!isNullOrUndef(instance.getChildContext)) {
        childContext = instance.getChildContext();
    }
    if (isNullOrUndef(childContext)) {
        instance._childContext = context;
    }
    else {
        instance._childContext = combineFrom(context, childContext);
    }
    if (!isNull(options.beforeRender)) {
        options.beforeRender(instance);
    }
    var input = instance.render(props, instance.state, context);
    if (!isNull(options.afterRender)) {
        options.afterRender(instance);
    }
    if (isArray(input)) {
        if (process.env.NODE_ENV !== "production") {
            throwError("a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.");
        }
        throwError();
    }
    else if (isInvalid(input)) {
        input = createVoidVNode();
    }
    else if (isStringOrNumber(input)) {
        input = createTextVNode(input, null);
    }
    else {
        if (input.dom) {
            input = directClone(input);
        }
        if (input.flags & 28 /* Component */) {
            // if we have an input that is also a component, we run into a tricky situation
            // where the root vNode needs to always have the correct DOM entry
            // so we break monomorphism on our input and supply it our vNode as parentVNode
            // we can optimise this in the future, but this gets us out of a lot of issues
            input.parentVNode = vNode;
        }
    }
    instance._pendingSetState = false;
    instance._lastInput = input;
    return instance;
}
function replaceLastChildAndUnmount(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling) {
    replaceVNode(parentDom, mount(nextInput, null, lifecycle, context, isSVG), lastInput, lifecycle, isRecycling);
}
function replaceVNode(parentDom, dom, vNode, lifecycle, isRecycling) {
    unmount(vNode, null, lifecycle, false, isRecycling);
    replaceChild(parentDom, dom, vNode.dom);
}
function createFunctionalComponentInput(vNode, component, props, context) {
    var input = component(props, context);
    if (isArray(input)) {
        if (process.env.NODE_ENV !== "production") {
            throwError("a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.");
        }
        throwError();
    }
    else if (isInvalid(input)) {
        input = createVoidVNode();
    }
    else if (isStringOrNumber(input)) {
        input = createTextVNode(input, null);
    }
    else {
        if (input.dom) {
            input = directClone(input);
        }
        if (input.flags & 28 /* Component */) {
            // if we have an input that is also a component, we run into a tricky situation
            // where the root vNode needs to always have the correct DOM entry
            // so we break monomorphism on our input and supply it our vNode as parentVNode
            // we can optimise this in the future, but this gets us out of a lot of issues
            input.parentVNode = vNode;
        }
    }
    return input;
}
function setTextContent(dom, text) {
    if (text !== "") {
        dom.textContent = text;
    }
    else {
        dom.appendChild(document.createTextNode(""));
    }
}
function updateTextContent(dom, text) {
    dom.firstChild.nodeValue = text;
}
function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
}
function insertOrAppend(parentDom, newNode, nextNode) {
    if (isNullOrUndef(nextNode)) {
        appendChild(parentDom, newNode);
    }
    else {
        parentDom.insertBefore(newNode, nextNode);
    }
}
function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(svgNS, tag);
    }
    else {
        return document.createElement(tag);
    }
}
function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    unmount(lastNode, null, lifecycle, false, isRecycling);
    var dom = mount(nextNode, null, lifecycle, context, isSVG);
    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
}
function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) {
        parentDom = lastDom.parentNode;
    }
    parentDom.replaceChild(nextDom, lastDom);
}
function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
}
function removeAllChildren(dom, children, lifecycle, isRecycling) {
    if (!options.recyclingEnabled || (options.recyclingEnabled && !isRecycling)) {
        removeChildren(null, children, lifecycle, isRecycling);
    }
    dom.textContent = "";
}
function removeChildren(dom, children, lifecycle, isRecycling) {
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        if (!isInvalid(child)) {
            unmount(child, dom, lifecycle, true, isRecycling);
        }
    }
}
function isKeyed(lastChildren, nextChildren) {
    return (nextChildren.length > 0 &&
        !isNullOrUndef(nextChildren[0]) &&
        !isNullOrUndef(nextChildren[0].key) &&
        lastChildren.length > 0 &&
        !isNullOrUndef(lastChildren[0]) &&
        !isNullOrUndef(lastChildren[0].key));
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function VNode(children, className, flags, key, props, ref, type) {
    this.children = children;
    this.className = className;
    this.dom = null;
    this.flags = flags;
    this.key = key;
    this.props = props;
    this.ref = ref;
    this.type = type;
}
/**
 * Creates virtual node
 * @param {number} flags
 * @param {string|Function|null} type
 * @param {string|null=} className
 * @param {object=} children
 * @param {object=} props
 * @param {*=} key
 * @param {object|Function=} ref
 * @param {boolean=} noNormalise
 * @returns {VNode} returns new virtual node
 */
function createVNode(flags, type, className, children, props, key, ref, noNormalise) {
    if (flags & 16 /* ComponentUnknown */) {
        flags = isStatefulComponent(type)
            ? 4 /* ComponentClass */
            : 8 /* ComponentFunction */;
    }
    var vNode = new VNode(children === void 0 ? null : children, className === void 0 ? null : className, flags, key === void 0 ? null : key, props === void 0 ? null : props, ref === void 0 ? null : ref, type);
    if (noNormalise !== true) {
        normalize(vNode);
    }
    if (options.createVNode !== null) {
        options.createVNode(vNode);
    }
    return vNode;
}
function directClone(vNodeToClone) {
    var newVNode;
    var flags = vNodeToClone.flags;
    if (flags & 28 /* Component */) {
        var props;
        var propsToClone = vNodeToClone.props;
        if (isNull(propsToClone)) {
            props = EMPTY_OBJ;
        }
        else {
            props = {};
            for (var key in propsToClone) {
                props[key] = propsToClone[key];
            }
        }
        newVNode = createVNode(flags, vNodeToClone.type, null, null, props, vNodeToClone.key, vNodeToClone.ref, true);
        var newProps = newVNode.props;
        var newChildren = newProps.children;
        // we need to also clone component children that are in props
        // as the children may also have been hoisted
        if (newChildren) {
            if (isArray(newChildren)) {
                var len = newChildren.length;
                if (len > 0) {
                    var tmpArray = [];
                    for (var i = 0; i < len; i++) {
                        var child = newChildren[i];
                        if (isStringOrNumber(child)) {
                            tmpArray.push(child);
                        }
                        else if (!isInvalid(child) && isVNode(child)) {
                            tmpArray.push(directClone(child));
                        }
                    }
                    newProps.children = tmpArray;
                }
            }
            else if (isVNode(newChildren)) {
                newProps.children = directClone(newChildren);
            }
        }
        newVNode.children = null;
    }
    else if (flags & 3970 /* Element */) {
        var children = vNodeToClone.children;
        var props$1;
        var propsToClone$1 = vNodeToClone.props;
        if (propsToClone$1 === null) {
            props$1 = EMPTY_OBJ;
        }
        else {
            props$1 = {};
            for (var key$1 in propsToClone$1) {
                props$1[key$1] = propsToClone$1[key$1];
            }
        }
        newVNode = createVNode(flags, vNodeToClone.type, vNodeToClone.className, children, props$1, vNodeToClone.key, vNodeToClone.ref, !children);
    }
    else if (flags & 1 /* Text */) {
        newVNode = createTextVNode(vNodeToClone.children, vNodeToClone.key);
    }
    return newVNode;
}
/*
 directClone is preferred over cloneVNode and used internally also.
 This function makes Inferno backwards compatible.
 And can be tree-shaked by modern bundlers

 Would be nice to combine this with directClone but could not do it without breaking change
 */
/**
 * Clones given virtual node by creating new instance of it
 * @param {VNode} vNodeToClone virtual node to be cloned
 * @param {Props=} props additional props for new virtual node
 * @param {...*} _children new children for new virtual node
 * @returns {VNode} new virtual node
 */
function cloneVNode(vNodeToClone, props) {
    var _children = [], len$2 = arguments.length - 2;
    while ( len$2-- > 0 ) _children[ len$2 ] = arguments[ len$2 + 2 ];

    var children = _children;
    var childrenLen = _children.length;
    if (childrenLen > 0 && !isUndefined(_children[0])) {
        if (!props) {
            props = {};
        }
        if (childrenLen === 1) {
            children = _children[0];
        }
        if (!isUndefined(children)) {
            props.children = children;
        }
    }
    var newVNode;
    if (isArray(vNodeToClone)) {
        var tmpArray = [];
        for (var i = 0, len = vNodeToClone.length; i < len; i++) {
            tmpArray.push(directClone(vNodeToClone[i]));
        }
        newVNode = tmpArray;
    }
    else {
        var flags = vNodeToClone.flags;
        var className = vNodeToClone.className;
        var key = vNodeToClone.key;
        var ref = vNodeToClone.ref;
        if (props) {
            if (props.hasOwnProperty("className")) {
                className = props.className;
            }
            if (props.hasOwnProperty("ref")) {
                ref = props.ref;
            }
            if (props.hasOwnProperty("key")) {
                key = props.key;
            }
        }
        if (flags & 28 /* Component */) {
            newVNode = createVNode(flags, vNodeToClone.type, className, null, !vNodeToClone.props && !props
                ? EMPTY_OBJ
                : combineFrom(vNodeToClone.props, props), key, ref, true);
            var newProps = newVNode.props;
            if (newProps) {
                var newChildren = newProps.children;
                // we need to also clone component children that are in props
                // as the children may also have been hoisted
                if (newChildren) {
                    if (isArray(newChildren)) {
                        var len$1 = newChildren.length;
                        if (len$1 > 0) {
                            var tmpArray$1 = [];
                            for (var i$1 = 0; i$1 < len$1; i$1++) {
                                var child = newChildren[i$1];
                                if (isStringOrNumber(child)) {
                                    tmpArray$1.push(child);
                                }
                                else if (!isInvalid(child) && isVNode(child)) {
                                    tmpArray$1.push(directClone(child));
                                }
                            }
                            newProps.children = tmpArray$1;
                        }
                    }
                    else if (isVNode(newChildren)) {
                        newProps.children = directClone(newChildren);
                    }
                }
            }
            newVNode.children = null;
        }
        else if (flags & 3970 /* Element */) {
            children = props && !isUndefined(props.children)
                ? props.children
                : vNodeToClone.children;
            newVNode = createVNode(flags, vNodeToClone.type, className, children, !vNodeToClone.props && !props
                ? EMPTY_OBJ
                : combineFrom(vNodeToClone.props, props), key, ref, false);
        }
        else if (flags & 1 /* Text */) {
            newVNode = createTextVNode(vNodeToClone.children, key);
        }
    }
    return newVNode;
}
function createVoidVNode() {
    return createVNode(4096 /* Void */, null);
}
function createTextVNode(text, key) {
    return createVNode(1 /* Text */, null, null, text, null, key);
}
function isVNode(o) {
    return !!o.flags;
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
function applyKey(key, vNode) {
    vNode.key = key;
    return vNode;
}
function applyKeyIfMissing(key, vNode) {
    if (isNumber(key)) {
        key = "." + key;
    }
    if (isNull(vNode.key) || vNode.key[0] === ".") {
        return applyKey(key, vNode);
    }
    return vNode;
}
function applyKeyPrefix(key, vNode) {
    vNode.key = key + vNode.key;
    return vNode;
}
function _normalizeVNodes(nodes, result, index, currentKey) {
    for (var len = nodes.length; index < len; index++) {
        var n = nodes[index];
        var key = currentKey + "." + index;
        if (!isInvalid(n)) {
            if (isArray(n)) {
                _normalizeVNodes(n, result, 0, key);
            }
            else {
                if (isStringOrNumber(n)) {
                    n = createTextVNode(n, null);
                }
                else if ((isVNode(n) && n.dom) || (n.key && n.key[0] === ".")) {
                    n = directClone(n);
                }
                if (isNull(n.key) || n.key[0] === ".") {
                    n = applyKey(key, n);
                }
                else {
                    n = applyKeyPrefix(currentKey, n);
                }
                result.push(n);
            }
        }
    }
}
function normalizeVNodes(nodes) {
    var newNodes;
    // we assign $ which basically means we've flagged this array for future note
    // if it comes back again, we need to clone it, as people are using it
    // in an immutable way
    // tslint:disable
    if (nodes["$"] === true) {
        nodes = nodes.slice();
    }
    else {
        nodes["$"] = true;
    }
    // tslint:enable
    for (var i = 0, len = nodes.length; i < len; i++) {
        var n = nodes[i];
        if (isInvalid(n) || isArray(n)) {
            var result = (newNodes || nodes).slice(0, i);
            _normalizeVNodes(nodes, result, i, "");
            return result;
        }
        else if (isStringOrNumber(n)) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, createTextVNode(n, null)));
        }
        else if ((isVNode(n) && n.dom !== null) ||
            (isNull(n.key) && (n.flags & 64 /* HasNonKeyedChildren */) === 0)) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, directClone(n)));
        }
        else if (newNodes) {
            newNodes.push(applyKeyIfMissing(i, directClone(n)));
        }
    }
    return newNodes || nodes;
}
function normalizeChildren(children) {
    if (isArray(children)) {
        return normalizeVNodes(children);
    }
    else if (isVNode(children) && children.dom !== null) {
        return directClone(children);
    }
    return children;
}
function normalizeProps(vNode, props, children) {
    if (vNode.flags & 3970 /* Element */) {
        if (isNullOrUndef(children) && props.hasOwnProperty("children")) {
            vNode.children = props.children;
        }
        if (props.hasOwnProperty("className")) {
            vNode.className = props.className || null;
            delete props.className;
        }
    }
    if (props.hasOwnProperty("ref")) {
        vNode.ref = props.ref;
        delete props.ref;
    }
    if (props.hasOwnProperty("key")) {
        vNode.key = props.key;
        delete props.key;
    }
}
function getFlagsForElementVnode(type) {
    if (type === "svg") {
        return 128 /* SvgElement */;
    }
    else if (type === "input") {
        return 512 /* InputElement */;
    }
    else if (type === "select") {
        return 2048 /* SelectElement */;
    }
    else if (type === "textarea") {
        return 1024 /* TextareaElement */;
    }
    else if (type === "media") {
        return 256 /* MediaElement */;
    }
    return 2 /* HtmlElement */;
}
function normalize(vNode) {
    var props = vNode.props;
    var children = vNode.children;
    // convert a wrongly created type back to element
    // Primitive node doesn't have defaultProps, only Component
    if (vNode.flags & 28 /* Component */) {
        // set default props
        var type = vNode.type;
        var defaultProps = type.defaultProps;
        if (!isNullOrUndef(defaultProps)) {
            if (!props) {
                props = vNode.props = defaultProps; // Create new object if only defaultProps given
            }
            else {
                for (var prop in defaultProps) {
                    if (isUndefined(props[prop])) {
                        props[prop] = defaultProps[prop];
                    }
                }
            }
        }
        if (isString(type)) {
            vNode.flags = getFlagsForElementVnode(type);
            if (props && props.children) {
                vNode.children = props.children;
                children = props.children;
            }
        }
    }
    if (props) {
        normalizeProps(vNode, props, children);
        if (!isInvalid(props.children)) {
            props.children = normalizeChildren(props.children);
        }
    }
    if (!isInvalid(children)) {
        vNode.children = normalizeChildren(children);
    }
    if (process.env.NODE_ENV !== "production") {
        // This code will be stripped out from production CODE
        // It helps users to track errors in their applications.
        var verifyKeys = function (vNodes) {
            var keyValues = vNodes.map((function (vnode) {
                return vnode.key;
            }));
            keyValues.some((function (item, idx) {
                var hasDuplicate = keyValues.indexOf(item) !== idx;
                if (hasDuplicate) {
                    warning("Inferno normalisation(...): Encountered two children with same key, all keys must be unique within its siblings. Duplicated key is:" +
                        item);
                }
                return hasDuplicate;
            }));
        };
        if (vNode.children && Array.isArray(vNode.children)) {
            verifyKeys(vNode.children);
        }
    }
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
/**
 * Links given data to event as first parameter
 * @param {*} data data to be linked, it will be available in function as first parameter
 * @param {Function} event Function to be called when event occurs
 * @returns {{data: *, event: Function}}
 */
function linkEvent(data, event) {
    if (isFunction(event)) {
        return { data: data, event: event };
    }
    return null; // Return null when event is invalid, to avoid creating unnecessary event handlers
}

/**
 * @module Inferno
 */ /** TypeDoc Comment */
/* tslint:disable:object-literal-sort-keys */
if (process.env.NODE_ENV !== "production") {
    /* tslint:disable-next-line:no-empty */
    var testFunc = function testFn() { };
    if ((testFunc.name || testFunc.toString()).indexOf("testFn") ===
        -1) {
        warning("It looks like you're using a minified copy of the development build " +
            "of Inferno. When deploying Inferno apps to production, make sure to use " +
            "the production build which skips development warnings and is faster. " +
            "See http://infernojs.org for more details.");
    }
}
var version = "3.6.4";
// we duplicate it so it plays nicely with different module loading systems
var index = {
    EMPTY_OBJ: EMPTY_OBJ,
    NO_OP: NO_OP,
    cloneVNode: cloneVNode,
    createRenderer: createRenderer,
    createVNode: createVNode,
    findDOMNode: findDOMNode,
    getFlagsForElementVnode: getFlagsForElementVnode,
    internal_DOMNodeMap: componentToDOMNodeMap,
    internal_isUnitlessNumber: isUnitlessNumber,
    internal_normalize: normalize,
    internal_patch: patch,
    linkEvent: linkEvent,
    options: options,
    render: render,
    version: version
};

exports['default'] = index;
exports.EMPTY_OBJ = EMPTY_OBJ;
exports.NO_OP = NO_OP;
exports.cloneVNode = cloneVNode;
exports.createRenderer = createRenderer;
exports.createVNode = createVNode;
exports.findDOMNode = findDOMNode;
exports.getFlagsForElementVnode = getFlagsForElementVnode;
exports.internal_DOMNodeMap = componentToDOMNodeMap;
exports.internal_isUnitlessNumber = isUnitlessNumber;
exports.internal_normalize = normalize;
exports.internal_patch = patch;
exports.linkEvent = linkEvent;
exports.options = options;
exports.render = render;
exports.version = version;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(13)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(12)(undefined);
// imports


// module
exports.push([module.i, "body {\n  background: white; }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(14);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 14 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baobab = __webpack_require__(16);

var _baobab2 = _interopRequireDefault(_baobab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tree = new _baobab2.default({
  colors: ['yellow', 'blue', 'orange']
});

exports.default = tree;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Baobab Data Structure
 * ======================
 *
 * A handy data tree with cursors.
 */


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _emmett = __webpack_require__(3);

var _emmett2 = _interopRequireDefault(_emmett);

var _cursor = __webpack_require__(5);

var _cursor2 = _interopRequireDefault(_cursor);

var _monkey = __webpack_require__(2);

var _watcher = __webpack_require__(18);

var _watcher2 = _interopRequireDefault(_watcher);

var _type = __webpack_require__(0);

var _type2 = _interopRequireDefault(_type);

var _update2 = __webpack_require__(6);

var _update3 = _interopRequireDefault(_update2);

var _helpers = __webpack_require__(1);

var helpers = _interopRequireWildcard(_helpers);

var arrayFrom = helpers.arrayFrom;
var coercePath = helpers.coercePath;
var deepFreeze = helpers.deepFreeze;
var getIn = helpers.getIn;
var makeError = helpers.makeError;
var deepClone = helpers.deepClone;
var deepMerge = helpers.deepMerge;
var shallowClone = helpers.shallowClone;
var shallowMerge = helpers.shallowMerge;
var uniqid = helpers.uniqid;

/**
 * Baobab defaults
 */
var DEFAULTS = {

  // Should the tree handle its transactions on its own?
  autoCommit: true,

  // Should the transactions be handled asynchronously?
  asynchronous: true,

  // Should the tree's data be immutable?
  immutable: true,

  // Should the monkeys be lazy?
  lazyMonkeys: true,

  // Should the tree be persistent?
  persistent: true,

  // Should the tree's update be pure?
  pure: true,

  // Validation specifications
  validate: null,

  // Validation behavior 'rollback' or 'notify'
  validationBehavior: 'rollback'
};

/**
 * Function returning a string hash from a non-dynamic path expressed as an
 * array.
 *
 * @param  {array}  path - The path to hash.
 * @return {string} string - The resultant hash.
 */
function hashPath(path) {
  return 'λ' + path.map(function (step) {
    if (_type2['default']['function'](step) || _type2['default'].object(step)) return '#' + uniqid() + '#';

    return step;
  }).join('λ');
}

/**
 * Baobab class
 *
 * @constructor
 * @param {object|array} [initialData={}]    - Initial data passed to the tree.
 * @param {object}       [opts]              - Optional options.
 * @param {boolean}      [opts.autoCommit]   - Should the tree auto-commit?
 * @param {boolean}      [opts.asynchronous] - Should the tree's transactions
 *                                             handled asynchronously?
 * @param {boolean}      [opts.immutable]    - Should the tree be immutable?
 * @param {boolean}      [opts.persistent]   - Should the tree be persistent?
 * @param {boolean}      [opts.pure]         - Should the tree be pure?
 * @param {function}     [opts.validate]     - Validation function.
 * @param {string}       [opts.validationBehaviour] - "rollback" or "notify".
 */

var Baobab = (function (_Emitter) {
  _inherits(Baobab, _Emitter);

  function Baobab(initialData, opts) {
    var _this = this;

    _classCallCheck(this, Baobab);

    _get(Object.getPrototypeOf(Baobab.prototype), 'constructor', this).call(this);

    // Setting initialData to an empty object if no data is provided by use
    if (arguments.length < 1) initialData = {};

    // Checking whether given initial data is valid
    if (!_type2['default'].object(initialData) && !_type2['default'].array(initialData)) throw makeError('Baobab: invalid data.', { data: initialData });

    // Merging given options with defaults
    this.options = shallowMerge({}, DEFAULTS, opts);

    // Disabling immutability & persistence if persistence if disabled
    if (!this.options.persistent) {
      this.options.immutable = false;
      this.options.pure = false;
    }

    // Privates
    this._identity = '[object Baobab]';
    this._cursors = {};
    this._future = null;
    this._transaction = [];
    this._affectedPathsIndex = {};
    this._monkeys = {};
    this._previousData = null;
    this._data = initialData;

    // Properties
    this.root = new _cursor2['default'](this, [], 'λ');
    delete this.root.release;

    // Does the user want an immutable tree?
    if (this.options.immutable) deepFreeze(this._data);

    // Bootstrapping root cursor's getters and setters
    var bootstrap = function bootstrap(name) {
      _this[name] = function () {
        var r = this.root[name].apply(this.root, arguments);
        return r instanceof _cursor2['default'] ? this : r;
      };
    };

    ['apply', 'clone', 'concat', 'deepClone', 'deepMerge', 'exists', 'get', 'push', 'merge', 'pop', 'project', 'serialize', 'set', 'shift', 'splice', 'unset', 'unshift'].forEach(bootstrap);

    // Registering the initial monkeys
    this._refreshMonkeys();

    // Initial validation
    var validationError = this.validate();

    if (validationError) throw Error('Baobab: invalid data.', { error: validationError });
  }

  /**
   * Monkey helper.
   */

  /**
   * Internal method used to refresh the tree's monkey register on every
   * update.
   * Note 1) For the time being, placing monkeys beneath array nodes is not
   * allowed for performance reasons.
   *
   * @param  {mixed}   node      - The starting node.
   * @param  {array}   path      - The starting node's path.
   * @param  {string}  operation - The operation that lead to a refreshment.
   * @return {Baobab}            - The tree instance for chaining purposes.
   */

  _createClass(Baobab, [{
    key: '_refreshMonkeys',
    value: function _refreshMonkeys(node, path, operation) {
      var _this2 = this;

      var clean = function clean(data) {
        var p = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

        if (data instanceof _monkey.Monkey) {
          data.release();
          (0, _update3['default'])(_this2._monkeys, p, { type: 'unset' }, {
            immutable: false,
            persistent: false,
            pure: false
          });

          return;
        }

        if (_type2['default'].object(data)) {
          for (var k in data) {
            clean(data[k], p.concat(k));
          }
        }
      };

      var walk = function walk(data) {
        var p = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

        // Should we sit a monkey in the tree?
        if (data instanceof _monkey.MonkeyDefinition || data instanceof _monkey.Monkey) {
          var monkeyInstance = new _monkey.Monkey(_this2, p, data instanceof _monkey.Monkey ? data.definition : data);

          (0, _update3['default'])(_this2._monkeys, p, { type: 'set', value: monkeyInstance }, {
            immutable: false,
            persistent: false,
            pure: false
          });

          return;
        }

        // Object iteration
        if (_type2['default'].object(data)) {
          for (var k in data) {
            walk(data[k], p.concat(k));
          }
        }
      };

      // Walking the whole tree
      if (!arguments.length) {
        walk(this._data);
      } else {
        var monkeysNode = getIn(this._monkeys, path).data;

        // Is this required that we clean some already existing monkeys?
        if (monkeysNode) clean(monkeysNode, path);

        // Let's walk the tree only from the updated point
        if (operation !== 'unset') {
          walk(node, path);
        }
      }

      return this;
    }

    /**
     * Method used to validate the tree's data.
     *
     * @return {boolean} - Is the tree valid?
     */
  }, {
    key: 'validate',
    value: function validate(affectedPaths) {
      var _options = this.options;
      var validate = _options.validate;
      var behavior = _options.validationBehavior;

      if (typeof validate !== 'function') return null;

      var error = validate.call(this, this._previousData, this._data, affectedPaths || [[]]);

      if (error instanceof Error) {

        if (behavior === 'rollback') {
          this._data = this._previousData;
          this._affectedPathsIndex = {};
          this._transaction = [];
          this._previousData = this._data;
        }

        this.emit('invalid', { error: error });

        return error;
      }

      return null;
    }

    /**
     * Method used to select data within the tree by creating a cursor. Cursors
     * are kept as singletons by the tree for performance and hygiene reasons.
     *
     * Arity (1):
     * @param {path}    path - Path to select in the tree.
     *
     * Arity (*):
     * @param {...step} path - Path to select in the tree.
     *
     * @return {Cursor}      - The resultant cursor.
     */
  }, {
    key: 'select',
    value: function select(path) {

      // If no path is given, we simply return the root
      path = path || [];

      // Variadic
      if (arguments.length > 1) path = arrayFrom(arguments);

      // Checking that given path is valid
      if (!_type2['default'].path(path)) throw makeError('Baobab.select: invalid path.', { path: path });

      // Casting to array
      path = [].concat(path);

      // Computing hash (done here because it would be too late to do it in the
      // cursor's constructor since we need to hit the cursors' index first).
      var hash = hashPath(path);

      // Creating a new cursor or returning the already existing one for the
      // requested path.
      var cursor = this._cursors[hash];

      if (!cursor) {
        cursor = new _cursor2['default'](this, path, hash);
        this._cursors[hash] = cursor;
      }

      // Emitting an event to notify that a part of the tree was selected
      this.emit('select', { path: path, cursor: cursor });
      return cursor;
    }

    /**
     * Method used to update the tree. Updates are simply expressed by a path,
     * dynamic or not, and an operation.
     *
     * This is where path solving should happen and not in the cursor.
     *
     * @param  {path}   path      - The path where we'll apply the operation.
     * @param  {object} operation - The operation to apply.
     * @return {mixed} - Return the result of the update.
     */
  }, {
    key: 'update',
    value: function update(path, operation) {
      var _this3 = this;

      // Coercing path
      path = coercePath(path);

      if (!_type2['default'].operationType(operation.type)) throw makeError('Baobab.update: unknown operation type "' + operation.type + '".', { operation: operation });

      // Solving the given path

      var _getIn = getIn(this._data, path);

      var solvedPath = _getIn.solvedPath;
      var exists = _getIn.exists;

      // If we couldn't solve the path, we throw
      if (!solvedPath) throw makeError('Baobab.update: could not solve the given path.', {
        path: solvedPath
      });

      // Read-only path?
      var monkeyPath = _type2['default'].monkeyPath(this._monkeys, solvedPath);
      if (monkeyPath && solvedPath.length > monkeyPath.length) throw makeError('Baobab.update: attempting to update a read-only path.', {
        path: solvedPath
      });

      // We don't unset irrelevant paths
      if (operation.type === 'unset' && !exists) return;

      // If we merge data, we need to acknowledge monkeys
      var realOperation = operation;
      if (/merge/i.test(operation.type)) {
        var monkeysNode = getIn(this._monkeys, solvedPath).data;

        if (_type2['default'].object(monkeysNode)) {

          // Cloning the operation not to create weird behavior for the user
          realOperation = shallowClone(realOperation);

          // Fetching the existing node in the current data
          var currentNode = getIn(this._data, solvedPath).data;

          if (/deep/i.test(realOperation.type)) realOperation.value = deepMerge({}, deepMerge({}, currentNode, deepClone(monkeysNode)), realOperation.value);else realOperation.value = shallowMerge({}, deepMerge({}, currentNode, deepClone(monkeysNode)), realOperation.value);
        }
      }

      // Stashing previous data if this is the frame's first update
      if (!this._transaction.length) this._previousData = this._data;

      // Applying the operation
      var result = (0, _update3['default'])(this._data, solvedPath, realOperation, this.options);

      var data = result.data;
      var node = result.node;

      // If because of purity, the update was moot, we stop here
      if (!('data' in result)) return node;

      // If the operation is push, the affected path is slightly different
      var affectedPath = solvedPath.concat(operation.type === 'push' ? node.length - 1 : []);

      var hash = hashPath(affectedPath);

      // Updating data and transaction
      this._data = data;
      this._affectedPathsIndex[hash] = true;
      this._transaction.push(shallowMerge({}, operation, { path: affectedPath }));

      // Updating the monkeys
      this._refreshMonkeys(node, solvedPath, operation.type);

      // Emitting a `write` event
      this.emit('write', { path: affectedPath });

      // Should we let the user commit?
      if (!this.options.autoCommit) return node;

      // Should we update asynchronously?
      if (!this.options.asynchronous) {
        this.commit();
        return node;
      }

      // Updating asynchronously
      if (!this._future) this._future = setTimeout(function () {
        return _this3.commit();
      }, 0);

      // Finally returning the affected node
      return node;
    }

    /**
     * Method committing the updates of the tree and firing the tree's events.
     *
     * @return {Baobab} - The tree instance for chaining purposes.
     */
  }, {
    key: 'commit',
    value: function commit() {

      // Do not fire update if the transaction is empty
      if (!this._transaction.length) return this;

      // Clearing timeout if one was defined
      if (this._future) this._future = clearTimeout(this._future);

      var affectedPaths = Object.keys(this._affectedPathsIndex).map(function (h) {
        return h !== 'λ' ? h.split('λ').slice(1) : [];
      });

      // Is the tree still valid?
      var validationError = this.validate(affectedPaths);

      if (validationError) return this;

      // Caching to keep original references before we change them
      var transaction = this._transaction,
          previousData = this._previousData;

      this._affectedPathsIndex = {};
      this._transaction = [];
      this._previousData = this._data;

      // Emitting update event
      this.emit('update', {
        paths: affectedPaths,
        currentData: this._data,
        transaction: transaction,
        previousData: previousData
      });

      return this;
    }

    /**
     * Method returning a monkey at the given path or else `null`.
     *
     * @param  {path}        path - Path of the monkey to retrieve.
     * @return {Monkey|null}      - The Monkey instance of `null`.
     */
  }, {
    key: 'getMonkey',
    value: function getMonkey(path) {
      path = coercePath(path);

      var monkey = getIn(this._monkeys, [].concat(path)).data;

      if (monkey instanceof _monkey.Monkey) return monkey;

      return null;
    }

    /**
     * Method used to watch a collection of paths within the tree. Very useful
     * to bind UI components and such to the tree.
     *
     * @param  {object} mapping - Mapping of paths to listen.
     * @return {Cursor}         - The created watcher.
     */
  }, {
    key: 'watch',
    value: function watch(mapping) {
      return new _watcher2['default'](this, mapping);
    }

    /**
     * Method releasing the tree and its attached data from memory.
     */
  }, {
    key: 'release',
    value: function release() {
      var k = undefined;

      this.emit('release');

      delete this.root;

      delete this._data;
      delete this._previousData;
      delete this._transaction;
      delete this._affectedPathsIndex;
      delete this._monkeys;

      // Releasing cursors
      for (k in this._cursors) this._cursors[k].release();
      delete this._cursors;

      // Killing event emitter
      this.kill();
    }

    /**
     * Overriding the `toJSON` method for convenient use with JSON.stringify.
     *
     * @return {mixed} - Data at cursor.
     */
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.serialize();
    }

    /**
     * Overriding the `toString` method for debugging purposes.
     *
     * @return {string} - The baobab's identity.
     */
  }, {
    key: 'toString',
    value: function toString() {
      return this._identity;
    }
  }]);

  return Baobab;
})(_emmett2['default']);

exports['default'] = Baobab;
Baobab.monkey = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (!args.length) throw new Error('Baobab.monkey: missing definition.');

  if (args.length === 1 && typeof args[0] !== 'function') return new _monkey.MonkeyDefinition(args[0]);

  return new _monkey.MonkeyDefinition(args);
};
Baobab.dynamicNode = Baobab.monkey;

/**
 * Exposing some internals for convenience
 */
Baobab.Cursor = _cursor2['default'];
Baobab.MonkeyDefinition = _monkey.MonkeyDefinition;
Baobab.Monkey = _monkey.Monkey;
Baobab.type = _type2['default'];
Baobab.helpers = helpers;

/**
 * Version
 */
Baobab.VERSION = '2.4.3';
module.exports = exports['default'];

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Baobab Watchers
 * ================
 *
 * Abstraction used to listen and retrieve data from multiple parts of a
 * Baobab tree at once.
 */


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _emmett = __webpack_require__(3);

var _emmett2 = _interopRequireDefault(_emmett);

var _cursor = __webpack_require__(5);

var _cursor2 = _interopRequireDefault(_cursor);

var _type = __webpack_require__(0);

var _type2 = _interopRequireDefault(_type);

var _helpers = __webpack_require__(1);

/**
 * Watcher class.
 *
 * @constructor
 * @param {Baobab} tree     - The watched tree.
 * @param {object} mapping  - A mapping of the paths to watch in the tree.
 */

var Watcher = (function (_Emitter) {
  _inherits(Watcher, _Emitter);

  function Watcher(tree, mapping) {
    var _this = this;

    _classCallCheck(this, Watcher);

    _get(Object.getPrototypeOf(Watcher.prototype), 'constructor', this).call(this);

    // Properties
    this.tree = tree;
    this.mapping = null;

    this.state = {
      killed: false
    };

    // Initializing
    this.refresh(mapping);

    // Listening
    this.handler = function (e) {
      if (_this.state.killed) return;

      var watchedPaths = _this.getWatchedPaths();

      if ((0, _helpers.solveUpdate)(e.data.paths, watchedPaths)) return _this.emit('update');
    };

    this.tree.on('update', this.handler);
  }

  /**
   * Method used to get the current watched paths.
   *
   * @return {array} - The array of watched paths.
   */

  _createClass(Watcher, [{
    key: 'getWatchedPaths',
    value: function getWatchedPaths() {
      var _this2 = this;

      var rawPaths = Object.keys(this.mapping).map(function (k) {
        var v = _this2.mapping[k];

        // Watcher mappings can accept a cursor
        if (v instanceof _cursor2['default']) return v.solvedPath;

        return _this2.mapping[k];
      });

      return rawPaths.reduce(function (cp, p) {

        // Handling path polymorphisms
        p = [].concat(p);

        // Dynamic path?
        if (_type2['default'].dynamicPath(p)) p = (0, _helpers.getIn)(_this2.tree._data, p).solvedPath;

        if (!p) return cp;

        // Facet path?
        var monkeyPath = _type2['default'].monkeyPath(_this2.tree._monkeys, p);

        if (monkeyPath) return cp.concat((0, _helpers.getIn)(_this2.tree._monkeys, monkeyPath).data.relatedPaths());

        return cp.concat([p]);
      }, []);
    }

    /**
     * Method used to return a map of the watcher's cursors.
     *
     * @return {object} - TMap of relevant cursors.
     */
  }, {
    key: 'getCursors',
    value: function getCursors() {
      var _this3 = this;

      var cursors = {};

      Object.keys(this.mapping).forEach(function (k) {
        var path = _this3.mapping[k];

        if (path instanceof _cursor2['default']) cursors[k] = path;else cursors[k] = _this3.tree.select(path);
      });

      return cursors;
    }

    /**
     * Method used to refresh the watcher's mapping.
     *
     * @param  {object}  mapping  - The new mapping to apply.
     * @return {Watcher}          - Itself for chaining purposes.
     */
  }, {
    key: 'refresh',
    value: function refresh(mapping) {

      if (!_type2['default'].watcherMapping(mapping)) throw (0, _helpers.makeError)('Baobab.watch: invalid mapping.', { mapping: mapping });

      this.mapping = mapping;

      // Creating the get method
      var projection = {};

      for (var k in mapping) {
        projection[k] = mapping[k] instanceof _cursor2['default'] ? mapping[k].path : mapping[k];
      }this.get = this.tree.project.bind(this.tree, projection);
    }

    /**
     * Methods releasing the watcher from memory.
     */
  }, {
    key: 'release',
    value: function release() {

      this.tree.off('update', this.handler);
      this.state.killed = true;
      this.kill();
    }
  }]);

  return Watcher;
})(_emmett2['default']);

exports['default'] = Watcher;
module.exports = exports['default'];

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inferno = __webpack_require__(4);

var _inferno2 = _interopRequireDefault(_inferno);

var _actions = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createVNode = _inferno2.default.createVNode;

exports.default = function (props) {
  console.log('here');
  return createVNode(2, 'div', null, [createVNode(2, 'span', null, 'hola!'), createVNode(2, 'div', 'cesium-container'), createVNode(2, 'button', null, 'add color', {
    'onClick': _actions.addColor
  })]);
};

/***/ }),
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.addColor = function (tree) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'red';

  console.log('addColor', color);
  tree.push('colors', color);
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map