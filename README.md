# SimpleScrollbar
Very simple vanilla javascript library for creating a custom scrollbar cross-browser and cross-devices.

## Demo
http://buzinas.github.io/simple-scrollbar

## Benefits

- Extremely lightweight (less than 1KB after gzip and minify)
- It uses the native scroll events, so:
  - All the events work and are smooth (mouse wheel, space, page down, page up, arrows etc).
  - The performance is awesome!
- No dependencies, completely vanilla Javascript!
- RTL support (thanks to [@BabkinAleksandr](https://github.com/BabkinAleksandr))

## Browser Support

It was developed for evergreen browsers, but it works both on IE10 and IE11 either.

If you want to make it works down to IE9, the only thing you need to do is to add the [classList polyfill](https://github.com/eligrey/classList.js).

```HTML
<!--[if IE 9]><script src="classList.min.js"></script><![endif]-->
```

## RTL Support

Add `direction: rtl;` to your `<div>`'s CSS, and SimpleScrollbar will detect the direction automatically.

## Usage

### Auto-binding

Include the CSS class `ss-container` in any `<div>` that you want to make scrollable, and the library will turn it for you

```HTML
<div class="ss-container">One</div>
<div class="ss-container">
  <span>Two</span>
</div>
```

### Manual binding

If you want to manually turn your div in a SimpleScrollbar, you can use the `SimpleScrollbar.init` method.

```HTML
<div class="myClass"></div>

<script>
  var el = document.querySelector('.myClass');
  SimpleScrollbar.init(el);
</script>
```

### Preconditions

The container must meet the following conditions:

1. CSS height rule must be set. Setting `max-height` only is not sufficient.
2. If no `.ss-scrolling` elements are used, the containers direct children
   must not change after initialization. Changing content may be implemented
   as grandchildren.

### Dynamically added content

If you changed the scrolling content or dimensions of the scrolling container
dynamically, call `updateLayout()`:


```html
<div class="myContainer">
  <div class="myContent">
    <p>Some text</p>
  </div>
</div>

<script>
  var el = document.querySelector('.myContainer');
  var scrollbar = SimpleScrollbar.init(el);

  setTimeout(function() {
    var newContent = document.createElement('p');
    newContent.innerHTML = "More text";
    el.querySelector(".myContent").appendChild(newContent);
    scrollbar.updateLayout();
  }, 1000);
</script>
```

## Notes for Angular users

1. In order to prevent Angular from doing change detection after every scroll movement,
we need to manually initialize outside of Angular
([read why](https://netbasal.com/angular-2-escape-from-change-detection-317b3b44906b)).

```html
<div #scrollMe><!-- no auto-binding here! -->
  <!-- ... -->
</div>
```

```typescript
// ...
export class ConversationComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  // ...

  constructor(private ngZone: NgZone) {
    // ...
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      simplescroll.init(this.myScrollContainer.nativeElement);
    });
  }
}
```

2. Adding the CSS file to a component's `styleUrls` does not work because style rules then get a component scope restriction that does not work with elements we create dynamically. Instead, add to `styles` list in .angular-cli.json, e.g.

```
{
  // ...
  "apps": [
    {
      // ...
      "styles": [
        // ...
        "../node_modules/simple-scrollbar/simple-scrollbar.css"
      ]
    }
  ]
}
```

## Changelog

**0.4.0**

Major refactoring, including

* new demo page
* CommonJS and RequireJS exports
* scroll view insets
* Bottom aligned scroll content
* rename initEl() -> init()

## Credits
Inspired by yairEO's jQuery plugin ([fakescroll](https://github.com/yairEO/fakescroll))
