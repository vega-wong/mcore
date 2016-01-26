// Generated by CoffeeScript 1.10.0

/**
 * 
 * @date 2016-01-11 20:41:14
 * @author vfasky <vfasky@gmail.com>
 * @link http://vfasky.com
 */
'use strict';
var _isNumberReg;

_isNumberReg = /^-{0,1}\d*\.{0,1}\d+$/;

exports.isNumber = function(x) {
  return _isNumberReg.test(x);
};

exports.isArray = function(x) {
  if (Array.isArray) {
    return Array.isArray(x);
  }
  return Object.prototype.toString.call(x) === '[object Array]';
};

exports.isObject = function(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
};

exports.isString = function(x) {
  return Object.prototype.toString.call(x) === '[object String]';
};

exports.isFunction = function(x) {
  return Object.prototype.toString.call(x) === '[object Function]';
};

exports.isPlainObject = function(x) {
  var hasIsPropertyOfMethod, hasOwnConstructor, key, lastKey;
  if (!x || Object.prototype.toString.call(x) !== '[object Object]' || x.nodeType || x.setInterval) {
    return false;
  }
  hasOwnConstructor = Object.hasOwnProperty.call(x, 'constructor');
  hasIsPropertyOfMethod = Object.hasOwnProperty.call(x.constructor.prototype, 'isPrototypeOf');
  if (x.constructor && !hasOwnConstructor && !hasIsPropertyOfMethod) {
    return false;
  }
  for (key in x) {
    lastKey = key;
  }
  return typeof lastKey === 'undefined' || Object.hasOwnProperty.call(x, lastKey);
};

exports.extend = function() {
  var clone, copy, deep, i, j, length, name, options, ref, ref1, src, start, target;
  target = arguments[0] || {};
  length = arguments.length;
  deep = false;
  start = 1;
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    start = 2;
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }
  for (i = j = ref = start, ref1 = length; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
    if ((options = arguments[i]) !== null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) {
          continue;
        }
        if (deep && copy && (exports.isPlainObject(copy) || exports.isArray(copy))) {
          clone = {};
          if (src && (exports.isPlainObject(src) || exports.isArray(src))) {
            clone = exports.isArray(copy) && [] || {};
          }
          target[name] = exports.extend(deep, clone, copy);
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }
  return target;
};

exports.setElementAttr = function(el, attrName, value, noHash) {
  var tagName;
  if (attrName === 'style') {
    return el.style.cssText = value;
  }
  tagName = (el.tagName || '').toLowerCase();
  if (attrName === 'value' && (tagName === 'input' || tagName === 'textarea')) {
    return el.value = value;
  }
  if (el._element && el._element.setAttribute && !noHash) {
    return el._element.setAttribute(el, attrName, value);
  } else {
    return el.setAttribute(attrName, value);
  }
};

exports.removeElementAttr = function(el, attrName) {
  if (el._element && el._element.removeAttribute) {
    return el._element.removeAttribute(attrName);
  } else {
    return el.removeAttribute(attrName);
  }
};

exports.toArray = function(listLike) {
  var i, j, list, ref;
  if (!listLike) {
    return [];
  }
  list = [];
  for (i = j = 0, ref = listLike.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    list.push(listLike[i]);
  }
  return list;
};

exports.each = function(arr, done) {
  var j, k, len, res, v;
  for (k = j = 0, len = arr.length; j < len; k = ++j) {
    v = arr[k];
    res = done(v, k);
    if (false === res) {
      return;
    }
  }
};

exports.objectKeys = function(obj) {
  var key, keys;
  if (obj == null) {
    obj = {};
  }
  if (Object.keys) {
    return Object.keys(obj);
  }
  keys = [];
  for (key in obj) {
    keys.push(key);
  }
  return keys;
};

exports.addEvent = function(node, type, callback) {
  if (node.addEventListener) {
    return node.addEventListener(type, callback);
  } else if (node.attachEvent) {
    node['e' + type + callback] = callback;
    node[type + callback] = function() {
      var event;
      event = window.event;
      event.target = event.srcElement;
      return node['e' + type + callback](event);
    };
    return node.attachEvent('on' + type, node[type + callback]);
  }
};

exports.removeEvent = function(node, type, callback) {
  if (node.removeEventListener) {
    return node.removeEventListener(type, callback);
  } else if (node.detachEvent) {
    node.detachEvent('on' + type, node[type + callback]);
    return node[type + callback] = null;
  }
};

(function() {
  if (window.requestAnimationFrame) {
    exports.nextTick = function(fun) {
      return window.requestAnimationFrame(function() {
        return fun();
      });
    };
    return exports.nextTick.clear = function(id) {
      if (id) {
        return window.cancelAnimationFrame(id);
      }
    };
  } else {
    exports.nextTick = function(fun) {
      return setTimeout(fun, 0);
    };
    return exports.nextTick.clear = function(id) {
      if (id) {
        return clearTimeout(id);
      }
    };
  }
})();
