/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

 /* 
  How to use:
    Just call $('select').select();
*/

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;
(function($, window, document, undefined) {

  var clickOutsideViewer;
  // window and document are passed through as local
  // variables rather than as globals, because this (slightly)
  // quickens the resolution process and can be more
  // efficiently minified (especially when both are
  // regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'select',
    defaults = {
      parent: 'js-body',
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
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var _this = this;
      var $select = $(this.element);
      var $options = $select.find('option');
      var $newContainer = $('<div class="' + this.options.containerClassname + ' ' + this.options.containerJsClassname + '">')
      var $newSelect = $('<div class="' + this.options.chooserClassname + ' ' + this.options.jsChooserClassname + '">');

      $select.addClass(this.options.classname);
      if(!clickOutsideViewer){
        $('.' + this.options.parent).on('click.' + pluginName + ' touchstart.' + pluginName, onClickoutside);
        clickOutsideViewer = true;
      }

      $options.each(function(i, el) {
        var $newOption = $('<div class="' + _this.options.containerClassname + '__item js-' + _this.options.containerClassname + '-item">');
        var $el = $(el);
        var value = $el.val();
        var text = $el.text();
        $newOption.attr('data-value', value);
        $newOption.text(text);

        if($el.is(':selected')) {
          $newOption.addClass('is-selected');
          $newSelect.attr('data-value', value);
          $newSelect.text(text);
        }
        if ($el.attr('disabled')){
          $newOption.addClass('is-disabled');
          $newOption.removeClass('js-' + _this.options.containerClassname + '-item');
        }

        $newContainer.append($newOption);
      });

      // Insert new items in the dom
      $select.after($newContainer);
      $select.after($newSelect);
      attachEvents();

      function attachEvents(){
        $newSelect.on('click', toggleContainerOpenStatus);

        $newContainer.on('click', toggleContainerOpenStatus);
        $newContainer.find('.js-' + _this.options.containerClassname + '-item').on('click', function(){
          var $el = $(this);
          $newContainer.find('.is-selected').removeClass('is-selected');
          $select.val($el.attr('data-value'));
          $el.addClass('is-selected');
          $select.trigger('change');
        });

        $select.on('change', function(){
          $newSelect.text($select.find(':selected').text());
          $newSelect.attr('data-value', $select.val());
        });

        function toggleContainerOpenStatus(){
          $newContainer.toggleClass('is-opened');
          $newSelect.toggleClass('is-opened');
        }
      }

      function onClickoutside(e){
        if (!$(e.target).closest('.' + _this.options.jsChooserClassname + ', .' + _this.options.containerJsClassname + ', ' + _this.options.clickOutsideExceptionsElements).length) {
          $newContainer.removeClass('is-opened');
          $newSelect.removeClass('is-opened');
        }
      };
    },

    yourOtherFunction: function(el, options) {
      // some logic
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
