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
  // Namespacing
  var eventListeners = [];
  var pluginName = 'popup';

  var defaults = {
    onBeforeClose: function () { return true; },
    onBeforeOpen: function () { return true; },
    animationDelayOnClose: 600,
    focusInputInside: true,
    container: '.js-popup-tampax',
    popups: '.js-popup',
    closeBtn: '.js-close-popup',
    openBtn: '.js-open-popup'
  };

  // Constructor
  function Popup(options) {
    this._defaults = defaults;
    this.settings = $.extend({}, this._defaults, options);
    this.$container = $(this.settings.container);
    this.$popups = this.$container.find(this.settings.popups);
    this.init();
    return this;
  }

  Popup.prototype = {
    init: function () {
      var _this = this;

      this.$container.off('.' + pluginName);
      this.$container.on('click.' + pluginName + ' touchstart.' + pluginName, onTampaxClick);
      $(this.settings.openBtn).bind('click.' + pluginName, onBtnOpen);
      $(this.settings.closeBtn).bind('click.' + pluginName, this.closePopups.bind(this));

      function onTampaxClick(e) {
        if ($(e.target).closest(_this.$popups).length) return;
        _this.closePopups();
      }

      function onBtnOpen(event) {
        var $popup;
        var $container;
        var ajaxUrl;
        var $this = $(this);
        var popupName = $this.data('popup');

        $popup = _this.$popups.filter(function (i, el) {
          return el.attributes['data-popup'].value === popupName;
        });

        // Check that the popup exists (In angular sometimes the popups haven't
        // been downloaded so we have to make sure they exist)
        ajaxUrl = $this.data('popup-ajax-url');
        if ($popup.length) {
          this.$container.addClass('is-opened');
          if (!ajaxUrl) {
            _this.openPopup($popup, $this, event);
          } else {
            $container = $popup.find('.' + $popup.data('popup-container-class'));
            $popup.addClass('is-loading');
            $container.html('');
            _this.openPopup($popup, $this, event);
            $.get($this.data('popup-ajax-url')).then(onSuccess, onError);
          }
        }

        function onSuccess(data) {
          $container.html(data);
          popup.removeClass('is-loading');
          fireEventListeners('onAjaxSucess', $popup);
        }

        function onError(data) {
          $container.html(data);
          popup.removeClass('is-loading');
          fireEventListeners('onAjaxError', $popup);
        }
      };
    },

    openPopup: function (popup, btn, event) {
      var _this = this;
      popup = typeof popup === 'string' ?
        this.$popups.filter(function (i, el) {
          return el.attributes['data-popup'].value === popup;
        }) : $(popup);

      // Check that the popup exists (In angular sometimes the popups
      // haven't been downloaded so we have to make sure they exists)
      // fix the event.preventdefault when this is executed after a click event
      if (popup.length) {
        if (event && event.stopPropagation) event.stopPropagation();
        this.$container.addClass('is-opened');

        // If onBefore returns false, we don't close the popup
        var shouldOpen = this.settings.onBeforeOpen(popup, btn);
        fireEventListeners('onBeforeOpen', popup, btn);
        if (!shouldOpen) return;

        this.$popups.removeClass('is-active');
        popup.addClass('is-active');
        fireEventListeners('onOpen', popup, btn);
        window.clearTimeout(this.closePopupsTimeout);
        return this.openPopupTimeout = window.setTimeout(function () {
          if (_this.settings.focusInputInside) {
            popup.find('input:first').focus();
          }
        }, 200);
      }
    },

    closePopups: function () {
      var _this = this;
      var activePopup = this.getActivePopup();

      // If onBefore returns false, we don't close the popup
      var shouldClose = this.settings.onBeforeClose(activePopup);
      fireEventListeners('onBeforeClose', activePopup);
      if (!shouldClose) return;

      window.clearTimeout(this.openPopupTimeout);
      this.closePopupsTimeout = window.setTimeout(function () {
        _this.$popups.removeClass('is-active');
      }, this.settings.animationDelayOnClose);
      this.$container.removeClass('is-opened');
      fireEventListeners('onClose', _this.getActivePopup());
    },

    getActivePopup: function () {
      return this.$popups.filter(function (i, el) {
        return $(el).hasClass('is-active');
      });
    },

    addEventListener: function (name, callback) {
      eventListeners.push({ name: name, callback: callback });
    },

    destroy: function () {
      this.$container.off('.' + pluginName + ' touchstart.' + pluginName);
      $(this.settings.openBtn).unbind('click.' + pluginName);
      $(this.settings.closeBtn).unbind('click.' + pluginName);
    }
  };

  function fireEventListeners (name, popup, btn) {
    eventListeners.forEach(function (el) {
      if (el.name === name) el.callback(popup, popup.data('popup'), btn);
    });
  }

  return Popup;
}));
