$(function () {

    var tempIndex = $('.page-sheduler-content-items .active').index();
    var $pageContent = $('.page-sheduler-content');
    var daysCache = {};

    $('.page-sheduler-content-items').on('click', '.page-sheduler-content-item', function () {
        var $current = $('.page-sheduler-content-items .active');
        var $current_live = $('.page-sheduler-content-items .live');
        var indexCurrent = $(this).index();
        var tIndex = $('.page-sheduler-content-items .active').index();

        if ($(this).hasClass('live2')) {
            $(this).addClass('live');
        }

        if (tIndex == indexCurrent) {
            return;
        }

        $current.removeClass('active');
        $current_live.removeClass('live').addClass('live2');
        $current.removeAttr('style');

        showItem($(this));

        if (indexCurrent > tempIndex) {
            $(window).scrollTo('-=180', 0);
        }

        tempIndex = indexCurrent;
    });

    function showItem($item) {
        $item.css({
            backgroundColor: '#fff'
        });

        $item.find('*').css({
            opacity: 0
        });

        $item.animate({
            height: 262
        }, 150, function () {
            $item.find('*').animate({
                opacity: 1
            });
        });

        $item.addClass('active');
    }

    var $arrowLeft = $('.page-sheduler-header-list-arrow__left');
    var $arrowRight = $('.page-sheduler-header-list-arrow__right');
    var $container = $('.page-sheduler-header-list');
    var $activeElement = $container.find('.selected');
    var indexActiveElement = $activeElement.index() + 1;
    var containerWidth = parseInt($('.page-sheduler-header-container').css('width'));
    var elementWidth = parseInt($('.page-sheduler-header-list li').css('width'));
    var elementMargin = parseInt($('.page-sheduler-header-list li').css('margin-right'));
    elementWidth = elementWidth + elementMargin;
    var counterElementsMain = Math.round(containerWidth / elementWidth);
    var counterElementsAll = $('.page-sheduler-header-list li').length;
    var widthElementsAll = (counterElementsAll * elementWidth) - elementMargin;
    var counterElementsLeft = (indexActiveElement - ((counterElementsMain - 1) / 2) - 1);
    var counterElementsRight = counterElementsAll - indexActiveElement - (counterElementsMain - 1) / 2;
    var startPosition = 0 - (counterElementsLeft * elementWidth);
    var counterElementsInvisible = (counterElementsAll - counterElementsMain) / 2;
    var counterSlider = 0;

    if ($container) {

        $container.css({
            width: widthElementsAll,
            marginLeft: startPosition
        });

        $container.animate({
            opacity: 1
        }, 100);
    }

    $arrowLeft.click(function () {

        $('.arrow__right__empty').addClass('page-sheduler-header-list-arrow__right');
        $('.page-sheduler-header-list-arrow__right').removeClass('arrow__right__empty');

        $('.page-sheduler-header-list-arrow__right').animate({
            opacity: 1
        }, 200);

        if (counterSlider > (0 - counterElementsLeft)) {
            $container.animate({
                marginLeft: '+=' + elementWidth
            }, 150)
        }

        if (counterSlider == (0 - (counterElementsLeft - 1))) {
            $arrowLeft.animate({
                opacity: 0
            }, 200, function () {
                $(this).addClass('arrow__left__empty');
                $(this).removeClass('page-sheduler-header-list-arrow__left');
            });
        }

        counterSlider--;
    });

    $arrowRight.click(function () {

        if (counterSlider == counterElementsRight) {
            return;
        }

        $('.arrow__left__empty').addClass('page-sheduler-header-list-arrow__left');
        $('.page-sheduler-header-list-arrow__left').removeClass('arrow__left__empty');

        $('.page-sheduler-header-list-arrow__left').animate({
            opacity: 1
        }, 200);

        if (counterSlider < counterElementsRight) {
            $container.animate({
                marginLeft: '-=' + elementWidth
            }, 150)
        }

        if (counterSlider == (counterElementsRight - 1)) {
            $arrowRight.animate({
                opacity: 0
            }, 200, function () {
                $(this).addClass('arrow__right__empty');
                $(this).removeClass('page-sheduler-header-list-arrow__right');
            });
        }

        counterSlider++;
    });

    $container.find('li').click(function () {
        var dayDate = $(this).data('scheduler-date');
        //var contentHeight = $pageContent.css('height');
        var currentIndex = $(this).index();
        var prevIndex = $('.page-sheduler-header-list .selected').index();

        if (currentIndex == prevIndex) {
            return;
        }

        $('.page-sheduler-header-list .selected').removeClass('selected');
        $(this).addClass('selected');

        loadJson(dayDate);

        setTimeout(function () {
            if (currentIndex < prevIndex) {
                renderTemplateBefore(daysCache[dayDate].data);
            } else {
                renderTemplateAfter(daysCache[dayDate].data);
            }
        }, 200)

    });

    function loadJson(dayDate) {

        var scheduler = Hope.Api.Scheduler(Hope.Config.Api.Scheduler.Endpoint);

        if (daysCache.hasOwnProperty(dayDate)) {
            return;
        }

        var start = moment(dayDate).set('hour', 0).set('minute', 0).set('second', 0).utc().toDate();
        var end = moment(dayDate).set('hour', 23).set('minute', 59).set('second', 59).utc().toDate();

        scheduler.from(start).to(end).fetch().then(function(data){
            daysCache[dayDate] = data;
            console.log(daysCache);
        }).catch(function(response){
             console.log(response);
         });

    }

    function renderTemplateBefore(currentDay) {
        var template = $('.page-sheduler-content-item').not('.active').not('.live2').eq(0).clone();
        template.removeClass('ru');
        template.removeClass('ua');
        var $container = $('.page-sheduler-content-items');
        var $defaultElement = $('.page-sheduler-content-item').not('.active').eq(1);
        var heightDefaultElement = parseInt($defaultElement.css('height'));
        var countInvisibleElements = currentDay.length;
        var shiftList = 0 - (countInvisibleElements * heightDefaultElement + 3);
        var reverseCache = currentDay.slice(0);
        reverseCache = reverseCache.reverse();

        $container.css({
            marginTop: shiftList
        })

        $container.animate({
            marginTop: 0
        }, 300);

        $.each(reverseCache, function (index, item) {

            var $temp = template.clone();

            $temp.find('.page-sheduler-content-episode-time span').text(timeToStr(item.date, 'ru'));
            $temp.find('.page-sheduler-content-episode-title').text(item.titleEpisode);
            $temp.find('.page-sheduler-content-item-titles p span').eq(0).text(item.titleEpisode);
            $temp.find('.page-sheduler-content-item-titles p span').eq(1).text(item.titleShow);
            $temp.find('.page-sheduler-content-episode-info-img').attr('src', 'img/' + item.img);
            $temp.find('.page-sheduler-content-episode-info-p').text(item.description);
            $temp.addClass(item.language);

            if (item.active == 'true') {
                $temp.addClass('active');
                $temp.addClass('live');
            }

            $container.prepend($temp);
        })

        var $containerList = $('.page-sheduler-content-items').find('.page-sheduler-content-item');
        var counterContainerList = $containerList.length;
        var counter = countInvisibleElements;

        setTimeout(function () {
            for (counter; counter <= counterContainerList; counter++) {
                $containerList.eq(counter).remove();
            }
        }, 300);

    }

    function renderTemplateAfter(currentDay) {
        var template = $('.page-sheduler-content-item').not('.active').not('.live2').eq(0).clone();
        template.removeClass('ru');
        template.removeClass('ua');
        var $container = $('.page-sheduler-content-items');
        var $defaultElement = $('.page-sheduler-content-item').not('.active').eq(1);
        var heightDefaultElement = parseInt($defaultElement.css('height'));
        var countInvisibleElements = currentDay.length;
        var shiftList = 0 - ($container.find('.page-sheduler-content-item').length * heightDefaultElement);

        $container.find('.active').removeClass('active');

        $.each(currentDay, function (index, item) {

            var $temp = template.clone();

            $temp.find('.page-sheduler-content-episode-time span').text(timeToStr(item.date, 'ru'));
            $temp.find('.page-sheduler-content-episode-title').text(item.titleEpisode);
            $temp.find('.page-sheduler-content-item-titles p span').eq(0).text(item.titleEpisode);
            $temp.find('.page-sheduler-content-item-titles p span').eq(1).text(item.titleShow);
            $temp.find('.page-sheduler-content-episode-info-img').attr('src', 'img/' + item.img);
            $temp.find('.page-sheduler-content-episode-info-p').text(item.description);
            $temp.addClass(item.language);

            if (item.active == 'true') {
                $temp.addClass('active');
                $temp.addClass('live');
            }

            $container.append($temp);
        })

        var $containerList = $('.page-sheduler-content-items').find('.page-sheduler-content-item');
        var counterContainerList = $containerList.length - currentDay.length;
        var counter = countInvisibleElements;

        $container.animate({
            marginTop: shiftList
        }, 300, function () {
            for (var i = 0; i < counterContainerList; i++) {
                $containerList.eq(i).remove();
            }

            $('.page-sheduler-content-items').css({
                marginTop: 0
            })

        });

    }

    $('.page-sheduler-header-now a').click(function () {
        var current = $('.page-sheduler-content-items .live2');
        var currentDay = $('.page-sheduler-header-list .current');
        var selectedDay = $('.page-sheduler-header-list .selected');
        var currentDayStatus = currentDay.hasClass('selected');

        if (currentDayStatus) {

            $('.page-sheduler-content-items .active').removeAttr('style');
            $('.page-sheduler-content-items .active').removeClass('active');

            if (current.length == 0) {
                current = $('.page-sheduler-content-items .live');
            }

            $(window).scrollTo(current, 400, {
                over: {
                    top: -10.347
                }
            });

            current.addClass('live');
            showItem(current);

        } else {
            var prevIndex = selectedDay.index();
            var currentIndex = currentDay.index();
            selectedDay.removeClass('selected');
            currentDay.addClass('selected');

            var elementId = currentDay.data('id');

            loadJson(elementId);

            setTimeout(function () {
                if (currentIndex < prevIndex) {
                    renderTemplateBefore(daysCache[elementId].objectsDay);

                    var currentProgram = $('.page-sheduler-content-items .active');
                    $(window).scrollTo(currentProgram, 400, {
                        over: {
                            top: 1.965
                        }
                    });

                } else {
                    renderTemplateAfter(daysCache[elementId].objectsDay);

                    var currentProgram = $('.page-sheduler-content-items .active');
                    $(window).scrollTo(currentProgram, 400, {
                        over: {
                            top: -5
                        }
                    });
                }



            }, 200)

        }

    });

    function timeToStr(unixTime, lang) {
        moment.locale(lang);
        var strDate = moment.unix(unixTime).format('LT');
        return strDate;
    }

});
