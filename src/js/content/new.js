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
                item.title = Hope.Utils.textTrim(item.title, 25);
                item.show = Hope.Utils.textTrim(item.show, 23);
                return item;
            });

            console.log(template);
            return Mustache.render(template, view);
        }
    });
});
