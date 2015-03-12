$(function(){

    var status = true;

    $('.header-timeline__items > div').click(function(){

        var timelineMenu = $('.header-timeline-menu');
        var blur = 'blur(6px)';

        var elementTime        = $('.header-banner__item-time');
        var elementDay         = $('.header-banner__item-day');
        var elementTitle       = $('.header-banner__item-title');
        var elementDescription = $('.header-banner__item-description');
        var elementPlay        = $('.header-banner__item-play');
        var elementArrowLeft   = $('.header-banner__arrow_left');
        var elementArrowRight  = $('.header-banner__arrow_right');

        if (status) {
            timelineMenu.css({display : 'block'});
            timelineMenu.animate({opacity : 1}, 200);

            $('.header-banner__item').css('filter', blur)
                .css('webkitFilter', blur)
                .css('mozFilter', blur)
                .css('oFilter', blur)
                .css('msFilter', blur);

            hide(elementTime, 200);
            hide(elementDay, 200);
            hide(elementTitle, 200);
            hide(elementDescription, 200);
            hide(elementPlay, 200);
            hide(elementArrowLeft, 200);
            hide(elementArrowRight, 200);

        } else {
            timelineMenu.animate({opacity : 0}, 200);
            setTimeout(function(){
                timelineMenu.css({display : 'none'});
            }, 200);

            $('.header-banner__item').css('filter', 'blur(0)')
                .css('webkitFilter', 'blur(0)')
                .css('mozFilter', 'blur(0)')
                .css('oFilter', 'blur(0)')
                .css('msFilter', 'blur(0)');

            show(elementTime, 200);
            show(elementDay, 200);
            show(elementTitle, 200);
            show(elementDescription, 200);
            show(elementPlay, 200);
            show(elementArrowLeft, 200);
            show(elementArrowRight, 200);

        }

        function hide($object, time){
            $object.animate({opacity : 0}, time);
        };

        function show($object, time){
            $object.animate({opacity : 1}, time);
        };

        status = !status;
    });
});
