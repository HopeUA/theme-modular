$(function () {

    var page = $('.page-episode');
    if (page.length == 0) {
        return;
    }

    var MediaAPI = Hope.Api.Media(Hope.Config.Api.Media.Endpoint);

    document.addEventListener('episodeChanged', function (e) {
        if (e.detail == null) {
            return;
        }

        $('.similar-episodes').hopeLoaderBlock({
            name: 'similar-episodes',
            loader: MediaAPI.episodes('similar').code(e.detail.code),
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
                    item.show.title = Hope.Utils.textTrim(item.show.title, 20);
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
            response.url = Hope.Config.Site.BaseURL + getEpisodeUrl(response.uid);
            view.episode = response;

            return Mustache.render(template, view);
        },
        loader: MediaAPI.episodes(),
        timePage: 625
    });

    var currentVideo = $('.content-video-list-header-content').data('show-code');
    var place = $('.content-video-list-items');

    if (currentVideo) {
        // var Api = MediaAPI.episodes('show').param('show', currentVideo);

        var loadStatus = false;

        var loadVideo = function (videoTotal, videoLimit, Api, status) {
            loadStatus = true;

            Api.offset(videoTotal).limit(videoLimit).fetch().then(function (response) {
                var template = $('#template-video-list').html();
                var view     = {};

                response.data.map(function(item){
                    item.publish = timeToStr2(item.publish, 'ru');
                    item.url  = '/shows/' + item.show.uid + '/' + item.uid.substring(4);
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
                    $('.page-episode-wrap').animate({
                        opacity: 0
                    }, 200, function () {
                       $('.page-episode-wrap').css('display', 'none');
                    });
                    place.html(html);
                    place.css('height', 'auto');
                    place.animate({
                        opacity: 1,
                        marginTop: 0
                    }, 400);
                } else {
                    place.append(html);
                    place.css('height', 'auto');
                }
                $('.content-video-list-label').html('');

                $('.content-video-list-header-search-loader').stop().animate({
                    opacity: 0
                }, 200, function() {
                    $('.content-video-list-header-search-icon').stop().animate({
                        opacity: 1
                    }, 200);
                });

                $('.banners-wide').css('margin-top', 0);

                loadStatus = false;

            }).catch(function (response) {

                if (response.status == 404 && videoTotal == 0) {
                    var viewLabelEmpty = $('#template-video-list-label-empty').html();
                    var htmlBlock = Mustache.render(viewLabelEmpty);

                    $('.page-episode-wrap').animate({
                        opacity: 0
                    }, 200, function () {
                        $('.banners-wide').css('margin-top', 0);
                        $('.page-episode-wrap').css('display', 'none');
                        place.css('display', 'block');
                        place.animate({
                            opacity: 1,
                            marginTop: 0
                        }, 200);
                    });

                    place.css('height', 'auto');
                    place.html(htmlBlock);

                    $('.content-video-list-header-search-loader').stop().animate({
                        opacity: 0
                    }, 200, function() {
                        $('.content-video-list-header-search-icon').stop().animate({
                            opacity: 1
                        }, 200);
                    });

                } else if (videoTotal == 0) {
                    var viewLabelServerError = $('#template-video-list-label-error').html();
                    var htmlBlock = Mustache.render(viewLabelServerError);
                    place.html(htmlBlock);
                }
                console.log(response);
            });
        }

        //loadVideo(0, 10, Api);

        var pageEpisodeWrap = $('.page-episode-wrap');


        setTimeout(function() {

            var counter = 1;

            $(window).scroll(function () {
                if (loadStatus) {
                    return;
                }

                var scrollHeight = $(document).height() - $(window).height();

                if ((scrollHeight - $(window).scrollTop()) <= 3434 && pageEpisodeWrap.css('display') == 'none') {

                    var videoTotal = $('.content-video-list-items').children().length;
                    var currentInputVal = $('.content-video-list-header-search-input').val();
                    var ApiSearch = MediaAPI.shows('episodes').code(currentVideo).search(currentInputVal);
                    loadVideo(videoTotal, 10, ApiSearch);

                    counter++;
                }
            });
        }, 50);

        place.on('click', '.content-video-list-item', function(){
            var link = $(this).find('.content-video-list-content-title');
            window.location.href = link.attr('href');
        });

        var $input = $('.content-video-list-header-search-input');
        var $inputVal = $('.content-video-list-header-search-input').val();
        var requestTimeout;

        $input.keyup(function(){
            if ($inputVal != $input.val()) {
                $('.content-video-list-header-search-icon').stop().animate({
                    opacity: 0
                }, 200, function () {
                    $('.content-video-list-header-search-loader').stop().animate({
                        opacity: 1
                    }, 200);
                });
            } else {
                return;
            }

            if (requestTimeout) {
                clearTimeout(requestTimeout);
            }
            requestTimeout = setTimeout(function(){
                var currentVal = $input.val();

                if (currentVal == '') {
                    $('.content-video-list-items').animate({
                        opacity: 0,
                        marginTop: 100
                    }, 400, function() {
                        $('.content-video-list-items').css('display', 'none');
                        $('.page-episode-wrap').css('display', 'block');
                        $('.page-episode-wrap').animate({
                            opacity: 1
                        }, 200);

                        $('.banners-wide').css('margin-top', 38);

                        $('.content-video-list-header-search-loader').stop().animate({
                            opacity: 0
                        }, 200, function() {
                            $('.content-video-list-header-search-icon').stop().animate({
                                opacity: 1
                            }, 200);
                        });
                    });

                    return;
                }

                $inputVal = $input.val();
                var ApiSearch = MediaAPI.shows('episodes').code(currentVideo).search(currentVal);

                $('.content-video-list-items').css('display', 'block');
                loadVideo(0, 10, ApiSearch, 'new');
            }, 700)
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

// BrandPage

$(function () {

    var page = $('.content-Brand-page-wrap');
    if (!page.length) {
        return;
    }

    var MediaAPI = Hope.Api.Media(Hope.Config.Api.Media.Endpoint);

    console.log('Brand Page Episode');

    var currentVideo = $('.content-Brand-header-content').data('show-code');
    var place = $('.content-video-list-items');

    if (currentVideo) {
        var Api = MediaAPI.shows('episodes').code(currentVideo);

        var loadStatus = false;

        var loadVideo = function (videoTotal, videoLimit, Api, status) {
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

                $('.content-video-list-header-search-loader').stop().animate({
                    opacity: 0
                }, 200, function() {
                    $('.content-video-list-header-search-icon').stop().animate({
                        opacity: 1
                    }, 200);
                });

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

        var pageEpisodeWrap = $('.content-Brand-page-wrap');


        setTimeout(function() {

            var counter = 1;

            $(window).scroll(function () {
                if (loadStatus) {
                    return;
                }

                console.log(pageEpisodeWrap.css('display'));

                var scrollHeight = $(document).height() - $(window).height();

                if ((scrollHeight - $(window).scrollTop()) <= 1851 && pageEpisodeWrap.css('display') == 'none') {

                    var videoTotal = $('.content-video-list-items').children().length;
                    var currentInputVal = $('.content-video-list-header-search-input').val();
                    var ApiSearch = MediaAPI.shows('episodes').code(currentVideo).search(currentInputVal);
                    loadVideo(videoTotal, 10, ApiSearch);

                    counter++;
                }
            });
        }, 50);

        place.on('click', '.content-video-list-item', function(){
            var link = $(this).find('.content-video-list-content-title');
            window.location.href = link.attr('href');
        });

        var $input = $('.content-Brand-header-search-input');
        var changeInput = false;

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
                        var ApiSearch = MediaAPI.shows('episodes').code(currentVideo).search(currentVal);
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