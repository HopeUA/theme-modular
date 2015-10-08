// Slider init
    //$('.anons').hopeSliderBlock({
    //    loadUrl: 'ajax/anons',
    //    name: 'anons'
    //});

    // Slider reload
    //var slider = $('.anons').hopeSliderBlock();

    //$('.filtet').click(function(){
    //    slider.setUrl('new url').reload();
    //})


$(function(){

    var LocalArticlesAPI = Hope.Api.LocalArticles(Hope.Config.Api.Articles.Endpoint);

    $('.anons').hopeSliderBlock({
        name:   'anons',
        lines:  2,
        loader: LocalArticlesAPI.category('news'),
        render: function (response) {

            var template = $('#template-article').html();
            var view     = {};

            view.articles = response.data.map(function (item) {
                item.title = Hope.Utils.textTrim(item.title, 29);
                item.description = Hope.Utils.textTrim(item.description.short, 210);
                return item;
            });

            return Mustache.render(template, view);
        }
    });
});

