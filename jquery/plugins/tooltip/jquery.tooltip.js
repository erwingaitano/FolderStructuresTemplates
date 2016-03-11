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

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'tooltip',
        defaults = {
          // classnames: 'list__tooltip',
          // arrowClassname: 'list__tooltip-arrow',
          scrollableParentSelector: '.js-body',
          arrowJsClassname: 'js-tooltip-arrow',
          // onlyText: false,
          classOnHover: 'is-opened',
          jsClassname: 'js-tooltip-item',
          firstShowClass: 'is-firstshow',
          animationDuration: 300,
          leftPositionNamespace: 'is-left',
          rightPositionNamespace: 'is-right',
          centerPositionNamespace: 'is-center',
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
      init: function() {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element
        // and this.options
        // you can add more functions like the one below and
        // call them like so: this.addText(this.element, this.options).
        var $element = $(this.element);
        var _this = this;

        if(this.options.onlyText) this.addText($element);
        $element.on('mouseenter.' + pluginName, onMouseenter);
        positioning();
        // $element.on('mouseleave.' + pluginName, onMouseleave);

        // NOTE:: If I remove the positioning class, there are css positioning bugs in the animation, so for now I just disabled it
        // function onMouseleave(){
        //   var $tooltip = $element.find('.' + _this.options.jsClassname);
        //   window.setTimeout(function(){
        //     $tooltip.removeClass(_this.options.centerPositionNamespace + ' ' + _this.options.leftPositionNamespace + ' ' + _this.options.rightPositionNamespace);
        //   }, _this.animationDuration)
        // }

        function onMouseenter(){
          positioning();
        }

        function positioning(){
          var $element = $(_this.element),
              elementWidth = $element.outerWidth(),
              elementOffsetLeft = $element.offset().left + parseFloat($element.css('marginLeft')),
              elementOffsetRight = $element.offset().left + elementWidth + parseFloat($element.css('marginRight')),
              parentScrollOnHorizontal = $(_this.options.scrollableParentSelector)[0].scrollLeft;
              $tooltip = $element.find('.' + _this.options.jsClassname),
              tooltipOffsetLeft = $tooltip.offset().left,
              tooltipWidth = $tooltip.outerWidth(),
              $tooltipArrow = $tooltip.find('.' + _this.options.arrowJsClassname),
              isInFromLeft = tooltipWidth/2 < elementOffsetLeft - parentScrollOnHorizontal,
              isInFromRight = (tooltipWidth/2 + elementOffsetRight) < document.body.parentNode.clientWidth + parentScrollOnHorizontal;

          // Remove positioning classes
          $tooltip.removeClass(_this.options.centerPositionNamespace + ' ' + _this.options.leftPositionNamespace + ' ' + _this.options.rightPositionNamespace);

          // If tooltip can be centered
          if(isInFromLeft && isInFromRight) {
            $tooltip.addClass(_this.options.centerPositionNamespace);
            // $tooltip.css('left', (elementWidth - tooltipWidth)/2);
            // $tooltipArrow.css('left', tooltipWidth/2);
          }else if(!isInFromLeft){
            // If is off from the left
            $tooltip.addClass(_this.options.leftPositionNamespace);
            // $tooltipArrow.css('left', elementWidth/2);
            // $tooltip.css('left', 0);
          }else{
            $tooltip.addClass(_this.options.rightPositionNamespace);
            // $tooltip.css({left: 'auto', right: 0}); 
            // $tooltipArrow.css({left: 'auto', right: elementWidth/2});
          }

          // Add the show class
          $element.addClass(_this.options.classOnHover);
        }
      }

      // addText: function(el){
      //   el.append('<p class="' + this.options.classnames + ' ' + this.options.jsClassname + '"><span class="' + this.options.arrowClassname + ' ' + this.options.arrowJsClassname + '"></span>' + el.data('tooltip') + '</p>');
      // },
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );