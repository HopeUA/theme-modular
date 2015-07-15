$(function () {

    $('.page-article-anons').hopeLoaderBlock({
        render: function (template, data) {
            var src = 'img/' + data.articleImg;
            template.find('.content-article__small-image').attr('src', src);
            template.find('.content-article__small-date').html(timeToStr(data.articleDate, 'ru'));
            template.find('.content-article__small-title').text(data.articleTitle);
            template.find('.content-article__small-description').text(data.articleDescription);

            return template;
        },
        btnMore: $('.page-article-anons-btn__more'),
        url: 'ajax/similar-articles'
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

});
