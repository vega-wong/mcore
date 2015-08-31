// Generated by CoffeeScript 1.9.3

/**
 * ui
 * @module mcore/ui
 * @author vfasky <vfasky@gmail.com>
 */

(function() {
  define('mcore/ui', ['jquery', 'mcore/template', 'stapes'], function($, Template, stapes) {
    "use strict";
    return stapes.subclass({
      constructor: function($el, options) {
        this.options = options != null ? options : {};
        this.$el = $('<div/>');
        this.$parent = $el;
        this.on('render', (function(_this) {
          return function() {
            return _this.$el.appendTo(_this.$parent);
          };
        })(this));
        this.init();
        return this.watch();
      },
      destroy: function() {
        if (this.tpl) {
          this.tpl.destroy();
        }
        return this.$el.remove();
      },
      render: function(uri, data) {
        if (data == null) {
          data = {};
        }
        return Template.render(uri, data, this);
      },
      renderString: function(html, data) {
        if (data == null) {
          data = {};
        }
        return Template.renderString(html, data, this);
      },
      init: function() {},
      watch: function() {}
    });
  });

}).call(this);
