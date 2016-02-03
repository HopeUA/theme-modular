$(function () {

    var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);

    $('.recomended').hopeSliderBlock({
        name: 'recomended',
        limit: {first: 10, default: 5},
        type: 'column',
        loader: LocalMediaAPI.episodes('recommended'),
        render: function (response, first) {
            first = first || false;

            var template = $('#template-recomended').html();
            var view = {};

            view.episodes = response.data.map(function (item) {
                item.title = Hope.Utils.textTrim(item.title, 32);
                item.show = Hope.Utils.textTrim(item.show, 25);
                item.description = Hope.Utils.textTrim(item.description, 138);
                return item;
            });

            blockLoader('recomended');

            return Mustache.render(template, view);
        }
    });
});
