$(function () {

    var page = $('.page-article');
    if (!page.length) {
        return;
    }

    var LocalArticlesAPI = Hope.Api.LocalArticles(Hope.Config.Api.Articles.Endpoint);

    $('.page-article-anons').hopeLoaderBlock({
        name:   'anons',
        lines:  2,
        btnMore: $('.page-article-anons-btn__more'),
        loader: LocalArticlesAPI.category('news'),
        render: function (response) {

            var template = $('#template-article-loader-block').html();
            var view     = {};

            view.articles = response.data.map(function (item) {
                item.title = Hope.Utils.textTrim(item.title, 29);
                item.description = Hope.Utils.textTrim(item.description.short, 210);
                return item;
            });

            console.log(view);

            return Mustache.render(template, view);
        }
    });

    page.hopeSliderArticlePage({
        render: function (response) {

            //var template = $('#template-page-episode').html();
            //var view     = {};
            //view.episode = response.object;

            //return Mustache.render(template, view);
        },
        loader: LocalArticlesAPI.category('news'),
        arrowLeft: $('.page-article-arrow__left'),
        arrowRight: $('.page-article-arrow__right'),
        timePage: 800
    });

});
