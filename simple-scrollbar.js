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
        context.content.scrollTop += delta / context.contentVisibleRatio;
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
  function SimpleScrollbar(el) {
    this.target = el;

    this.direction = w.getComputedStyle(this.target).direction;

    this.bar = '<div class="ss-scroll">';

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'ss-native-scrolling-wrapper');

    this.content = d.createElement('div');
    this.content.setAttribute('class', 'ss-content');

    if (this.direction === 'rtl') {
      this.content.classList.add('rtl');
    }

    this.wrapper.appendChild(this.content);

    while (this.target.firstChild) {
      this.content.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;

    dragDealer(this.bar, this);
    this.moveBar();

    w.addEventListener('resize', this.moveBar.bind(this));
    this.content.addEventListener('scroll', this.moveBar.bind(this));
    this.content.addEventListener('mouseenter', this.moveBar.bind(this));

    this.target.classList.add('ss-container');

    var css = w.getComputedStyle(el);
  	if (css['height'] === '0px' && css['max-height'] !== '0px') {
    	el.style.height = css['max-height'];
    }
  }

  SimpleScrollbar.prototype = {
    moveBar: function(e) {
      var _this = this;

      var totalHeight = _this.content.scrollHeight;
      var containerHeight = _this.content.clientHeight;

      _this.contentVisibleRatio = containerHeight / totalHeight;

      var isRtl = _this.direction === 'rtl';
      var right = isRtl
        ? (_this.target.clientWidth - _this.bar.clientWidth + 18)
        : (_this.target.clientWidth - _this.bar.clientWidth) * -1;

      raf(function() {
        // Hide scrollbar if no scrolling is possible
        if(_this.contentVisibleRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
          _this.bar.style.cssText = 'height:' + Math.max(_this.contentVisibleRatio * 100, 10) + '%; top:' + (_this.content.scrollTop / totalHeight ) * 100 + '%;right:' + right + 'px;';
        }
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
