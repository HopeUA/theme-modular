var timelineInterval = null;
var timelineIntervalCounter = 0;
var newTime = null;
var DateStopUnix = null;
var newTimeUnix = null;
var shouldMoveTimeline = true;


$(function () {

    var status = true;

    // new code
    //var serverTime = Hope.Chrono.getDate();
    //var year = moment(serverTime).format('YYYY');
    //var day = moment(serverTime).format('DD');
    //var month = moment(serverTime).format('MM');
    //var dateFull = year + '-' + month + '-' + day;
    //var daysFormatted = [dateFull];

    moment.locale('ru');
    var currentTime = null;

    loadJson();

    $('.header-timeline__items').on('click', 'div', function () {

        if ($('header').hasClass('header__small')) {
            window.location.href = '/scheduler.html';
        }

        var $current = $(this).parent().children();
        var index = $current.index(this);

        toogleTimeline(status, index);

        status = !status;
    });

    $('.header-timeline-menu-item-full-close').on('click', function () {

        hideTimeline();

        status = !status;

    });


    $('.header-timeline-menu-item-full__left').on('click', function () {
        moveFullTimeline('left');
    });

    $('.header-timeline-menu-item-full-arrow__right').on('click', function () {
        moveFullTimeline('right');
    });

    $('.header-timeline__items').on('mouseenter', '.header-timeline__item', function () {

        var self = $('.header-timeline__items > div').not($(this));
        var description = $(this).find('.header-timeline__description');

        self.stop().animate({
            'opacity': 0.5
        }, 250);

        description.stop().animate({
            'opacity': 1
        }, 250);

        console.log('header-timeline__item');

    });

    $('.header-timeline__items').on('mouseenter', '.header-timeline__item-current', function () {

        var self = $('.header-timeline__items > div').not($(this));
        var description = $(this).find('.header-timeline__description');

        self.stop().animate({
            'opacity': 0.5
        }, 250);

        description.stop().animate({
            'opacity': 1
        }, 250);

        console.log('header-timeline__item-current');

    });

    $('.header-timeline__items').on('mouseenter', '.header-timeline__item-next', function () {

        var self = $('.header-timeline__items > div').not($(this));
        var description = $(this).find('.header-timeline__description');

        self.stop().animate({
            'opacity': 0.5
        }, 250);

        description.stop().animate({
            'opacity': 1
        }, 250);

        console.log('header-timeline__item-next');

    });

    $('.header-timeline__items').on('mouseleave', '.header-timeline__item', function () {

        var self = $('.header-timeline__items > div').not($(this));
        var description = $(this).find('.header-timeline__description');

        self.stop().animate({
            'opacity': 1
        }, 250);

        description.stop().animate({
            'opacity': 0
        }, 250);

    });

    $('.header-timeline__items').on('mouseleave', '.header-timeline__item-current', function () {

        var self = $('.header-timeline__items > div').not($(this));
        var description = $(this).find('.header-timeline__description');

        self.stop().animate({
            'opacity': 1
        }, 250);

        description.stop().animate({
            'opacity': 0
        }, 250);

    });

    $('.header-timeline__items').on('mouseleave', '.header-timeline__item-next', function () {

        var self = $('.header-timeline__items > div').not($(this));
        var description = $(this).find('.header-timeline__description');

        self.stop().animate({
            'opacity': 1
        }, 250);

        description.stop().animate({
            'opacity': 0
        }, 250);

    });

    $('.header-timeline__items').on('mouseenter', '.header-timeline__item-current', function () {

        var self = $('.header-timeline-time');

        self.stop().animate({
            'opacity': 1
        }, 250);

    });

    $('.header-timeline__items').on('mouseleave', '.header-timeline__item-current', function () {

        var self = $('.header-timeline-time');

        self.stop().animate({
            'opacity': 0
        }, 250);

    });


    function isAnimated(self) {

        return self.is(':animated');

    };

    function showUnderElement(index) {

        var $items = $('.header-timeline-menu-items');

        var current = $items.find('.header-timeline-menu-item').eq(index);

        current.addClass('header-timeline-menu-item__current');

    };

    function toogleTimeline(status, index) {
        if (status) {
            showTimeline(index);
        } else {
            hideTimeline();
        }
    };

    function hideTimeline() {

        shouldMoveTimeline = true;
        var timeShift = (newTimeUnix - DateStopUnix) / 60;

        moveTimelineTo(timeShift);

        var timelineMenu = $('.header-timeline-menu');
        var blur = 'blur(6px)';

        var elementTime = $('.header-banner__item-time');
        var elementDay = $('.header-banner__item-day');
        var elementTitle = $('.header-banner__item-title');
        var elementDescription = $('.header-banner__item-description');
        var elementPlay = $('.header-banner__item-play');
        var elementArrowLeft = $('.header-banner__arrow_left');
        var elementArrowRight = $('.header-banner__arrow_right');
        var elementControls = $('.header-banner__controls');

        var $items = $('.header-timeline-menu-items .header-timeline-menu-item__current');

        $('.header-timeline-menu-container').animate({
            'top': '-540px',
            'opacity': 0
        }, 500);

        $('.header-timeline-time').animate({
            'opacity': 0
        }, 200, function () {
            $('.header-timeline-time').removeClass('visibleTime');
        });

        timelineMenu.animate({
            opacity: 0
        }, 500, function () {
            timelineMenu.css({
                display: 'none'
            });
            $items.removeClass('header-timeline-menu-item__current');
        });

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

        function show($object, time) {
            $object.animate({
                opacity: 1
            }, time);
        };

        return false;
    };

    function showTimeline(index) {

        shouldMoveTimeline = false;

        DateStopUnix = newTimeUnix;

        var timelineMenu = $('.header-timeline-menu');
        var blur = 'blur(6px)';

        var elementTime = $('.header-banner__item-time');
        var elementDay = $('.header-banner__item-day');
        var elementTitle = $('.header-banner__item-title');
        var elementDescription = $('.header-banner__item-description');
        var elementPlay = $('.header-banner__item-play');
        var elementArrowLeft = $('.header-banner__arrow_left');
        var elementArrowRight = $('.header-banner__arrow_right');
        var elementControls = $('.header-banner__controls');

        var $items = $('.header-timeline-menu-items');
        var current = $items.find('.header-timeline-menu-item').eq(index);

        var timeData = current.find('.header-timeline-menu-item-small .header-timeline-menu-item-time').text();
        var timeContainer = $('.header-timeline-menu-item-full-time').text(timeData);

        var labelData = current.find('.header-timeline-menu-item-small .header-timeline-menu-item-label').text();
        var labelContainer = $('.header-timeline-menu-item-full-label').text(labelData);

        var itemesBeginPoint = 176;

        var itemsLeft = 176;

        $('.header-timeline-time').addClass('visibleTime');
        $('.header-timeline-time').animate({
            'opacity': 1
        }, 200);

        switch (index) {
            case 0:
                itemsLeft = 397;
                $('.header-timeline-menu-item-full-arrow__right').css('opacity', '0');
                break;
            case 1:
                itemsLeft = 124;
                break;
            case 2:
                itemsLeft = -139;
                break;
            case 3:
                itemsLeft = -400;
                break;
            default:
                itemsLeft = (index - 3 + 1) * (-267) - 150;
                break;
        }

        $items.css('left', itemsLeft);

        current.addClass('header-timeline-menu-item__current');

        timelineMenu.css({
            display: 'block'
        });
        timelineMenu.animate({
            opacity: 1,
        }, 500);

        $('.header-timeline-menu-container').animate({
            'top': 0,
            'opacity': 1
        }, 500);

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

        function hide($object, time) {
            $object.animate({
                opacity: 0
            }, time);
        };

        return true;
    };

    function loadJson() {

        var self = $('.header-timeline__item-current');
        var $before = self.find('.before');
        var $after = self.find('.after');

        var scheduler = Hope.Api.Scheduler(Hope.Config.Api.Scheduler.Endpoint);
        var serverTime = moment(Hope.Chrono.getDate());
        var start = moment(serverTime).subtract(10, 'hour').utc().toDate();
        var end = moment(serverTime).add(10, 'hour').utc().toDate();

        scheduler.from(start).to(end).fetch().then(function(result){
            serverTime = moment(Hope.Chrono.getDate());
            console.log(serverTime.format('H:mm'));
            var episodes = result.data;
            var str = null;
            var strFull = null;
            var place = $('.header-timeline__items');
            var placeFull = $('.header-timeline-menu-items');
            var minutes = null;
            var multiplier = 5;
            var minutes = null;
            var elementClass = null;
            var currentBefore = null;
            var currentAfter = null;
            var leftAfter = null;
            var leftTimeline = -238;
            var counterElements = null;
            var minWidth = 100;

            var currentTime = serverTime.format('H:mm');
            $('.header-timeline-time').html(currentTime);

            var limit = episodes.length - 1;
            for (var i = 0; i < limit; i++) {
                var start = moment(episodes[i].date);
                var endIdx = i + 1;
                var end = moment(episodes[endIdx].date);

                var duration = end.diff(start, 'minutes');
                var after = Math.floor((end.unix() - serverTime.unix()) / 60);
                var before = duration - after;
                var width = multiplier * duration;

                if (width < minWidth) {
                    width = minWidth;
                }

                if (end <= serverTime) {
                    before = duration;
                    after = 0;
                    elementClass = 'header-timeline__item';
                    leftTimeline += width + 15;
                }

                if (before < 0) {
                    before = 0;
                    after = duration;
                    elementClass = 'header-timeline__item-next';
                }

                var startTimeString = start.format('H:mm');
                var serverTimeString = serverTime.format('H:mm');

                if (before > 0 && after > 0 || startTimeString == serverTimeString) {
                    elementClass = 'header-timeline__item-current';

                    currentBefore = 5 * before;
                    currentAfter = (width - 7) - currentBefore;
                    if (before == 0) {
                        leftAfter = 5;
                    } else {
                        leftAfter = currentBefore + 7;
                    }

                    if (startTimeString == serverTimeString) {
                        leftTimeline += 0;
                    }
                }

                str = '<div class="' + elementClass + '" style="width: ' + width + 'px"><div class="before"></div><span class="header-timeline__time">' + start.format('H:mm') + '</span><span class="header-timeline__live">' + 'live' + '</span><p class="header-timeline__description">' + episodes[i].episode.title.slice(0, 10) + '</p><div class="after"></div></div>'
                place.append(str);

                var episodeDescription = null;
                if (episodes[i].episode.description != '') {
                    episodeDescription = episodes[i].episode.description;
                } else {
                    episodeDescription = episodes[i].show.description.short;
                }

                strFull = '<div class="header-timeline-menu-item">' +

                            '<div class="header-timeline-menu-item-full">' +

                            '<div class="header-timeline-menu-item-full__content">' +
                            '<h1 class="header-timeline-menu-item-full-episode">' + episodes[i].episode.title + '</h1>' +
                            '<h2 class="header-timeline-menu-item-full-shows">' + episodes[i].show.title + '</h2>' +
                            '<div class="header-timeline-menu-item-full-video"><img src="img/' + episodes[i].episode.image + '"></div>' +
                            '<p class="header-timeline-menu-item-full-description">' + episodeDescription + '</p>' +
                            '</div>' +

                            '</div>' +

                            '<div class="header-timeline-menu-item-small">' +
                            '<h1 class="header-timeline-menu-item-episode">' + episodes[i].episode.title + '</h1>' +
                            '<h2 class="header-timeline-menu-item-shows">' + episodes[i].show.title + '</h2>' +
                            '<span class="header-timeline-menu-item-time">' + start.format('H:mm') + '</span>' +
                            '<span class="header-timeline-menu-item-label">' + 'live' + '</span>' +
                            '<p class="header-timeline-menu-item-description">' + episodeDescription + '</p>' +
                            '</div>' +

                            '</div>';
                placeFull.append(strFull);

            }

            counterElements = $('.header-timeline__item').length;

            $('.header-timeline__item-current .before').css('width', currentBefore);
            $('.header-timeline__item-current .after').css({
                width: currentAfter,
                marginLeft: leftAfter
            });

            leftTimeline += currentBefore + 2;
            leftTimeline = '-' + leftTimeline + 'px';
            $('.header-timeline__items').css('left', leftTimeline);

            currentTime = serverTime;
            timelineInterval = startInterval();

        }).catch(function(response){
            console.log(response);
        });
    }

    function startInterval() {
        var tInterval = setInterval(syncTime, 2000);
        return tInterval;
    }

    function syncTime() {
        var serverTime = moment(Hope.Chrono.getDate());
        if (currentTime != null) {
            //var shift2 = (serverTime.diff(currentTime) / 1000) / 60; // Правильно посчитать shift
            //console.log(shift2);
        }

        var shift = 1;
        if (shift > 0) {
            moveTimelineTo(shift); // Пофиксить переезд с элемента на элемент если больше 1 минуты
            currentTime = serverTime;
        }
    }

    function moveTimeline() {

        var timelineItems = $('.header-timeline__items');
        var timelineItemsLeft = timelineItems.position();
        timelineItemsLeft = timelineItemsLeft.left - 5;

        var $currentElement = $('.header-timeline__item-current');
        var $currentElementWidth = $currentElement.width();
        var $currentElementBefore = $currentElement.find('.before');
        var $currentElementBeforeWidth = $currentElementBefore.width();
        var $currentElementAfter = $currentElement.find('.after');
        var $currentElementAfterWidth = $currentElementAfter.width();
        var $currentElementAfterMargin = parseInt($currentElementAfter.css('margin-left'));


        if ($currentElementBeforeWidth < $currentElementWidth) {
            $currentElementBeforeWidth = $currentElementBeforeWidth + 5;
            //console.log('$currentElementBeforeWidth < $currentElementWidth');
            $currentElementAfterWidth = $currentElementAfterWidth - 5;
            $currentElementAfterMargin = $currentElementAfterMargin + 5;
            $currentElementBefore.animate({
                'width': $currentElementBeforeWidth
            }, 300, 'linear');
            if ($('.header-timeline__item-current .before').width() == 0) {
                $currentElementAfter.animate({
                    'width': $currentElementAfterWidth,
                    'margin-left': 12
                }, 300, 'linear');
            } else {
                $currentElementAfter.animate({
                    'width': $currentElementAfterWidth,
                    'margin-left': $currentElementAfterMargin
                }, 300, 'linear');
            }
            if ($currentElementBeforeWidth == $currentElementWidth) {

                $currentElement = $('.header-timeline__item-current');
                $currentElement.addClass('header-timeline__item');
                $currentElement.removeClass('header-timeline__item-current');
                $currentElement.next().removeClass('header-timeline__item-next');
                $currentElement.next().addClass('header-timeline__item-current');
                $currentElement = $('.header-timeline__item-current');

                $currentElementWidth = $currentElement.width();
                $currentElementBefore = $currentElement.find('.before');
                $currentElementBeforeWidth = $currentElementBefore.width();
                $currentElementAfter = $currentElement.find('.after');
                $currentElementAfterWidth = $currentElementAfter.width();
                $currentElementAfterMargin = null;

                $currentElementBefore.css('width', 0);
                $currentElementAfterWidth = $currentElementWidth - 5;
                $currentElementAfter.css({
                    'width': $currentElementAfterWidth
                });
                $currentElementAfter.animate({
                    'margin-left': 5
                }, 300);

                //timelineItemsLeft = timelineItemsLeft - 12;
                console.log('Work!!!!!!');
                timelineItems.animate({
                    'left': timelineItemsLeft
                }, 300, 'linear');
                //console.log('Новая программа');
                $('.header-timeline__item-current').animate({
                    'margin-top': '-5px'
                }, 300);
                setTimeout(function () {
                    $('.header-timeline__item-current').animate({
                        'margin-top': '0'
                    }, 300);
                }, 300)

            } else if ($('.header-timeline__item-current .before').width() == 0) {
                //console.log('first iteration');
                $currentElementAfterWidth -= 2;
                $currentElementAfterMargin += 7;

                //timelineItemsLeft -= 2;
                timelineItems.animate({
                    'left': timelineItemsLeft
                }, 300, 'linear');
            } else {
                //console.log('next iteration');

                timelineItems.animate({
                    'left': timelineItemsLeft
                }, 300, 'linear');
            }
        }
    }

    function mainTime(time) {

        newTimeUnix = serverTime;

        var mainTimeTimer = setInterval(function () {
            time += 60;
            newTime = myTime(time);
            newTimeUnix = time;
            $('.header-timeline-time').html(newTime);
            //console.log(myTime(time));
        }, 3000);
    }

    function myTime(unixTime) {

        var date = new Date(unixTime * 1000);

        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;

        var result = hours + ':' + minutes;

        return result;
    }

    function moveFullTimeline(direction) {
        //slider FullTimeline

        var $items = $('.header-timeline-menu-items');
        var $current = $('.header-timeline-menu-item__current');
        var shift = null;

        if (direction == 'left') {
            shift = $items.position();
            shift = shift.left - 267;

            $current.next().addClass('header-timeline-menu-item__current');

            //$current.animate({'opacity' : 0}, 450);
            $current.removeClass('header-timeline-menu-item__current');

            setTimeout(function () {
                //$current.removeClass('header-timeline-menu-item__current');
            }, 460);



            $current.animate({
                'opacity': 1
            }, 300);

            $items.animate({
                'left': shift
            }, 300);


        } else if (direction == 'right') {

            shift = $items.position();
            shift = shift.left + 267;
            //console.log(shift);

            $current.prev().addClass('header-timeline-menu-item__current');
            $current.removeClass('header-timeline-menu-item__current');

            $current.animate({
                'opacity': 1
            }, 300);

            $items.animate({
                'left': shift
            }, 300);


        }
    }

    function moveTimelineTo(minutes) {

        var shiftMinutes = minutes * 5;
        //console.log('shiftMinutes: ', shiftMinutes);

        var timelineItems = $('.header-timeline__items');
        var timelineItemsLeft = timelineItems.position();
        //timelineItemsLeft = timelineItemsLeft.left - 5;
        timelineItemsLeft = timelineItemsLeft.left - shiftMinutes;

        var $currentElement = $('.header-timeline__item-current');
        var $currentElementWidth = $currentElement.width();
        var $currentElementBefore = $currentElement.find('.before');
        var $currentElementBeforeWidth = $currentElementBefore.width();
        var $currentElementAfter = $currentElement.find('.after');
        var $currentElementAfterWidth = $currentElementAfter.width();
        var $currentElementAfterMargin = parseInt($currentElementAfter.css('margin-left'));

        console.log('Function start');
        console.log('$currentElementBeforeWidth', $currentElementBeforeWidth);

        //if ($currentElementBeforeWidth > 0) {
        //    console.log('Before > 0');
        //    //$('.header-timeline__item-current .after').css('left', 0);
        //}

        if ($currentElementBeforeWidth < $currentElementWidth) {
            //$currentElementBeforeWidth = $currentElementBeforeWidth + 5;
            $currentElementBeforeWidth = $currentElementBeforeWidth + shiftMinutes;
            //$currentElementAfterWidth = $currentElementAfterWidth - 5;
            $currentElementAfterWidth = $currentElementAfterWidth - shiftMinutes;
            //$currentElementAfterMargin = $currentElementAfterMargin + 5;
            $currentElementAfterMargin = $currentElementAfterMargin + shiftMinutes;
            $currentElementBefore.animate({
                'width': $currentElementBeforeWidth
            }, 300, 'linear');
            if ($('.header-timeline__item-current .before').width() == 0) {
                $currentElementAfter.animate({
                    'width': $currentElementAfterWidth,
                    'margin-left': 12
                }, 300, 'linear');
            } else {
                $currentElementAfter.animate({
                    'width': $currentElementAfterWidth,
                    'margin-left': $currentElementAfterMargin
                }, 300, 'linear');
            }
            if ($currentElementBeforeWidth == $currentElementWidth) {
                console.log('here');
                $currentElement = $('.header-timeline__item-current');
                $currentElement.addClass('header-timeline__item');
                $currentElement.removeClass('header-timeline__item-current');
                $currentElement.next().removeClass('header-timeline__item-next');
                $currentElement.next().addClass('header-timeline__item-current');
                $currentElement = $('.header-timeline__item-current');

                $currentElementWidth = $currentElement.width();
                $currentElementBefore = $currentElement.find('.before');
                $currentElementBeforeWidth = $currentElementBefore.width();
                $currentElementAfter = $currentElement.find('.after');
                $currentElementAfterWidth = $currentElementAfter.width();
                $currentElementAfterMargin = null;

                $currentElementBefore.css('width', 0);
                //$currentElementAfterWidth = $currentElementWidth - 5;
                $currentElementAfterWidth = $currentElementWidth - shiftMinutes;
                $currentElementAfter.css({
                    'width': $currentElementAfterWidth
                });
                $currentElementAfter.animate({
                    'margin-left': 5
                }, 300);

                timelineItemsLeft = timelineItemsLeft - 15;
                timelineItems.animate({
                    'left': timelineItemsLeft
                }, 300, 'linear');
                //console.log('Новая программа');
                $('.header-timeline__item-current').animate({
                    'margin-top': '-5px'
                }, 300);
                setTimeout(function () {
                    $('.header-timeline__item-current').animate({
                        'margin-top': '0'
                    }, 300);
                }, 300)

            } else if ($('.header-timeline__item-current .before').width() == 0) {
                //console.log('first iteration');
                $currentElementAfterWidth -= 2;
                //$currentElementAfterMargin += 7;
                $currentElementAfterMargin += shiftMinutes + 2;
                //$('.header-timeline__item-current .after').css({
                //    marginLeft: 14,
                //    left: 0
                //});
                //$('.header-timeline__item-current .after').css({
                //    marginLeft: 12
                //});

                console.log('timelineItemsLeft: ', timelineItemsLeft);
                //if (before !=0) {
                    //timelineItemsLeft -= 0;
                //}
                timelineItems.animate({
                    'left': timelineItemsLeft
                }, 300, 'linear');
            } else {
                //console.log('next iteration!!!');

                timelineItems.animate({
                    'left': timelineItemsLeft
                }, 300, 'linear');
            }
        }
    }

});