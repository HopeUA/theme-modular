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

        $input.keyup(function(){
            changeInput = true;
            setTimeout(function(){
                var currentVal = $input.val();
                if (changeInput) {
                    console.log(currentVal);
                    //var ApiSearch = LocalMediaAPI.episodes('show').param('show', currentVideo).search(currentVal);
                    var ApiSearch = Api.search(currentVal);
                    //place.html('');
                    loadVideo(0, 10, ApiSearch, 'new');
                    changeInput = false;
                }
            }, 700);
        });
    }

    function getEpisodeUrl(code) {
        return '/shows/' + code.substring(0, 4) + '/' + code.substring(4);
    }

});