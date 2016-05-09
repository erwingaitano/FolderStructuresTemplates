/* eslint prefer-arrow-callback: 0, object-shorthand: 0, no-var: 0 */
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
  return {
    getUrlParameter: function init(param, searchQueryString) {
      var queryString = window.location.search;
      var sPageURL;
      var sURLVariables;
      var i;
      var sParameterName;

      if (searchQueryString) queryString = searchQueryString;

      sPageURL = queryString.substring(1);
      sURLVariables = sPageURL.split('&');

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === param) {
          return sParameterName[1];
        }
      }

      return null;
    }
  };
}));
