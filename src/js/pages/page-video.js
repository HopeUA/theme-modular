$(function () {

    var counter = 0;

    $('.similar-episodes-btn__more').click(function () {

        var container = $('.similar-episodes');

        if (counter >= 2) {

            $(this).text('Скрыть');

        }

        if (counter >= 3) {

            $('.similar-episodes').animate({
                'height': '553px'
            }, 400);

            counter = 0;

            $(this).text('Показать еще');

        } else {

            if (counter <= 1) {
                var url = 'ajax/similar-episodes' + counter + '.json';

                loadJson(url);
            }

            container.animate({
                'height': '+=287px'
            }, 200);
            counter++;

        }
    });

    function loadJson(url) {

        var result = null;
        var strFull = null;


        $.getJSON(url, function (data) {

            var episodes = data;


            $.each(episodes, function (index, element) {

                strFull = '<div class="grid__column-1 similar-episodes-item">' +
                    '<div class="similar-episodes-item-video">' +
                    '<div class="similar-episodes-item-video-play"></div>' +
                    '<img src="img/' + element.episodeImg + '" class="similar-episodes-item-video-image__wide">' +

                    '</div>' +

                    '<div class="similar-episodes-item-description">' +
                    '<p class="similar-episodes-item-description-time">' + moment.unix(element.episodeDate).format('DD.MM.YYYY') + '</p>' +
                    '<p class="similar-episodes-item-description-title">' + element.episodeTitle + '111</p>' +
                    '<a href="#" class="similar-episodes-item-description-show">' + element.episodeShow + '<span> →</span></a>' +

                    '</div>' +
                    '</div>';

                $('.similar-episodes').append(strFull);

            });
        });
    };

    function timeConverter(time_unix) {
        var time = new Date(time_unix * 1000);
        var year = time.getFullYear();
        var month = time.getMonth();
        var date = time.getDate();
        var time = date + '.' + month + '.' + year;
        return time;
    }
});
