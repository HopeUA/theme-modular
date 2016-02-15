$(function(){

    var MediaAPI = Hope.Api.Media(Hope.Config.Api.Media.Endpoint);

    $('.now').hopeSliderBlock({
        name:   'now',
        limit:  {first : 7, default : 10},
        loader: MediaAPI.episodes('now').include('show'),
        render: function (response, first) {
            first = first || false;

            var template = $('#template-now').html();
            var view     = {};
            if (first) {
                view.first = [response.data.shift()];
            }

            view.episodes = response.data.map(function (item) {
                item.title = Hope.Utils.textTrim(item.title, 25);
                item.show.title = Hope.Utils.textTrim(item.show.title, 23);
                return item;
            });

            blockLoader('now');

            return Mustache.render(template, view);
        }
    });

    var slider = $('.now').data('hopeSliderBlock');

    $('.filter-small__reload').click(function(){
        slider.reload();
    });

});
