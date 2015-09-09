$(function () {

    var tempIndex = $('.page-scheduler-content-items .active').index();
    var $pageContent = $('.page-scheduler-content');
    var daysCache = {};

    init();

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
        var currentIndex = $(this).index();
        var prevIndex = $('.page-scheduler-header-list .selected').index();

        if (currentIndex == prevIndex) {
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

    function renderTemplate(currentDay, dirrection) {

        var $container = $('.page-scheduler-content-items');
        var heightDefaultElement = 40;
        var countInvisibleElements = currentDay.length;

        if (dirrection == 'next') {
            var shiftList = 0 - ($container.find('.page-scheduler-content-item').length * heightDefaultElement);
            $container.find('.active').removeClass('active');
        } else {
            var shiftList = 0 - (countInvisibleElements * heightDefaultElement + 3);

            $container.css({
                marginTop: shiftList
            })

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

        if (dirrection == 'next') {
            $container.append(renderTemplate);
        } else {
            $container.prepend(renderTemplate);
        }

        var $containerList = $('.page-scheduler-content-items').find('.page-scheduler-content-item');

        if (dirrection == 'next') {
            var counterContainerList = $containerList.length - currentDay.length;

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
        } else {
            var counterContainerList = $containerList.length;
            var counter = countInvisibleElements;

            setTimeout(function () {
                for (counter; counter <= counterContainerList; counter++) {
                    $containerList.eq(counter).remove();
                }
            }, 300);
        }
    }

    function init() {
        var elementId = '2015-09-04';

        loadJson(elementId).then(function(data) {
            renderTemplate(data, 'next');
            var $container = $('.page-scheduler-content-items');
            $container.animate({
                opacity : 1,
                height : '100%'
            }, 200);
        });
    }

});
