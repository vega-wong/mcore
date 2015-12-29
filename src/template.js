// Generated by CoffeeScript 1.10.0

/**
 * 模板
 * @module mcore/template
 * @author vfasky <vfasky@gmail.com>
 */
"use strict";
var $, Stapes, Template, config, exports, rivets, util,
  slice = [].slice;

$ = require('jquery');

rivets = require('rivets');

Stapes = require('stapes');

util = require('./util');

config = require('./config')();

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
  rootInterface: '.',
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
  if (false === Array.isArray(value)) {
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

rivets.formatters['%'] = function() {
  var args, len, str;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  len = args.length;
  if (len > 1 && String(args[0]).indexOf('%') === -1 && String(args[len - 1]).indexOf('%') !== -1) {
    str = args.pop();
    args.splice(0, 0, str);
  }
  return util.format.apply(this, args);
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

rivets.formatters['in'] = function() {
  var args, value;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  if (args.length < 2) {
    return false;
  }
  value = args[0];
  args.splice(0, 1);
  return args.indexOf(value) !== -1;
};

rivets.formatters['script'] = function() {
  var args, code, context, error, error1, error2, fn, keys, values;
  code = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  if (!code || args.length === 0) {
    return null;
  }
  code = String(code);
  code = code.replace(/\sor\s/g, ' || ').replace(/\sand\s/g, ' && ').replace(/\sthen\s/g, ' { \n').replace(/\send\s/g, ' } \n');
  if (code.indexOf('return') === -1) {
    code = 'return ' + code;
  }
  if (args.length === 1) {
    context = args[0];
    fn = new Function('self', code);
    try {
      return fn(context);
    } catch (error1) {
      error = error1;
    }
  } else {
    keys = [];
    values = [];
    args.forEach(function(v, k) {
      if (k % 2 === 0) {
        return keys.push(v);
      } else {
        return values.push(v);
      }
    });
    keys.push(code);
    fn = Function.apply(null, keys);
    try {
      return fn.apply(null, values);
    } catch (error2) {
      error = error2;
      console.log(error);
    }
  }
  return null;
};

rivets.formatters['firstUpperCase'] = function(x) {
  if (!x) {
    return '';
  }
  return String(x).replace(/^\S/, function(s) {
    return s.toUpperCase();
  });
};

rivets.formatters['upperCase'] = function(x) {
  if (!x) {
    return '';
  }
  return String(x).toUpperCase();
};

rivets.formatters['arrayAddIx'] = function(arr, ixName) {
  if (arr == null) {
    arr = [];
  }
  if (ixName == null) {
    ixName = 'ix';
  }
  if (arr != null) {
    arr.forEach(function(v, k) {
      return v[ixName] = k;
    });
  }
  return arr;
};

rivets.formatters['param'] = function(obj) {
  if (obj == null) {
    obj = {};
  }
  return $.param(obj);
};

rivets.formatters['toString'] = function(x) {
  if (x == null) {
    x = '';
  }
  return String(x);
};

rivets.formatters['toNumber'] = function(x) {
  if (util.isNumber(x)) {
    return Number(x);
  }
  return 0;
};


/**
 * 模板渲染
 * @param {Object} view
 * @param {jQuery} view.$el
 * @param {Function} view.set
 * @param {Object} data
 */

Template = function(view, data1) {
  this.view = view;
  this.data = data1 != null ? data1 : {};
  this.rv = false;
};

Template.prototype.init = function() {
  var data, dtd, keys, rv;
  data = this.data;
  keys = Object.keys(data);
  dtd = $.Deferred();
  if (keys.length === 0) {
    rv = rivets.bind(this.view.$el, {
      self: this.view
    });
    this.rv = rv;
    dtd.resolve(rv);
  } else {
    Template.loadPromise(data).done((function(_this) {
      return function(vData) {
        keys.forEach(function(k) {
          var v;
          v = vData[k];
          if (v != null) {
            return _this.view.set(k, v);
          }
        });
        rv = rivets.bind(_this.view.$el, {
          self: _this.view
        });
        _this.rv = rv;
        dtd.resolve(rv);
      };
    })(this)).fail(function() {
      return dtd.reject('template render error');
    });
  }
  return dtd.promise();
};

Template.prototype.set = function(key, promise) {
  return promise.then((function(_this) {
    return function(val) {
      return _this.view.set(key, val);
    };
  })(this));
};

Template.prototype.update = function(data) {
  var dtd, keys;
  if (data == null) {
    data = {};
  }
  dtd = $.Deferred();
  if (false === this.rv) {
    dtd.reject('Template no init');
  } else {
    keys = Object.keys(data);
    Template.loadPromise(data).done((function(_this) {
      return function(vData) {
        var newData;
        newData = {};
        keys.forEach(function(k) {
          var v;
          v = vData[k];
          if (v != null) {
            return newData[k] = v;
          }
        });
        _this.view.set(newData);
        dtd.resolve(vData);
      };
    })(this)).fail(function() {
      return dtd.reject('template update error');
    });
  }
  return dtd.promise();
};

Template.prototype.destroy = function() {
  if (this.rv) {
    return this.rv.unbind();
  }
};

Template.loadPromise = function(data) {
  var dtd, keys, promises;
  dtd = $.Deferred();
  keys = Object.keys(data);
  if (keys.length === 0) {
    dtd.resolve({});
  } else {
    promises = [];
    keys.forEach((function(_this) {
      return function(v) {
        return promises.push(data[v]);
      };
    })(this));
    $.when.apply(null, promises).done(function() {
      var args, vData;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      vData = {};
      args.forEach((function(_this) {
        return function(v, k) {
          var key;
          key = keys[k];
          if (key) {
            if (Array.isArray(v) && v.length === 3 && v[2].promise) {
              v = v[0];
            }
            return vData[key] = v;
          }
        };
      })(this));
      return dtd.resolve(vData);
    }).fail(function(err) {
      console.log(err);
      return dtd.reject(err);
    });
  }
  return dtd.promise();
};


/**
 * 加载amd规范的模板，
 * 包名必须为 tpl/ 前缀
 */

Template.loadTpl = function(uri) {
  var dtd, info;
  dtd = $.Deferred();
  info = String(uri).split('/');
  if (info.length === 2) {
    config.AMDLoader(["tpl/" + info[0]], function(tpl) {
      var html;
      html = tpl[info[1]];
      if (html) {
        return dtd.resolve(html);
      } else {
        return dtd.reject('url data map error');
      }
    });
  } else {
    dtd.reject('uri error: ' + uri);
  }
  return dtd.promise();
};

Template.bind = function(data, model) {
  if (data == null) {
    data = {};
  }
  model.tpl = new Template(model, data);
  return model.tpl.init().then(function() {
    model.emit('render');
    return model.tpl;
  });
};

Template.renderString = function(html, data, model) {
  var defTplVal, keys;
  if (data == null) {
    data = {};
  }
  keys = Object.keys(data);
  if (keys.length > 0 && !model.tpl) {
    defTplVal = {};
    keys.forEach((function(_this) {
      return function(k) {
        return defTplVal[k] = {};
      };
    })(this));
    model.set(defTplVal);
  }
  if (model.tpl) {
    model.emit('tplBeforeUpdate');
    return model.tpl.update(data).then(function() {
      model.emit('tplUpdate');
      return model.tpl;
    });
  } else {
    model.$el.hide().append(html);
    model.emit('beforeRender');
    return Template.bind(data, model).then(function(res) {
      model.$el.show();
      return res;
    });
  }
};

Template.render = function(uri, data, model) {
  if (data == null) {
    data = {};
  }
  return Template.loadTpl(uri).then(function(html) {
    return Template.renderString(html, data, model);
  });
};

Template.formatters = function(name, fun) {
  return rivets.formatters[name] = fun;
};

Template.Attr = Stapes.subclass({
  constructor: function(name1, rv1, el1) {
    this.name = name1;
    this.rv = rv1;
    this.el = el1;
    this.$el = $(this.el);
    this.init(this.el);
    return this.watch();
  },
  sync: function(value) {
    if (this.rv.observer && this.rv.observer.setValue) {
      return this.rv.observer.setValue(value);
    }
  },
  asyncSet: function(key, promise) {
    return promise.then((function(_this) {
      return function(val) {
        _this.set(key, val);
        return val;
      };
    })(this));
  },
  init: function(el) {},
  update: function(value, el) {},
  destroy: function(el) {},
  watch: function() {}
});

Template.regAttr = function(name, Attr) {
  return rivets.binders[name] = {
    bind: function(el) {
      var $el, attr;
      $el = $(el);
      attr = new Attr(name, this, el);
      return $el.data('__mcore_attr', attr);
    },
    unbind: function(el) {
      var $el, attr;
      $el = $(el);
      attr = $el.data('__mcore_attr');
      return attr.destroy(el);
    },
    routine: function(el, value) {
      var $el, attr;
      $el = $(el);
      attr = $el.data('__mcore_attr');
      return attr.update(value, el);
    }
  };
};

Template.regTag = function(name, options) {
  if (options == null) {
    options = {};
  }
  return rivets.components[name] = {
    "static": options["static"] || [],
    attributes: options.attr || [],
    template: options.template || function() {
      return '';
    },
    initialize: options.init || function() {}
  };
};

exports = module.exports = Template;
