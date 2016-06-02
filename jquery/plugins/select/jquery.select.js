/* eslint prefer-arrow-callback: 0, prefer-template: 0, no-var: 0, object-shorthand: 0 */
/* global define */

/* !
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

 /*
  How to use:
    div(style='position: relative;')
      select.select.js-custom-select
        option(disabled, selected, data-placeholder) Select fruit
        option(value="apple") Manzana
        option(value="greenapple") Manzana verde
        option(value="mango") Mango Maduro

    $('.js-custom-select').select();

  To Destroy:
    $('.js-custom-select').data('plugin_select').destroy();

  If $('.js-custom-select') has more than one element, you would have
  to iterate them and destroy them individually:
    $('.js-custom-select').each((i, el) => $(el).data('plugin_select').destroy());

*/

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.

/* eslint prefer-arrow-callback: 0 */
/* global define */

(function init(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  }
}(this, function init($) {
  var pluginName = 'select';
  var $document = $(document);
  var defaults = {
    onChange: function init() {},
    classname: 'select',
    chooserClassname: 'select-item',
    jsChooserClassname: 'js-select',
    containerClassname: 'select-container',
    containerJsClassname: 'js-select-container'
  };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;

    // jQuery has an extend method that merges the
    // contents of two or more objects, storing the
    // result in the first object. The first object
    // is generally empty because we don't want to alter
    // the default options for future instances of the plugin
    this.settings = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      var _this = this;
      var $select = $(this.element);
      var $options = $select.find('option');
      this.$newContainer = $('<div class="' + this.settings.containerClassname +
                            ' ' + this.settings.containerJsClassname + '">'
                           );
      this.$newSelect = $('<div class="' + this.settings.chooserClassname +
                         ' ' + this.settings.jsChooserClassname + '">'
                        );
      this.handleClickOutside = this.handleClickOutside.bind(this);

      function toggleContainerOpenStatus() {
        _this.$newContainer.toggleClass('is-opened');
        _this.$newSelect.toggleClass('is-opened');
      }

      function attachEvents() {
        _this.$newSelect.on('click', toggleContainerOpenStatus);
        _this.$newContainer.on('click', toggleContainerOpenStatus);
        _this.$newContainer.find('.js-' + _this.settings.containerClassname + '-item')
        .on('click', function init() {
          var $el = $(this);
          _this.$newContainer.find('.is-selected').removeClass('is-selected');
          $select.val($el.attr('data-value'));
          $el.addClass('is-selected');
          $select.trigger('change');
        });

        $select.on('change', function init() {
          var $selected = $select.find(':selected');
          const value = $select.val();
          _this.$newSelect.text($selected.text());
          if ($selected.data('placeholder')) _this.$newSelect.addClass('is-placeholder');
          else _this.$newSelect.removeClass('is-placeholder');
          _this.$newSelect.attr('data-value', value);
          _this.settings.onChange(value);
        });
      }

      $document.on('click touchstart', this.handleClickOutside);
      $select.addClass(this.settings.classname);
      $options.each(function init(i, el) {
        var $newOption = $('<div class="' + _this.settings.containerClassname +
                           '__item js-' + _this.settings.containerClassname + '-item">'
                          );
        var $el = $(el);
        var value = $el.val();
        var text = $el.text();
        $newOption.attr('data-value', value);
        $newOption.text(text);

        if ($el.is(':selected')) {
          $newOption.addClass('is-selected');
          if ($el.data('placeholder')) _this.$newSelect.addClass('is-placeholder');
          else _this.$newSelect.removeClass('is-placeholder');

          _this.$newSelect.attr('data-value', value);
          _this.$newSelect.html('<span>' + text + '</span>');
        }
        if ($el.attr('disabled')) {
          $newOption.addClass('is-disabled');
          $newOption.removeClass('js-' + _this.settings.containerClassname + '-item');
        }

        _this.$newContainer.append($newOption);
      });

      // Insert new items in the dom
      $select.after(this.$newContainer);
      $select.after(this.$newSelect);
      attachEvents();
    },

    handleClickOutside: function init(e) {
      if (!$(e.target).closest('.' + this.settings.jsChooserClassname +
          ', .' + this.settings.containerJsClassname + ', ' +
          this.settings.clickOutsideExceptionsElements).length
      ) {
        this.$newContainer.removeClass('is-opened');
        this.$newSelect.removeClass('is-opened');
      }
    },

    destroy: function init() {
      $document.off('click touchstart', this.handleClickOutside);
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function init(options) {
    return this.each(function init() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin(this, options));
      }
    });
  };
}));
