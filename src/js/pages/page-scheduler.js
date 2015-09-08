$(function () {

    var tempIndex = $('.page-scheduler-content-items .active').index();
    var $pageContent = $('.page-scheduler-content');
    var daysCache = {};

    $('.page-scheduler-content-items').on('click', '.page-scheduler-content-item', function () {
        var $current = $('.page-scheduler-content-items .active');
        var $current_live = $('.page-scheduler-content-items .live');
        var indexCurrent = $(this).index();
        var tIndex = $('.page-scheduler-content-items .active').index();

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

    var $arrowLeft = $('.page-scheduler-header-list-arrow__left');
    var $arrowRight = $('.page-scheduler-header-list-arrow__right');
    var $container = $('.page-scheduler-header-list');
    var $activeElement = $container.find('.selected');
    var indexActiveElement = $activeElement.index() + 1;
    var containerWidth = parseInt($('.page-scheduler-header-container').css('width'));
    var elementWidth = parseInt($('.page-scheduler-header-list li').css('width'));
    var elementMargin = parseInt($('.page-scheduler-header-list li').css('margin-right'));
    elementWidth = elementWidth + elementMargin;
    var counterElementsMain = Math.round(containerWidth / elementWidth);
    var counterElementsAll = $('.page-scheduler-header-list li').length;
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

        $('.arrow__right__empty').addClass('page-scheduler-header-list-arrow__right');
        $('.page-scheduler-header-list-arrow__right').removeClass('arrow__right__empty');

        $('.page-scheduler-header-list-arrow__right').animate({
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
                $(this).removeClass('page-scheduler-header-list-arrow__left');
            });
        }

        counterSlider--;
    });

    $arrowRight.click(function () {

        if (counterSlider == counterElementsRight) {
            return;
        }

        $('.arrow__left__empty').addClass('page-scheduler-header-list-arrow__left');
        $('.page-scheduler-header-list-arrow__left').removeClass('arrow__left__empty');

        $('.page-scheduler-header-list-arrow__left').animate({
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
                $(this).removeClass('page-scheduler-header-list-arrow__right');
            });
        }

        counterSlider++;
    });

    $container.find('li').click(function () {
        var dayDate = $(this).data('scheduler-date');
        //var contentHeight = $pageContent.css('height');
        var currentIndex = $(this).index();
        var prevIndex = $('.page-scheduler-header-list .selected').index();

        if (currentIndex == prevIndex) {
            return;
        }

        $('.page-scheduler-header-list .selected').removeClass('selected');
        $(this).addClass('selected');

        loadJson(dayDate).then(function(data){
            if (currentIndex < prevIndex) {
                renderTemplateBefore(data);
            } else {
                renderTemplateAfter(data);
            }
        });
    });

    function loadJson(dayDate) {

        return new Promise(function(resolve, reject){
            if (daysCache.hasOwnProperty(dayDate)) {
                return resolve(daysCache[dayDate]);
            }

            var scheduler = Hope.Api.Scheduler(Hope.Config.Api.Scheduler.Endpoint);

            var start = moment(dayDate).set('hour', 0).set('minute', 0).set('second', 0).utc().toDate();
            var end = moment(dayDate).set('hour', 23).set('minute', 59).set('second', 59).utc().toDate();

            scheduler.from(start).to(end).fetch().then(function(result){
                daysCache[dayDate] = result.data;
                console.log(daysCache);
                resolve(result.data);
            }).catch(function(response){
                console.log(response);
                reject(response);
            });
        });
    }

    function renderTemplateBefore(currentDay) {
        var template = $('.page-scheduler-content-item').not('.active').not('.live2').eq(0).clone();
        template.removeClass('ru');
        template.removeClass('ua');
        var $container = $('.page-scheduler-content-items');
        var $defaultElement = $('.page-scheduler-content-item').not('.active').eq(1);
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
            var description = null;
            var image = null;

            $temp.find('.page-scheduler-content-episode-time span').text(timeToStr(item.date, 'ru'));
            $temp.find('.page-scheduler-content-episode-title').text(item.episode.title);
            $temp.find('.page-scheduler-content-item-titles p span').eq(0).text(item.episode.title);
            $temp.find('.page-scheduler-content-item-titles p span').eq(1).text(item.show.title);
            if (item.episode.image == '') {
                image = item.show.image.cover;
            } else {
                image = item.episode.image;
            }
            $temp.find('.page-scheduler-content-episode-info-img').attr('src', image);
            if (item.episode.description == '') {
                description = item.show.description.short;
            } else {
                description = item.episode.description;
            }
            $temp.find('.page-.page-scheduler-header-list-content-episode-info-p').text(description);
            $temp.addClass(item.show.language);

            if (item.active == 'true') {
                $temp.addClass('active');
                $temp.addClass('live');
            }

            $container.prepend($temp);
        })

        var $containerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item');
        var counterContainerList = $containerList.length;
        var counter = countInvisibleElements;

        setTimeout(function () {
            for (counter; counter <= counterContainerList; counter++) {
                $containerList.eq(counter).remove();
            }
        }, 300);

    }

    function renderTemplateAfter(currentDay) {
        var template = $('.page-scheduler-content-item').not('.active').not('.live2').eq(0).clone();
        template.removeClass('ru');
        template.removeClass('ua');
        var $container = $('.page-scheduler-content-items');
        var $defaultElement = $('.page-scheduler-content-item').not('.active').eq(1);
        var heightDefaultElement = parseInt($defaultElement.css('height'));
        var countInvisibleElements = currentDay.length;
        var shiftList = 0 - ($container.find('.page-scheduler-content-item').length * heightDefaultElement);

        $container.find('.active').removeClass('active');

        $.each(currentDay, function (index, item) {
            console.log('step 2.1', index);
            var $temp = template.clone();
            var description = null;
            var image = null;
            if (item.episode) {
                var title = item.episode.title || '';
            }

            $temp.find('.page-scheduler-content-episode-time span').text(timeToStr(item.date, 'ru'));
            $temp.find('.page-scheduler-content-episode-title').text(item.episode.title);
            $temp.find('.page-scheduler-content-item-titles p span').eq(0).text(item.episode.title);
            $temp.find('.page-scheduler-content-item-titles p span').eq(1).text(item.show.title);
            if (item.episode.image == '') {
                image = item.show.images.cover;
            } else {
                image = item.episode.image;
            }
            $temp.find('.page-scheduler-content-episode-info-img').attr('src', image);
            if (item.episode.description == '') {
                description = item.show.description.short;
            } else {
                description = item.episode.description;
            }
            $temp.find('.page-scheduler-content-episode-info-p').text(description);
            $temp.addClass(item.episode.language);

            if (item.active == 'true') {
                $temp.addClass('active');
                $temp.addClass('live');
            }

            $container.append($temp);

            if (index == 21) {
                console.log(item);
            }
        });

        var $containerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item');
        var counterContainerList = $containerList.length - currentDay.length;
        var counter = countInvisibleElements;

        $container.animate({
            marginTop: shiftList
        }, 300, function () {
            for (var i = 0; i < counterContainerList; i++) {
                $containerList.eq(i).remove();
            }

            $('.page-scheduler-content-items').css({
                marginTop: 0
            })

        });

    }

    $('.page-scheduler-header-now a').click(function () {
        var current = $('.page-scheduler-content-items .live2');
        var currentDay = $('.page-scheduler-header-list .current');
        var selectedDay = $('.page-scheduler-header-list .selected');
        var currentDayStatus = currentDay.hasClass('selected');

        if (currentDayStatus) {

            $('.page-scheduler-content-items .active').removeAttr('style');
            $('.page-scheduler-content-items .active').removeClass('active');

            if (current.length == 0) {
                current = $('.page-scheduler-content-items .live');
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

            loadJson(elementId).then(function(data){
                if (currentIndex < prevIndex) {
                    renderTemplateBefore(data);

                    var currentProgram = $('.page-scheduler-content-items .active');
                    $(window).scrollTo(currentProgram, 400, {
                        over: {
                            top: 1.965
                        }
                    });
                } else {
                    renderTemplateAfter(data);

                    var currentProgram = $('.page-scheduler-content-items .active');
                    $(window).scrollTo(currentProgram, 400, {
                        over: {
                            top: -5
                        }
                    });
                }
            });
        }
    });

    function timeToStr(schedulerDate, lang) {
        moment.locale(lang);
        var strDate = moment(schedulerDate).format('LT');
        return strDate;
    }

});
