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
        render: function (response) {

            var template = $('#template-page-episode').html();
            var view     = {};
            view.episode = response.object;

            return Mustache.render(template, view);
        },
        loader: LocalMediaAPI.episodes(),
        timePage: 625
    });

});