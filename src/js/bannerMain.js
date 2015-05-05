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

                mainColor = $last.data('averegecolor');

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

                mainColor = $next.data('averegecolor');

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

                $current.animate({opacity : 0}, time);
                $first.animate({opacity : 1}, time);

                mainColor = $first.data('averegecolor');

                $labelActive.removeClass('header-banner__controls-item__active');
                $labelFirst.addClass('header-banner__controls-item__active');

                setTimeout(function(){
                    $current.removeClass('header-banner__item__current');
                    $first.addClass('header-banner__item__current');
                    $current = $('.header-banner__item__current');
                    $current.animate({opacity : 1}, time);
                }, time)

            } else {

                $current.animate({opacity : 0}, time);
                $next.animate({opacity : 1}, time);

                mainColor = $next.data('averegecolor');

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
    }

    function moveTo(self, index) {

        var $labelActive = $('.header-banner__controls-item__active');

        var $current = $('.header-banner__item__current');
        var $first   = $('.header-banner__item').first();
        var $last    = $('.header-banner__item').last();

        var $next = $('.header-banner__item').eq(index);

        mainColor = $next.data('averegecolor');

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
    }

    var mainColor = $('.header-banner__item').eq(0).data('averegecolor');

    function bannerTimer() {

        var $line = $('.header-banner__loader');
        var timer = 5000;
        var width = $(window).width();

        var $line = $('.header-banner__loader');

        $line.css('background-color', mainColor);

        $line.animate({
            width: width
        }, 4990, 'linear', function(){
            move('right');
        });

        setTimeout(function(){
            $line.animate({width : 0}, 0);
        }, 4990);

    };

    var sliderAnimations = null;
    var changeTimeout = null;
    var $line = $('.header-banner__loader');

    bannerTimer();

    var sliderAnimations = setInterval(bannerTimer, 5010);

    $('.header__large').hover(function(){
        clearInterval(sliderAnimations);
        $line.stop();
        $line.animate({width : 0}, 600);

    }, function(){
        bannerTimer();
        sliderAnimations = setInterval(bannerTimer, 5010);

    });

    //console.log('test');
});
