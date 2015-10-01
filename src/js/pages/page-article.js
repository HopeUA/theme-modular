$(function () {

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

    $('.page-article').hopeSliderPage({
        render: function (template, data) {
            template.find('.pa-article-title').text(data.title);
            $('.pa-article-title').text(data.title);
            var imgSrc = 'img/' + data.img;
            template.find('.pa-article-img').attr('src', imgSrc);
            template.find('.pa-article-description').html(data.description);
            template.find('.pa-article-date').text(moment.unix(data.date).format('DD.MM.YYYY'));
            template.find('.pa-article-views').text(data.views);
        },
        arrowLeft: $('.page-article-arrow__left'),
        arrowRight: $('.page-article-arrow__right'),
        url: 'ajax/'
    });

    function timeToStr(unixTime, lang) {
        moment.locale(lang);
        var strDate = moment.unix(unixTime).format('D MMMM') + ', ' + '<span>' + moment.unix(unixTime).format('LT') + '</span>';
        return strDate;
    }

    articleBlock = $('.page-article').length;

    if (articleBlock != 0) {
        $poster = $('.page-article-header');
        $poster.css({
            backgroundSize: '163%',
            backgroundPosition: '38% 38%',
            height: '106%',
            width: '105%'
        });
    }

});
