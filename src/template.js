// Generated by CoffeeScript 1.9.3

/**
 * 模板
 * @module mcore/template
 * @author vfasky <vfasky@gmail.com>
 */

(function() {
  var slice = [].slice;

  define('mcore/template', ['jquery', 'rivets', 'mcore/util'], function($, rivets, util) {
    "use strict";
    rivets.adapters[':'] = {
      observe: function(obj, keypath, callback) {
        obj.on('change:' + keypath, callback);
      },
      unobserve: function(obj, keypath, callback) {
        obj.off('change:' + keypath, callback);
      },
      get: function(obj, keypath) {
        return obj.get(keypath);
      },
      set: function(obj, keypath, value) {
        obj.set(keypath, value);
      }
    };
    rivets.configure({
      handler: function(target, event, binding) {
        var ref;
        ref = this.call(binding.view.models.self, target, event);
        if (false !== ref) {
          return;
        }
        if (event.stopPropagation && event.preventDefault) {
          event.stopPropagation();
          return event.preventDefault();
        } else {
          window.event.cancelBubble = true;
          return window.event.returnValue = false;
        }
      }
    });

    /**
     * Formatters
     */
    rivets.formatters['nl2br'] = function(value) {
      if (!value) {
        return '';
      }
      return String(value).trim().replace(/<[^>]+>/g, "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br/>' + '$2');
    };
    rivets.formatters['link'] = function(value, join) {
      if (!value) {
        return '';
      }
      return String(value) + String(join);
    };
    rivets.formatters['and'] = function(value, show) {
      if (!value) {
        return value;
      }
      return show;
    };
    rivets.formatters['or'] = function(value, show) {
      if (value) {
        return value;
      }
      return show;
    };
    rivets.formatters['slice'] = function(value, start, end) {
      if (Array.isArray(value)) {
        return [];
      }
      return value.slice(start, end);
    };
    rivets.formatters['substr'] = function(value, start, end) {
      if (!value) {
        return '';
      }
      return String(value).substring(start, end);
    };
    rivets.formatters['len'] = function(value) {
      if (Array.isArray(value)) {
        return value.length;
      }
      if (!value) {
        return 0;
      }
      return String(value).length;
    };
    rivets.formatters['eq'] = function(value, x) {
      return value === x;
    };
    rivets.formatters['<'] = function(value, x) {
      return Number(value) < Number(x);
    };
    rivets.formatters['<='] = function(value, x) {
      return Number(value) <= Number(x);
    };
    rivets.formatters['=='] = function(value, x) {
      return Number(value) === Number(x);
    };
    rivets.formatters['>='] = function(value, x) {
      return Number(value) >= Number(x);
    };
    rivets.formatters['>'] = function(value, x) {
      return Number(value) > Number(x);
    };
    rivets.formatters['+'] = function(value, x) {
      return Number(value) + Number(x);
    };
    rivets.formatters['-'] = function(value, x) {
      return Number(value) - Number(x);
    };
    rivets.formatters['*'] = function(value, x) {
      return Number(value) * Number(x);
    };
    rivets.formatters['/'] = function(value, x) {
      return Number(value) / Number(x);
    };
    rivets.formatters['isArray'] = function(value) {
      return Array.isArray(value);
    };
    rivets.formatters['eachObject'] = function(obj) {
      var data, k, results, v;
      if (false === util.isObject(obj)) {
        return [];
      }
      data = [];
      results = [];
      for (k in obj) {
        v = obj[k];
        results.push(data.push({
          key: k,
          value: v
        }));
      }
      return results;
    };
    rivets.formatters['toFixed'] = function(value, len) {
      if (len == null) {
        len = 1;
      }
      if (false === util.isNumber(value)) {
        return 0;
      }
      return Number(value).toFixed(len);
    };
    return rivets.formatters['in'] = function() {
      var args, value;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (args.length < 2) {
        return false;
      }
      value = args[0];
      args.splice(0, 1);
      if (util.isNumber(value)) {
        value = Number(value);
      }
      return args.indexOf(value) !== -1;
    };
  });

}).call(this);
