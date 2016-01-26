$(function(){

    var elementArrowLeft   = $('.header-banner__arrow_left');
    var elementArrowRight  = $('.header-banner__arrow_right');

    elementArrowLeft.click(function(){

        move('left');

    });

    elementArrowRight.click(function(){

        move('right');

    });

    $('.header-banner__controls-item').click(function(){
        var index = $(this).index();

        moveTo(this, index);
    });

    function move(direction) {
        var time = 400;

        var $current = $('.header-banner__item__current');
        var $first   = $('.header-banner__item').first();
        var $last    = $('.header-banner__item').last();
        currentIndex = $current.index();

        var $labelActive = $('.header-banner__controls-item__active');
        var $labelFirst   = $('.header-banner__controls-item').first();
        var $labelLast    = $('.header-banner__controls-item').last();

        if (direction === 'left') {

            var $next = $('.header-banner__item__current').prev('.header-banner__item');
            var $prev = $('.header-banner__item__current').next('.header-banner__item');

            var $labelNext = $labelActive.prev('.header-banner__controls-item');
            var $labelPrev = $labelActive.next('.header-banner__controls-item');

            if ($first.hasClass('header-banner__item__current')) {

                $current.animate({opacity : 0}, time);
                $last.animate({opacity : 1}, time);

                mainColor = $last.data('averagecolor');

                $labelActive.removeClass('header-banner__controls-item__active');
                $labelLast.addClass('header-banner__controls-item__active');

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $last.addClass('header-banner__item__current');
                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time)

            } else {

                $current.animate({opacity : 0}, time);
                $next.animate({opacity : 1}, time);

                mainColor = $next.data('averagecolor');

                $labelActive.removeClass('header-banner__controls-item__active');
                $labelNext.addClass('header-banner__controls-item__active');

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $next.addClass('header-banner__item__current');
                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time);
            }

        } else if (direction === 'right') {

            var $next = $('.header-banner__item__current').next('.header-banner__item');
            var $prev = $('.header-banner__item__current').prev('.header-banner__item');

            var $labelNext = $labelActive.next('.header-banner__controls-item');
            var $labelPrev = $labelActive.prev('.header-banner__controls-item');

            if ($last.hasClass('header-banner__item__current')) {
                mainColor = $first.data('averagecolor');

                $current.animate({opacity : 0}, time);
                $first.animate({opacity : 1}, time);

                $labelActive.removeClass('header-banner__controls-item__active');
                $labelFirst.addClass('header-banner__controls-item__active');

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $first.addClass('header-banner__item__current');
                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time)

            } else {
                mainColor = $next.data('averagecolor');

                $current.animate({opacity : 0}, time);
                $next.animate({opacity : 1}, time);

                $labelActive.removeClass('header-banner__controls-item__active');
                $labelNext.addClass('header-banner__controls-item__active');

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $next.addClass('header-banner__item__current');
                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time);
            }
        }

        bannerTimer();
    }

    function moveTo(self, index) {

        var $labelActive = $('.header-banner__controls-item__active');

        var $current = $('.header-banner__item__current');
        var $first   = $('.header-banner__item').first();
        var $last    = $('.header-banner__item').last();

        var $next = $('.header-banner__item').eq(index);

        mainColor = $next.data('averagecolor');

        $labelActive.removeClass('header-banner__controls-item__active');
        $(self).addClass('header-banner__controls-item__active');

        $current.animate({opacity : 0}, 400);
        $next.animate({opacity : 1}, 400);

        setTimeout(function(){
            $current.removeClass('header-banner__item__current');
            $next.addClass('header-banner__item__current');
            $current = $('.header-banner__item__current');
            $current.animate({opacity : 1}, 400);
        }, 400);

        bannerTimer();
    }

    var mainColor = $('.header-banner__item').eq(0).data('averagecolor');

    function bannerTimer() {

        var $line = $('.header-banner__loader');
        var timer = 4990;
        var width = $(window).width();

        $line.css('background-color', mainColor);

        $line.animate({
            width: width
        }, timer, 'linear', function(){
            $line.animate({width : 0}, 0);
            move('right');
        });
    };

    var changeTimeout = null;
    var $line = $('.header-banner__loader');
    var mainSliderStatus = $('.header-timeline-menu').css('opacity');

    if (mainSliderStatus == 0) {
        bannerTimer();
    }

    $('.header__large').hover(function(){
        $line.stop();
        $line.animate({width : 0}, 600);

    }, function(){
        mainSliderStatus = $('.header-timeline-menu').css('opacity');

        if (mainSliderStatus == 0) {
            bannerTimer();
        }
    });
});
