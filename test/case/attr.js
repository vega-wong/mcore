// Generated by CoffeeScript 1.9.3

/**
 * 测试属性
 * @module case/attr
 * @author vfasky <vfasky@gmail.com>
 */

(function() {
  define('case/attr', ['jquery', 'mcore/view', 'mcore-attr/validator', 'describe', 'it'], function($, View, validator, describe, it) {
    "use strict";
    return describe('attr test', function() {
      it('validator required', function(done) {
        var $el, ValidatorView, view;
        $el = $('<div />');
        ValidatorView = View.subclass({
          constructor: View.prototype.constructor,
          run: function() {
            this.on('render', (function(_this) {
              return function() {
                return _this.$el.find('form').submit();
              };
            })(this));
            return this.renderString('<form rv-on-submit="self.save" rv-validator>\n    <input name="id" validator="required" />\n</form>');
          },
          save: function(el) {
            var $form, errData, ref;
            $form = $(el);
            ref = $form.data('check')();
            if ($.isFunction(ref)) {
              errData = ref();
              if (errData.err === '不能为空') {
                done();
              }
            }
            return false;
          }
        });
        view = new ValidatorView($el);
        return view.run();
      });
      it('validator isEmail is null pass', function(done) {
        var $el, ValidatorView, view;
        $el = $('<div />');
        ValidatorView = View.subclass({
          constructor: View.prototype.constructor,
          run: function() {
            this.on('render', (function(_this) {
              return function() {
                return _this.$el.find('form').submit();
              };
            })(this));
            return this.renderString('<form rv-on-submit="self.save" rv-validator>\n    <input name="id" value="" validator="isEmail err:emailIsError" />\n</form>');
          },
          save: function(el) {
            var $form, ref;
            $form = $(el);
            ref = $form.data('check')();
            if ($.isFunction(ref) === false) {
              done();
            }
            return false;
          }
        });
        view = new ValidatorView($el);
        return view.run();
      });
      it('validator isEmail', function(done) {
        var $el, ValidatorView, view;
        $el = $('<div />');
        ValidatorView = View.subclass({
          constructor: View.prototype.constructor,
          run: function() {
            this.on('render', (function(_this) {
              return function() {
                return _this.$el.find('form').submit();
              };
            })(this));
            return this.renderString('<form rv-on-submit="self.save" rv-validator>\n    <input name="id" value="1" validator="required | isEmail err:emailIsError" />\n</form>');
          },
          save: function(el) {
            var $form, errData, ref;
            $form = $(el);
            ref = $form.data('check')();
            if ($.isFunction(ref)) {
              errData = ref();
              if (errData.err === 'emailIsError') {
                done();
              }
            }
            return false;
          }
        });
        view = new ValidatorView($el);
        return view.run();
      });
      it('validator isUrl', function(done) {
        var $el, ValidatorView, view;
        $el = $('<div />');
        ValidatorView = View.subclass({
          constructor: View.prototype.constructor,
          run: function() {
            this.on('render', (function(_this) {
              return function() {
                return _this.$el.find('form').submit();
              };
            })(this));
            return this.renderString('<form rv-on-submit="self.save" rv-validator>\n    <input name="id" value="vfasky@gmail.com" validator="required | isEmail " />\n    <input name="url" value="vfasky" validator="required | isUrl " />\n\n</form>');
          },
          save: function(el) {
            var $form, ref;
            $form = $(el);
            ref = $form.data('check')();
            if ($.isFunction(ref)) {
              done();
            }
            return false;
          }
        });
        view = new ValidatorView($el);
        return view.run();
      });
      it('validator min', function(done) {
        var $el, ValidatorView, view;
        $el = $('<div />');
        ValidatorView = View.subclass({
          constructor: View.prototype.constructor,
          run: function() {
            this.on('render', (function(_this) {
              return function() {
                return _this.$el.find('form').submit();
              };
            })(this));
            return this.renderString('<form rv-on-submit="self.save" rv-validator>\n    <input name="id" value="1" validator="required | min 9" />\n\n</form>');
          },
          save: function(el) {
            var $form, ref;
            $form = $(el);
            ref = $form.data('check')();
            if (ref().err === '数值要大于 9') {
              done();
            }
            return false;
          }
        });
        view = new ValidatorView($el);
        return view.run();
      });
      return it('validator pass', function(done) {
        var $el, ValidatorView, view;
        $el = $('<div />');
        ValidatorView = View.subclass({
          constructor: View.prototype.constructor,
          run: function() {
            this.on('render', (function(_this) {
              return function() {
                return _this.$el.find('form').submit();
              };
            })(this));
            return this.renderString('<form rv-on-submit="self.save" rv-validator>\n    <input name="id" value="vfasky@gmail.com" validator="required | isEmail " />\n    <input name="url" value="http://vfasky.com" validator="required | isUrl " />\n\n</form>');
          },
          save: function(el) {
            var $form, ref;
            $form = $(el);
            ref = $form.data('check')();
            if (ref.id === 'vfasky@gmail.com') {
              done();
            }
            return false;
          }
        });
        view = new ValidatorView($el);
        return view.run();
      });
    });
  });

}).call(this);