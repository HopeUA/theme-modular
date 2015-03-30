$(function(){

    var status = true;

    loadJson('/dist/ajax/timeline.json');



    $('.header-timeline__items > div').click(function(){
        toogleTimeline(status);
        status = !status;
    });

    $('.header-timeline-menu-item__current .header-timeline-menu-item-full-close').click(function(){
        hideTimeline();
    });

});

    function toogleTimeline(status) {
        if (status) {
            showTimeline();
        } else {
            hideTimeline();
        }
    };

    function hideTimeline() {

        var timelineMenu = $('.header-timeline-menu');
        var blur = 'blur(6px)';

        var elementTime        = $('.header-banner__item-time');
        var elementDay         = $('.header-banner__item-day');
        var elementTitle       = $('.header-banner__item-title');
        var elementDescription = $('.header-banner__item-description');
        var elementPlay        = $('.header-banner__item-play');
        var elementArrowLeft   = $('.header-banner__arrow_left');
        var elementArrowRight  = $('.header-banner__arrow_right');
        var elementControls    = $('.header-banner__controls');

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
        show(elementControls, 200);

        function show($object, time){
            $object.animate({opacity : 1}, time);
        };

        return false;
    };

    function showTimeline() {

        var timelineMenu = $('.header-timeline-menu');
        var blur = 'blur(6px)';

        var elementTime        = $('.header-banner__item-time');
        var elementDay         = $('.header-banner__item-day');
        var elementTitle       = $('.header-banner__item-title');
        var elementDescription = $('.header-banner__item-description');
        var elementPlay        = $('.header-banner__item-play');
        var elementArrowLeft   = $('.header-banner__arrow_left');
        var elementArrowRight  = $('.header-banner__arrow_right');
        var elementControls    = $('.header-banner__controls');

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
        hide(elementControls, 200);

        function hide($object, time){
            $object.animate({opacity : 0}, time);
        };

        return true;
    };

    function loadJson(url) {

        var self = $('.header-timeline__item-current');
        var $before = self.find('.before');
        var $after  = self.find('.after');

        $.getJSON(url, function(data) {
            var serverTime   = data.serverTime;
            var episodes     = data.episodes;
            var str          = null;
            var place        = $('.header-timeline__items');
            var minutes      = null;
            var multiplier   = 5;
            var minutes      = null;
            var elementClass = null;
            var currentBefore = null;
            var currentAfter  = null;
            var leftAfter     = null;
            var leftTimeline  = null;
            var counterElements = null;

            var minWidth = 100;

            $.each(episodes, function(index, element) {

                var start    = element.beginTime;
                var duration = element.duration / 60;
                var end      = start + element.duration;
                var after    = end - serverTime;
                var before   = element.duration - after;
                var width    = multiplier * duration;

                if (width < minWidth) {
                    width = minWidth;
                }

                if (end <= serverTime) {
                    before = element.duration;
                    after  = 0;
                    elementClass = 'header-timeline__item';
                    leftTimeline += width;
                }

                if (before < 0) {
                    before = 0;
                    after  = element.duration;
                    elementClass = 'header-timeline__item-next';
                }

                if (before > 0 && after > 0 || start == serverTime) {
                    elementClass = 'header-timeline__item-current';
                    currentBefore = ((width - 28) / duration) * (before / 60);
                    currentAfter  = (width - 28) - currentBefore;
                    leftAfter = currentBefore + 13;

                    if (start == serverTime) {
                        leftTimeline -= 5;
                    }
                }

//                console.log(elementClass);
//                console.log(element.showTitle);
//                console.log('begin: ' + myTime(start));
//                console.log('before: ' + myTime(before));
//                console.log('after: ' + myTime(after));
//                console.log('************************');


                str = '<div class="' + elementClass + '" style="width: ' + width + 'px"><div class="before"></div><span class="header-timeline__time">' + myTime(element.beginTime) + '</span><span class="header-timeline__live">' + element.label +'</span><p class="header-timeline__description">' + element.showTitle + '</p><div class="after"></div></div>'
                place.append(str);

            });

            counterElements = $('.header-timeline__item').length;

            $('.header-timeline__item-current .before').css('width', currentBefore);
            $('.header-timeline__item-current .after').css({'width' : currentAfter, 'left' : leftAfter});

            leftTimeline += currentBefore + 5;
            leftTimeline = '-' + leftTimeline + 'px';
            $('.header-timeline__items').css('left', leftTimeline);

            var timelineIntervalCounter = 0;

            var timelineInterval = setInterval(function(){
                if(timelineIntervalCounter >= 999) {
                    clearInterval(timelineInterval);
                } else {
                    moveTimeline();
                    console.log('counter: ' + timelineIntervalCounter);
                    timelineIntervalCounter++;
                }
            }, 3000);

        });
    }

    function moveTimeline() {

        var timelineItems = $('.header-timeline__items');
        var timelineItemsLeft = timelineItems.position();
        timelineItemsLeft = timelineItemsLeft.left - 5;

        var $currentElement = $('.header-timeline__item-current');
        var $currentElementWidth = $currentElement.width() + 3;
        var $currentElementBefore = $currentElement.find('.before');
        var $currentElementBeforeWidth = $currentElementBefore.width();
        var $currentElementAfter = $currentElement.find('.after');
        var $currentElementAfterWidth = $currentElementAfter.width();
        var $currentElementAfterMargin = parseInt($currentElementAfter.css('margin-left'));

        if ($currentElementBeforeWidth < $currentElementWidth) {
            $currentElementBeforeWidth = $currentElementBeforeWidth + 5;
            $currentElementAfterWidth = $currentElementAfterWidth - 5;
            $currentElementAfterMargin = $currentElementAfterMargin + 5;
            $currentElementBefore.animate({'width' : $currentElementBeforeWidth}, 300, 'linear');
            $currentElementAfter.animate({'width' : $currentElementAfterWidth, 'margin-left' : $currentElementAfterMargin}, 300, 'linear');
        } else if ($currentElementBeforeWidth == $currentElementWidth) {
            $currentElement = $('.header-timeline__item-current');
            $currentElement.addClass('header-timeline__item');
            $currentElement.removeClass('header-timeline__item-current');
            $currentElement.next().removeClass('header-timeline__item-next');
            $currentElement.next().addClass('header-timeline__item-current');
            console.log('finish');
        }

        timelineItems.animate({'left' : timelineItemsLeft}, 300, 'linear');

    }

    function myTime(unixTime) {

        var date = new Date(unixTime *1000);

        var hours   = date.getUTCHours();
        var minutes = date.getUTCMinutes();

        hours   = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;

        var result = hours + ':' + minutes;

        return result;
    }
