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
                var titleLimit = 25;
                var showLimit = 23;
                var reg = /[а-яёіїА-Яa-zA-Z]/;

                item.description = $('<p>' + item.description + '</p>').text();
                item.title = $('<p>' + item.title + '</p>').text();

                if (item.title.length > titleLimit) {

                    item.title = item.title.substring(0, titleLimit).trim();

                    for(var i = item.title.length - 1; i > 0; i--) {
                        var currentTitle = item.title.charAt(i);
                        if (reg.test(currentTitle)) {
                            break;
                        } else {
                            item.title = item.title.substring(0, item.title.length - 1);
                        }
                    }

                    item.title += '...';
                }

                item.show = $('<p>' + item.show + '</p>').text();

                if (item.show.length > showLimit) {

                    item.show = item.show.substring(0, showLimit).trim();

                    for(var l = item.show.length - 1; l > 0; l--) {
                        var currentShow = item.show.charAt(i);
                        if (reg.test(currentShow)) {
                            break;
                        } else {
                            item.show = item.show.substring(0, item.show.length - 1);
                        }
                    }

                    item.show += '...';
                }

                return item;
            });

            return Mustache.render(template, view);
        }
    });
});
