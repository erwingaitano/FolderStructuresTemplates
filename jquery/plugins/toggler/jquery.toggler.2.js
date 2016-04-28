/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.

// Uses CommonJS, AMD or browser globals to create a jQuery plugin.

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function( root, jQuery ) {
      if ( jQuery === undefined ) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if ( typeof window !== 'undefined' ) {
            jQuery = require('jquery');
        }
        else {
            jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  var pluginName = 'toggler';

  // Create the defaults once
  // To initiate the plugin, call it as 'new window[pluginName]' and assign it to a global variable
  var defaults = {
    onBeforeClose: function () { return true; },
    onBeforeOpen: function () { return true; },
    onClose: function () {},
    onOpen: function () {},
    animationDuration: 700,
    parent: 'js-body',
    containerClass: '.js-toggler-container',
    togglerBtnClass: '.js-toggler'
  };

  // The actual plugin constructor
  function Plugin(options) {
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var _this = this;

      if (typeof this.settings.parent === 'string') {
        this.$parent = $('.' + this.settings.parent);
      } else {
        this.$parent = $(this.settings.parent);
      }

      this.$parent.on('click.' + pluginName, this.settings.togglerBtnClass, onClick);

      function onClick(event) {
        var $btn = $(this);
        if (event) event.preventDefault();
        opener(_this, $btn, $btn.data('toggler'), $btn.data('toggler-namespace'));
      }
    },

    updateContainerSizes: function (options) {
      var _this = this;
      var $activeContainers;
      options = options || {};
      if (!options.namespace) {
        $activeContainers = this.$parent.find(this.settings.containerClass + '.is-active');
        if (options.isNotAnimated) $activeContainers.addClass('no-animated');

        // Animate elements
        window.setTimeout(function () { updateElementsHeight($activeContainers);}, 0);

        // Remove the no-animated class after the animation if the option.isNotAnimated
        // was true
        window.setTimeout(function () {
          $activeContainers.removeClass('no-animated');
        }, _this.settings.animationDuration);
      } else {
        // TODO::You should allow also individual container updates
      }
    },

    toggle: function ($btn, toggler, togglerNamespace) {
      opener(this, $btn, toggler, togglerNamespace);
    },

    destroy: function () {
      this.$parent.off('.' + this._name);
    }
  };

  function opener(context, $btn, toggler, togglerNamespace) {
    var isActive;
    var $containers = context.$parent.find(context.settings.containerClass);
    var $btns = context.$parent.find(context.settings.togglerBtnClass);
    var $activeContainers = filterByData($containers, 'toggler', toggler);
    var $sameNamespaceContainers = filterByData($containers, 'toggler-namespace', togglerNamespace);
    var $sameNamespaceBtns = filterByData($btns, 'toggler-namespace', togglerNamespace);

    $sameNamespaceContainers.removeClass('is-active');
    $sameNamespaceContainers.css('height', 0);
    $sameNamespaceBtns.removeClass('is-active');
    $btn.toggleClass('is-active');
    isActive = $btn.hasClass('is-active');

    $activeContainers.toggleClass('is-active');
    if (isActive) updateElementsHeight($activeContainers);
    else $activeContainers.css('height', 0);
  }

  function updateElementsHeight(elements) {
    elements.each(function (i, el) {
      var $el = $(el);
      var elHeight = calculateSizeOfElement($el).height;
      $el.css('height', elHeight);
    });
  }

  function filterByData(elements, dataNamespace, comparator) {
    return elements.filter(function (i, el) {
      return $(el).data(dataNamespace) === comparator;
    });
  }

  function calculateSizeOfElement(element) {
    var $clone;
    var sizes = {};

    $clone = element.clone().appendTo(element.parent());
    $clone.css({
      position: 'absolute',
      visibility: 'hidden',
      display: 'block',
      height: 'auto'
    });

    sizes.width = $clone.width();
    sizes.height = $clone.height();
    $clone.remove();

    return sizes;
  }

  return Plugin;
}));
