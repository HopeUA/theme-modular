$(function () {

    var firstLoad = true;
    var currentVideo = $('.content-video-list-header-content').data('show-code');
    var place = $('.content-video-list-items');
    var pageEpisodeWrap = $('.page-episode-wrap');

    if ($('.page__show-loader').length > 0) {
        $('.content-video-list-items').css('display', 'block');
    }

    if (currentVideo && pageEpisodeWrap.length == 0) {
        var MediaAPI = Hope.Api.Media(Hope.Config.Api.Media.Endpoint);
        var Api = MediaAPI.shows('episodes').code(currentVideo);

        var loadStatus = false;

        var loadVideo = function (videoTotal, videoLimit, Api, status) {
            loadStatus = true;

            if (status == 'new') {
                if (firstLoad) {
                    $('.page__show-loader').css('display', 'block');
                    $('.page__show-loader').css('marginTop', -400);
                    firstLoad = false;
                }
            } else {
                $('.page__show-loader').css({
                    marginTop: 40,
                    height: 110
                });
                $('.page__show-loader').css('display', 'block');
            }

            Api.offset(videoTotal).limit(videoLimit).fetch().then(function (response) {

                var template = $('#template-video-list').html();
                var view     = {};

                response.data.map(function(item){
                    item.publish = timeToStr2(item.publish, 'ru');
                    item.url     = '/shows/' + item.show.uid + '/' + item.uid.substring(4);
                    item.labels = '';

                    $.each(item.tags, function (index, tag) {
                        if (index < 4) {
                            item.labels += '<a href="#" class="content-video-list-content-label">' + tag + '</a>';
                        }
                    });
                    return item;
                });

                view.episodes = response.data;

                var html = Mustache.render(template, view);
                if (status == 'new') {
                    place.css({
                        opacity: 0,
                        marginTop: 100
                    });
                    place.html(html);
                    // console.log('new');
                } else {
                    place.append(html);
                    // console.log('old');
                }

                $('.banners-wide').css('margin-top', 0);
                $('.content-video-list-items').css('height', 'auto');
                $('.content-video-list-items').animate({
                    opacity: 1,
                    marginTop: 0
                }, 400);

                $('.page__show-loader').css('display', 'none');

                $('.content-video-list-header-search-loader').stop().animate({
                    opacity: 0
                }, 200, function() {
                    $('.content-video-list-header-search-icon').stop().animate({
                        opacity: 1
                    }, 200);
                });

                $('.content-video-list-label').html('');
                loadStatus = false;

            }).catch(function (response) {

                if (response.status == 404 && videoTotal == 0) {
                    var viewLabelEmpty = $('#template-video-list-label-empty').html();
                    var htmlBlock = Mustache.render(viewLabelEmpty);
                    place.html(htmlBlock);

                    $('.page__show-loader').css('display', 'none');

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
                } else {
                    $('.page__show-loader').css('display', 'none');
                }
                // console.log(response);
            });
        }

        loadVideo(0, 10, Api, 'new');

        setTimeout(function() {

            var counter = 1;

            $(window).scroll(function () {
                if (loadStatus) {
                    return;
                }

                var scrollHeight = $(document).height() - $(window).height();

                // console.log(scrollHeight);
                // console.log($(window).scrollTop());
                if ((scrollHeight - $(window).scrollTop()) <= 3434) {

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
                $inputVal = $input.val();
                var ApiSearch = MediaAPI.shows('episodes').code(currentVideo).search(currentVal);
                //place.html('');
                loadVideo(0, 10, ApiSearch, 'new');
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