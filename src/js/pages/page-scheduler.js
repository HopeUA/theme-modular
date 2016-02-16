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
            height: 'auto'
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
        var currentDay = moment(serverTime).format('DD');
        var month = moment(serverTime).format('MM');

        var hashTime = window.location.hash;
        if (hashTime.length > 1) {
            hashTime = hashTime.slice(1, hashTime.length);
            var momentHashTime = moment(hashTime);
            if (momentHashTime) {
                currentDay = momentHashTime.format('DD');
            }
        }

        var dateFull = year + '-' + month + '-' + day;
        var daysFormatted = [];
        var $containerCalendar = $('.page-scheduler-header-list');

        console.log(dateFull);

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

        var ajaxRunning = false;
        var ajaxListRunning = false;

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
                    itemStyle.push('current');
                }
                if (itemDate == currentDay) {
                    itemStyle.push('selected');
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
                $arrowRight.css({
                    display : 'block',
                    opacity : 1
                });
            }

        });

        var ajaxListStatus = function(status) {
            if (status) {
                ajaxListRunning = true;
                $('.page-scheduler-content').addClass('page-scheduler-list-loader');
            } else {
                ajaxListRunning = false;
                $('.page-scheduler-content').removeClass('page-scheduler-list-loader');
            }
        };

        var goToEpisodeScroll = function() {

            console.log('goToEpisodeScroll');

            $('.page-scheduler-content-items .active').removeAttr('style');
            $('.page-scheduler-content-items .active').removeClass('active');

            var current = $('.page-scheduler-content-items .goToEpisode');

            if (current.hasClass('live2')) {
                current.addClass('live');
            }

            $(window).scrollTo(current, 400, {
                over: {
                    top: -10.347
                }
            });

            showItem(current);
        };

        var goToTime = window.location.hash;

        if (goToTime.length > 1) {
            goToTime = goToTime.slice(1, goToTime.length);
            var goToEpisodeDay = goToTime.slice(0, 10);
            init(goToEpisodeDay, goToEpisodeScroll);
        } else {
            console.log('Default');
            init(dateFull);
        }

        var widthElementsAll = displayDays.length * 95;
        var shiftCounter = null;

        $container.css({
            width: widthElementsAll,
            left: '-95px'
        });

        $container.animate({
            opacity: 1
        }, 100);
    }

    var ajaxStatus = function(status) {
        if (status) {
            ajaxRunning = true;
            $('.page-scheduler-header-container').addClass('page-scheduler-header-container-loader');
        } else {
            ajaxRunning = false;
            $('.page-scheduler-header-container').removeClass('page-scheduler-header-container-loader');
        }
    };

    $arrowLeft.click(function () {
        if (ajaxRunning) {
            return;
        }

        var currentIndex = 0 - $('.page-scheduler-header-list .current').index();
        var indexDifference = currentIndex - shiftCounter;

        elementWidth = parseInt($('.page-scheduler-header-list li').css('width')) + parseInt($('.page-scheduler-header-list li').css('margin-right'));

        var queryDay = moment($('.page-scheduler-header-list li').eq(0).data('scheduler-date'));
        var queryData = [];

        queryData[0] = queryDay.subtract(1, 'day').format('YYYY-MM-DD');

        if (shiftCounter <= 0 && indexDifference == -5) {
            ajaxStatus(true);
            $container.animate({
                left: '+=95'
            }, 150, function () {

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

                    ajaxStatus(false);

                    var dayItemsLength = $('.page-scheduler-header-list li').length;
                    var dayItemsLengthPx = dayItemsLength * 95;
                    $('.page-scheduler-header-list').css('width', dayItemsLengthPx);
                });
                shiftCounter--;
            });
        } else {
            $container.animate({
                left: '+=95'
            }, 150);
            shiftCounter--;
        }

    });

    $arrowRight.click(function () {

        if (ajaxRunning) {
            return;
        }

        elementWidth = parseInt($('.page-scheduler-header-list li').css('width')) + parseInt($('.page-scheduler-header-list li').css('margin-right'));

        var lastElementIndex = $('.page-scheduler-header-list li').length - 1;

        var startPosition = lastElementIndex - $('.page-scheduler-header-list .current').index();

        if (shiftCounter >= 0 && (startPosition - shiftCounter == 5)) {
            ajaxStatus(true);
            $container.animate({
                left: '-=95'
            }, 150, function(){

                var queryDay = moment($('.page-scheduler-header-list li').eq(lastElementIndex).data('scheduler-date'));
                var queryData = [];

                queryData[0] = queryDay.add(1, 'day').format('YYYY-MM-DD');

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

                    if (count == 0) {
                        itemStyle.push('disabled');
                    }

                    var template = '<li class="' + itemStyle.join(' ') + '" data-scheduler-date="' + item + '">'
                        + '<span>' + itemWeekDay + '</span>'
                        + '<span>' + itemDate + '</span>'
                        + '<span>' + itemMonthName + '</span>'
                        + '</li>';

                    $containerCalendar.append(template);

                    var dayItemsLength = $('.page-scheduler-header-list li').length;
                    var dayItemsLengthPx = dayItemsLength * 95;
                    $('.page-scheduler-header-list').css('width', dayItemsLengthPx);

                    ajaxStatus(false);
                });
                shiftCounter++;
            });
        } else {
            $container.animate({
                left: '-=95'
            }, 150);

            shiftCounter++;
        }

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
        ajaxListStatus(true);
        loadJson(dayDate).then(function(data){
            if (currentIndex < prevIndex) {
                renderTemplate(data, 'prev', false, function(){
                    //console.log('render prev was finished');
                });
            } else {
                renderTemplate(data, 'next', false, function(){
                    //console.log('render next was finished');
                });
            }
            ajaxListStatus(false);
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
                    renderTemplate(data, 'prev', false, function() {
                        var currentProgram = $('.page-scheduler-content-items .live2');
                        $(window).scrollTo(currentProgram, 400, {
                            over: {
                                top: -10.347
                            }
                        });

                        currentProgram.addClass('live');
                        showItem(currentProgram);
                    });
                } else {
                    renderTemplate(data, 'next', false, function() {
                        var currentProgram = $('.page-scheduler-content-items .live2');
                        $(window).scrollTo(currentProgram, 400, {
                            over: {
                                top: -10.347
                            }
                        });

                        currentProgram.addClass('live');
                        showItem(currentProgram);
                    });
                }
            }).catch(function(e){
                console.error(e.message);
            });
        }
    });

    function timeToStr(schedulerDate, lang) {
        moment.locale(lang);
        var strDate = moment(schedulerDate).format('LT');
        return strDate;
    }

    function renderTemplate(currentDay, dirrection, first, cb) {
        var $container = $('.page-scheduler-content-items');

        if (dirrection == 'next') {
            oldCounter = currentDay.length;
            $container.find('.active').removeClass('active');

        } else {
            oldCounter = currentDay.length;
            $container.find('.active').removeClass('active');
            var shiftList = 0 - (currentDay.length - 2) * 79 + 200;
            var tempHeightFirst = shiftList * (-2);

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
        var liveStatus = false;

        var selectedGoToTime = window.location.hash.match(/\d{2}:\d{2}/);
        if (selectedGoToTime) {
            selectedGoToTime = selectedGoToTime[0];
        }

        for (var i = 0; i < currentDay.length; i++) {
            var episode = {
                title : currentDay[i].episode.title,
                show :  currentDay[i].show.title,
                date :  timeToStr(currentDay[i].date, 'ru'),
                language : currentDay[i].episode.language,
                liveStatus: '',
                goToEpisodeStatus : ''
            };

            if (selectedGoToTime == episode.date) {
                episode.goToEpisodeStatus = 'goToEpisode'
            }

            var episodeDate = moment(currentDay[i].date);
            var currentDate = moment(Hope.Chrono.getDate());
            if (!liveStatus && episodeDate.date() == currentDate.date() && episodeDate.isAfter(currentDate)) {
                episodes[(i-1)].liveStatus = 'live2';
                $('.page-scheduler-header-now-time').html(timeToStr(currentDay[i-1].date, 'ru'));
                $('.page-scheduler-header-now-episode').html(currentDay[i-1].episode.title);
                $('.page-scheduler-header-now-show').html(currentDay[i-1].show.title);
                liveStatus = true;
            }

            if (currentDay[i].episode.description) {
                episode.description = currentDay[i].episode.description;
            } else {
                episode.description = currentDay[i].show.description.short;
            }
            episode.description = Hope.Utils.textTrim(episode.description, 800);
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

                if (cb) {
                    cb();
                }
            });
        } else {

            setTimeout(function () {
                var counterContainerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item').length;
                var counter = oldCounter;
                var $containerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item');
                for (counter; counter <= counterContainerList; counter++) {
                    $containerList.eq(counter).remove();
                }
                if (cb) {
                    cb();
                }
            }, 300);
        }
    }

    function init(day, cb) {

        ajaxListStatus(true);

        loadJson(day).then(function(data) {
            oldCounter = data.length;
            renderTemplate(data, 'next', true);
            var $container = $('.page-scheduler-content-items');

            $container.animate({
                opacity: 1
            }, 200);

            if (cb) {
                cb();
            }

            ajaxListStatus(false);
        });
    }

});
