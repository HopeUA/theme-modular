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

    function timeToStr(unixTime, lang) {
        moment.locale(lang);
        var strDate = moment.unix(unixTime).format('D MMMM') + ', ' + '<span>' + moment.unix(unixTime).format('LT') + '</span>';
        return strDate;
    }

});
