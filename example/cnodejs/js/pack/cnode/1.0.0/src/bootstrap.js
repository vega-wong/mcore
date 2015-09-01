// Generated by CoffeeScript 1.9.3

/**
 * 启动
 * @module cnode/bootstrap
 * @author vfasky <vfasky@gmail.com>
 */

(function() {
  define('cnode', ['jquery', 'mcore'], function($, mcore) {
    "use strict";
    var init;
    init = false;
    return function(select, loadSelect) {
      var app;
      app = new mcore.App($(select));
      app.route('/topic/:id', 'cnode/topic').route('*', 'cnode/index');
      app.on('runView', function() {
        if (init === false) {
          init = true;
          return $(loadSelect).remove();
        }
      });
      return app.run();
    };
  });

}).call(this);