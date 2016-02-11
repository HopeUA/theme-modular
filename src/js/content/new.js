$(function(){

    var MediaAPI = Hope.Api.Media(Hope.Config.Api.Media.Endpoint);

    $('.new').hopeSliderBlock({
        name:   'new',
        lines:  2,
        loader: MediaAPI.episodes('new'),
        render: function (response, first) {
            first = first || false;

            var template = $('#template-new').html();
            var view     = {};
            if (first) {
                view.first = [response.shift()];
            }

            view.episodes = response.map(function (item) {
                item.title = Hope.Utils.textTrim(item.title, 25);
                item.show.title = Hope.Utils.textTrim(item.show.title, 23);
                return item;
            });

            blockLoader('new');

            return Mustache.render(template, view);
        }
    });
});
