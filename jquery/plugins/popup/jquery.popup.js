/* 
  Init the popup plugin:
    You should assing the plugin to a global namespace different from popup and it should be initialize only once. Example:
    
    window.popupManager = window.popupManager || new window.popup();

  How to use:
    Basic:
      .popup-tampax.js-popup-tampax
        .popup.js-popup{:'data-popup' => 'my-popup'}
          %a.js-close-popup x

      Link that calls the popup:
      %a.js-open-popup{:'data-popup' => 'my-popup'} Open Popup

    Ajax:
      .popup-tampax.js-popup-tampax
        .popup.js-popup{:'data-popup' => 'my-ajaxpopup', :'data-popup-container-class' => 'js-popup-data'}
          %a.js-close-popup x
          .js-popup-data
      
      Link that calls the popup:
      %a.js-open-popup{:'data-popup' => 'my-ajaxpopup', :'data-popup-ajax-url' => '/privacy_ajax'} Open Popup

  NOTES::
    IT must always be 1 container (.popup-tampax) to contain all the popups. Example:

    This is OK:
      .popup-tampax.js-popup-tampax
        .popup.js-popup{:'data-popup' => 'my-popup'}
          %a.js-close-popup x
        .popup.js-popup{:'data-popup' => 'my-popup2'}
          %a.js-close-popup x
        .popup.js-popup{:'data-popup' => 'my-popup3'}
          %a.js-close-popup x

    This is NOT OK:
      .popup-tampax.js-popup-tampax
        .popup.js-popup{:'data-popup' => 'my-popup'}
          %a.js-close-popup x

      .popup-tampax.js-popup-tampax
        .popup.js-popup{:'data-popup' => 'my-popup2'}
          %a.js-close-popup x

      .popup-tampax.js-popup-tampax
        .popup.js-popup{:'data-popup' => 'my-popup3'}
          %a.js-close-popup x

*/

;(function($) {
  // Namespacing
  var pluginName = 'popup';

  window[pluginName] = Popup;
  var eventListeners = [];

  var defaults = {
    onBeforeClose: function() {},
    onBeforeOpen: function() {},
    onClose: function() {},
    onOpen: function() {},
    animationDelayOnClose: 600,
    focusInputInside: true,
    selectors: {
      parent: '.js-body',
      popup: '.js-popup',
      tampax: '.js-popup-tampax',
      closeBtn: '.js-close-popup',
      openBtn: '.js-open-popup',
      clickOutsideExceptionsElements: '.js-global-loading', // String comma separated
    }
  };

  // Constructor
  function Popup(options) {
    this._defaults = defaults;
    this.settings = $.extend({}, this._defaults, options);
    this.init($(this.settings.selectors.parent));
    return this;
  };

  Popup.prototype = {
    init: function($parent){
      var _this = this;

      $parent.off('.' + pluginName);
      $parent.on('click.' + pluginName + ' touchstart.' + pluginName, onClickoutside);
      $parent.on('click.' + pluginName, this.settings.selectors.openBtn, onBtnOpen);
      $parent.on('click.' + pluginName, this.settings.selectors.closeBtn, this.closePopups.bind(this));
      
      function onClickoutside(e){
        if (!$(e.target).closest(_this.settings.selectors.popup + ', ' + _this.settings.selectors.openBtn + ', ' + _this.settings.selectors.clickOutsideExceptionsElements).length) {
          _this.closePopups();
        }
      };

      function onBtnOpen(event){
        var popup, $container, ajaxUrl;
        var $this = $(this);
        var popupName = $this.data('popup');

        popup = $(_this.settings.selectors.popup).filter(function(i, el) {
          return $(el).data('popup') == popupName;
        });

        // Check that the popup exists (In angular sometimes the popups haven't been downloaded so we have to make sure they exists)
        ajaxUrl = $this.data('popup-ajax-url');
        if(popup.length){
          $(_this.settings.selectors.tampax).addClass('is-opened');
          if(!ajaxUrl){
            _this.openPopup(popup, $this, event);
          }else{
            $container = popup.find('.' + popup.data('popup-container-class'));
            popup.addClass('is-loading');
            $container.html('');
            _this.openPopup(popup, $this, event);
            $.get($this.data('popup-ajax-url')).then(onSuccess, onError);
          }
        }

        function onSuccess(data){
          $container.html(data);
          popup.removeClass('is-loading');
        }

        function onError(data){
          $container.html(data);
          popup.removeClass('is-loading');
          alert('An error has occurred.');
        }
      };
    },

    openPopup: function(popup, btn, event) {
      // Check that the popup exists (In angular sometimes the popups haven't been downloaded so we have to make sure they exists)
      // fix the event.preventdefault when this is executed after a click event
      var _this = this;
      if(popup.length){
        if(event && event.stopPropagation) event.stopPropagation();
        $(this.settings.selectors.tampax).addClass('is-opened');
        this.settings.onBeforeOpen(popup, btn);
        fireEventListeners('onBeforeOpen', popup, btn);
        $(this.settings.selectors.popup).removeClass('is-active');
        popup.addClass('is-active');
        this.settings.onOpen(popup, btn);
        fireEventListeners('onOpen', popup, btn);
        window.clearTimeout(this.closePopupsTimeout);
        return this.openPopupTimeout = window.setTimeout(function() {
          if(_this.settings.focusInputInside){
            popup.find('input:first').focus();
          }
        }, 200);
      }
    },

    closePopups: function() {
      var _this = this;
      _this.settings.onBeforeClose();
      fireEventListeners('onBeforeClose', _this.getActivePopup());
      window.clearTimeout(_this.openPopupTimeout);
      _this.closePopupsTimeout = window.setTimeout(function() {
        $(_this.settings.selectors.popup).removeClass('is-active');
      }, _this.settings.animationDelayOnClose);
      $(_this.settings.selectors.tampax).removeClass('is-opened');
      _this.settings.onClose();
      fireEventListeners('onClose', _this.getActivePopup());
    },

    getActivePopup: function() {
      return $('.js-popup.is-active');
    },

    addEventListener: function(name, callback){
      eventListeners.push({name: name, callback: callback});
    }
  }

  function fireEventListeners(name, popup, btn){
    eventListeners.forEach(function(el, i){
      if(el.name == name) el.callback(popup, popup.data('popup'), btn);
    });
  }
})(jQuery);