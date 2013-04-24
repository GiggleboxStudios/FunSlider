/*jshint strict:true, evil:true, boss:false, laxcomma:true, latedef:true, immed:true, newcap:true, noarg:true, nonew:true, plusplus:true, regexp:true, undef:true, unused:true, trailing:true, eqeqeq:true, curly:true, camelcase:true, bitwise:true */
/*global jQuery:true, window:true */

/**
 * @name          FunSlider.js
 * @author        Brandtley McMinn
 * @version       1.0
 * -------------------------------------------------------------
 *
 * @description   Creates a flexible, functional slideshow for use in your web page that is entirely controlled by CSS
 *
 * @requires      jQuery >= 1.4.2, modernizr
 *
 * @license [url] MIT License
 *
 *   Copyright (c) 2013 Brandtley McMinn and Contributors
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom the
 *   Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 *   THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 *
 */

;(function($) {

  "use strict";

  $.fn.funSlider = function(options) {

    var defaults = {

        // Usual options
          displayButtons:     false
        , displayIndexes:     false
        , interval:           3

        // Defaults by default.
        , prevText:           'Prev'
        , nextText:           'Next'
        , hoverDelay:         true

        // Fallbacks in case browser support isn't viable
        , fallbackTransition: 'fade'
        , fallbackDuration:   0.5

        } // defaults

      , settings
      , i                     = 1
      , indexContent          = ''
      , indexes
      , indexButtons
      , slideshow             = $(this)
      , slideshowID           = slideshow.attr('id')
      , timeInterval          = 0
      , timeDuration          = 0
      , slideshowInterval
      , slides
      , slideCounter          = 1
      , slideCount
      , slidesWrapper         = 'div'

      // Use this to cache contents when performing replacements
      , tempContent

      // TIME BASED VARIABLES
      , seconds               = 1000
      ;



    var FunSlider = {

      /**
       * the "constructor" method that gets called when the object is created
       * @return undefined
       */
      init: function() {

        // Combobulate our settings
        settings      = $.extend({}, defaults, options);

        // Convert our seconds to milliseconds
        timeInterval  = settings.interval * seconds;
        timeDuration  = settings.fallbackDuration * seconds;

        // Tempcache slideshow contents
        tempContent   = slideshow.html();

        // Rebuild slideshow container with proper DIV wrapper
        slideshow.replaceWith('<div id="' + slideshowID + '">' + tempContent + '</div>');

        // Re-cache #slideshow since it was lost after .replaceWith()
        slideshow     = $('#' + slideshowID);

        // Find all our slides and give them a class of .slide
        slides        = slideshow.find('li,div');

        // Tempcache our slides
        tempContent   = slideshow.html();

        // Test if we're using DIV's or LI's for our slides and use an UL if appropriate
        if (slides.eq(0).is('li')) {
          slidesWrapper = 'ul';
        }

        // Wrap slides with container
        slideshow.html('<' + slidesWrapper + ' class="slide-container">' + tempContent + '</' + slidesWrapper + '>');

        // Append class to each slide
        $('.slide-container').children().addClass('slide');

        // Re-assign slides to .slide elements
        slides        = $('.slide');

        // Utilize our slides data for something
        slides.each(function() {

          // Assign a unique ID to each slide
          $(this).attr('id', 'slide-' + i).attr('data-slideID', i);

          // Build our list of indexes
          indexContent += '<button class="index-button" data-slideID="' + i + '">' + i + '</button>';

          i += 1;
        });

        // Reset 'i' to 1
        i = 1;

        // Count number of slides
        slideCount    = slides.length;

        // Make our first slide active
        slides.eq(0).addClass('active-slide');

        // If we're showing next|prev buttons, add them
        if (settings.displayButtons) {
          slideshow.append('<div class="controls"><button class="prev">' + settings.prevText + '</button><button class="next">' + settings.nextText + '</button></div>');
        }

        // If we're showing slide indexes, add them
        if (settings.displayIndexes) {
          slideshow.append('<div class="indexes">' + indexContent +'</div>');
          indexes       = $('.indexes');
          indexButtons  = $('.index-button');
          indexButtons.eq(0).addClass('active-index');
        }

        return;

      } // init();



      /**
       * Initializes a Timer interval object to run our slideshow automagically
       */
    , runSlideshow: function() {

        slideshowInterval = window.setInterval(function() {
          FunSlider.toggleSlides(1);
        }, timeInterval);

      } // .runSlideshow



      /**
       * Manages class assignements for our slides
       * @param  int | direction | takes +1/-1 as argument to increment or decrement our slide count
       */
    , toggleSlides: function(direction) {

        // Increment/Decrement our slide counter
        slideCounter += direction;

        // Compare slideCounter to slides.length

        // If we're over the number of slides, reset to zero and start the slideshow over
        if (slideCounter > slideCount) {
          slideCounter = 1;

        // If we're under 0, reset counter to
        } else if (slideCounter <= 0) {
          slideCounter = slideCount;
        }

        // Reset all slides to remove .active-slide
        slides.removeClass('active-slide');

        // Set .active-slide
        slides.eq(slideCounter - 1).addClass('active-slide');
        console.log('active-slide ' + slideCounter);

        // Are we using indexes?
        if (settings.displayIndexes) {

          // Reset all indexes to remove .active-index
          indexButtons.removeClass('active-index');
          indexButtons.eq(slideCounter - 1).addClass('active-index');
        }

      } // .toggleSlides

      /**
       * Manages class assignments when we click a specific slide index
       * @param int | slideIndex | Sets the index of the slide we wish to view
       */
    , setSlides: function(slideIndex) {

        // Reset our slideCounter to slideIndex
        slideCounter = slideIndex;

        // Reset all slides to remove .active-slide
        slides.removeClass('active-slide');

        // Set .active-slide
        slides.eq(slideCounter).addClass('active-slide');

        // Are we using indexes?
        if (settings.displayIndexes) {

          // Reset all indexes to remove .active-index
          indexButtons.removeClass('active-index');
          indexButtons.eq(slideCounter).addClass('active-index');
        }
      }


      /**
       * [navSlideshow description]
       * @return {[type]} [description]
       */
    , navSlideshow: function() {


      } // .navSlideshow

    }; // var FunSlider = {...}


    // starts the party <:-)
    FunSlider.init();

    // Init slideshow interval
    FunSlider.runSlideshow();

    // Make our Prev|Next Buttons work
    FunSlider.navSlideshow();


    // If there is only one slide, don't animate it
    if (slideCount <= 1) {
      window.clearInterval(slideshowInterval);

    } else {

      // Determine if we're hovering a slide and delay
      slideshow.hover(function() {
        window.clearInterval(slideshowInterval);
        console.log('hoverOn: clear interval');

      }, function() {
        FunSlider.runSlideshow();
        console.log('hoverOff: runSlideshow');

      });

    }

    // ... but it's not off the chain
    return this;

  };

})(jQuery);
