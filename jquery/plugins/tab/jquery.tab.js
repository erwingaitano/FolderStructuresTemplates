/**
 * Jquery.Tab 1.0
 * Author: Erwin Gaitan Ospino
 *
 * How to use:
 * By default, add the class 'js-tab' to the clickable elements.
 * You must add the 'tab' and 'tab-namespace data attributes.
 *
 * For the containers, you should add the 'js-tab-container' class and
 * also the same data attributes should be added.
 *
 * You must add the class 'is-active', to both the clickable and container
 * elements that should be active by default. Note that everytime you
 * click a new tab, the class 'is-active' will be set for this new tab
 * and his corresponding container.
 */

//////////////////////
// Jade/Pug Example //
//////////////////////

// nav.tab.has-3
//   a.tab__item.is-active.js-tab(data-tab='content1', data-tab-namespace='elements') tab1
//   a.tab__item.js-tab(data-tab='content2', data-tab-namespace='elements') tab2
//   a.tab__item.js-tab(data-tab='content3', data-tab-namespace='elements') tab3
//
// .tab-container.is-active.js-tab-container(data-tab='content1', data-tab-namespace='elements')
// .tab-container.js-tab-container(data-tab='content2', data-tab-namespace='elements')
// .tab-container.js-tab-container(data-tab='content3', data-tab-namespace='elements')

////////////////
// Definition //
////////////////

// Uses CommonJS, AMD or browser globals to create a jQuery plugin.

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS. Dependencies
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
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
  var pluginName = 'tab';
  var defaults = {
    parent: '.js-body',
    tabClass: '.js-tab',
    containerClass: '.js-tab-container'
  };

  function Tab(options) {
    this.settings = $.extend({}, defaults, options);
    this.$parent = $(this.settings.parent);
    this.init();

    return this;
  }

  function filterByClass(elements, className) {
    return elements.filter(function () {
      return $(this).hasClass(className);
    });
  }

  function filterByData(elements, dataNamespace, comparator) {
    return elements.filter(function (i, el) {
      return $(el).data(dataNamespace) === comparator;
    });
  }

  function belongsToNamespace(elements, namespace) {
    return elements.filter(function (i, el) {
      return $(el).data('tab-namespace') === namespace;
    });
  }

  function setActiveContainer(pluginContext, tabName, namespace) {
    var $containers = pluginContext.$parent.find(pluginContext.settings.containerClass);
    $containers = belongsToNamespace($containers, namespace);
    var $currentActiveContainers = filterByClass($containers, 'is-active');
    var $nextActiveContainers = filterByData($containers, 'tab', tabName);

    var $tabs = pluginContext.$parent.find(pluginContext.settings.tabClass);
    $tabs = belongsToNamespace($tabs, namespace);

    var $activeTabs = filterByData($tabs, 'tab', tabName);
    $tabs.removeClass('is-active');
    $activeTabs.addClass('is-active');

    if ($currentActiveContainers.data('tab') !== $nextActiveContainers.data('tab')) {
      window.setTimeout(function () {
        $nextActiveContainers.addClass('is-active');
        $currentActiveContainers.removeClass('is-active');
        pluginContext.triggerTabChange(namespace, $nextActiveContainers);
      }, 0);
    }
  }

  Tab.prototype = {
    init: function () {
      function onClick(event) {
        var $element = $(event.currentTarget);
        var namespace = $element.data('tab-namespace');
        var tabName = $element.data('tab');

        setActiveContainer(this, tabName, namespace);
      }

      this.$parent.on('click.jqueryPlugin' + pluginName, this.settings.tabClass, onClick.bind(this));
    },


    onTabChange: function (tabNamespace, callback) {
      $(this).on(tabNamespace, function (e, container) {
        callback(container);
      });
    },

    triggerTabChange: function (tabNamespace, container) {
      $(this).trigger(tabNamespace, container);
    },

    goToTab: function (tabName, tabNamespace) {
      setActiveContainer(this, tabName, tabNamespace);
    },

    getCssBrowserTranslate: function (el) {
      if ($(el).css('transform')) {
        return $(el).css('transform').match(/(-?[0-9\.]+)/g);
      } else {
        if ($(el).css('webkitTransform')) {
          return $(el).css('webkitTransform').match(/(-?[0-9\.]+)/g);
        }
      }
      return false;
    },

    cssCrossBrowserTranslate: function (value) {
      return {
        '-webkit-transform': value,
        '-moz-transform': value,
        '-ms-transform': value,
        '-o-transform': value,
        'transform': value,
      };
    },

    destroy: function() {
      this.$parent.off('click.jqueryPlugin' + pluginName);
    }

    // TODO: Remove functions from the prototypes if no needed
  };

  return Tab;
}));
