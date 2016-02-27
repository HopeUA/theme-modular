$(function(){
    var MediaAPI = Hope.Api.Media(Hope.Config.Api.Media.Endpoint);
    var $container = $('.now');

    $container.hopeSliderBlock({
        name:   'now',
        limit:  {first : 7, default : 10},
        loader: MediaAPI.episodes('now'),
        render: function (response, first) {
            first = first || false;

            response.data.map(function(item){
                item.url = '/shows/' + item.show.uid + '/' + item.uid.substring(4);
            });

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

    var slider = $container.data('hopeSliderBlock');

    $('.filter-small__reload').click(function(){
        slider.reload();
    });

    $container.on('click', '.content-episodes__row-item', function(){
        location.href = $(this).find('a').attr('href');
    });

    $container.on('click', '.content-episode__large', function(){
        location.href = $(this).find('a').attr('href');
    });
});
