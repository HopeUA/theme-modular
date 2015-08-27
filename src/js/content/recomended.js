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

            view.episodes = response.data.map(function(item) {
                item.description = $('<p>' + item.description + '</p>').text();
                item.title = $('<p>' + item.title + '</p>').text();
                item.show = $('<p>' + item.show + '</p>').text();
                return item;
            });

            return Mustache.render(template, view);
        }
    });
});
