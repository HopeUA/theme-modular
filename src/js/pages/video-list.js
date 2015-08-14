$(function () {

    var place = $('.content-video-list-items');
    var url = 'ajax/videoList0.json';
    var loadStatus = false;

    $.getJSON(url, function (data) {
        var episodes = data.episodes;

        $.each(episodes, function (index, element) {

            var labels = '';

            $.each(element.episodeLabels, function (index, element) {
                var label = '<a href="#" class="content-video-list-content-label">' + element + '</a>';
                labels += label;
            });

            var template = '<div class="content-video-list-item">' +
                '<div class="container">' +
                    '<div class="container-content">' +
                        '<div class="content-video-list-poster">' +
                            '<div class="content-video-list-poster-play"></div>' +
                            '<img src="img/' + element.episodeImg + '" alt="">' +
                        '</div>' +
                        '<div class="content-video-list-content">' +
                            '<a href="/video.html" class="content-video-list-content-title">' + element.episodeTitle + '</a>' +
                            '<p class="content-video-list-content-date">' + timeToStr2(element.episodeDate, 'ru') + '</p>' +
                            '<div class="content-video-list-content-labels">' + labels + '</div>' +
                            '<p class="content-video-list-content-description">' + element.episodeDescription + '</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div>';

            place.append(template);
        });

        loadStatus = data.next;
    });

    function timeToStr2(unixTime, lang) {
        moment.locale(lang);
        var strDate = moment.unix(unixTime).format('D MMMM') + '<span>, ' + moment.unix(unixTime).format('YYYY') + '</span>';
        return strDate;
    }



    setTimeout(function() {

        var counter = 1;

        $(window).scroll(function () {

            var scrollHeight = $(document).height() - $(window).height();

            if ((scrollHeight - $(window).scrollTop()) <= 1851) {

                var place = $('.content-video-list-items');
                var url = 'ajax/videoList' + counter +'.json';

                if (loadStatus) {
                    $.getJSON(url, function (data) {
                        var episodes = data.episodes;
                        $.each(episodes, function (index, element) {

                            var labels = '';

                            $.each(element.episodeLabels, function (index, element) {
                                var label = '<a href="#" class="content-video-list-content-label">' + element + '</a>';
                                labels += label;
                            });

                            var template = '<div class="content-video-list-item">' +
                                '<div class="container">' +
                                '<div class="container-content">' +
                                '<div class="content-video-list-poster">' +
                                '<div class="content-video-list-poster-play"></div>' +
                                '<img src="img/' + element.episodeImg + '" alt="">' +
                                '</div>' +
                                '<div class="content-video-list-content">' +
                                '<a href="/video.html" class="content-video-list-content-title">' + element.episodeTitle + '</a>' +
                                '<p class="content-video-list-content-date">' + timeToStr2(element.episodeDate, 'ru') + '</p>' +
                                '<div class="content-video-list-content-labels">' + labels + '</div>' +
                                '<p class="content-video-list-content-description">' + element.episodeDescription + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>';

                            place.append(template);
                        });
                        loadStatus = data.next;
                    });
                }

                counter++;
            }
        });
    }, 50);

    var item = $('.content-video-list-items');

    $('.content-video-list-items').on('click', '.content-video-list-item', function(){
        var link = $(this).find('.content-video-list-content-title');
        window.location.href = link.attr('href');
    });

});