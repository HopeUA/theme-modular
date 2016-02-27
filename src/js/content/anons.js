$(function(){
    var LocalArticlesAPI = Hope.Api.LocalArticles(Hope.Config.Api.Articles.Endpoint);
    var $container = $('.anons');

    $container.hopeSliderBlock({
        name:   'anons',
        lines:  2,
        pages: 2,
        loader: LocalArticlesAPI.category('news'),
        render: function (response) {

            var template = $('#template-article').html();
            var view     = {};

            view.articles = response.data.map(function (item) {
                item.title = Hope.Utils.textTrim(item.title, 25);
                item.description = Hope.Utils.textTrim(item.description.short, 210);
                return item;
            });

            blockLoader('anons');

            return Mustache.render(template, view);
        }
    });

    $container.on('click', 'article', function(){
        location.href = $(this).find('a').attr('href');
    });
});
