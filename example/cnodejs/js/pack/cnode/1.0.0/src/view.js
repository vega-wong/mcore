// Generated by CoffeeScript 1.9.3

/**
 * 
 * @module cnode/view
 * @author vfasky <vfasky@gmail.com>
 */

(function() {
  define('cnode/view', ['jquery', 'mcore', 'cnode/api'], function($, mcore, api) {
    "use strict";
    return mcore.View.subclass({
      constructor: mcore.View.prototype.constructor,
      beforeInit: function() {
        return this.api = api;
      }
    });
  });

}).call(this);
