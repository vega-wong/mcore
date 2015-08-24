// Generated by CoffeeScript 1.9.3

/**
 * 路由
 * @module mcore/route
 * @author vfasky <vfasky@gmail.com>
 * @example 
 * route = new mcore.Route()
 *
 * route.add '/index/:id', (id)->
 *     console.log id
 *
 * route.add '/show/*', (name)->
 *     console.log name
 * 
 * route.add '/get/:id?', (id)->
 *     console.log id # or undefined
 * 
 * route.add 'user user/:id', (id)->
 *     console.log route.lookup('user', id:1) #/user/1
 *
 * route.run()
 */

(function() {
  define('mcore/route', ['mcore/util'], function(util) {
    "use strict";
    var Route, pathToObject, pathToRegexp;
    pathToRegexp = function(path, keys, sensitive, strict) {
      var toKeys;
      if (keys == null) {
        keys = [];
      }
      if (sensitive == null) {
        sensitive = false;
      }
      if (strict == null) {
        strict = false;
      }
      if (path instanceof RegExp) {
        return path;
      }
      toKeys = function(_, slash, format, key, capture, optional) {
        keys.push({
          name: key,
          optional: !!optional
        });
        slash = slash || '';
        return '' + (optional && '' || slash) + '(?:' + (optional && slash || '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
      };
      path = path.concat(strict && '' || '/?').replace(/\/\(/g, '(?:/').replace(/\+/g, '__plus__').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, toKeys).replace(/([\/.])/g, '\\$1').replace(/__plus__/g, '(.+)').replace(/\*/g, '(.*)');
      return new RegExp('^' + path + '$', sensitive && '' || 'i');
    };
    pathToObject = function(url) {
      var argStr, args, attr, data, keys;
      url = String(url);
      argStr = '';
      attr = [];
      if (url.indexOf('?') !== -1) {
        argStr = url.split('?').pop();
      } else if (url.indexOf('&') !== -1) {
        argStr = url;
      }
      if (argStr === '') {
        return {};
      }
      args = argStr.split('&');
      data = {};
      keys = [];
      args.forEach(function(v) {
        var key, value;
        if (v.indexOf('=') === -1) {
          return;
        }
        v = v.split('=');
        if (v.length !== 2) {
          return;
        }
        key = v[0].trim();
        value = v[1];
        if (util.isNumber(value)) {
          value = Number(value);
        } else {
          value = decodeURIComponent(value);
        }
        data[key] = value;
      });
      return data;
    };

    /**
     * 路由
     */
    Route = function(hashchange, sensitive1, strict1) {
      this.hashchange = hashchange != null ? hashchange : Route.changeByLocationHash;
      this.sensitive = sensitive1 != null ? sensitive1 : false;
      this.strict = strict1 != null ? strict1 : false;
      this.rule = [];
    };
    Route.prototype.add = function(path, fn) {
      var keys, reg;
      keys = [];
      reg = pathToRegexp(path, keys, this.sensitive, this.strict);
      this.rule.push({
        path: path,
        reg: reg,
        keys: keys,
        fn: fn
      });
      return this;
    };
    Route.prototype.match = function(url) {
      var argStr, fullPath, getIx, isMatch, path;
      path = String(url);
      fullPath = path;
      argStr = '';
      getIx = path.indexOf('?');
      if (getIx === -1) {
        getIx = path.indexOf('&');
      }
      isMatch = false;
      if (getIx !== -1) {
        argStr = path.substring(getIx);
        path = path.substring(0, getIx);
      }
      util.each(this.rule, function(v) {
        var args, context, data, env, i, j, k, ref, ref1, value;
        if (isMatch) {
          return false;
        }
        ref = v.reg.exec(path);
        if (null === ref) {
          return;
        }
        isMatch = true;
        context = pathToObject(argStr);
        data = {};
        args = [];
        for (i = j = 1, ref1 = ref.length; 1 <= ref1 ? j < ref1 : j > ref1; i = 1 <= ref1 ? ++j : --j) {
          k = v.keys[i - 1];
          value = ref[i];
          if (util.isNumber(value)) {
            value = Number(value);
          } else if (value) {
            value = decodeURIComponent(value);
          }
          if (k && k.name) {
            data[k.name] = value;
          }
          args.push(value || null);
        }
        env = {
          url: fullPath,
          path: path,
          args: argStr,
          rule: v.path,
          context: context,
          keys: v.keys,
          data: data
        };
        v.fn.apply(env, args);
      });
      return this;
    };
    Route.changeByLocationHash = function(emit) {
      var hashChanged;
      hashChanged = function() {
        return emit(window.location.hash.substring(1));
      };
      if (window.addEventListener) {
        return window.addEventListener('hashchange', hashChanged, false);
      } else {
        return window.attachEvent('onhashchange', hashChanged);
      }
    };
    return {
      pathToRegexp: pathToRegexp,
      pathToObject: pathToObject,
      Route: Route
    };
  });

}).call(this);
