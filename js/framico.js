/*
    =============================================
    Framico v1.7.6 (http://framico.thebrooons.ru)
    =============================================

    Используется Glide.js | Ver: 1.0.5 | http://jedrzejchalubek.com
    Модальные окна Remodal - v1.0.6 | http://vodkabears.github.io/remodal/

*/


// Навигация

$(document).ready(function() {
    var touch = $('#touch-nav');
    var menu = $('.nav');

    $(touch).on('click', function (e) {
        e.preventDefault();
        menu.slideToggle();
    });

    var resizeTimeout;

    var resize = function() {
        var w = $(window).width();
        if (w > 768 && menu.is(':hidden')) {
            menu.removeAttr('style');
        }
    };

    $(window).resize(function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize,250);
    });
});

// Вкладки

$(document).ready(function() {
    $('.accordion-tabs').children('li').first().children('a').addClass('is-active')
        .next().addClass('is-open').show();

    $('.accordion-tabs').on('click', 'li > a', function(event) {
        if (!$(this).hasClass('is-active')) {
            event.preventDefault();

            $('.accordion-tabs .is-open').removeClass('is-open').hide();

            $(this).next().toggleClass('is-open').toggle();

            $('.accordion-tabs').find('.is-active').removeClass('is-active');

            $(this).addClass('is-active');

        } else {
            event.preventDefault();
        }
    });
});

// Glide.js

