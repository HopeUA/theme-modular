$(function () {

    var page = $('.page-episode');
    if (!page.length) {
        return;
    }

    var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);

    document.addEventListener('episodeChanged', function (e) {
        if (e.detail == null) {
            return;
        }

        $('.similar-episodes').hopeLoaderBlock({
            name: 'similar-episodes',
            loader: LocalMediaAPI.episodes('similar').param('code', e.detail.code),
            render: function (response, first) {
                first = first || false;

                var template = $('#template-similar').html();
                var view     = {};
                if (first) {
                    view.first = [response.data.shift()];
                }
                view.episodes = response.data;

                view.episodes = response.data.map(function (item) {
                    item.title = Hope.Utils.textTrim(item.title, 20);
                    item.show = Hope.Utils.textTrim(item.show, 20);
                    return item;
                });

                return Mustache.render(template, view);
            }
        });
    }, false);

    var episodeChangedEvent = new CustomEvent('episodeChanged', {
        detail: { code: page.data('episode-code') }
    });
    document.dispatchEvent(episodeChangedEvent);

    page.hopeSliderPage({
        render: function (response) {

            var template = $('#template-page-episode').html();
            var view     = {};
            view.episode = response.object;

            return Mustache.render(template, view);
        },
        loader: LocalMediaAPI.episodes(),
        timePage: 625
    });

    console.log('Page Episode');

    var currentVideo = $('.content-video-list-header-content').data('show-code');
    var place = $('.content-video-list-items');

    if (currentVideo) {
        var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);
        var Api = LocalMediaAPI.episodes('show').param('show', currentVideo);

        var loadStatus = false;

        var loadVideo = function (videoTotal, videoLimit, Api, status) {
            console.log('loadVideo run');
            loadStatus = true;
            Api.offset(videoTotal).limit(videoLimit).fetch().then(function (response) {

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
                if (status == 'new') {
                    place.html(html);
                } else {
                    place.append(html);
                }
                $('.content-video-list-label').html('');
                loadStatus = false;

            }).catch(function (response) {

                if (response.status == 404 && videoTotal == 0) {
                    var viewLabelEmpty = $('#template-video-list-label-empty').html();
                    var htmlBlock = Mustache.render(viewLabelEmpty);
                    place.html(htmlBlock);
                } else if (videoTotal == 0) {
                    var viewLabelServerError = $('#template-video-list-label-error').html();
                    var htmlBlock = Mustache.render(viewLabelServerError);
                    place.html(htmlBlock);
                }
                console.log(response);
            });
        }

        //loadVideo(0, 10, Api);

        setTimeout(function() {

            var counter = 1;

            $(window).scroll(function () {
                if (loadStatus) {
                    return;
                }

                var scrollHeight = $(document).height() - $(window).height();

                if ((scrollHeight - $(window).scrollTop()) <= 1851) {

                    var videoTotal = $('.content-video-list-items').children().length;
                    var currentInputVal = $('.content-video-list-header-search-input').val();
                    var ApiSearch = LocalMediaAPI.episodes('show').param('show', currentVideo).search(currentInputVal);
                    //loadVideo(videoTotal, 10, ApiSearch);

                    counter++;
                }
            });
        }, 50);

        place.on('click', '.content-video-list-item', function(){
            var link = $(this).find('.content-video-list-content-title');
            window.location.href = link.attr('href');
        });

        var $input = $('.content-video-list-header-search-input');
        var changeInput = false;
        var pageEpisodeWrap = $('.page-episode-wrap');

        $input.keyup(function(){
            changeInput = true;
            setTimeout(function(){
                var currentVal = $input.val();
                if (changeInput) {
                    if (currentVal == '') {
                        console.log('clear');
                        pageEpisodeWrap.css('display', 'block');
                        pageEpisodeWrap.animate({
                            opacity: 1
                        }, 200, function(){
                            $('.content-video-list-items').html('');
                        });
                    } else {
                        var ApiSearch = LocalMediaAPI.episodes('show').param('show', currentVideo).search(currentVal);
                        //place.html('');
                        loadVideo(0, 10, ApiSearch, 'new');
                        pageEpisodeWrap.animate({
                            opacity: 0
                        }, 200, function () {
                            pageEpisodeWrap.css('display', 'none');
                        });
                    }
                    changeInput = false;
                }
            }, 700);
        });
    }

    function timeToStr2(date, lang) {
        moment.locale(lang);
        var strDate = moment(date).format('D MMMM') + '<span>, ' + moment(date).format('YYYY') + '</span>';
        return strDate;
    }

    function getEpisodeUrl(code) {
        return '/shows/' + code.substring(0, 4) + '/' + code.substring(4);
    }

});