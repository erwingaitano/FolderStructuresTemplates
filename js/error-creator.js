/* eslint prefer-arrow-callback: 0 */
/* global define */

(function init(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'underscore'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'), require('underscore'));
  } else {
    // Browser globals (root is window)
    // If you don't want to export to the window object, you
    // can remove this else statement
    root.moduleExports = factory(root.$, root._);
  }
}(this, function init($, _) {
  console.log('do something with: ', $, _);

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {};
}));


/* eslint prefer-arrow-callback: 0 */
/* global define */

(function init(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    // If you don't want to export to the window object, you
    // can remove this else statement
    root.moduleExports = factory();
  }
}(this, function define() {
  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {};
}));
