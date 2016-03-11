/**
 * Jquery.Tab 1.0
 * Author: Erwin Gaitan Ospino
 *
 * How to use:
 * By default, add the class 'js-tab' to the clickable elements.
 * You must add the 'tab' and 'tab-namespace data attributes.
 * It's optional to add a 'js-tab-arrow' element to do an arrow animation.
 * It will require the same data attributes.
 *
 * For the containers, you should add the 'js-tab-container' class and
 * also the same data attributes should be added.
 *
 * You must add the class 'is-active', to both the clickable and container
 * elements that should be active by default. Note that everytime you
 * click a new tab, the class 'is-active' will be set for this new tab
 * and his corresponding container.
 * 
 * 
 *       nav.tab
 *          %a.tab__item.is-active.js-tab{:'data-tab' => 'content1', :'data-tab-namespace' => 'elements'} 
 *          %a.tab__item.js-tab{:'data-tab' => 'content2', :'data-tab-namespace' => 'elements'} 
 *          %a.tab__item.js-tab{:'data-tab' => 'content3', :'data-tab-namespace' => 'elements'} 
 *         
 *       .tab-container.is-active.js-tab-container{:'data-tab' => 'content1', :'data-tab-namespace' => 'elements'}
 *       .tab-container.js-tab-container{:'data-tab' => 'content2', :'data-tab-namespace' => 'elements'}
 *       .tab-container.js-tab-container{:'data-tab' => 'content3', :'data-tab-namespace' => 'elements'}
 *        
 * 
 */

(function(){
  window.tab = Tab;

  var isInitialized = false;
  var pluginName = 'tab';
  var defaults  = {
    selectors: {
      parent: '.js-body',
      tabs: '.js-tab',
      arrow: '.js-tab-arrow',
      container: '.js-tab-container',
    },
    arrowAnimationDelay: 0
  };

  // Constructor
  function Tab(options){
    this._defaults = defaults;
    this.settings = $.extend({}, this._defaults, options);
    this.init();
    $(window).load(this.init.bind(this));
    return this;
  }

  Tab.prototype = {
    init: function(){
      var $parent = $(this.settings.selectors.parent);
      var _this = this;

      // This is a flag to indicate if an instance was already created.
      // We need to do this since the initialization can be call in two ways:
      // By normal flow execution or the load event or both. So to avoid duplication
      // we opt for do this check.

      if(isInitialized) return true;
      if($parent.length) isInitialized = true;

      // For all the tabs that can be in the document
      this.updateArrows();

      // On click
      $parent.on('click', this.settings.selectors.tabs, function(){
        _this.onClick(this);
      });
    },

    onClick: function(element){
      var _this = this;
      var $element = $(element);
      var namespace = $element.data('tab-namespace');
      var name = $element.data('tab');
      var $containers = belongsToNamespace($(this.settings.selectors.container), namespace);
      var $tabs = belongsToNamespace($(this.settings.selectors.tabs), namespace);
      var $arrow = belongsToNamespace($(this.settings.selectors.arrow), namespace);

      initTab();
      initArrow();

      function initTab(){
        var $currentContainers = filterByClass($containers, 'is-active');
        var $activeContainers = filterByData($containers, 'tab', name);
        var $activeTabs = filterByData($tabs, 'tab', name);
        $tabs.removeClass('is-active');
        $activeTabs.addClass('is-active');

        if($currentContainers.data('tab') != $activeContainers.data('tab')){
          window.setTimeout(function(){
            $activeContainers.addClass('is-active');
            $currentContainers.removeClass('is-active');
            _this.triggerTabChange(namespace, $activeContainers);
          }, 0);
        }
      }

      function initArrow(){
        if($arrow.length){
          var translateX = this.getCssBrowserTranslate($arrow);
          translateX = translateX ? parseFloat(translateX[4]) : 0;
          var offset = ($element.offset().left + $element.outerWidth()/2) - ($arrow.offset().left + $arrow.outerWidth()/2) + translateX;
          $arrow.css(this.cssCrossBrowserTranslate('translateX(' + offset + 'px)'));
        }
      }

      function filterByClass(elements, className){
        return elements.filter(function(){
          return $(this).hasClass(className);
        });
      }
      function filterByData(elements, dataNamespace, comparator){
        return elements.filter(function(i, el){
          return $(el).data(dataNamespace) == comparator;
        });
      }

      function belongsToNamespace(elements, namespace){
        return elements.filter(function(i, el){
          return $(el).data('tab-namespace') == namespace;
        });
      }
    },

    updateArrows: function(){
      var _this = this;
      $(this.settings.selectors.tabs +'.is-active').each(update);

      function update(){
        var $this = $(this);
        var namespace = $this.data('tab-namespace');
        var arrowOffset = 0;
        var $arrow = $(_this.settings.selectors.arrow + '[data-tab-namespace="' + namespace + '"]');

        if($arrow.length){
          var translateX = _this.getCssBrowserTranslate($arrow);
          translateX = translateX ? parseFloat(translateX[4]) : 0;
          arrowOffset = $arrow.offset().left + $arrow.outerWidth()/2;
          var offset = ($this.offset().left + $this.outerWidth()/2) - arrowOffset + translateX;
          $arrow.css(_this.cssCrossBrowserTranslate('translateX(' + offset + 'px)'));
          window.setTimeout(function(){ $arrow.addClass('is-animated');}, _this.settings.arrowAnimationDelay);
        }
      }
    },

    onTabChange: function(tabNamespace, callback){
      $(this).on(tabNamespace, function(e, container){
        callback(container);
      });
    },

    triggerTabChange: function(tabNamespace, container){
      $(this).trigger(tabNamespace, container);
    },

    goToTab: function(tabName, tabNamespace){
      var el = $('<div/>');
      el.data('tab', tabName);
      el.data('tab-namespace', tabNamespace);
      this.onClick(el[0]);
    },

    getCssBrowserTranslate: function(el){
      if($(el).css('transform')){
        return $(el).css('transform').match(/(-?[0-9\.]+)/g);
      }else{
        if($(el).css('webkitTransform')){
          return $(el).css('webkitTransform').match(/(-?[0-9\.]+)/g);
        }
      }
      return false;      
    },

    cssCrossBrowserTranslate: function(value){
      return {
        '-webkit-transform' : value,
        '-moz-transform'    : value,
        '-ms-transform'     : value,
        '-o-transform'      : value,
        'transform'         : value,
      };
    }
  };
})();
