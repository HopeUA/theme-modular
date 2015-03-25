$(function(){

    var status = true;

    //moveTimeline();

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

    function moveTimeline() {

        var self = $('.header-timeline__item-current');
        var timelineItems = $('.header-timeline__items');
        var timelineItemsLeft = timelineItems.position();
        timelineItemsLeft = timelineItemsLeft.left;

        var width       = self.outerWidth() - 14;
        var before      = self.find('.before')
        var after       = self.find('.after')
        var beforeWidth = before.width();
        var afterWidth  = after.width();
        var left   = self.find('.after').css('left');
        var shift  = 9;

        var shiftMain = (width - beforeWidth) + shift;
        var shiftTimeline = timelineItemsLeft - shiftMain;

        before.animate({width : width}, 1500);
        timelineItems.animate({left : shiftTimeline}, 2000);

    }

    function loadJson(url) {

        var self = $('.header-timeline__item-current');
        var $before = self.find('.before');
        var $after  = self.find('.after');

        currentBefore = null;
        currentAfter  = null;

        $.getJSON(url, function(data) {
            var serverTime   = data.serverTime;
            var episodes     = data.episodes;
            var str          = null;
            var place        = $('.header-timeline__items');
            var minutes      = null;
            var multiplier   = 5;
            var minutes      = null;
            var elementClass = null;

            var minWidth = 100;

            console.log('Current ServerTime: ' + myTime(serverTime) + ' unix: ' + serverTime);

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

                if (end < serverTime) {
                    before = element.duration;
                    after  = 0;
                    elementClass = 'header-timeline__item';
                }

                if (before < 0) {
                    before = 0;
                    after  = element.duration;
                    elementClass = 'header-timeline__item-next';
                }

                if (before > 0 && after > 0) {
                    elementClass = 'header-timeline__item-current';
                    currentBefore = before / (element.duration / width);
                    currentAfter  = after / (element.duration / width);
                }

                str = '<div class="' + elementClass + '" style="width: ' + width + 'px"><div class="before"></div><span class="header-timeline__time">' + myTime(element.beginTime) + '</span><span class="header-timeline__live">' + element.label +'</span><p class="header-timeline__description">' + element.showTitle + '</p><div class="after"></div></div>'
                place.append(str);
            });
        });

        $before.css('width', currentBefore);
        $after.css('width', currentAfter);
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
