/* eslint prefer-arrow-callback: 0, prefer-template: 0, no-var: 0, object-shorthand: 0 */
/* global define */

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
    root.jqueryTab = factory(root.$);
  }
}(this, function init($) {
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
    return elements.filter(function init() {
      return $(this).hasClass(className);
    });
  }

  function filterByData(elements, dataNamespace, comparator) {
    return elements.filter(function init(i, el) {
      return $(el).data(dataNamespace) === comparator;
    });
  }

  function belongsToNamespace(elements, namespace) {
    return elements.filter(function init(i, el) {
      return $(el).data('tab-namespace') === namespace;
    });
  }

  function setActiveContainer(pluginContext, tabName, namespace) {
    var $containers = pluginContext.$parent.find(pluginContext.settings.containerClass);
    var $currentActiveContainers;
    var $nextActiveContainers;
    var $tabs;
    var $activeTabs;

    $containers = belongsToNamespace($containers, namespace);
    $currentActiveContainers = filterByClass($containers, 'is-active');
    $nextActiveContainers = filterByData($containers, 'tab', tabName);

    $tabs = pluginContext.$parent.find(pluginContext.settings.tabClass);
    $tabs = belongsToNamespace($tabs, namespace);

    $activeTabs = filterByData($tabs, 'tab', tabName);
    $tabs.removeClass('is-active');
    $activeTabs.addClass('is-active');

    if ($currentActiveContainers.data('tab') !== $nextActiveContainers.data('tab')) {
      window.setTimeout(function init() {
        $nextActiveContainers.addClass('is-active');
        $currentActiveContainers.removeClass('is-active');
        pluginContext.triggerTabChange(namespace, $nextActiveContainers);
      }, 0);
    }
  }

  Tab.prototype = {
    init: function init() {
      function onClick(event) {
        var $element = $(event.currentTarget);
        var namespace = $element.data('tab-namespace');
        var tabName = $element.data('tab');

        setActiveContainer(this, tabName, namespace);
      }

      this.$parent.on('click.jqueryPlugin' + pluginName, this.settings.tabClass,
                      onClick.bind(this));
    },

    onTabChange: function init(tabNamespace, callback) {
      $(this).on(tabNamespace, function init(e, container) {
        callback(container);
      });
    },

    triggerTabChange: function init(tabNamespace, container) {
      $(this).trigger(tabNamespace, container);
    },

    goToTab: function init(tabName, tabNamespace) {
      setActiveContainer(this, tabName, tabNamespace);
    },

    destroy: function init() {
      this.$parent.off('click.jqueryPlugin' + pluginName);
    }
  };

  return Tab;
}));
