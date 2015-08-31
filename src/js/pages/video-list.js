$(function () {

    var currentVideo = $('.content-video-list-header-content').data('show-code');
    var place = $('.content-video-list-items');

    if (currentVideo) {
        var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);
        var Api = LocalMediaAPI.episodes('show').param('show', currentVideo);

        var loadStatus = false;

        var VideoTotal = 1;
        var VideoLimit = 10;

        var loadVideo = function (VideoTotal, VideoLimit) {
            Api.offset(VideoTotal).limit(VideoLimit).fetch().then(function (response) {

                var template = $('#template-video-list').html();
                var view     = {};

                response.data.map(function(item){
                    item.date = timeToStr2(item.date, 'ru');
                    item.code = getEpisodeUrl(item.code);
                    item.labels = '';

                    $.each(item.tags, function (index, tag) {
                        if (index < 4) {
                            var label = '<a href="#" class="content-video-list-content-label">' + tag + '</a>';
                            item.labels += label;
                        } else {
                            return;
                        }
                    });
                    return item;
                });

                view.episodes = response.data;

                var html = Mustache.render(template, view);
                place.append(html);
            }).catch(function (response) {
                console.error(response);
            });
        }

        loadVideo(VideoTotal, VideoLimit);
    }

    function timeToStr2(date, lang) {
        moment.locale(lang);
        var strDate = moment(date).format('D MMMM') + '<span>, ' + moment(date).format('YYYY') + '</span>';
        return strDate;
    }

    function getEpisodeUrl(code) {
        return '/shows/' + code.substring(0, 4) + '/' + code.substring(4);
    }

    //setTimeout(function() {
    //
    //    var counter = 1;
    //
    //    $(window).scroll(function () {
    //
    //        var scrollHeight = $(document).height() - $(window).height();
    //
    //        if ((scrollHeight - $(window).scrollTop()) <= 1851) {
    //
    //            var place = $('.content-video-list-items');
    //            var url = Hope.Config.Api.Media.Endpoint + '/episodes.json?module=show&show=' + $('content-video-list-header-content').data('show-code');
    //
    //            url += '&offset=' + (counter*10);
    //
    //            if (loadStatus) {
    //                $.getJSON(url, function (data) {
    //                    var episodes = data.data;
    //                    $.each(episodes, function (index, element) {
    //
    //                        var labels = '';
    //
    //                        $.each(element.tags, function (index, tag) {
    //                            var label = '<a href="#" class="content-video-list-content-label">' + tag + '</a>';
    //                            labels += label;
    //                        });
    //
    //                        var template = '<div class="content-video-list-item">' +
    //                            '<div class="container">' +
    //                            '<div class="container-content">' +
    //                            '<div class="content-video-list-poster">' +
    //                            '<div class="content-video-list-poster-play"></div>' +
    //                            '<img src="' + element.image + '" alt="">' +
    //                            '</div>' +
    //                            '<div class="content-video-list-content">' +
    //                            '<a href="' + getEpisodeUrl(element.code) + '" class="content-video-list-content-title">' + element.title + '</a>' +
    //                            '<p class="content-video-list-content-date">' + timeToStr2(element.date, 'ru') + '</p>' +
    //                            '<div class="content-video-list-content-labels">' + labels + '</div>' +
    //                            '<p class="content-video-list-content-description">' + element.description + '</p>' +
    //                            '</div>' +
    //                            '</div>' +
    //                            '</div>' +
    //                            '</div>';
    //
    //                        place.append(template);
    //                    });
    //                    loadStatus = data.next;
    //                });
    //            }
    //
    //            counter++;
    //        }
    //    });
    //}, 50);

    //var item = $('.content-video-list-items');

    place.on('click', '.content-video-list-item', function(){
        var link = $(this).find('.content-video-list-content-title');
        window.location.href = link.attr('href');
    });

});