(function($, window, document, undefined) {

    var name = 'glide',
        defaults = {

            autoplay: 4000,
            hoverpause: true,

            animationTime: 500,

            arrows: true,
            arrowsWrapperClass: 'slider-arrows',
            arrowMainClass: 'slider-arrow',
            arrowRightClass: 'slider-arrow-right',
            arrowRightText: '<i class="fa fa-angle-right"></i>',
            arrowLeftClass: 'slider-arrow-left',
            arrowLeftText: '<i class="fa fa-angle-left"></i>',

            nav: true,
            navCenter: true,
            navClass: 'slider-nav',
            navItemClass: 'slider-nav-item',
            navCurrentItemClass: 'slider-nav-item-current',

            keyboard: true,

            touchDistance: 60,

            beforeInit: function() {},
            afterInit: function() {},

            beforeTransition: function() {},
            afterTransition: function() {}

        };

    function Glide(parent, options) {

        var _ = this;
        _.options = $.extend({}, defaults, options);
        _.parent = parent;
        _.wrapper = _.parent.children();
        _.slides = _.wrapper.children();
        _.currentSlide = 0;
        _.CSS3support = true;

        _.options.beforeInit.call(_);

        _.init();
        _.build();
        _.play();

        if (_.options.touchDistance) {
            _.swipe();
        }

        if (_.options.keyboard) {
            $(document).on('keyup', function(k) {
                if (k.keyCode === 39) _.slide(1);
                if (k.keyCode === 37) _.slide(-1);
            });
        }

        if (_.options.hoverpause) {
            _.parent.add(_.arrows).add(_.nav).on('mouseover mouseout', function(e) {
                _.pause();
                if (e.type === 'mouseout') _.play();
            });
        }

        $(window).on('resize', function() {
            _.init();
            _.slide(0);
        });

        _.options.afterInit.call(_);

        return {

            current: function() {
                return -(_.currentSlide) + 1;
            },

            play: function() {
                _.play();
            },

            pause: function() {
                _.pause();
            },

            next: function(callback) {
                _.slide(1, false, callback);
            },

            prev: function(callback) {
                _.slide(-1, false, callback);
            },

            jump: function(distance, callback) {
                _.slide(distance - 1, true, callback);
            },

            nav: function(target) {
                if (_.navWrapper) {
                    _.navWrapper.remove();
                }
                _.options.nav = (target) ? target : _.options.nav;
                _.navigation();
            },

            arrows: function(target) {
                if (_.arrowsWrapper) {
                    _.arrowsWrapper.remove();
                }
                _.options.arrows = (target) ? target : _.options.arrows;
                _.arrows();
            }

        };

    }

    Glide.prototype.build = function() {

        var _ = this;

        if (_.options.arrows) _.arrows();

        if (_.options.nav) _.navigation();

    };

    Glide.prototype.navigation = function() {

        var _ = this;

        if (_.slides.length > 1) {
            var o = _.options,
                target = (_.options.nav === true) ? _.parent : _.options.nav;

            _.navWrapper = $('<div />', {
                'class': o.navClass
            }).appendTo(target);

            var nav = _.navWrapper,
                item;

            for (var i = 0; i < _.slides.length; i++) {
                item = $('<a />', {
                    'href': '#',
                    'class': o.navItemClass,
                    'data-distance': i
                }).appendTo(nav);

                nav[i + 1] = item;
            }

            var navChildren = nav.children();

            navChildren.eq(0).addClass(o.navCurrentItemClass);

            if (o.navCenter) {
                nav.css({
                    'left': '50%',
                    'width': navChildren.outerWidth(true) * navChildren.length,
                    'margin-left': -nav.outerWidth(true) / 2
                });
            }

            navChildren.on('click touchstart', function(e) {
                e.preventDefault();
                _.slide($(this).data('distance'), true);
            });
        }

    };

    Glide.prototype.arrows = function() {

        var _ = this;

        if (_.slides.length > 1) {
            var o = _.options,
                target = (_.options.arrows === true) ? _.parent : _.options.arrows;

            _.arrowsWrapper = $('<div />', {
                'class': o.arrowsWrapperClass
            }).appendTo(target);

            var arrows = _.arrowsWrapper;

            arrows.right = $('<a />', {
                'href': '#',
                'class': o.arrowMainClass + ' ' + o.arrowRightClass,
                'data-distance': '1',
                'html': o.arrowRightText
            }).appendTo(arrows);

            arrows.left = $('<a />', {
                'href': '#',
                'class': o.arrowMainClass + ' ' + o.arrowLeftClass,
                'data-distance': '-1',
                'html': o.arrowLeftText
            }).appendTo(arrows);

            arrows.children().on('click touchstart', function(e) {
                e.preventDefault();
                _.slide($(this).data('distance'), false);
            });
        }

    };


    Glide.prototype.slide = function(distance, jump, callback) {

        var _ = this;

        _.pause();

        _.options.beforeTransition.call(_);

        var currentSlide = (jump) ? 0 : _.currentSlide,
            slidesLength = -(_.slides.length - 1),
            navCurrentClass = _.options.navCurrentItemClass,
            slidesSpread = _.slides.spread;

        if (currentSlide === 0 && distance === -1) {
            currentSlide = slidesLength;
        } else if (currentSlide === slidesLength && distance === 1) {
            currentSlide = 0;
        } else {
            currentSlide = currentSlide + (-distance);
        }

        var translate = slidesSpread * currentSlide + 'px';

        if (_.CSS3support) {
            _.wrapper.css({
                '-webkit-transform': 'translate3d(' + translate + ', 0px, 0px)',
                '-moz-transform': 'translate3d(' + translate + ', 0px, 0px)',
                '-ms-transform': 'translate3d(' + translate + ', 0px, 0px)',
                '-o-transform': 'translate3d(' + translate + ', 0px, 0px)',
                'transform': 'translate3d(' + translate + ', 0px, 0px)'
            });
        } else {
            _.wrapper.stop()
                .animate({
                    'margin-left': translate
                }, _.options.animationTime);
        }

        if (_.options.nav && _.navWrapper) {
            _.navWrapper.children()
                .eq(-currentSlide)
                .addClass(navCurrentClass)
                .siblings()
                .removeClass(navCurrentClass);
        }

        _.currentSlide = currentSlide;

        _.options.afterTransition.call(_);
        if ((callback !== 'undefined') && (typeof callback === 'function')) callback();

        _.play();

    };

    Glide.prototype.play = function() {

        var _ = this;

        if (_.options.autoplay) {
            _.auto = setInterval(function() {
                _.slide(1, false);
            }, _.options.autoplay);
        }

    };

    Glide.prototype.pause = function() {

        var _ = this;

        if (_.options.autoplay) {
            _.auto = clearInterval(_.auto);
        }

    };

    Glide.prototype.swipe = function() {

        var _ = this,
            touch,
            touchDistance,
            touchStartX,
            touchStartY,
            touchEndX,
            touchEndY,
            touchHypotenuse,
            touchCathetus,
            touchSin,
            MathPI = 180 / Math.PI,
            subExSx,
            subEySy,
            powEX,
            powEY;

        _.parent.on('touchstart', function(e) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

            touchStartX = touch.pageX;
            touchStartY = touch.pageY;
        });

        _.parent.on('touchmove', function(e) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

            touchEndX = touch.pageX;
            touchEndY = touch.pageY;

            subExSx = touchEndX - touchStartX;
            subEySy = touchEndY - touchStartY;
            powEX = Math.abs(subExSx << 2);
            powEY = Math.abs(subEySy << 2);

            touchHypotenuse = Math.sqrt(powEX + powEY);
            touchCathetus = Math.sqrt(powEY);
            touchSin = Math.asin(touchCathetus / touchHypotenuse);

            if ((touchSin * MathPI) < 32) e.preventDefault();
        });

        _.parent.on('touchend', function(e) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

            touchDistance = touch.pageX - touchStartX;

            if (touchDistance > _.options.touchDistance) {
                _.slide(-1);
            } else if (touchDistance < -_.options.touchDistance) {
                _.slide(1);
            }
        });

    };

    Glide.prototype.init = function() {

        var _ = this,
            sliderWidth = _.parent.width();
        _.slides.spread = sliderWidth;

        _.wrapper.width(sliderWidth * _.slides.length);
        _.slides.width(_.slides.spread);

        if (!isCssSupported("transition") || !isCssSupported("transform")) _.CSS3support = false;

    };

    function isCssSupported(declaration) {

        var isSupported = false,
            prefixes = 'Khtml ms O Moz Webkit'.split(' '),
            clone = document.createElement('div'),
            declarationCapital = null;

        declaration = declaration.toLowerCase();
        if (clone.style[declaration] !== undefined) isSupported = true;
        if (isSupported === false) {
            declarationCapital = declaration.charAt(0).toUpperCase() + declaration.substr(1);
            for (var i = 0; i < prefixes.length; i++) {
                if (clone.style[prefixes[i] + declarationCapital] !== undefined) {
                    isSupported = true;
                    break;
                }
            }
        }

        if (window.opera) {
            if (window.opera.version() < 13) isSupported = false;
        }


        return isSupported;

    }

    $.fn[name] = function(options) {

        return this.each(function() {
            if (!$.data(this, 'api_' + name)) {
                $.data(this, 'api_' + name,
                    new Glide($(this), options)
                );
            }
        });

    };

})(jQuery, window, document);

