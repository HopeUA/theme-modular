$(function () {

    var page = $('.page-episode');
    if (!page.length) {
        return;
    }

    var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);

    document.addEventListener('episodeChanged', function (e) {
        if (e.detail == null) {
            return;
        }

        $('.similar-episodes').hopeLoaderBlock({
            name: 'similar-episodes',
            loader: LocalMediaAPI.episodes('similar').param('code', e.detail.code),
            render: function (response, first) {
                first = first || false;

                var template = $('#template-similar').html();
                var view     = {};
                if (first) {
                    view.first = [response.data.shift()];
                }
                view.episodes = response.data;

                view.episodes = response.data.map(function (item) {
                    item.title = Hope.Utils.textTrim(item.title, 20);
                    item.show = Hope.Utils.textTrim(item.show, 20);
                    return item;
                });

                return Mustache.render(template, view);
            }
        });
    }, false);

    var episodeChangedEvent = new CustomEvent('episodeChanged', {
        detail: { code: page.data('episode-code') }
    });
    document.dispatchEvent(episodeChangedEvent);

    page.hopeSliderPage({
        render: function (template, data) {
            $('.page-episode').data('episode-code', data.code);

            template.find('.pv-episode-title').text(data.title);
            $('.pv-episode-title').text(data.title);
            template.find('.pv-episode-show').text(data.show);
            $('.pv-episode-show').text(data.show);
            var imgSrc = data.image;
            template.find('.pv-episode-img').attr('src', imgSrc);
            template.find('.pv-episode-description').html(data.description);
            template.find('.pv-episode-date').text(moment(data.date).format('DD.MM.YYYY'));
            template.find('.pv-episode-views').text(data.views);
        },
        loader: LocalMediaAPI.episodes()
    });

});