FunSlider - jQuery Slideshow Plugin (v 0.8b)
===========================================

_**Author:** Brandtley McMinn_

---

_**NOTE: This is a beta script and is still undergoing development.**_

---


Requirements
------------

jQuery 1.4.2+<br>
[Modernizr.js](http://modernizr.com/)<br>
Modern web browser with CSS3 support (Chrome, FF 4+, IE9+, Opera)


TL;DR:
------

If you just want to get started with FunSlider's awesomeness, grab the assets and link them up as shown (or do whatever fits your project)

```HTML
<head>
  <!-- Other <head> contents... -->

  <!-- Link up the stylesheet in HEAD -->
  <link rel="stylesheet" href="css/funslider.css">
</head>

<body>

  <!-- Put this guy where you need it -->
  <ul id="slideshow">
    <li>
      <!-- YOUR SLIDE MARKUP HERE -->
    </li>
    <li>
      <!-- YOUR SLIDE MARKUP HERE -->
    </li>
  </ul><!-- #slideshow -->


  <!-- Include jQuery (>=1.4.2) -->
  <script src="js/jQuery.1.4.2.min.js"></script>

  <!-- Then load the plugin file -->
  <script src="js/funslider.min.js"></script>

  <!-- init the plugin (preferably in a seperate plugins script file) -->
  <script src="js/plugins.js"></script>

</body>
```

###js/plugins.js

```js
(function($) {
  $('#slideshow').funSlider({
    // Usual options
      displayButtons:     false   // show next/prev controls
    , displayIndexes:     false   // show slide index markers
    , interval:           3       // time in seconds between class changes

    // Defaults by default.
    , prevText:           'Prev'
    , nextText:           'Next'
    , hoverDelay:         true

    // Fallbacks provided in case browser support isn't viable
    , fallbackTransition: 'fade'
    , fallbackDuration:   0.5
  });
})(jQuery);
```


If you have any questions about the above markup, Read on.



Description
-----------

FunSlider was designed and built to eliminate the static and inflexible nature of today's slideshow plugin. Browsers are better at rendering complex animations and transitions than ever, so why use complex JS animations that aren't as performant? Slides are built using HTML which allows for more customization, more interactivity, more extensibility with other JS libraries, more custom effects applied using CSS, the possibilities are virtually endless.

That being said, FunSlider was built to utilize CSS as it's presentation controller, JavaScript merely handles when to switch the slide, just like it should be :) We'll cover more complex details as we go along.


Features
--------

- Keyboard support by default :)
- Completely customizable using CSS
- Auto calculates frames based on number of elements within the target node
- Stop-on-hover is configurable. On by default
- Plugin uses jQuery animation features if CSS3 transitions and/or animations are not available.


Configuration Options:
----------------------

By default, you don't have to do much of anything to get this guy going, but if you wanted to customize certain aspects your more than welcome to utilize the following options:

```JS
$('#slideshow').funSlider({

  // Usual options
    displayButtons:     false     // hide next/prev buttons by default
  , displayIndexes:     false     // hide slide index markers by default
  , interval:           3         // time in seconds to display a slide before transitioning

  // Defaults by default.
  , prevText:           'Prev'    // text to display on 'Previous' button
  , nextText:           'Next'    // text to display on 'Next' button
  , hoverDelay:         true      // enable slideshow delay on hover by default

  // Fallbacks in case browser support isn't viable
  , fallbackTransition: 'fade'    // 'fade|slideHoriz|slideVert' default transition if browser doesn't support CSS variants.
  , fallbackDuration:   0.5       // time in seconds to complete slide transition

});
```



Basic Slideshow:
----------------

```HTML
<ul id="slideshow">
  <li>
    <h1>Slide 1: Title</h1>
    <p>
      We could do virtually anything with this thing :D Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem nisi unde eum quis! Dolorum libero eos corrupti alias esse numquam accusantium id ex necessitatibus ipsam deserunt accusamus. Laudantium itaque iste.
    </p>
  </li>
  <li>
    <h2>Entirely CSS driven design</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio id rem exercitationem quam at soluta ipsum itaque pariatur nostrum eius asperiores delectus ullam reiciendis. Expedita dolores quo distinctio enim numquam.
    </p>
  </li>
</ul>

<script src="js/funslider.min.js"></script>
<script>
  (function($) {
    $('#slideshow').funSlider({

    });
  })(jQuery);
</script>
```

The only requirement to get FunSlider going is to initailize it on a single jQuery selector that contains consistant slide elements. In our example we'll use `#slideshow`.

FunSlider takes a simple barebones approach to the whole process. It assumes nothing about your markup and tries to optimize where it can. If you use `<li>` tags, for your slides, per our example, it will generate a frame wrapper using an `<ul>` tag (it generates a `<div>` by default). This provides the most flexibility while allowing for semanticly valid markup.

Here's what we get after the plugin runs on our markup:

```HTML
<div id="slideshow">
  <ul class="slide-container">
    <li id="slide-1" class="slide active-slide" data-slideid="1">
      <h1>Slide 1: Title</h1>
      <p> We could do virtually anything with this thing :D </p>
    </li>

    <li id="slide-2" class="slide" data-slideid="2">
      <h2>Entirely CSS driven design</h2>
      <p> The Plugin itself does nothing more than manage classes on each slide to denote active/inactive states. CSS handles all presentation. </p>
    </li>
  </ul>
</div>
```

Again, FunSlider tries to assume nothing about your markup, and optimizes it as best it can. It also provides you with unique ID attributes in order to customize each slide using CSS.



But where's the interactivity?
------------------------------

So you want buttons and controls and index markers right? easy; adjust your intialization script to include these values:

```JS
  $('#slideshow').funSlider({
    // Usual options
      displayButtons:     true
    , displayIndexes:     true
  });
```

Providing one of these options enables that control set which behave independantly of eachother, but add to the overall experience. They're also easy to customize in appearance, because they have classes appended to their markup making CSS edits very simple.

```HTML
<div id="slideshow">
  <ul class="slide-container">
    <!-- slides and contents -->
  </ul>
  <div class="controls">
    <button class="prev">Prev</button>
    <button class="next">Next</button>
  </div>
  <div class="indexes">
    <button class="index-button active-index" data-slideid="1">1</button>
    <button class="index-button" data-slideid="2">2</button>
    <button class="index-button" data-slideid="3">3</button>
    <button class="index-button" data-slideid="4">4</button>
    <button class="index-button" data-slideid="5">5</button>
  </div>
</div>
```



"What if my browser doesn't support Fancy transitions?"
-------------------------------------------------------

Way ahead of you. Using [modernizr](http://modernizr.com) we can detect when CSS Transitions and Animations are supported and provide a JS based fallback from within the plugin.

These are the defaults initialized by the plugin, but can be overridden if desired:


```js
$('#slideshow').funSlider({
  // Usual options...

  // Fallbacks in case browser support isn't viable
  , fallbackTransition: 'fade'    // 'fade|slideHoriz|slideVert' default transition if browser doesn't support CSS variants.
  , fallbackDuration:   0.5       // time in seconds to complete slide transition
});
```


Support:
--------

Any and all support related questions should be handled using the [issues](https://github.com/bmcminn/FunSlider/issues) tab on Github.


**Happy coding :)**

_- Brandtley McMinn - [GiggleboxStudios](http://giggleboxstudios.net)_


License:
--------

The MIT License (MIT)

Copyright (c) 2013 Brandtley McMinn, GiggleboxStudios

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
