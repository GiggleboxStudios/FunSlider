/*jshint strict:true, evil:true, boss:false, laxbreak:true, laxcomma:true, latedef:true, immed:true, newcap:true, noarg:true, nonew:true, plusplus:true, regexp:true, undef:true, unused:true, trailing:true, eqeqeq:true, curly:true, camelcase:true, bitwise:true */
/**
 * @name          FunSlider.js
 * @author        Brandtley McMinn
 * @version       1.0
 * -------------------------------------------------------------
 *
 * @description   Creates a flexible, functional $slideshow for use in your web page that is entirely controlled by CSS
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

    var defaults =  {
                      // Usual options
                        displayButtons:     false   // Show next/prev controls
                      , displayIndexes:     false   // Show slide index markers
                      , interval:           3       // Time in seconds between class changes
                      , enableKeyboard:     false   // We have keyboard integration for left and right arrow keys
                      , showFrames:         0       // Show this many slides at one time

                      // Defaults by default.
                      , carousel:           true    // Enables carousel mode
                      , hoverDelay:         true    // Determines if the slideshow should stop animating on hover
                      , prevText:           'Prev'
                      , nextText:           'Next'

                      // Fallbacks provided in case browser support isn't viable
                      , fallbackTransition: 'fade'
                      , fallbackDuration:   0.5
                    } // defaults

      , settings
      , $i                    = 1
      , $indexContent         = ''
      , $indexes
      , $indexButtons
      , $slideshow            = $(this)
      , $slideshowID          = $slideshow.attr('id')
      , $timeInterval         = 0
      , $timeDuration         = 0
      , $slideshowInterval
      , $frameCount
      , $nextButton
      , $prevButton
      , $slideCount
      , $slideCounter         = 1
      , $slidesWrapper        = 'div'
      , $slides

      // Use this to cache contents when performing replacements
      , $tempContent

      // TIME BASED VARIABLES
      , $seconds               = 1000
      ;


    var FunSlider = {

      /**
       * the "constructor" method that gets called when the object is created
       * @return undefined
       */
      init: function() {

        var content   = '';

        // Combobulate our settings
        settings      = $.extend({}, defaults, options);

        // Convert our $seconds to milliseconds
        $timeInterval = settings.interval * $seconds;
        $timeDuration = settings.fallbackDuration * $seconds;

        // Get total number of frames to show
        $frameCount   = settings.showFrames;

        // Tempcache $slideshow contents
        $tempContent  = $slideshow.html();

        // Find all our slides
        $slides       = $slideshow.find('li,div');

        // Test if we're using DIV's or LI's for our slides and use an UL if appropriate
        if ($slides.eq(0).is('li')) {
          $slidesWrapper = 'ul';
        }

        // Rebuild $slideshow container with proper DIV wrapper
        content = '<div id="' + $slideshowID + '">'
                +   '<' + $slidesWrapper + ' class="slide-container">' + $tempContent + '</' + $slidesWrapper + '>'
                + '</div>';

        $slideshow.replaceWith(content);

        // Re-cache #slideshow since it was lost after .replaceWith()
        $slideshow  = $('#' + $slideshowID);

        // Re-cache all our slides
        $slides     = $slideshow.find('li, div').addClass('slide');

        // Utilize our slides data for something
        $slides.each(function() {

          // Assign a unique ID to each slide
          $(this).attr('id', 'slide-' + $i).attr('data-slideID', $i);

          // Build our list of indexes
          $indexContent += '<button class="index-button" data-slideID="' + $i + '">' + $i + '</button>';

          $i += 1;
        });

        // Reset 'i' to 1
        $i = 1;

        // Count number of slides
        $slideCount = $slides.length;

        // Make our first slide active
        $slides.eq(0).addClass('active-slide');

        // If we're showing next|prev buttons, add them
        if (settings.displayButtons) {
          content = '<div class="controls">'
                  +   '<button class="prev">' + settings.prevText + '</button>'
                  +   '<button class="next">' + settings.nextText + '</button>'
                  + '</div>'
                  ;

          $slideshow.append(content);

          // Cache the buttons
          $prevButton = $slideshow.find('button.prev');
          $nextButton = $slideshow.find('button.next');
        }

        // If we're showing slide indexes, add them
        if (settings.displayIndexes) {
          content = '<div class="indexes">' + $indexContent +'</div>';
          $slideshow.append(content);
          $indexes      = $('.indexes');
          $indexButtons = $('.index-button');
          $indexButtons.eq(0).addClass('active-index');
        }

        return;
      } // init();



      /**
       * Initializes a Timer interval object to run our $slideshow automagically
       */
    , runSlideshow: function() {
        if (settings.interval) {
          $slideshowInterval = window.setInterval(function() {
            FunSlider.toggleSlides(1);
          }, $timeInterval);
        }
      } // .runSlideshow



      /**
       * Handle to disable slideshow automation
       */
    , killSlideshow: function() {
        window.clearInterval($slideshowInterval);
      }



      /**
       * Manages class assignements for our slides
       * @param  int | direction | takes +1/-1 as argument to increment or decrement our slide count
       */
    , toggleSlides: function(direction) {

        // Increment/Decrement our slide counter
        $slideCounter += direction;

        // If we're over the number of slides, reset to zero and start the $slideshow over
        if ($slideCounter > $slideCount) {
          $slideCounter = 1;

        // If we're under 0, reset counter to
        } else if ($slideCounter <= 0) {
          $slideCounter = $slideCount;
        }

        // Reset all slides to remove .active-slide
        $slides.removeClass('active-slide previous-slide next-slide');

        // Set .active-slide
        $slides.eq($slideCounter - 1).addClass('active-slide');


  // TODO - Figure out how to stage next/previous slides without adding
  //        a ridiculous number of classes and if/else statements


        // Are we using indexes?
        if (settings.displayIndexes) {
          // Reset all indexes to remove .active-index
          $indexButtons.removeClass('active-index');
          $indexButtons.eq($slideCounter - 1).addClass('active-index');
        }
      } // .toggleSlides()



      /**
       * Manages class assignments when we click a specific slide index
       * @param int | slideIndex | Sets the index of the slide we wish to view
       */
    , setSlides: function(slideIndex) {

        // Reset our $slideCounter to slideIndex
        $slideCounter = slideIndex;

        // Reset all slides to remove .active-slide
        $slides.removeClass('active-slide');

        // Set .active-slide
        $slides.eq($slideCounter).addClass('active-slide');

        // Are we using indexes?
        if (settings.displayIndexes) {
          $indexButtons.removeClass('active-index');
          $indexButtons.eq($slideCounter).addClass('active-index');
        }
      } // .setSlides()



      /**
       * Handles button clicks and bumps the slides as necessary
       * @return {[type]} [description]
       */
    , navSlideshow: function() {

        // Are we using indexes?
        if (settings.displayIndexes) {
          $indexButtons.click(function() {
            var $this = $(this);
            FunSlider.setSlides($this.attr('data-slideid') - 1);
          });
        }

        // Are we using buttons
        if (settings.displayButtons) {
          $nextButton.click(function() {
            FunSlider.toggleSlides(1);
          });

          $prevButton.click(function() {
            FunSlider.toggleSlides(-1);
          });
        }

        // Are we using keyboard input?
        if (settings.enableKeyboard) {
          $(window).keydown(function (e) {
            var keyCode = e.keyCode || e.which
              , arrow   = { left: 37, up: 38, right: 39, down: 40 };

            switch (keyCode) {
              case arrow.left:
                FunSlider.toggleSlides(-1);
                break;

              case arrow.right:
                FunSlider.toggleSlides(1);
                break;
            }

            // When we .keydown, clear the interval and reset the interval
            FunSlider.killSlideshow();

            // TODO: Figure out error where we get multiple .runSlideshow instances rolling...
            // FunSlider.runSlideshow();

          });
        }
      } // .navSlideshow()

    }; // var FunSlider = {...}


    // starts the party <:-)
    FunSlider.init();
    FunSlider.runSlideshow();   // Init $slideshow interval
    FunSlider.navSlideshow();   // Make our Prev|Next Buttons work

    // If there is only one slide, don't animate it
    if ($slideCount <= 1) {
      FunSlider.killSlideshow();

    } else {

      // Determine if we're hovering a slide and delay
      $slideshow.hover(function() {
        FunSlider.killSlideshow();
        // console.log('hoverOn: clear interval');

      }, function() {
        FunSlider.runSlideshow();
        // console.log('hoverOff: runSlideshow');

      });

    }

    // ... but it's not off the chain
    return this;

  };

})(jQuery);
