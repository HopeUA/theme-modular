$(function(){

    var elementArrowLeft   = $('.header-banner__arrow_left');
    var elementArrowRight  = $('.header-banner__arrow_right');

    elementArrowRight.click(function(){

        var $current = $('.header-banner__item__current');
        var $next    = $('.header-banner__item__current').next('.header-banner__item');
        var $prev    = $('.header-banner__item__current').prev('.header-banner__item');
        var $first   = $('.header-banner__item').first();

        $current.animate({opacity : 0}, 200);

        $current.removeClass('header-banner__item__current');

        if ($next.length === 0) {
            $first.addClass('header-banner__item__current');

            return;
        }

        $next.animate({opacity : 1}, 200);
        setTimeout(function(){
            $next.addClass('header-banner__item__current');
        });

    });
});
