$(function () {

    var currentVideo = $('.content-video-list-header-content').data('show-code');
    var place = $('.content-video-list-items');

    if (currentVideo) {
        var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);
        var Api = LocalMediaAPI.episodes('show').param('show', currentVideo);

        var loadStatus = false;

        var loadVideo = function (videoTotal, videoLimit, Api) {
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
                place.append(html);
                loadStatus = false;

            }).catch(function (response) {
                console.error(response);
            });
        }

        loadVideo(0, 10, Api);
    }

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
            if (loadStatus) {
                return;
            }

            var scrollHeight = $(document).height() - $(window).height();

            if ((scrollHeight - $(window).scrollTop()) <= 1851) {

                var videoTotal = $('.content-video-list-items').children().length;
                loadVideo(videoTotal, 10);

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

    $input.keyup(function(){
        changeInput = true;
        setTimeout(function(){
            var currentVal = $input.val();
            if (changeInput && currentVal !='') {
                console.log(currentVal);
                var ApiSearch = LocalMediaAPI.episodes('show').param('show', 'MBCP');
                loadVideo(0, 10, ApiSearch);
                changeInput = false;
            }
        }, 2000);
    });

});