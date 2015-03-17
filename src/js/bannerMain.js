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
        var $last   = $('.header-banner__item').last();

        if (direction === 'left') {
            var $next    = $('.header-banner__item__current').prev('.header-banner__item');
            var $prev    = $('.header-banner__item__current').next('.header-banner__item');

            if ($first.hasClass('header-banner__item__current')) {

                $current.animate({opacity : 0}, time);
                $last.animate({opacity : 1}, time);

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $last.addClass('header-banner__item__current');

                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time)

            } else {

                $current.animate({opacity : 0}, time);
                $next.animate({opacity : 1}, time);

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $next.addClass('header-banner__item__current');

                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time);
            }

        } else if (direction === 'right') {

            var $next    = $('.header-banner__item__current').next('.header-banner__item');
            var $prev    = $('.header-banner__item__current').prev('.header-banner__item');

            if ($last.hasClass('header-banner__item__current')) {

                $current.animate({opacity : 0}, time);
                $first.animate({opacity : 1}, time);

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $first.addClass('header-banner__item__current');

                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time)

            } else {

                $current.animate({opacity : 0}, time);
                $next.animate({opacity : 1}, time);

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $next.addClass('header-banner__item__current');

                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time);
            }
        }
    }

    function bannerTimer() {
        var $line = $('.header-banner__loader');
        var time = 5000;
        var w = $(window).width();
        var speed = (w/time) * 1000;

        $line.animate({
            width: w
        }, time, 'linear')

        setTimeout(function(){
            move('right');
            $line.width(0);
        }, time);
    };

    bannerTimer();

    setInterval(function(){
        bannerTimer();
    }, 5000);

});
