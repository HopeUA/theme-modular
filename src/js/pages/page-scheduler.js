$(function () {

    var tempIndex = $('.page-scheduler-content-items .active').index();
    var $pageContent = $('.page-scheduler-content');
    var daysCache = {};
    var oldCounter = null;

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

    var counterElementsLeft = (indexActiveElement - ((counterElementsMain - 1) / 2) - 1);
    var counterElementsRight = counterElementsAll - indexActiveElement - (counterElementsMain - 1) / 2;
    var counterSlider = 0;

    if ($container) {

        var serverTime = Hope.Chrono.getDate();
        var year = moment(serverTime).format('YYYY');
        var day = moment(serverTime).format('DD');
        var month = moment(serverTime).format('MM');
        var dateFull = year + '-' + month + '-' + day;
        var daysFormatted = [];
        var $containerCalendar = $('.page-scheduler-header-list');

        moment.locale('ru');

        var displayDays = [
            moment(serverTime).subtract(5, 'days'),
            moment(serverTime).subtract(4, 'days'),
            moment(serverTime).subtract(3, 'days'),
            moment(serverTime).subtract(2, 'days'),
            moment(serverTime).subtract(1, 'day'),
            moment(serverTime),
            moment(serverTime).add(1, 'day'),
            moment(serverTime).add(2, 'days'),
            moment(serverTime).add(3, 'days'),
            moment(serverTime).add(4, 'days'),
            moment(serverTime).add(5, 'days')
        ];

        for (var i = 0; i < displayDays.length; i++) {
            var itemYear = displayDays[i].format('YYYY');
            var itemMonth = displayDays[i].format('MM');
            var itemDate = displayDays[i].format('DD');

            var item = itemYear + '-' + itemMonth + '-' + itemDate;

            daysFormatted.push(item);
        }

        var scheduler = Hope.Api.Scheduler(Hope.Config.Api.Scheduler.Endpoint);
        scheduler.count(daysFormatted).fetch().then(function(result){

            for (var i = 0; i < displayDays.length; i++) {
                var itemYear = displayDays[i].format('YYYY');
                var itemMonth = displayDays[i].format('MM');
                var itemMonthName = displayDays[i].format('MMM');
                itemMonthName = itemMonthName.charAt(0).toUpperCase() + itemMonthName.slice(1);
                var itemDate = displayDays[i].format('DD');
                var itemWeekDay = displayDays[i].format('ddd');
                var item = itemYear + '-' + itemMonth + '-' + itemDate;
                var itemStyle = [];

                if (itemDate == day) {
                    itemStyle.push('selected');
                    itemStyle.push('current');
                }

                if (result.dates[item] == 0) {
                    itemStyle.push('disabled');
                }

                var template = '<li class="' + itemStyle.join(' ') + '" data-scheduler-date="' + item + '">'
                    + '<span>' + itemWeekDay + '</span>'
                    + '<span>' + itemDate + '</span>'
                    + '<span>' + itemMonthName + '</span>'
                    + '</li>';
                $containerCalendar.append(template);
            }

            var preLastElementIndex = $('.page-scheduler-header-list li').length - 2;
            var preLastElement = $('.page-scheduler-header-list li').eq(preLastElementIndex);

            if (!preLastElement.hasClass('disabled')) {
                console.log('test1');
                $arrowRight.css({
                    display : 'block',
                    opacity : 1
                });
            }

        });



        init(dateFull);

        var widthElementsAll = displayDays.length * 95;

        console.log(widthElementsAll);
        $container.css({
            width: widthElementsAll,
            left: '-95px'
        });

        $container.animate({
            opacity: 1
        }, 100);
    }

    $arrowLeft.click(function () {

        elementWidth = parseInt($('.page-scheduler-header-list li').css('width')) + parseInt($('.page-scheduler-header-list li').css('margin-right'));

        var queryDay = moment($('.page-scheduler-header-list li').eq(0).data('scheduler-date'));
        var queryData = [];

        queryData[0] = queryDay.subtract(1, 'day').format('YYYY-MM-DD');

        $container.animate({
            left: '+=95'
        }, 150, function() {
            scheduler.count(queryData).fetch().then(function (result) {

                var queryString = queryData[0];
                var count = result.dates[queryString];

                var momentData = moment(queryString);
                var itemYear = momentData.format('YYYY');
                var itemMonth = momentData.format('MM');
                var itemMonthName = momentData.format('MMM');
                itemMonthName = itemMonthName.charAt(0).toUpperCase() + itemMonthName.slice(1);
                var itemDate = momentData.format('DD');
                var itemWeekDay = momentData.format('ddd');
                var item = itemYear + '-' + itemMonth + '-' + itemDate;
                var itemStyle = [];

                console.log(count);
                if (count == 0) {
                    itemStyle.push('disabled');
                }

                var template = '<li class="' + itemStyle.join(' ') + '" data-scheduler-date="' + item + '">'
                    + '<span>' + itemWeekDay + '</span>'
                    + '<span>' + itemDate + '</span>'
                    + '<span>' + itemMonthName + '</span>'
                    + '</li>';

                $container.css({
                    width: '+=95',
                    left: '-=95'
                });
                $containerCalendar.prepend(template);
                $container.css({
                    width: '-=95'
                });
            });
        });

    });

    $arrowRight.click(function () {

        counterElementsRight = 3;
        elementWidth = parseInt($('.page-scheduler-header-list li').css('width')) + parseInt($('.page-scheduler-header-list li').css('margin-right'));

        if (counterSlider == counterElementsRight) {
            //return;
        }

        var preLastElementIndex = $('.page-scheduler-header-list li').length - 1;
        var preLastElement = $('.page-scheduler-header-list li').eq(preLastElementIndex);

        if (preLastElement.hasClass('disabled')) {
            $arrowRight.animate({
                opacity: 0
            }, 200, function () {
                $(this).css('display', 'none');
            });
        }

        $('.arrow__left__empty').addClass('page-scheduler-header-list-arrow__left');
        $('.page-scheduler-header-list-arrow__left').removeClass('arrow__left__empty');

        $('.page-scheduler-header-list-arrow__left').animate({
            opacity: 1
        }, 200);

        console.log('counterSlider', counterSlider);
        console.log('counterElementsRight', counterElementsRight);

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

    $container.on('click', 'li', function () {
        var dayDate = $(this).data('scheduler-date');
        var currentIndex = $(this).index();
        var prevIndex = $('.page-scheduler-header-list .selected').index();

        if (currentIndex == prevIndex || $(this).hasClass('disabled')) {
            return;
        }

        $('.page-scheduler-header-list .selected').removeClass('selected');
        $(this).addClass('selected');

        loadJson(dayDate).then(function(data){
            if (currentIndex < prevIndex) {
                renderTemplate(data, 'prev');
            } else {
                renderTemplate(data, 'next');
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
                resolve(result.data);
            }).catch(function(response){
                console.log(response);
                reject(response);
            });
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
                    renderTemplate(data, 'prev');

                    var currentProgram = $('.page-scheduler-content-items .active');
                    $(window).scrollTo(currentProgram, 400, {
                        over: {
                            top: 1.965
                        }
                    });
                } else {
                    renderTemplate(data, 'next');

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

    function renderTemplate(currentDay, dirrection, first) {

        var $container = $('.page-scheduler-content-items');

        if (dirrection == 'next') {
            oldCounter = currentDay.length;
            $container.find('.active').removeClass('active');

        } else {
            oldCounter = currentDay.length;
            $container.find('.active').removeClass('active');
            var shiftList = 0 - (currentDay.length - 2) * 79 + 200;
            var tempHeightFirst = shiftList * (-2);

            console.log(tempHeightFirst);
            $container.css({
                'height': tempHeightFirst
            });
            $container.css({
                marginTop: shiftList
            })
            $container.css('height','inherit');
            $container.animate({
                marginTop: 0
            }, 300);
        }

        var episodes = [];
        for (var i = 0; i < currentDay.length; i++) {
            var episode = {
                title : currentDay[i].episode.title,
                show :  currentDay[i].show.title,
                date :  timeToStr(currentDay[i].date, 'ru'),
                language : currentDay[i].episode.language
            };
            if (currentDay[i].episode.description) {
                episode.description = currentDay[i].episode.description;
            } else {
                episode.description = currentDay[i].show.description.short;
            }
            if (currentDay[i].episode.image) {
                episode.image = currentDay[i].episode.image;
            } else {
                episode.image = currentDay[i].show.images.cover;
            }

            episodes.push(episode);
        }

        var template = $('#scheduler-list__vertical').html();
        var view     = {};
        view.episodes = episodes;
        var renderTemplate = Mustache.render(template, view);
        var $containerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item');

        var newHeight = (currentDay.length - 2) * 79 + 200 - 2;
        if (dirrection == 'next') {
            var beginLoop = $containerList.length;
            $container.append(renderTemplate);
            console.log($container.css('height'));
            $container.css({
                height: newHeight
            });
        } else {
            $container.prepend(renderTemplate);
            $container.css({
                //height: newHeight
            });
        }

        if (dirrection == 'next' && first != true) {
            var shiftUP = 0 - (currentDay.length - 2) * 79 + 200;
            var tempHeight = shiftUP * (-2);
            var i = 0;
            $container.css('height', tempHeight);
            $container.animate({
                marginTop: shiftUP
            }, 300, function () {
                for (i; i < beginLoop; i++) {
                    $containerList.eq(i).remove();
                }
                $container.css('height','inherit');
                $('.page-scheduler-content-items').css({
                    marginTop: 0
                })
            });
        } else {

            setTimeout(function () {
                var counterContainerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item').length;
                var counter = oldCounter;
                var $containerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item');
                for (counter; counter <= counterContainerList; counter++) {
                    $containerList.eq(counter).remove();
                }
            }, 300);
        }
    }

    function init(day) {

        loadJson(day).then(function(data) {
            oldCounter = data.length;
            renderTemplate(data, 'next', true);
            var $container = $('.page-scheduler-content-items');

            $container.animate({
                opacity: 1
            }, 200);
        });
    }

});