// Remodal

!(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory(root, $);
        });
    } else if (typeof exports === 'object') {
        factory(root, require('jquery'));
    } else {
        factory(root, root.jQuery || root.Zepto);
    }
})(this, function(global, $) {

    'use strict';

    var PLUGIN_NAME = 'remodal';
    var NAMESPACE = global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.NAMESPACE || PLUGIN_NAME;
    var ANIMATIONSTART_EVENTS = $.map(
        ['animationstart', 'webkitAnimationStart', 'MSAnimationStart', 'oAnimationStart'],

        function(eventName) {
            return eventName + '.' + NAMESPACE;
        }

    ).join(' ');

    var ANIMATIONEND_EVENTS = $.map(
        ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'],

        function(eventName) {
            return eventName + '.' + NAMESPACE;
        }

    ).join(' ');


    var DEFAULTS = $.extend({
        hashTracking: true,
        closeOnConfirm: true,
        closeOnCancel: true,
        closeOnEscape: true,
        closeOnOutsideClick: true,
        modifier: ''
    }, global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.DEFAULTS);

    var STATES = {
        CLOSING: 'closing',
        CLOSED: 'closed',
        OPENING: 'opening',
        OPENED: 'opened'
    };

    var STATE_CHANGE_REASONS = {
        CONFIRMATION: 'confirmation',
        CANCELLATION: 'cancellation'
    };

    var IS_ANIMATION = (function() {
        var style = document.createElement('div').style;

        return style.animationName !== undefined ||
            style.WebkitAnimationName !== undefined ||
            style.MozAnimationName !== undefined ||
            style.msAnimationName !== undefined ||
            style.OAnimationName !== undefined;
    })();

    var IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform);
    var current;
    var scrollTop;

    function getAnimationDuration($elem) {
        if (
            IS_ANIMATION &&
            $elem.css('animation-name') === 'none' &&
            $elem.css('-webkit-animation-name') === 'none' &&
            $elem.css('-moz-animation-name') === 'none' &&
            $elem.css('-o-animation-name') === 'none' &&
            $elem.css('-ms-animation-name') === 'none'
        ) {
            return 0;
        }

        var duration = $elem.css('animation-duration') ||
            $elem.css('-webkit-animation-duration') ||
            $elem.css('-moz-animation-duration') ||
            $elem.css('-o-animation-duration') ||
            $elem.css('-ms-animation-duration') ||
            '0s';

        var delay = $elem.css('animation-delay') ||
            $elem.css('-webkit-animation-delay') ||
            $elem.css('-moz-animation-delay') ||
            $elem.css('-o-animation-delay') ||
            $elem.css('-ms-animation-delay') ||
            '0s';

        var iterationCount = $elem.css('animation-iteration-count') ||
            $elem.css('-webkit-animation-iteration-count') ||
            $elem.css('-moz-animation-iteration-count') ||
            $elem.css('-o-animation-iteration-count') ||
            $elem.css('-ms-animation-iteration-count') ||
            '1';

        var max;
        var len;
        var num;
        var i;

        duration = duration.split(', ');
        delay = delay.split(', ');
        iterationCount = iterationCount.split(', ');

        for (i = 0, len = duration.length, max = Number.NEGATIVE_INFINITY; i < len; i++) {
            num = parseFloat(duration[i]) * parseInt(iterationCount[i], 10) + parseFloat(delay[i]);

            if (num > max) {
                max = num;
            }
        }

        return num;
    }

    function getScrollbarWidth() {
        if ($(document.body).height() <= $(window).height()) {
            return 0;
        }

        var outer = document.createElement('div');
        var inner = document.createElement('div');
        var widthNoScroll;
        var widthWithScroll;

        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        document.body.appendChild(outer);

        widthNoScroll = outer.offsetWidth;

        outer.style.overflow = 'scroll';

        inner.style.width = '100%';
        outer.appendChild(inner);

        widthWithScroll = inner.offsetWidth;

        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    function lockScreen() {
        if (IS_IOS) {
            return;
        }

        var $html = $('html');
        var lockedClass = namespacify('is-locked');
        var paddingRight;
        var $body;

        if (!$html.hasClass(lockedClass)) {
            $body = $(document.body);

            paddingRight = parseInt($body.css('padding-right'), 10) + getScrollbarWidth();

            $body.css('padding-right', paddingRight + 'px');
            $html.addClass(lockedClass);
        }
    }

    function unlockScreen() {
        if (IS_IOS) {
            return;
        }

        var $html = $('html');
        var lockedClass = namespacify('is-locked');
        var paddingRight;
        var $body;

        if ($html.hasClass(lockedClass)) {
            $body = $(document.body);

            paddingRight = parseInt($body.css('padding-right'), 10) - getScrollbarWidth();

            $body.css('padding-right', paddingRight + 'px');
            $html.removeClass(lockedClass);
        }
    }

    function setState(instance, state, isSilent, reason) {

        var newState = namespacify('is', state);
        var allStates = [namespacify('is', STATES.CLOSING),
            namespacify('is', STATES.OPENING),
            namespacify('is', STATES.CLOSED),
            namespacify('is', STATES.OPENED)
        ].join(' ');

        instance.$bg
            .removeClass(allStates)
            .addClass(newState);

        instance.$overlay
            .removeClass(allStates)
            .addClass(newState);

        instance.$wrapper
            .removeClass(allStates)
            .addClass(newState);

        instance.$modal
            .removeClass(allStates)
            .addClass(newState);

        instance.state = state;
        !isSilent && instance.$modal.trigger({
            type: state,
            reason: reason
        }, [{
            reason: reason
        }]);
    }

    function syncWithAnimation(doBeforeAnimation, doAfterAnimation, instance) {
        var runningAnimationsCount = 0;

        var handleAnimationStart = function(e) {
            if (e.target !== this) {
                return;
            }

            runningAnimationsCount++;
        };

        var handleAnimationEnd = function(e) {
            if (e.target !== this) {
                return;
            }

            if (--runningAnimationsCount === 0) {

                $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
                    instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
                });

                doAfterAnimation();
            }
        };

        $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
            instance[elemName]
                .on(ANIMATIONSTART_EVENTS, handleAnimationStart)
                .on(ANIMATIONEND_EVENTS, handleAnimationEnd);
        });

        doBeforeAnimation();

        if (
            getAnimationDuration(instance.$bg) === 0 &&
            getAnimationDuration(instance.$overlay) === 0 &&
            getAnimationDuration(instance.$wrapper) === 0 &&
            getAnimationDuration(instance.$modal) === 0
        ) {

            $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
                instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
            });

            doAfterAnimation();
        }
    }

    function halt(instance) {
        if (instance.state === STATES.CLOSED) {
            return;
        }

        $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
            instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
        });

        instance.$bg.removeClass(instance.settings.modifier);
        instance.$overlay.removeClass(instance.settings.modifier).hide();
        instance.$wrapper.hide();
        unlockScreen();
        setState(instance, STATES.CLOSED, true);
    }

    function parseOptions(str) {
        var obj = {};
        var arr;
        var len;
        var val;
        var i;

        str = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');

        arr = str.split(',');
        for (i = 0, len = arr.length; i < len; i++) {
            arr[i] = arr[i].split(':');
            val = arr[i][1];

            if (typeof val === 'string' || val instanceof String) {
                val = val === 'true' || (val === 'false' ? false : val);
            }

            if (typeof val === 'string' || val instanceof String) {
                val = !isNaN(val) ? +val : val;
            }

            obj[arr[i][0]] = val;
        }

        return obj;
    }

    function namespacify() {
        var result = NAMESPACE;

        for (var i = 0; i < arguments.length; ++i) {
            result += '-' + arguments[i];
        }

        return result;
    }

    function handleHashChangeEvent() {
        var id = location.hash.replace('#', '');
        var instance;
        var $elem;

        if (!id) {

            if (current && current.state === STATES.OPENED && current.settings.hashTracking) {
                current.close();
            }
        } else {

            try {
                $elem = $(
                    '[data-' + PLUGIN_NAME + '-id="' + id + '"]'
                );
            } catch (err) {}

            if ($elem && $elem.length) {
                instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];

                if (instance && instance.settings.hashTracking) {
                    instance.open();
                }
            }

        }
    }

    function Remodal($modal, options) {
        var $body = $(document.body);
        var remodal = this;

        remodal.settings = $.extend({}, DEFAULTS, options);
        remodal.index = $[PLUGIN_NAME].lookup.push(remodal) - 1;
        remodal.state = STATES.CLOSED;

        remodal.$overlay = $('.' + namespacify('overlay'));

        if (!remodal.$overlay.length) {
            remodal.$overlay = $('<div>').addClass(namespacify('overlay') + ' ' + namespacify('is', STATES.CLOSED)).hide();
            $body.append(remodal.$overlay);
        }

        remodal.$bg = $('.' + namespacify('bg')).addClass(namespacify('is', STATES.CLOSED));

        remodal.$modal = $modal
            .addClass(
                NAMESPACE + ' ' +
                namespacify('is-initialized') + ' ' +
                remodal.settings.modifier + ' ' +
                namespacify('is', STATES.CLOSED))
            .attr('tabindex', '-1');

        remodal.$wrapper = $('<div>')
            .addClass(
                namespacify('wrapper') + ' ' +
                remodal.settings.modifier + ' ' +
                namespacify('is', STATES.CLOSED))
            .hide()
            .append(remodal.$modal);
        $body.append(remodal.$wrapper);

        remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="close"]', function(e) {
            e.preventDefault();

            remodal.close();
        });

        remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="cancel"]', function(e) {
            e.preventDefault();

            remodal.$modal.trigger(STATE_CHANGE_REASONS.CANCELLATION);

            if (remodal.settings.closeOnCancel) {
                remodal.close(STATE_CHANGE_REASONS.CANCELLATION);
            }
        });

        remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="confirm"]', function(e) {
            e.preventDefault();

            remodal.$modal.trigger(STATE_CHANGE_REASONS.CONFIRMATION);

            if (remodal.settings.closeOnConfirm) {
                remodal.close(STATE_CHANGE_REASONS.CONFIRMATION);
            }
        });

        remodal.$wrapper.on('click.' + NAMESPACE, function(e) {
            var $target = $(e.target);

            if (!$target.hasClass(namespacify('wrapper'))) {
                return;
            }

            if (remodal.settings.closeOnOutsideClick) {
                remodal.close();
            }
        });
    }

    Remodal.prototype.open = function() {
        var remodal = this;
        var id;

        if (remodal.state === STATES.OPENING || remodal.state === STATES.CLOSING) {
            return;
        }

        id = remodal.$modal.attr('data-' + PLUGIN_NAME + '-id');

        if (id && remodal.settings.hashTracking) {
            scrollTop = $(window).scrollTop();
            location.hash = id;
        }

        if (current && current !== remodal) {
            halt(current);
        }

        current = remodal;
        lockScreen();
        remodal.$bg.addClass(remodal.settings.modifier);
        remodal.$overlay.addClass(remodal.settings.modifier).show();
        remodal.$wrapper.show().scrollTop(0);
        remodal.$modal.focus();

        syncWithAnimation(
            function() {
                setState(remodal, STATES.OPENING);
            },

            function() {
                setState(remodal, STATES.OPENED);
            },

            remodal);
    };

    Remodal.prototype.close = function(reason) {
        var remodal = this;

        if (remodal.state === STATES.OPENING || remodal.state === STATES.CLOSING) {
            return;
        }

        if (
            remodal.settings.hashTracking &&
            remodal.$modal.attr('data-' + PLUGIN_NAME + '-id') === location.hash.substr(1)
        ) {
            location.hash = '';
            $(window).scrollTop(scrollTop);
        }

        syncWithAnimation(
            function() {
                setState(remodal, STATES.CLOSING, false, reason);
            },

            function() {
                remodal.$bg.removeClass(remodal.settings.modifier);
                remodal.$overlay.removeClass(remodal.settings.modifier).hide();
                remodal.$wrapper.hide();
                unlockScreen();

                setState(remodal, STATES.CLOSED, false, reason);
            },

            remodal);
    };

    Remodal.prototype.getState = function() {
        return this.state;
    };

    Remodal.prototype.destroy = function() {
        var lookup = $[PLUGIN_NAME].lookup;
        var instanceCount;

        halt(this);
        this.$wrapper.remove();

        delete lookup[this.index];
        instanceCount = $.grep(lookup, function(instance) {
            return !!instance;
        }).length;

        if (instanceCount === 0) {
            this.$overlay.remove();
            this.$bg.removeClass(
                namespacify('is', STATES.CLOSING) + ' ' +
                namespacify('is', STATES.OPENING) + ' ' +
                namespacify('is', STATES.CLOSED) + ' ' +
                namespacify('is', STATES.OPENED));
        }
    };

    $[PLUGIN_NAME] = {
        lookup: []
    };

    $.fn[PLUGIN_NAME] = function(opts) {
        var instance;
        var $elem;

        this.each(function(index, elem) {
            $elem = $(elem);

            if ($elem.data(PLUGIN_NAME) == null) {
                instance = new Remodal($elem, opts);
                $elem.data(PLUGIN_NAME, instance.index);

                if (
                    instance.settings.hashTracking &&
                    $elem.attr('data-' + PLUGIN_NAME + '-id') === location.hash.substr(1)
                ) {
                    instance.open();
                }
            } else {
                instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];
            }
        });

        return instance;
    };

    $(document).ready(function() {

        $(document).on('click', '[data-' + PLUGIN_NAME + '-target]', function(e) {
            e.preventDefault();

            var elem = e.currentTarget;
            var id = elem.getAttribute('data-' + PLUGIN_NAME + '-target');
            var $target = $('[data-' + PLUGIN_NAME + '-id="' + id + '"]');

            $[PLUGIN_NAME].lookup[$target.data(PLUGIN_NAME)].open();
        });

        $(document).find('.' + NAMESPACE).each(function(i, container) {
            var $container = $(container);
            var options = $container.data(PLUGIN_NAME + '-options');

            if (!options) {
                options = {};
            } else if (typeof options === 'string' || options instanceof String) {
                options = parseOptions(options);
            }

            $container[PLUGIN_NAME](options);
        });

        $(document).on('keydown.' + NAMESPACE, function(e) {
            if (current && current.settings.closeOnEscape && current.state === STATES.OPENED && e.keyCode === 27) {
                current.close();
            }
        });

        $(window).on('hashchange.' + NAMESPACE, handleHashChangeEvent);
    });
});