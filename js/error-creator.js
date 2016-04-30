/* eslint prefer-arrow-callback: 0 */
/* global define */

/* eslint prefer-arrow-callback: 0 */
/* global define */

(function init(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node, CommonJS-like
    module.exports = factory();
  }
}(this, function define() {
  /**
   * To create a custom error, you should call:
   *    const MyError = errorCreator('MyError');`
   * Now you can normally create custom errors:
   *    const err = new MyError('error', { info: 'you da man' });
   * Note that you can actually pass an object with additional data!
   *
   * @param  {string}   titleCasedName  titlecased name of your custom error. Eg 'MyError'
   * @return {function} creator         The constructor for your custom error
   */
  return function errorCreator(titleCasedName) {
    function creator(message, data) {
      this.name = titleCasedName;
      this.message = message;
      this.data = data || {};
      Error.captureStackTrace(this, creator);
    }

    creator.prototype = Object.create(Error.prototype);
    creator.prototype.constructor = creator;

    return creator;
  };
}));
