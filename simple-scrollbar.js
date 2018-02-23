(function (root, factory) {
  // Main setup block (see http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/)
  //
  // This block assumes that window and document magically exist,
  // which might not be the case in every environment.
  if(typeof define === "function" && define.amd) {
    // AMD
    define(function() { return factory(window, document) });
  } else if(typeof module === "object" && module.exports) {
    // CommonJS
    module.exports = factory(window, document);
  } else {
    // Browser environment
    root.SimpleScrollbar = factory(window, document);
  }
}(this, function(w, d) {
  // factory block

  var raf = w.requestAnimationFrame || w.setImmediate || function(c) { return setTimeout(c, 0); };

  function initEl(el) {
    if (Object.prototype.hasOwnProperty.call(el, 'data-simple-scrollbar')) return;
    Object.defineProperty(el, 'data-simple-scrollbar', new SimpleScrollbar(el));
  }

  // Mouse drag handler
  function dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      d.body.classList.add('ss-grabbed');

      d.addEventListener('mousemove', drag);
      d.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      raf(function() {
        context.wrapper.scrollTop += delta / context.contentVisibleRatio;
      });
    }

    function stop() {
      el.classList.remove('ss-grabbed');
      d.body.classList.remove('ss-grabbed');
      d.removeEventListener('mousemove', drag);
      d.removeEventListener('mouseup', stop);
    }
  }

  // Constructor
  function SimpleScrollbar(container) {
    this.scrollInsetsTop = parseInt(container.dataset.ssScrollInsetsTop, 10) || 0;
    this.scrollInsetsBottom = parseInt(container.dataset.ssScrollInsetsBottom, 10) || 0;

    container.classList.add("ss-container"); // may not be set in manual bindings

    var direction = w.getComputedStyle(container).direction;
    container.classList.add(direction === 'rtl' ? 'ss-rtl' : 'ss-ltr');

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'ss-native-scrolling-wrapper');

    this.content = d.createElement('div');
    this.content.setAttribute('class', 'ss-content');

    this.wrapper.appendChild(this.content);

    var customScrollingContentContainer = container.querySelector(".ss-scrolling");
    if (customScrollingContentContainer) {
      // Move everything from .ss-scrolling into .ss-content
      while (customScrollingContentContainer.firstChild) {
        this.content.appendChild(customScrollingContentContainer.firstChild);
      }
      // Add wrapper into .ss-content
      customScrollingContentContainer.appendChild(this.wrapper);
    } else {
      // Move everything from .ss-container into .ss-content
      while (container.firstChild) {
        this.content.appendChild(container.firstChild);
      }
      // Add wrapper into .ss-container
      container.appendChild(this.wrapper);
    }

    this.bar = d.createElement('div');
    this.bar.setAttribute('class', 'ss-scrollbar');
    container.appendChild(this.bar);

    dragDealer(this.bar, this);

    w.addEventListener('resize', this.updateLayout.bind(this));
    this.wrapper.addEventListener('mouseenter', this.updateLayout.bind(this));
    this.updateLayout();

    this.wrapper.addEventListener('scroll', this.updateScrollBarVerticalPosition.bind(this));
    this.updateScrollBarVerticalPosition();

    var css = w.getComputedStyle(container);
  	if (css['height'] === '0px' && css['max-height'] !== '0px') {
    	container.style.height = css['max-height'];
    }
  }

  SimpleScrollbar.prototype = {
    updateLayout: function(e) {
      var _this = this;

      _this.content.style.width = _this.wrapper.offsetWidth - 10000;

      var totalHeight = _this.wrapper.scrollHeight;
      var containerHeight = _this.wrapper.clientHeight;

      _this.contentVisibleRatio = containerHeight / totalHeight;

      raf(function() {
        // Hide scrollbar if no scrolling is possible
        if(_this.contentVisibleRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden');
          var heightRel = Math.max(_this.contentVisibleRatio, 0.1);
          var heightAbs = Math.round(heightRel * (_this.wrapper.offsetHeight - _this.scrollInsetsTop - _this.scrollInsetsBottom));
          _this.bar.style["height"] = heightAbs + 'px';
        }
      });
    },
    updateScrollBarVerticalPosition: function(e) {
      var _this = this;

      raf(function() {
        var topMin = _this.scrollInsetsTop;
        var topMax = _this.wrapper.offsetHeight - _this.scrollInsetsBottom - _this.bar.offsetHeight;
        var posRelative = (_this.wrapper.scrollTop / (_this.wrapper.scrollHeight-_this.wrapper.offsetHeight));
        var top = topMin + (topMax-topMin)*posRelative;
        _this.bar.style["top"] = top + 'px';
      });
    }
  }

  function initAll() {
    var nodes = d.querySelectorAll('.ss-container');

    for (var i = 0; i < nodes.length; i++) {
      initEl(nodes[i]);
    }
  }

  d.addEventListener('DOMContentLoaded', initAll);
  SimpleScrollbar.initEl = initEl;
  SimpleScrollbar.initAll = initAll;

  return SimpleScrollbar;
}));
