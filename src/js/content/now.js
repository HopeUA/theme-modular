$(function(){

    var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);

    $('.now').hopeSliderBlock({
        name:   'now',
        limit:  {first : 7, default : 10},
        loader: LocalMediaAPI.episodes('now'),
        render: function (response, first) {
            first = first || false;

            var template = $('#template-now').html();
            var view     = {};
            if (first) {
                view.first = [response.data.shift()];
            }
            view.episodes = response.data;

            return Mustache.render(template, view);
        }
    });

    var slider = $('.now').data('hopeSliderBlock');

    $('.filter-small__reload').click(function(){
        slider.reload();
    });

});
