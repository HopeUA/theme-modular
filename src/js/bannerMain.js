$(function(){

    var elementArrowLeft   = $('.header-banner__arrow_left');
    var elementArrowRight  = $('.header-banner__arrow_right');

    elementArrowLeft.click(function(){

        move('left');

    });

    elementArrowRight.click(function(){

        move('right');

    });

    function move(direction) {

        var time = 400;

        var $current = $('.header-banner__item__current');
        var $first   = $('.header-banner__item').first();
        var $last    = $('.header-banner__item').last();

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

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $labelActive.removeClass('header-banner__controls-item__active');
                    $labelLast.addClass('header-banner__controls-item__active');
                    $last.addClass('header-banner__item__current');

                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time)

            } else {

                $current.animate({opacity : 0}, time);
                $next.animate({opacity : 1}, time);

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $labelActive.removeClass('header-banner__controls-item__active');
                    $next.addClass('header-banner__item__current');
                    $labelNext.addClass('header-banner__controls-item__active');
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

                $current.animate({opacity : 0}, time);
                $first.animate({opacity : 1}, time);

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $labelActive.removeClass('header-banner__controls-item__active');
                    $labelFirst.addClass('header-banner__controls-item__active');
                    $first.addClass('header-banner__item__current');

                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time)

            } else {

                $current.animate({opacity : 0}, time);
                $next.animate({opacity : 1}, time);

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $labelActive.removeClass('header-banner__controls-item__active');
                    $next.addClass('header-banner__item__current');
                    $labelNext.addClass('header-banner__controls-item__active');

                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time);
            }
        }
    }

    function bannerTimer() {

        //

        var $line = $('.header-banner__loader');
        var timer = 5000;
        var width = $(window).width();

        var $line = $('.header-banner__loader');
        var $current = $('.header-banner__item__current').data('averegecolor');
        var color = $current;

        $line.css('background-color', color);

        $line.animate({
            width: width
        }, timer, 'linear');

        setTimeout(function(){
            move('right');
            $line.animate({width : 0}, 0);
        }, 4999);

    };

    var sliderAnimations = null;

//    var $line = $('.header-banner__loader');
//    var $current = $('.header-banner__item__current').data('averegecolor');
//    var color = $current;
//
//    $line.css('background-color', color);

    bannerTimer();
    var sliderAnimations = window.setInterval(bannerTimer, 5010);

    $('.header__large').hover(function(){
        window.clearInterval(sliderAnimations);
    }, function(){
        bannerTimer();
        sliderAnimations = window.setInterval(bannerTimer, 5010);
    });
});
