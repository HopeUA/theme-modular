$(function () {

    $('.similar-episodes').hopeLoaderBlock({
        render: function (template, data) {
            var src = 'img/' + data.episodeImg;
            template.find('.similar-episodes-item-video-image__wide').attr('src', src);
            template.find('.similar-episodes-item-description-time').text(moment.unix(data.episodeDate).format('DD.MM.YYYY'));
            template.find('.similar-episodes-item-description-title').text(data.episodeTitle);
            template.find('.similar-episodes-item-description-show').text(data.episodeShow);

            return template;
        },
        url: 'ajax/similar-episodes'
    });

    $('.page-video').hopeSliderPage({
        render: function (template, data) {
            template.find('.pv-episode-title').text(data.title);
            $('.pv-episode-title').text(data.title);
            template.find('.pv-episode-show').text(data.show);
            $('.pv-episode-show').text(data.show);
            var imgSrc = 'img/' + data.img;
            template.find('.pv-episode-img').attr('src', imgSrc);
            template.find('.pv-episode-description').text(data.description);
            template.find('.pv-episode-date').text(moment.unix(data.date).format('DD.MM.YYYY'));
            template.find('.pv-episode-views').text(data.views);
        },
        url: 'ajax/'
    });

});
