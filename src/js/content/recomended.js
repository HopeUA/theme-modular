$(function(){

    var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);

    $('.recomended').hopeSliderBlock({
        name: 'recomended',
        limit:  {first : 10, default : 5},
        type: 'column',
        loader: LocalMediaAPI.episodes('recommended'),
        render: function (response, first) {
            first = first || false;

            var template = $('#template-recomended').html();
            var view     = {};

            view.episodes = response.data.map(function (item) {
                item.title = text_trim(item.title, 25);
                item.show = text_trim (item.show, 23);
                return item;
            });

            return Mustache.render(template, view);
        }
    });
});
