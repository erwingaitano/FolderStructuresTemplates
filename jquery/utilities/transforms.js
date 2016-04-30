/* eslint prefer-arrow-callback: 0 */
/* global define */

(function init(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals (root is window)
    // If you don't want to export to the window object, you
    // can remove this else statement
    root.moduleExports = factory(root.$);
  }
}(this, function init($) {
  return {
    getElementCssTransform: function init(el) {
      if ($(el).css('transform')) {
        return $(el).css('transform').match(/(-?[0-9\.]+)/g);
      } else if ($(el).css('webkitTransform')) {
        return $(el).css('webkitTransform').match(/(-?[0-9\.]+)/g);
      }

      return null;
    },

    getCssCrossBrowserTransform: function init(value) {
      return {
        '-webkit-transform': value,
        '-moz-transform': value,
        '-ms-transform': value,
        '-o-transform': value,
        transform: value
      };
    }
  };
}));

