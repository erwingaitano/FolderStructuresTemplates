/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

  var pluginName = 'toggler';
  window[pluginName] = Plugin;

  // Create the defaults once
  // To initiate the plugin, call it as 'new window[pluginName]' and assign it to a global variable
  var defaults = {
    onBeforeClose: function() {},
    onBeforeOpen: function() {},
    onClose: function() {},
    onOpen: function() {},
    animationDuration: 700,
    selectors: {
      parent: '.js-body',
      togglerBtn: '.js-toggler',
      container: '.js-toggler-container'
    }

  };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var _this = this;
      $(this.options.selectors.parent).on('click', this.options.selectors.togglerBtn, onClick);

      function onClick(event){
        if(event) event.preventDefault();
        var $btn = $(this);
        opener(_this, $btn, $btn.data('toggler'));
      }
    },

    updateSizes: function(options){
      var _this = this;
      options = options || {};
      // TODO:: You should allow also individual container updates
      if(!options.namespace){
        var $activeContainers = $(this.options.selectors.container + '.is-active');
        if(options.isNotAnimated) $activeContainers.addClass('no-animated');
        window.setTimeout(function(){ updateElements($activeContainers);}, 0);
        window.setTimeout(function(){ $activeContainers.removeClass('no-animated');}, _this.options.animationDuration);
      }else{

      }
    },

    toggle: function($btn, togglerNamespace){
      opener(this, $btn, togglerNamespace);
    }
  };

  function opener(context, $btn, namespace){
    $btn.toggleClass('is-active');
    var isActive = $btn.hasClass('is-active');
    var namespace = namespace;
    var $containers = $(context.options.selectors.container);
    var $activeContainers = filterByData($containers, 'toggler', namespace);

    $activeContainers.toggleClass('is-active');
    if(isActive) updateElements($activeContainers);
    else $activeContainers.css('height', 0);
  }

  function updateElements(elements){
    elements.each(function(i, el){
      var $el = $(el);
      var elHeight = calculateSizeOfElement($el).height;
      $el.css('height', elHeight);
    });
  }

  function filterByData(elements, dataNamespace, comparator){
    return elements.filter(function(i, el){
      return $(el).data(dataNamespace) == comparator;
    });
  }

  function calculateSizeOfElement(element){
    var $clone;
    var sizes = {};

    $clone = element.clone().appendTo(element.parent());
    $clone.css({
      position:   'absolute',
      visibility: 'hidden',
      display:    'block',
      height:     'auto'
    });

    sizes.width = $clone.width(); 
    sizes.height = $clone.height();
    $clone.remove();

    return sizes;
  }

})( jQuery, window, document );