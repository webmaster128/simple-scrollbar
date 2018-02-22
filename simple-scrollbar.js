(function(w, d) {
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
    var direction = w.getComputedStyle(container).direction;

    this.bar = '<div class="ss-scroll">';

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'ss-native-scrolling-wrapper');

    this.content = d.createElement('div');
    this.content.setAttribute('class', 'ss-content');

    this.wrapper.appendChild(this.content);

    while (container.firstChild) {
      this.content.appendChild(container.firstChild);
    }
    container.appendChild(this.wrapper);

    container.insertAdjacentHTML('beforeend', this.bar);
    this.bar = container.lastChild;

    dragDealer(this.bar, this);

    w.addEventListener('resize', this.updateLayout.bind(this));
    this.wrapper.addEventListener('mouseenter', this.updateLayout.bind(this));
    this.updateLayout();

    this.wrapper.addEventListener('scroll', this.updateScrollBarVerticalPosition.bind(this));
    this.updateScrollBarVerticalPosition();

    container.classList.add('ss-container');
    container.classList.add(direction === 'rtl' ? 'ss-rtl' : 'ss-ltr');

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
          _this.bar.classList.remove('ss-hidden')
          _this.bar.style["height"] = Math.max(_this.contentVisibleRatio * 100, 10) + '%';
        }
      });
    },
    updateScrollBarVerticalPosition: function(e) {
      var _this = this;

      raf(function() {
        var pos = (_this.wrapper.scrollTop / _this.wrapper.scrollHeight) * 100;
        _this.bar.style["top"] = pos + '%';
      });
    }
  }

  function initAll() {
    var nodes = d.querySelectorAll('*[ss-container]');

    for (var i = 0; i < nodes.length; i++) {
      initEl(nodes[i]);
    }
  }

  d.addEventListener('DOMContentLoaded', initAll);
  SimpleScrollbar.initEl = initEl;
  SimpleScrollbar.initAll = initAll;

  w.SimpleScrollbar = SimpleScrollbar;
})(window, document);
