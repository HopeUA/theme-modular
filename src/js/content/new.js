$(function(){
    var MediaAPI = Hope.Api.Media(Hope.Config.Api.Media.Endpoint);
    var $container = $('.new');

    var isHome = $('.page__home').length > 0;
    var loader;
    var sliderPages = 5;
    if ($('.brand-JMLU').length) {
        loader = MediaAPI.shows('episodes').code('JMLU');
    } else if ($('.brand-GMNU').length) {
        loader = MediaAPI.shows('episodes').code('GMNU');
        sliderPages = 2;
    } else {
        loader = MediaAPI.episodes('new');
    }

    $container.hopeSliderBlock({
        name:   'new',
        lines:  2,
        pages: sliderPages,
        loader: loader,
        render: function (response, first) {
            first = first || false;

            response.data.map(function(item){
                item.url = '/shows/' + item.show.uid + '/' + item.uid.substring(4);
            });
            
            var template = $('#template-new').html();
            var view     = {};
            if (first) {
                view.first = [response.data.shift()];
            }

            view.episodes = response.data.map(function (item) {
                item.title = Hope.Utils.textTrim(item.title, 25);
                item.show.title = Hope.Utils.textTrim(item.show.title, 23);
                return item;
            });

            if (isHome) {
                blockLoader('new');
            }

            return Mustache.render(template, view);
        }
    });
    
    $container.on('click', '.content-episodes__row-item', function(){
        location.href = $(this).find('a').attr('href');
    });
    
    $container.on('click', '.content-episode__large', function(){
        location.href = $(this).find('a').attr('href');
    });
});
