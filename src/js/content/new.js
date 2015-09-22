$(function(){

    var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);

    $('.new').hopeSliderBlock({
        name:   'new',
        lines:  2,
        loader: LocalMediaAPI.episodes('new'),
        render: function (response, first) {
            first = first || false;

            var template = $('#template-new').html();
            var view     = {};
            if (first) {
                view.first = [response.data.shift()];
            }

            view.episodes = response.data.map(function (item) {
                item.title = text_trim(item.title, 25);
                item.show = text_trim (item.show, 23);
                return item;
            });

            return Mustache.render(template, view);
        }
    });
});
