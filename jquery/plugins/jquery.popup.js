;(function($) {
  // Namespacing
  window.popup = Popup;

  var pluginName = 'popup';
  var defaults = {
    onBeforeClose: function() {},
    onBeforeOpen: function() {},
    onClose: function() {},
    onOpen: function() {},
    animationDelayOnClose: 600,
    selectors: {
      parent: '.js-body',
      popup: '.js-popup',
      tampax: '.js-popup-tampax',
      closeBtn: '.js-close-popup',
      openBtn: '.js-open-popup',
      onPopupTallerClass: 'is-taller',
      onPopupWiderClass: 'is-wider'
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
      $parent.on('click.' + pluginName, onClickoutside);
      $parent.on('click.' + pluginName, this.settings.selectors.openBtn, onBtnOpen);
      $parent.on('click.' + pluginName, this.settings.selectors.closeBtn, this.closePopups.bind(this));
      $(window).resize(this.onResize.bind(this));
      
      function onClickoutside(e){
        if (!$(e.target).closest(_this.settings.selectors.popup + ', ' + _this.settings.selectors.openBtn).length) {
          _this.closePopups();
        }
      };

      function onBtnOpen(){
        var popup, $container, isAjax;;
        var $this = $(this);
        var popupName = $this.data('popup');

        popup = $(_this.settings.selectors.popup).filter(function(i, el) {
          return $(el).data('popup') == popupName;
        });

        // Check that the popup exists (In angular sometimes the popups haven't been downloaded so we have to make sure they exists)
        isAjax = popup.data('popup-ajax');
        if(popup.length){
          $(_this.settings.selectors.tampax).addClass('is-opened');

          if(isAjax != true && isAjax != 'true' && isAjax != 'yes'){
            _this.openPopup(popup);
          }else{
            $container = popup.find('.' + popup.data('popup-container-class'));
            popup.addClass('is-loading');
            _this.openPopup(popup);
            $.get(popup.data('popup-ajax-url')).then(onSuccess, onError);
          }
        }

        function onSuccess(data){
          $container.html(data);
          _this.center(popup);
          popup.removeClass('is-loading');
        }

        function onError(data){
          $container.html(data);
          _this.center(popup);
          popup.removeClass('is-loading');
          alert('An error has occurred.');
        }
      };
    },

    onResize: function(){
      this.center(this.getActivePopup());
    },

    update: function(){
      this.center(this.getActivePopup());
    },

    openPopup: function(popup) {
      // Check that the popup exists (In angular sometimes the popups haven't been downloaded so we have to make sure they exists)
      if(popup.length){
        this.settings.onBeforeOpen(popup);
        $(this.settings.selectors.popup).removeClass('is-active');
        popup.addClass('is-active');
        this.settings.onOpen(popup);
        this.center(popup);
        window.clearTimeout(this.closePopupsTimeout);
        return this.openPopupTimeout = window.setTimeout(function() {
          return popup.find('input:first').focus();
        }, 200);
      }
    },

    closePopups: function() {
      var _this = this;
      _this.settings.onBeforeClose();
      window.clearTimeout(_this.openPopupTimeout);
      _this.closePopupsTimeout = window.setTimeout(function() {
        $(_this.settings.selectors.popup).removeClass('is-active');
      }, _this.settings.animationDelayOnClose);
      $(_this.settings.selectors.tampax).removeClass('is-opened');
      _this.settings.onClose();
    },

    center: function(popup) {
      if (popup && popup.length) {
        // Remove on popup taller/wider classes
        popup.removeClass(this.settings.selectors.onPopupTallerClass + ' ' + this.settings.selectors.onPopupWiderClass);

        var marginHorizontal = parseInt(popup.css('margin-left')) * 2;
        var marginVertical = parseInt(popup.css('margin-top')) * 2;
        var popupWidth = marginHorizontal + popup.outerWidth();
        var popupHeight = marginVertical + popup.outerHeight();
        var leftPosition = (document.body.parentNode.clientWidth - popupWidth) / 2;
        var topPosition = (document.body.parentNode.clientHeight - popupHeight) / 2;

        // If popup is wider than screen
        if (leftPosition < 0) {
          leftPosition = 0;
          popup.addClass(this.settings.selectors.onPopupWiderClass);
        }

        // If popup is taller than screen
        if (topPosition < 0) {
          topPosition = 0;
          popup.addClass(this.settings.selectors.onPopupTallerClass);
        }

        popup.css({
          left: leftPosition,
          top: topPosition
        });
      }
    },

    getActivePopup: function() {
      return $('.js-popup.is-active');
    }
  }

})(jQuery);