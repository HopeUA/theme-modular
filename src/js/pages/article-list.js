$(function () {

    //var currentVideo = $('.content-video-list-header-content').data('show-code');
    var page = $('.page-articles');

    if (page.length == 1) {
        var place = $('.page-articles-items');

        //var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);
        //var Api = LocalMediaAPI.episodes('show').param('show', currentVideo);

        var Api = Hope.Api.LocalArticles(Hope.Config.Api.Articles.Endpoint).category('news');

        var loadStatus = false;

        var loadVideo = function (videoTotal, videoLimit, Api, status) {
            loadStatus = true;
            Api.offset(videoTotal).limit(videoLimit).fetch().then(function (response) {

                console.log('request');

                var template = $('#template-article-list').html();
                var view     = {};

                response.data.map(function(item, key){
                    item.date = moment(item.date).format('DD.MM.YYYY');
                    item.code = getEpisodeUrl(item.code);
                    item.description = Hope.Utils.textTrim(item.description.full, 520);
                    item.views = item.views || 0;

                    if (status == 'new' && key == 0) {
                        item.class = 'page-articles-article-last';
                    } else {
                        item.class = '';
                    }

                    return item;
                });

                view.articles = response.data;

                var html = Mustache.render(template, view);
                if (status == 'new') {
                    place.html(html);
                } else {
                    place.append(html);
                }

                $('.page-articles-article-last .container').animate({
                    opacity: 1
                }, 250);
                $('.page-articles-article').animate({
                    opacity: 1
                }, 250);

                loadStatus = false;

            }).catch(function (response) {

                if (videoTotal == 0) {
                    if (response.status == 404) {
                        var viewLabelEmpty = $('.page-articles-search-error-empty');
                        viewLabelEmpty.css('display', 'block');
                        viewLabelEmpty.animate({
                            opacity: 1
                        }, 250);

                        var articlesItem = $('.page-articles-article').not(':first');
                        var articleItemFirstContainer = $('.page-articles-article').eq(0).find('.container');

                        articleItemFirstContainer.animate({
                            opacity: 0
                        }, 200);

                        articlesItem.animate({
                            opacity: 0
                        }, 200, function () {
                            $('.banners-wide').css('margin-top', '-5px');
                            articlesItem.css('display', 'none');
                        });

                    } else {
                        var viewLabelServerError = $('.page-articles-search-error-server');
                        viewLabelServerError.css('display', 'inline-flex');
                        viewLabelServerError.animate({
                            opacity: 1
                        }, 250);
                    }
                }
                console.log(response);
            });
        }

        loadVideo(0, 3, Api, 'new');

        setTimeout(function() {

            var counter = 1;

            $(window).scroll(function () {
                if (loadStatus) {
                    return;
                }

                var scrollHeight = $(document).height() - $(window).height();

                if ((scrollHeight - $(window).scrollTop()) <= 1851) {

                    var videoTotal = $('.page-articles-article').length;
                    var currentInputVal = $('.page-articles-header-search-input').val();
                    var ApiSearch = Api.search(currentInputVal);
                    loadVideo(videoTotal, 10, ApiSearch);

                    counter++;
                }
            });
        }, 50);


        place.on('click', '.page-articles-article', function(){
            if ($(this).hasClass('page-articles-article-last')) {
                return;
            }
            var link = $(this).find('.page-articles-article-content-title');
            window.location.href = link.attr('href');
        });

        place.on('click', '.page-articles-article-last .container-content', function(){
            var link = $(this).find('.page-articles-article-content-title');
            window.location.href = link.attr('href');
        });

        var $input = $('.page-articles-header-search-input');
        var changeInput = false;
        var searchString = '';

        $input.keyup(function(){
            changeInput = true;
            console.log('keyup');
            setTimeout(function(){
                var currentVal = $input.val();
                console.log('start timer');
                if (changeInput && currentVal !== searchString) {
                    console.log('load artilce');
                    //var ApiSearch = LocalMediaAPI.episodes('show').param('show', currentVideo).search(currentVal);
                    var ApiSearch = Api.search(currentVal);
                    //place.html('');
                    var errorEmpty = $('.page-articles-search-error-empty');
                    var errorServer = $('.page-articles-search-error-server');

                    if (errorEmpty.css('display') !== 'none') {
                        errorEmpty.animate({
                            opacity: 0
                        }, 250, function() {
                            errorEmpty.css('display', 'none');
                        })
                    }

                    if (errorServer.css('display') !== 'none') {
                        errorServer.animate({
                            opacity: 0
                        }, 250, function() {
                            errorServer.css('display', 'none');
                        })
                    }

                    loadVideo(0, 10, ApiSearch, 'new');

                    changeInput = false;
                }
                searchString = currentVal;
                console.log('end timer');
            }, 700);
        });
    }

    function getEpisodeUrl(code) {
        return '/shows/' + code.substring(0, 4) + '/' + code.substring(4);
    }

});