/* eslint prefer-arrow-callback: 0, prefer-template: 0, no-var: 0, object-shorthand: 0 */
/* global define */

/*
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.

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
    root.jqueryToggler = factory(root.$);
  }
}(this, function init($) {
  var pluginName = 'toggler';

  // Create the defaults once
  // To initiate the plugin, call it as 'new window[pluginName]' and assign it to a global variable
  var defaults = {
    onBeforeClose: function init() { return true; },
    onBeforeOpen: function init() { return true; },
    onClose: function init() {},
    onOpen: function init() {},
    animationDuration: 700,
    parent: 'js-body',
    containers: '.js-toggler-container',
    togglerBtn: '.js-toggler'
  };

  // The actual plugin constructor

  function Plugin(options) {
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  function filterByData(elements, dataNamespace, comparator) {
    return elements.filter(function init(i, el) {
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

  function updateElements(elements) {
    elements.each(function init(i, el) {
      var $el = $(el);
      var elHeight = calculateSizeOfElement($el).height;
      $el.css('height', elHeight);
    });
  }

  function opener(context, $btn, namespace) {
    var isActive;
    var $containers = context.$parent.find(context.settings.containers);
    var $activeContainers = filterByData($containers, 'toggler', namespace);

    $btn.toggleClass('is-active');
    isActive = $btn.hasClass('is-active');

    $activeContainers.toggleClass('is-active');
    if (isActive) updateElements($activeContainers);
    else $activeContainers.css('height', 0);
  }

  Plugin.prototype = {
    init: function init() {
      var _this = this;

      function onClick(event) {
        var $btn = $(this);
        if (event) event.preventDefault();
        opener(_this, $btn, $btn.data('toggler'));
      }

      if (typeof this.settings.parent === 'string') {
        this.$parent = $('.' + this.settings.parent);
      } else {
        this.$parent = $(this.settings.parent);
      }

      this.$parent.on('click.' + pluginName, this.settings.togglerBtn, onClick);
    },

    updateContainerSizes: function init(options) {
      var _this = this;
      var $activeContainers;
      options = options || {};
      if (!options.namespace) {
        $activeContainers = $(this.settings.containers + '.is-active');
        if (options.isNotAnimated) $activeContainers.addClass('no-animated');

        // Animate elements
        window.setTimeout(function init() { updateElements($activeContainers);}, 0);

        // Remove the no-animated class after the animation if the option.isNotAnimated
        // was true
        window.setTimeout(function init() {
          $activeContainers.removeClass('no-animated');
        }, _this.settings.animationDuration);
      } else {
        // TODO::You should allow also individual container updates
      }
    },

    toggle: function init($btn, togglerNamespace) {
      opener(this, $btn, togglerNamespace);
    },

    destroy: function init() {
      this.$parent.off('.' + this._name);
    }
  };

  return Plugin;
}));
