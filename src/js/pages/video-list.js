$(function () {

    var place = $('.content-video-list-items');
    var url = hopeConfig.api.media.endpoint + '/episodes.json?module=show&show=' + $('.content-video-list-header-content').data('show-code');
    var loadStatus = false;

    $.getJSON(url, function (data) {
        var episodes = data.data;

        $.each(episodes, function (index, element) {

            var labels = '';

            $.each(element.tags, function (index, tag) {
                var label = '<a href="#" class="content-video-list-content-label">' + tag + '</a>';
                labels += label;
            });

            var template = '<div class="content-video-list-item">' +
                '<div class="container">' +
                    '<div class="container-content">' +
                        '<div class="content-video-list-poster">' +
                            '<div class="content-video-list-poster-play"></div>' +
                            '<img src="' + element.image + '" alt="">' +
                        '</div>' +
                        '<div class="content-video-list-content">' +
                            '<a href="' + getEpisodeUrl(element.code) + '" class="content-video-list-content-title">' + element.title + '</a>' +
                            '<p class="content-video-list-content-date">' + timeToStr2(element.date, 'ru') + '</p>' +
                            '<div class="content-video-list-content-labels">' + labels + '</div>' +
                            '<p class="content-video-list-content-description">' + element.description + '</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div>';

            place.append(template);
        });

        loadStatus = data.next;
    });

    function timeToStr2(date, lang) {
        moment.locale(lang);
        var strDate = moment(date).format('D MMMM') + '<span>, ' + moment(date).format('YYYY') + '</span>';
        return strDate;
    }

    function getEpisodeUrl(code) {
        return '/shows/' + code.substring(0, 4) + '/' + code.substring(4);
    }



    setTimeout(function() {

        var counter = 1;

        $(window).scroll(function () {

            var scrollHeight = $(document).height() - $(window).height();

            if ((scrollHeight - $(window).scrollTop()) <= 1851) {

                var place = $('.content-video-list-items');
                var url = hopeConfig.api.media.endpoint + '/episodes.json?module=show&show=' + $('content-video-list-header-content').data('show-code');

                url += '&offset=' + (counter*10);

                if (loadStatus) {
                    $.getJSON(url, function (data) {
                        var episodes = data.data;
                        $.each(episodes, function (index, element) {

                            var labels = '';

                            $.each(element.tags, function (index, tag) {
                                var label = '<a href="#" class="content-video-list-content-label">' + tag + '</a>';
                                labels += label;
                            });

                            var template = '<div class="content-video-list-item">' +
                                '<div class="container">' +
                                '<div class="container-content">' +
                                '<div class="content-video-list-poster">' +
                                '<div class="content-video-list-poster-play"></div>' +
                                '<img src="' + element.image + '" alt="">' +
                                '</div>' +
                                '<div class="content-video-list-content">' +
                                '<a href="' + getEpisodeUrl(element.code) + '" class="content-video-list-content-title">' + element.title + '</a>' +
                                '<p class="content-video-list-content-date">' + timeToStr2(element.date, 'ru') + '</p>' +
                                '<div class="content-video-list-content-labels">' + labels + '</div>' +
                                '<p class="content-video-list-content-description">' + element.description + '</p>' +
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