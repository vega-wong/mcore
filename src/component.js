// Generated by CoffeeScript 1.10.0

/**
 * 组件
 * @date 2016-01-23 16:46:42
 * @author vfasky <vfasky@gmail.com>
 * @link http://vfasky.com
 */
'use strict';
var Component, EventEmitter, Template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EventEmitter = require('./eventEmitter');

Template = require('./template');

Component = (function(superClass) {
  extend(Component, superClass);

  function Component(el, virtualEl) {
    this.el = el;
    this.virtualEl = virtualEl;
    this.init();
    this.watch();
  }

  Component.prototype.init = function() {};

  Component.prototype.watch = function() {};

  Component.prototype.render = function(virtualDomDefine, scope) {
    this.virtualDomDefine = virtualDomDefine;
    if (scope == null) {
      scope = {};
    }
    if (!this.template) {
      this.template = new Template();
      this.template._proxy = this;
      this.template.once('rendered', (function(_this) {
        return function(refs1) {
          _this.refs = refs1;
          return _this.mount();
        };
      })(this));
      this.template.on('rendered', (function(_this) {
        return function(refs) {
          return _this.emit('rendered', refs);
        };
      })(this));
    }
    return this.template.render(this.virtualDomDefine, scope, true);
  };

  Component.prototype.mount = function() {
    return this.el.appendChild(this.refs);
  };

  Component.prototype.set = function() {
    if (this.template) {
      return this.template.set.apply(this.template, arguments);
    }
  };

  Component.prototype.get = function() {
    if (this.template) {
      return this.template.get.apply(this.template, arguments);
    }
  };

  Component.prototype.remove = function() {
    if (this.template) {
      return this.template.remove.apply(this.template, arguments);
    }
  };

  Component.prototype.update = function(attrName, value) {
    if (this.get(attrName) !== value) {
      this.set(attrName, value);
      this.emit('update', attrName, value);
      return this.emit('change:' + attrName, value);
    }
  };

  Component.prototype.destroy = function() {
    if (this.template) {
      return this.template.destroy();
    }
  };

  return Component;

})(EventEmitter);

module.exports = Component;
