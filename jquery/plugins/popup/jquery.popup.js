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
          popup.removeClass('is-loading');
        }

        function onError(data){
          $container.html(data);
          popup.removeClass('is-loading');
          alert('An error has occurred.');
        }
      };
    },

    openPopup: function(popup) {
      // Check that the popup exists (In angular sometimes the popups haven't been downloaded so we have to make sure they exists)
      if(popup.length){
        this.settings.onBeforeOpen(popup);
        $(this.settings.selectors.popup).removeClass('is-active');
        popup.addClass('is-active');
        this.settings.onOpen(popup);
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

    getActivePopup: function() {
      return $('.js-popup.is-active');
    }
  }

})(jQuery);