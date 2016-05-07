/* eslint prefer-arrow-callback: 0, prefer-template: 0, no-var: 0, object-shorthand: 0 */
/* global define */

/*
  Init the popup plugin:
    You should assing the plugin to a global namespace different from popup and
    it should be initialize only once. Example:

    window.popupManager = window.popupManager || new window.jqueryPopup();

  How to use:
    Basic:
      .popup-tampax.js-popup-tampax
        .popup.js-popup(data-popup='my-popup')
          a.js-close-popup x

      Link that calls the popup:
      a.js-open-popup(data-popup='my-popup') Open Popup

    Ajax:
      .popup-tampax.js-popup-tampax
        .popup.js-popup(data-popup='my-ajaxpopup', data-popup-container-class='js-popup-data')
          a.js-close-popup x
          .js-popup-data

      Link that calls the popup:
      a.js-open-popup(data-popup='my-ajaxpopup', data-popup-ajax-url='/privacy_ajax') Open Popup

  NOTES::
    IT must always be 1 container (.popup-tampax) to contain all the popups. Example:

    This is OK:
      body
        .popup-tampax.js-popup-tampax
          .popup.js-popup(data-popup='my-popup')
            a.js-close-popup x
          .popup.js-popup(data-popup='my-popup2')
            a.js-close-popup x
          .popup.js-popup(data-popup='my-popup3')
            a.js-close-popup x

    This is NOT OK:
      body
        .popup-tampax.js-popup-tampax
          .popup.js-popup(data-popup='my-popup')
            a.js-close-popup x

        .popup-tampax.js-popup-tampax
          .popup.js-popup(data-popup='my-popup2')
            a.js-close-popup x

        .popup-tampax.js-popup-tampax
          .popup.js-popup(data-popup='my-popup3')
            a.js-close-popup x

*/

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
    root.jqueryPopup = factory(root.$);
  }
}(this, function init($) {
  var eventListeners = [];
  var pluginName = 'popup';

  var defaults = {
    onBeforeClose: function init() { return true; },
    onBeforeOpen: function init() { return true; },
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
    this.closePopups = this.closePopups.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.getActivePopup = this.getActivePopup.bind(this);
    this.init();
    return this;
  }

  function fireEventListeners(name, popup, btn) {
    eventListeners.forEach(function init(el) {
      if (el.name === name) el.callback(popup, popup.data('popup'), btn);
    });
  }

  Popup.prototype = {
    init: function init() {
      var _this = this;

      function onTampaxClick(e) {
        if ($(e.target).closest(_this.$popups).length) return;
        _this.closePopups();
      }

      function onBtnOpen(event) {
        var $popup;
        var $popupContainer;
        var ajaxUrl;
        var $this = $(this);
        var popupName = $this.data('popup');

        function onSuccess(data) {
          $popupContainer.html(data);
          $popup.removeClass('is-loading');
          fireEventListeners('onAjaxSucess', $popup);
        }

        function onError(data) {
          $popupContainer.html(data);
          $popup.removeClass('is-loading');
          fireEventListeners('onAjaxError', $popup);
        }

        $popup = _this.$popups.filter(function init(i, el) {
          return el.attributes['data-popup'].value === popupName;
        });

        // Check that the popup exists (In angular sometimes the popups haven't
        // been downloaded so we have to make sure they exist)
        ajaxUrl = $this.data('popup-ajax-url');
        if ($popup.length) {
          _this.$container.addClass('is-opened');
          if (!ajaxUrl) {
            _this.openPopup($popup, $this, event);
          } else {
            $popupContainer = $popup.find('.' + $popup.data('popup-container-class'));
            $popup.addClass('is-loading');
            $popupContainer.html('');
            _this.openPopup($popup, $this, event);
            $.get($this.data('popup-ajax-url')).then(onSuccess, onError);
          }
        }
      }

      this.$container.off('.' + pluginName);
      this.$container.on('click.' + pluginName + ' touchstart.' + pluginName, onTampaxClick);
      $(this.settings.openBtn).bind('click.' + pluginName, onBtnOpen);
      $(this.settings.closeBtn).bind('click.' + pluginName, this.closePopups);
    },

    openPopup: function init(popup, btn, event) {
      var _this = this;
      var shouldOpen;

      popup = typeof popup === 'string' ?
        this.$popups.filter(function init(i, el) {
          return el.attributes['data-popup'].value === popup;
        }) : $(popup);

      // Check that the popup exists (In angular sometimes the popups
      // haven't been downloaded so we have to make sure they exists)
      // fix the event.preventdefault when this is executed after a click event
      if (popup.length) {
        shouldOpen = this.settings.onBeforeOpen(popup, btn);

        if (event && event.stopPropagation) event.stopPropagation();
        this.$container.addClass('is-opened');

        // If onBefore returns false, we don't close the popup
        fireEventListeners('onBeforeOpen', popup, btn);
        if (!shouldOpen) return;

        this.$popups.removeClass('is-active');
        popup.addClass('is-active');
        fireEventListeners('onOpen', popup, btn);
        window.clearTimeout(this.closePopupsTimeout);
        this._openPopupTimeout = window.setTimeout(function init() {
          if (_this.settings.focusInputInside) {
            popup.find('input:first').focus();
          }
        }, 200);
      }
    },

    closePopups: function init() {
      var _this = this;
      var activePopup = this.getActivePopup();

      // If onBefore returns false, we don't close the popup
      var shouldClose = this.settings.onBeforeClose(activePopup);
      fireEventListeners('onBeforeClose', activePopup);
      if (!shouldClose) return;

      window.clearTimeout(this._openPopupTimeout);
      this.closePopupsTimeout = window.setTimeout(function init() {
        _this.$popups.removeClass('is-active');
      }, this.settings.animationDelayOnClose);
      this.$container.removeClass('is-opened');
      fireEventListeners('onClose', _this.getActivePopup());
    },

    getActivePopup: function init() {
      return this.$popups.filter(function init(i, el) {
        return $(el).hasClass('is-active');
      });
    },

    addEventListener: function init(name, callback) {
      eventListeners.push({ name: name, callback: callback });
    },

    destroy: function init() {
      this.$container.off('.' + pluginName + ' touchstart.' + pluginName);
      $(this.settings.openBtn).unbind('click.' + pluginName);
      $(this.settings.closeBtn).unbind('click.' + pluginName);
    }
  };

  return Popup;
}));
