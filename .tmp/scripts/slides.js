/*
* Slides, A Slideshow Plugin for jQuery
* Intructions: http://slidesjs.com
* By: Nathan Searles, http://nathansearles.com
* Version: 1.1.6
* Updated: March 23th, 2011
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

(function ($) {
  $.fn.slides = function (g) {
    g = $.extend({}, $.fn.slides.option, g);return this.each(function () {
      $('.' + g.container, $(this)).children().wrapAll('<div class="slides_control"/>');var d = $(this),
          control = $('.slides_control', d),
          total = control.children().size(),
          width = control.children().outerWidth(),
          height = control.children().outerHeight(),
          start = g.start - 1,
          effect = g.effect.indexOf(',') < 0 ? g.effect : g.effect.replace(' ', '').split(',')[0],
          paginationEffect = g.effect.indexOf(',') < 0 ? effect : g.effect.replace(' ', '').split(',')[1],
          next = 0,
          prev = 0,
          number = 0,
          current = 0,
          loaded,
          active,
          clicked,
          position,
          direction,
          imageParent,
          pauseTimeout,
          playInterval;function animate(a, b, c) {
        if (!active && loaded) {
          active = true;g.animationStart(current + 1);switch (a) {case 'next':
              prev = current;next = current + 1;next = total === next ? 0 : next;position = width * 2;a = -width * 2;current = next;break;case 'prev':
              prev = current;next = current - 1;next = next === -1 ? total - 1 : next;position = 0;a = 0;current = next;break;case 'pagination':
              next = parseInt(c, 10);prev = $('.' + g.paginationClass + ' li.current a', d).attr('href').match('[^#/]+$');if (next > prev) {
                position = width * 2;a = -width * 2;
              } else {
                position = 0;a = 0;
              }current = next;break;}if (b === 'fade') {
            if (g.crossfade) {
              control.children(':eq(' + next + ')', d).css({ zIndex: 10 }).fadeIn(g.fadeSpeed, g.fadeEasing, function () {
                if (g.autoHeight) {
                  control.animate({ height: control.children(':eq(' + next + ')', d).outerHeight() }, g.autoHeightSpeed, function () {
                    control.children(':eq(' + prev + ')', d).css({ display: 'none', zIndex: 0 });control.children(':eq(' + next + ')', d).css({ zIndex: 0 });g.animationComplete(next + 1);active = false;
                  });
                } else {
                  control.children(':eq(' + prev + ')', d).css({ display: 'none', zIndex: 0 });control.children(':eq(' + next + ')', d).css({ zIndex: 0 });g.animationComplete(next + 1);active = false;
                }
              });
            } else {
              control.children(':eq(' + prev + ')', d).fadeOut(g.fadeSpeed, g.fadeEasing, function () {
                if (g.autoHeight) {
                  control.animate({ height: control.children(':eq(' + next + ')', d).outerHeight() }, g.autoHeightSpeed, function () {
                    control.children(':eq(' + next + ')', d).fadeIn(g.fadeSpeed, g.fadeEasing);
                  });
                } else {
                  control.children(':eq(' + next + ')', d).fadeIn(g.fadeSpeed, g.fadeEasing, function () {
                    if ($.browser.msie) {
                      $(this).get(0).style.removeAttribute('filter');
                    }
                  });
                }g.animationComplete(next + 1);active = false;
              });
            }
          } else {
            control.children(':eq(' + next + ')').css({ left: position, display: 'block' });if (g.autoHeight) {
              control.animate({ left: a, height: control.children(':eq(' + next + ')').outerHeight() }, g.slideSpeed, g.slideEasing, function () {
                control.css({ left: -width });control.children(':eq(' + next + ')').css({ left: width, zIndex: 5 });control.children(':eq(' + prev + ')').css({ left: width, display: 'none', zIndex: 0 });g.animationComplete(next + 1);active = false;
              });
            } else {
              control.animate({ left: a }, g.slideSpeed, g.slideEasing, function () {
                control.css({ left: -width });control.children(':eq(' + next + ')').css({ left: width, zIndex: 5 });control.children(':eq(' + prev + ')').css({ left: width, display: 'none', zIndex: 0 });g.animationComplete(next + 1);active = false;
              });
            }
          }if (g.pagination) {
            $('.' + g.paginationClass + ' li.current', d).removeClass('current');$('.' + g.paginationClass + ' li:eq(' + next + ')', d).addClass('current');
          }
        }
      }function stop() {
        clearInterval(d.data('interval'));
      }function pause() {
        if (g.pause) {
          clearTimeout(d.data('pause'));clearInterval(d.data('interval'));pauseTimeout = setTimeout(function () {
            clearTimeout(d.data('pause'));playInterval = setInterval(function () {
              animate("next", effect);
            }, g.play);d.data('interval', playInterval);
          }, g.pause);d.data('pause', pauseTimeout);
        } else {
          stop();
        }
      }if (total < 2) {
        return;
      }if (start < 0) {
        start = 0;
      }if (start > total) {
        start = total - 1;
      }if (g.start) {
        current = start;
      }if (g.randomize) {
        control.randomize();
      }$('.' + g.container, d).css({ overflow: 'hidden', position: 'relative' });control.children().css({ position: 'absolute', top: 0, left: control.children().outerWidth(), zIndex: 0, display: 'none' });control.css({ position: 'relative', width: width * 3, height: height, left: -width });$('.' + g.container, d).css({ display: 'block' });if (g.autoHeight) {
        control.children().css({ height: 'auto' });control.animate({ height: control.children(':eq(' + start + ')').outerHeight() }, g.autoHeightSpeed);
      }if (g.preload && control.find('img').length) {
        $('.' + g.container, d).css({ background: 'url(' + g.preloadImage + ') no-repeat 50% 50%' });var f = control.find('img:eq(' + start + ')').attr('src') + '?' + new Date().getTime();if ($('img', d).parent().attr('class') != 'slides_control') {
          imageParent = control.children(':eq(0)')[0].tagName.toLowerCase();
        } else {
          imageParent = control.find('img:eq(' + start + ')');
        }control.find('img:eq(' + start + ')').attr('src', f).load(function () {
          control.find(imageParent + ':eq(' + start + ')').fadeIn(g.fadeSpeed, g.fadeEasing, function () {
            $(this).css({ zIndex: 5 });$('.' + g.container, d).css({ background: '' });loaded = true;g.slidesLoaded();
          });
        });
      } else {
        control.children(':eq(' + start + ')').fadeIn(g.fadeSpeed, g.fadeEasing, function () {
          loaded = true;g.slidesLoaded();
        });
      }if (g.bigTarget) {
        control.children().css({ cursor: 'pointer' });control.children().click(function () {
          animate('next', effect);return false;
        });
      }if (g.hoverPause && g.play) {
        control.bind('mouseover', function () {
          stop();
        });control.bind('mouseleave', function () {
          pause();
        });
      }if (g.generateNextPrev) {
        $('.' + g.container, d).after('<a href="#" class="' + g.prev + '">Prev</a>');$('.' + g.prev, d).after('<a href="#" class="' + g.next + '">Next</a>');
      }$('.' + g.next, d).click(function (e) {
        e.preventDefault();if (g.play) {
          pause();
        }animate('next', effect);
      });$('.' + g.prev, d).click(function (e) {
        e.preventDefault();if (g.play) {
          pause();
        }animate('prev', effect);
      });if (g.generatePagination) {
        d.append('<ul class=' + g.paginationClass + '></ul>');control.children().each(function () {
          $('.' + g.paginationClass, d).append('<li><a href="#' + number + '">' + (number + 1) + '</a></li>');number++;
        });
      } else {
        $('.' + g.paginationClass + ' li a', d).each(function () {
          $(this).attr('href', '#' + number);number++;
        });
      }$('.' + g.paginationClass + ' li:eq(' + start + ')', d).addClass('current');$('.' + g.paginationClass + ' li a', d).click(function () {
        if (g.play) {
          pause();
        }clicked = $(this).attr('href').match('[^#/]+$');if (current != clicked) {
          animate('pagination', paginationEffect, clicked);
        }return false;
      });$('a.link', d).click(function () {
        if (g.play) {
          pause();
        }clicked = $(this).attr('href').match('[^#/]+$') - 1;if (current != clicked) {
          animate('pagination', paginationEffect, clicked);
        }return false;
      });if (g.play) {
        playInterval = setInterval(function () {
          animate('next', effect);
        }, g.play);d.data('interval', playInterval);
      }
    });
  };$.fn.slides.option = { preload: false, preloadImage: '/images/loading.gif', container: 'slides_container', generateNextPrev: false, next: 'next', prev: 'prev', pagination: true, generatePagination: true, paginationClass: 'pagination', fadeSpeed: 350, fadeEasing: '', slideSpeed: 350, slideEasing: '', start: 1, effect: 'slide', crossfade: false, randomize: false, play: 0, pause: 0, hoverPause: false, autoHeight: false, autoHeightSpeed: 350, bigTarget: false, animationStart: function animationStart() {}, animationComplete: function animationComplete() {}, slidesLoaded: function slidesLoaded() {} };$.fn.randomize = function (c) {
    function randomizeOrder() {
      return Math.round(Math.random()) - 0.5;
    }return $(this).each(function () {
      var $this = $(this);var $children = $this.children();var a = $children.length;if (a > 1) {
        $children.hide();var b = [];for (i = 0; i < a; i++) {
          b[b.length] = i;
        }b = b.sort(randomizeOrder);$.each(b, function (j, k) {
          var $child = $children.eq(k);var $clone = $child.clone(true);$clone.show().appendTo($this);if (c !== undefined) {
            c($child, $clone);
          }$child.remove();
        });
      }
    });
  };
})(jQuery);
//# sourceMappingURL=slides.js.map
